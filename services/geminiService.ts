
import { GoogleGenAI, Type } from "@google/genai";
import { AgentModule, Deal, AgentResult, DocumentAnalysisResult, GroundingSource, DocumentAnalysis, SharedDocument, User, UserRole, CommentRisk, AIRecommendation, Task, Comment, ScenarioMetrics, AffiliateLender, LenderRecommendation, QoEData, IndustryMultipleRange } from '../types';
import { getSchemaForAgent } from "./functionSchemas";
import { AGENT_MODULES } from "../constants";

const SYSTEM_PROMPT = `
You are AcquiStack AI, an AI-powered M&A Copilot for structuring SBA-compliant acquisitions under SOP 50 10 8.

## Purpose
Orchestrate a multi-agent workflow that helps users design and validate SBA-compliant acquisition capital stacks for small or micro-businesses (under $10M purchase price). The system uses modular AI Assistants — each focused on a distinct stage of the acquisition pipeline — from compliance and capital modeling to lender packaging.

Your primary goal is to use the provided tools to analyze a user's deal information and then generate a comprehensive, user-facing report in Markdown format.

## Prime Objective
Help buyers of micro-businesses, SaaS apps, and digital ventures build creative, compliant, and financeable acquisition structures under SBA SOP 50 10 8 and lender overlays.

## Tone and Voice
- Professional, precise, collaborative
- Explain compliance logic clearly
- Provide concise, investor-ready summaries
- Use plain-English finance language (avoid heavy legal jargon)
- Format all final outputs using Markdown for readability (e.g., headings, lists, bold text, tables).

## ⚙️ System Behavior and Global Guardrails
- Always ensure minimum 10% equity injection (by SBA rule).
- Seller notes can count for ≤ 50% of required equity only if on full-life standby (no P&I).
- Rollover equity does not count toward the 10% equity requirement.
- Always output sources & uses, DSCR estimates, and required documents checklist when applicable.
- Cross-reference to lender overlays when applicable.
- Auto-generate talking points, draft emails, and negotiation summaries when relevant.
`;

const buildBasePrompt = (agent: AgentModule, context: any, userInput: string) => `
  ## 🏦 Deal Information Context
  Here is the relevant context for the acquisition deal currently being analyzed. Use this data as the single source of truth for your response.
  \`\`\`json
  ${JSON.stringify(context, null, 2)}
  \`\`\`

  ---

  ## 🚀 Agent Task & User Request
  **Agent:** ${agent.title}
  **User's Request:** "${userInput || `Execute the agent's core command: ${agent.command}`}"
`;

const parseNumber = (str: string) => {
    if (!str) return null;
    const num = parseFloat(str.replace(/[^0-9.-]/g, ''));
    return isNaN(num) ? null : num;
}

export const parseMetricsFromText = (text: string): ScenarioMetrics => {
  const metrics: ScenarioMetrics = {
    totalEquityNeeded: null,
    dscrEstimate: null,
    postCloseLiquidity: null,
  };

  const equityMatch = text.match(/Total Equity Needed:\s*\$?([\d,.-]+)/i);
  if (equityMatch && equityMatch[1]) {
    metrics.totalEquityNeeded = parseNumber(equityMatch[1]);
  }

  const dscrMatch = text.match(/DSCR Estimate:\s*([\d,.-]+)x/i);
  if (dscrMatch && dscrMatch[1]) {
    metrics.dscrEstimate = parseNumber(dscrMatch[1]);
  }

  const liquidityMatch = text.match(/Post-Close Liquidity:\s*\$?([\d,.-]+)/i);
  if (liquidityMatch && liquidityMatch[1]) {
    metrics.postCloseLiquidity = parseNumber(liquidityMatch[1]);
  }

  return metrics;
};


const runFunctionCallingAgent = async (ai: GoogleGenAI, agent: AgentModule, context: any, userInput: string): Promise<AgentResult> => {
  const functionSchema = getSchemaForAgent(agent);
  if (!functionSchema) {
    throw new Error(`Could not find a function schema for agent: ${agent.title}`);
  }

  let promptContext: any = context;

  if (agent.id === 'lender_compatibility_analyzer') {
    const total_project_cost = context.purchase_price + context.working_capital + context.closing_costs + context.fees;
    const borrower_cash_contribution = context.borrower_profile.liquidity.cash; 
    
    promptContext = {
      lender_overlays: context.lender_overlays,
      deal_context: {
        total_project_cost: total_project_cost,
        borrower_cash_contribution: borrower_cash_contribution,
        seller_note_amount: context.seller_note.proposed_amount,
        is_seller_note_on_standby: context.seller_note.standby_full_life,
      }
    };
  }


  const isThinkingMode = agent.mode === 'thinking';
  const modelName = isThinkingMode ? 'gemini-2.5-pro' : 'gemini-2.5-flash';
  
  const config: any = {
    systemInstruction: SYSTEM_PROMPT,
    tools: [{ functionDeclarations: [functionSchema] }],
  };

  if (isThinkingMode) {
    config.thinkingConfig = { thinkingBudget: 32768 };
  }

  const chat = ai.chats.create({
    model: modelName,
    config,
  });

  const initialMessage = `${buildBasePrompt(agent, promptContext, userInput)}\n\nPlease analyze the context and request, then call the appropriate function with the correct parameters.`;
  
  const initialResult = await chat.sendMessage({ message: initialMessage });
  
  if (initialResult.functionCalls && initialResult.functionCalls.length > 0) {
    const functionCall = initialResult.functionCalls[0];
    
    const reportGenerationPrompt = `The function '${functionCall.name}' was invoked with the arguments: ${JSON.stringify(functionCall.args)}. Now, generate the comprehensive, user-facing Markdown report based on this action.

**The report MUST include the following components:**
${agent.outputRequirements}`;

    // FIX: The `sendMessage` method expects an object with a `message` property containing the parts array.
    const finalResult = await chat.sendMessage({
      message: [
        {
          functionResponse: {
            name: functionCall.name,
            response: {
              result: reportGenerationPrompt,
            },
          },
        },
      ],
    });

    const agentResult: AgentResult = { text: finalResult.text };
    if (agent.id === 'capital_stack_builder') {
      agentResult.structuredMetrics = parseMetricsFromText(finalResult.text);
    }
    return agentResult;

  } else {
    return { text: initialResult.text };
  }
};

const runSearchAgent = async (ai: GoogleGenAI, agent: AgentModule, context: any, userInput: string): Promise<AgentResult> => {
    const prompt = `${buildBasePrompt(agent, context, userInput)}\n\nPlease use Google Search to find the most relevant, up-to-date information to answer the user's request. Synthesize the search results into a comprehensive, user-facing Markdown report.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        tools: [{googleSearch: {}}],
      },
    });

    // FIX: The `groundingChunks` from the API response have optional properties,
    // but the app's `GroundingSource` type requires them. This maps and filters
    // the chunks to ensure type compatibility.
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const sources: GroundingSource[] = groundingChunks?.reduce((acc: GroundingSource[], chunk) => {
        if (chunk.web?.uri && chunk.web?.title) {
            acc.push({ web: { uri: chunk.web.uri, title: chunk.web.title } });
        } else if (chunk.maps?.uri && chunk.maps?.title) {
            acc.push({ maps: { uri: chunk.maps.uri, title: chunk.maps.title } });
        }
        return acc;
    }, []) || [];
    
    return {
        text: response.text,
        sources: sources
    };
};

export const runAgent = async (agent: AgentModule, context: any, userInput: string): Promise<AgentResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    if (agent.mode === 'search') {
      return await runSearchAgent(ai, agent, context, userInput);
    } else {
      return await runFunctionCallingAgent(ai, agent, context, userInput);
    }

  } catch (error) {
    console.error("Gemini API call failed:", error);
    if (error instanceof Error && error.message.includes('API key not valid')) {
       throw new Error("The configured API key is invalid. Please check your API key and try again.");
    }
    throw new Error("Failed to get a response from the AI. There might be an issue with the service or your connection.");
  }
};

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const analyzeDocument = async (file: File): Promise<DocumentAnalysisResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }
  if (!file.type.startsWith('application/pdf')) {
    throw new Error("Only PDF files are supported for analysis.");
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const filePart = await fileToGenerativePart(file);

    const prompt = "Analyze the attached business document (likely a CIM or financial overview). Extract key information, provide a concise summary, and identify potential risks. Structure the output according to the provided JSON schema.";

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            summary: {
                type: Type.STRING,
                description: "A 2-3 sentence summary of the business and the opportunity."
            },
            risks: {
                type: Type.ARRAY,
                description: "A list of 3-5 potential risks or key discussion points identified from the document.",
                items: { type: Type.STRING }
            },
            extracted_data: {
                type: Type.OBJECT,
                description: "Key financial and descriptive data points extracted from the document.",
                properties: {
                    deal_name: { type: Type.STRING, description: "The name of the business or deal." },
                    purchase_price: { type: Type.NUMBER, description: "The asking or purchase price." },
                    industry: { type: Type.STRING, description: "The industry the business operates in." },
                    revenue_ttm: { type: Type.NUMBER, description: "The trailing twelve months (TTM) revenue." },
                    ebitda_ttm: { type: Type.NUMBER, description: "The trailing twelve months (TTM) EBITDA." }
                }
            }
        },
        required: ["summary", "risks", "extracted_data"]
    };

    const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: { parts: [filePart, { text: prompt }] },
        config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
        },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as DocumentAnalysisResult;

  } catch (error) {
    console.error("Document analysis failed:", error);
    if (error instanceof Error && error.message.includes('API key not valid')) {
       throw new Error("The configured API key is invalid. Please check your API key and try again.");
    }
    throw new Error("Failed to analyze the document. The file may be corrupted or the AI service is unavailable.");
  }
};

export const analyzeVDRDocument = async (file: File): Promise<DocumentAnalysis> => {
    if (!process.env.API_KEY) throw new Error("API_KEY environment variable is not set.");
    if (!file.type.startsWith('application/pdf')) throw new Error("Only PDF files are supported for analysis.");

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const filePart = await fileToGenerativePart(file);
        
        const prompt = `You are a due diligence analyst. Analyze the attached document (e.g., CIM, financial statement, legal agreement). Provide a concise summary, identify 3-5 key risks or discussion points, and extract any critical clauses related to change of control, liabilities, or payment terms. Structure the output as JSON.`;

        const responseSchema = {
            type: Type.OBJECT,
            properties: {
                summary: {
                    type: Type.STRING,
                    description: "A 2-4 sentence summary of the document's purpose and key contents."
                },
                risks: {
                    type: Type.ARRAY,
                    description: "A list of 3-5 potential risks, inconsistencies, or key discussion points identified from the document.",
                    items: { type: Type.STRING }
                },
                key_clauses: {
                    type: Type.ARRAY,
                    description: "A list of direct quotes of critical clauses related to liabilities, change of control, payment terms, or exclusivity.",
                    items: { type: Type.STRING }
                }
            },
            required: ["summary", "risks", "key_clauses"]
        };

        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: { parts: [filePart, { text: prompt }] },
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as DocumentAnalysis;

    } catch (error) {
        console.error("VDR Document analysis failed:", error);
        throw new Error("Failed to analyze the VDR document.");
    }
};

export const queryVDR = async (query: string, documents: SharedDocument[]): Promise<string> => {
    if (!process.env.API_KEY) throw new Error("API_KEY environment variable is not set.");
    
    const context = documents
      .filter(doc => doc.analysisState === 'complete' && doc.analysis)
      .map(doc => `## Document: ${doc.name}\n**Summary:**\n${doc.analysis!.summary}\n**Identified Risks:**\n- ${doc.analysis!.risks.join('\n- ')}`)
      .join('\n\n---\n\n');

    if (!context.trim()) {
        return "There are no analyzed documents in the data room to query. Please upload and analyze a document first.";
    }

    const prompt = `You are an AI assistant for a Virtual Data Room. Answer the following user query based ONLY on the provided document summaries and their identified risks. Synthesize information across documents if necessary. If the information is not in the summaries, state that clearly. Be concise and direct in your answer.

## Document Summaries & Risks:
${context}

---

## User Query:
"${query}"`;

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("VDR Query failed:", error);
        throw new Error("Failed to get a response from the VDR AI assistant.");
    }
};

export const suggestTasksFromDocument = async (documentName: string, documentSummary: string): Promise<{text: string, assigneeRole: UserRole}[]> => {
    if (!process.env.API_KEY) throw new Error("API_KEY environment variable is not set.");
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `Based on a document named "${documentName}" with the summary: "${documentSummary}", suggest 2-3 specific, actionable next-step tasks for an M&A deal room. Infer the document type from its name and summary (e.g., 'LOI', 'Financials', 'CIM'). For each task, suggest which role is most appropriate: 'Broker' (for legal/deal structuring), 'Analyst' (for financial/data analysis), or 'Admin' (for general coordination). Format the response as a JSON array of objects, each with "text" and "assigneeRole" properties.`;

        const responseSchema = {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    text: { type: Type.STRING, description: "The specific, actionable task description." },
                    assigneeRole: { type: Type.STRING, enum: ['Admin', 'Broker', 'Analyst'], description: "The suggested role for the task." }
                },
                required: ["text", "assigneeRole"]
            }
        };

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: { responseMimeType: "application/json", responseSchema: responseSchema },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Failed to suggest tasks:", error);
        return []; // Return empty array on failure
    }
};

export const analyzeCommentForRisks = async (commentText: string): Promise<CommentRisk> => {
    if (!process.env.API_KEY) throw new Error("API_KEY environment variable is not set.");
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `Analyze the following comment from an M&A deal room discussion for negative sentiment, hesitation, or negotiation risks. The user might mention issues with terms, seller reluctance, or financial discrepancies. Respond with a JSON object. The object should have three properties: 'isRisk' (boolean, true if any risk is detected), 'summary' (string, a brief one-sentence summary of the risk if found, otherwise empty), and 'suggestsCopilot' (boolean, true if the comment involves negotiation, persuasion, or resolving a disagreement). Comment: "${commentText}"`;

        const responseSchema = {
            type: Type.OBJECT,
            properties: {
                isRisk: { type: Type.BOOLEAN },
                summary: { type: Type.STRING },
                suggestsCopilot: { type: Type.BOOLEAN }
            },
            required: ["isRisk", "summary", "suggestsCopilot"]
        };
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: { responseMimeType: "application/json", responseSchema: responseSchema },
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as CommentRisk;

    } catch (error) {
        console.error("Failed to analyze comment:", error);
        return { isRisk: false, summary: '', suggestsCopilot: false }; // Return default on failure
    }
};

export const getAIRecommendations = async (deal: Deal, tasks: Task[], comments: Comment[], documents: SharedDocument[]): Promise<AIRecommendation[]> => {
    if (!process.env.API_KEY) throw new Error("API_KEY environment variable is not set.");
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const availableAgents = AGENT_MODULES.map(agent => `- ${agent.id}: ${agent.title}`).join('\n');

        const prompt = `You are an expert M&A analyst copilot. Your goal is to provide highly contextual next-step recommendations by suggesting relevant AI agents. Analyze the current state of the deal, prioritizing suggestions based on the deal's current stage and recent user activity (inferred from the list of analyzed documents).

## Prioritization Logic:
1.  **Deal Stage First**: The current deal status ('${deal.status}') is the most important factor.
    - 'Initial Analysis': Focus on foundational agents like 'sba_eligibility_screener', 'valuation_modeler', and 'capital_stack_builder'.
    - 'Due Diligence': Suggest agents for deeper analysis ('business_health_check', 'seller_note_studio') and communication ('dealtalk_copilot').
    - 'Awaiting Financing'/'Closing': Prioritize lender-facing agents like 'lendermatch_ai' and 'lender_package_generator'.
2.  **Recent Activity Second**: The presence of analyzed documents indicates user activity.
    - If financial documents are present, it strongly suggests using 'valuation_modeler' or 'capital_stack_builder'.
    - If legal documents (LOI, Term Sheet) are present, negotiation or compliance agents ('dealtalk_copilot', 'rule_enforcer') are more relevant.
3.  **General Context Third**: Use tasks and comments for further refinement, especially for communication-related agents like 'dealpulse_ai'.

## Context Provided

DEAL STAGE: "${deal.status}"

AVAILABLE AGENTS:
${availableAgents}

DEAL INFO (abbreviated for context):
${JSON.stringify({ purchase_price: deal.purchase_price, ebitda_ttm: deal.ebitda_ttm, industry: deal.industry, rollover_equity: deal.rollover_equity, seller_note: deal.seller_note }, null, 2)}

ANALYZED DOCUMENTS:
${JSON.stringify(documents.filter(d => d.analysisState === 'complete' && d.analysis).map(d => ({ name: d.name, summary: d.analysis!.summary })), null, 2)}

TASKS (pending):
${JSON.stringify(tasks.filter(t => t.status !== 'Completed').map(t => t.text), null, 2)}

RECENT COMMENTS:
${JSON.stringify(comments.slice(-3).map(c => c.text), null, 2)}

Respond ONLY with a valid JSON array of 2-4 recommended AI agents. For each suggestion, provide a brief, user-facing 'reason' explaining *why* it's relevant based on the prioritization logic, and an actionable 'suggestedTask'.`;

        const responseSchema = {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    agentId: { type: Type.STRING, description: "The unique ID of the suggested agent." },
                    reason: { type: Type.STRING, description: "A brief, user-facing explanation for the suggestion." },
                    suggestedTask: { type: Type.STRING, description: "A short, actionable task related to the agent's purpose." }
                },
                required: ["agentId", "reason", "suggestedTask"]
            }
        };

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: { responseMimeType: "application/json", responseSchema: responseSchema },
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as AIRecommendation[];

    } catch (error) {
        console.error("Failed to get AI recommendations:", error);
        return []; // Return empty array on failure
    }
};

const flattenTasks = (tasks: Task[]): Task[] => {
    let allTasks: Task[] = [];
    tasks.forEach(task => {
        allTasks.push(task);
        if (task.subtasks) {
            allTasks = allTasks.concat(flattenTasks(task.subtasks));
        }
    });
    return allTasks;
};

export const suggestDealTasks = async (deal: Deal, existingTasks: Task[]): Promise<{ text: string }[]> => {
    if (!process.env.API_KEY) throw new Error("API_KEY environment variable is not set.");

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const existingTaskTexts = flattenTasks(existingTasks).map(t => t.text);

        const prompt = `
          You are an expert M&A analyst copilot. Analyze the current state of the provided deal and suggest 2-3 specific, actionable next-step tasks.
          - Consider the deal's current status ('${deal.status}'). For 'Initial Analysis', suggest diligence tasks. For 'Due Diligence', suggest financing or legal tasks.
          - Do NOT suggest tasks that are already on the existing tasks list.
          - The tasks should be concise and clear.

          DEAL INFO:
          ${JSON.stringify({ status: deal.status, purchase_price: deal.purchase_price, ebitda_ttm: deal.ebitda_ttm, industry: deal.industry }, null, 2)}

          EXISTING TASKS (do not repeat these):
          - ${existingTaskTexts.join('\n- ')}

          Respond ONLY with a valid JSON array of objects, where each object has a single "text" property.
        `;

        const responseSchema = {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    text: { type: Type.STRING, description: "The specific, actionable task description." },
                },
                required: ["text"]
            }
        };

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: { responseMimeType: "application/json", responseSchema: responseSchema },
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText);

    } catch (error) {
        console.error("Failed to suggest deal tasks:", error);
        return []; // Return empty array on failure
    }
};

export const getLenderMatches = async (deal: Deal, lenders: AffiliateLender[]): Promise<LenderRecommendation[]> => {
    if (!process.env.API_KEY) throw new Error("API_KEY environment variable is not set.");
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const prompt = `You are an expert funding advisor. Your goal is to find the best-fit lenders for a business acquisition based on the provided deal information and a list of affiliate lenders.

Analyze the deal context and compare it against each lender's criteria. Identify the top 3-5 most promising matches. For each match, provide a brief, compelling 'reason' explaining why it's a good fit. Focus on specific criteria that are met (e.g., industry, revenue, funding amount).

## Deal Context
\`\`\`json
${JSON.stringify({
    industry: deal.industry,
    purchase_price: deal.purchase_price,
    revenue_ttm: deal.revenue_ttm,
    ebitda_ttm: deal.ebitda_ttm,
    credit_score_band: deal.borrower_profile.credit_score_band
}, null, 2)}
\`\`\`

## Available Lenders
\`\`\`json
${JSON.stringify(lenders.map(l => ({
    id: l.id,
    name: l.name,
    fundingAmount: l.fundingAmount,
    requirements: l.requirements,
    targetIndustries: l.targetIndustries
})), null, 2)}
\`\`\`

Respond ONLY with a valid JSON array of the top recommended lenders.
`;

        const responseSchema = {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    lenderId: { type: Type.STRING, description: "The unique ID of the recommended lender." },
                    reason: { type: Type.STRING, description: "A brief, user-facing explanation for why this lender is a good match." }
                },
                required: ["lenderId", "reason"]
            }
        };

        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: prompt,
            config: { 
                responseMimeType: "application/json", 
                responseSchema: responseSchema,
                temperature: 0.2
            },
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as LenderRecommendation[];

    } catch (error) {
        console.error("Failed to get lender matches:", error);
        throw new Error("AI failed to generate lender recommendations.");
    }
};

export const analyzeQoE = async (qoeData: QoEData, deal: Deal): Promise<string> => {
    if (!process.env.API_KEY) throw new Error("API_KEY environment variable is not set.");
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `
You are an expert M&A diligence analyst specializing in Quality of Earnings (QoE) for small business acquisitions, typically financed with SBA loans. Your task is to write a "QoE Lite" report based on the user-provided data below.

Your analysis should be critical but fair. Your goal is to help the buyer understand the true, sustainable cash flow of the business and identify potential risks before they make an offer.

**Structure your report using Markdown and cover these key areas:**

1.  **Executive Summary:** A brief, top-level summary of your findings. State clearly whether the earnings quality appears strong, average, or weak, and why.
2.  **Revenue Quality Analysis:**
    *   Analyze customer concentration risk based on the top 1 and top 5 customer revenue. Is it too high?
    *   Comment on the stability and predictability of revenue based on the recurring revenue percentage.
3.  **Profitability (SDE) Analysis:**
    *   Review the "questionable add-backs" provided by the user. For each, explain why a lender might challenge it (e.g., is it truly a one-time, non-recurring expense, or is it a necessary cost of doing business?).
    *   Calculate an "Adjusted SDE" by subtracting the total questionable add-backs from the reported SDE.
4.  **Working Capital Assessment:**
    *   Compare the average historical working capital to the target working capital. Is there a significant deficit or surplus?
    *   Explain the implication: will the buyer need to inject extra cash at closing to fund operations?
5.  **Key Questions for Seller:** Based on your analysis, provide a bulleted list of 3-5 critical questions the buyer should ask the seller or their broker.
6.  **Impact on Valuation & Loan:** Briefly explain how your findings could impact the deal's valuation multiple and its financeability with an SBA lender.

**Deal Context:**
\`\`\`json
${JSON.stringify({deal_name: deal.deal_name, industry: deal.industry, purchase_price: deal.purchase_price}, null, 2)}
\`\`\`

**User-Provided QoE Data:**
\`\`\`json
${JSON.stringify(qoeData, null, 2)}
\`\`\`
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: prompt,
            config: {
                temperature: 0.3
            }
        });

        return response.text;

    } catch (error) {
        console.error("QoE Analysis failed:", error);
        throw new Error("Failed to get a response from the AI for QoE analysis.");
    }
};

export const getIndustryMultiple = async (industry: string): Promise<IndustryMultipleRange> => {
    if (!process.env.API_KEY) throw new Error("API_KEY environment variable is not set.");
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `
          You are an expert M&A analyst for small businesses (sub $10M revenue). 
          Based on the provided industry, "${industry}", provide a typical Seller's Discretionary Earnings (SDE) multiple range.

          Consider factors typical for small businesses in this industry.
          Provide a brief explanation for the range.

          Respond ONLY with a valid JSON object matching the provided schema.
        `;

        const responseSchema = {
            type: Type.OBJECT,
            properties: {
                low: { type: Type.NUMBER, description: "The low end of the typical SDE multiple range." },
                high: { type: Type.NUMBER, description: "The high end of the typical SDE multiple range." },
                explanation: { type: Type.STRING, description: "A brief explanation for why this range is typical for the industry." }
            },
            required: ["low", "high", "explanation"]
        };

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as IndustryMultipleRange;

    } catch (error) {
        console.error("Failed to get industry multiple:", error);
        throw new Error("AI failed to generate an industry multiple. The industry might be too niche or an error occurred.");
    }
};
