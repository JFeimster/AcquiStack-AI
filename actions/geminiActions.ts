import { 
  AgentModule, 
  AgentResult, 
  DocumentAnalysisResult, 
  SharedDocument, 
  Task, 
  Comment, 
  UserRole, 
  CommentRisk, 
  AIRecommendation, 
  Deal, 
  AffiliateLender, 
  LenderRecommendation, 
  QoEData, 
  IndustryMultipleRange,
  DocumentAnalysis
} from '../types';

/**
 * Gemini Actions - Frontend helpers that proxy AI requests to our secure full-stack backend APIs.
 * This completely keeps your Google Gemini API Key hidden from the client browser.
 */

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]); // Extract only the base64-encoded bytes
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Run modular SBA compliance or capital stack agent
 */
export const runAgent = async (agent: AgentModule, context: any, userInput: string): Promise<AgentResult> => {
  const response = await fetch('/api/run-agent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ agent, context, userInput }),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'AI Agent failed to execute');
  }
  return response.json();
};

/**
 * Analyze a CIM PDF document for risk extraction
 */
export const analyzeDocument = async (file: File): Promise<DocumentAnalysisResult> => {
  const base64Content = await fileToBase64(file);
  const response = await fetch('/api/analyze-document', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ base64Content, mimeType: file.type }),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Document analysis failed');
  }
  return response.json();
};

/**
 * Analyze a document for Virtual Data Room (VDR) integration
 */
export const analyzeVDRDocument = async (file: File): Promise<DocumentAnalysis> => {
  const base64Content = await fileToBase64(file);
  const response = await fetch('/api/analyze-vdr-document', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ base64Content, mimeType: file.type }),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'VDR document analysis failed');
  }
  return response.json();
};

/**
 * Query the Virtual Data Room corpus using AI
 */
export const queryVDR = async (query: string, documents: SharedDocument[]): Promise<string> => {
  const response = await fetch('/api/query-vdr', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, documents }),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'VDR Query failed');
  }
  const result = await response.json();
  return result.text;
};

/**
 * Suggest deal tasks from an uploaded VDR document's summary
 */
export const suggestTasksFromDocument = async (documentName: string, documentSummary: string): Promise<{text: string, assigneeRole: UserRole}[]> => {
  const response = await fetch('/api/suggest-tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ documentName, documentSummary }),
  });
  if (!response.ok) {
    return [];
  }
  return response.json();
};

/**
 * Perform sentiment risk analysis on a user comment
 */
export const analyzeCommentForRisks = async (commentText: string): Promise<CommentRisk> => {
  const response = await fetch('/api/analyze-comment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ commentText }),
  });
  if (!response.ok) {
    return { isRisk: false, summary: '', suggestsCopilot: false };
  }
  return response.json();
};

/**
 * Fetch contextual AI-driven suggestions for the active deal room
 */
export const getAIRecommendations = async (deal: Deal, tasks: Task[], comments: Comment[], documents: SharedDocument[]): Promise<AIRecommendation[]> => {
  const response = await fetch('/api/ai-recommendations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ deal, tasks, comments, documents }),
  });
  if (!response.ok) {
    return [];
  }
  return response.json();
};

/**
 * Suggest actionable next steps for a deal
 */
export const suggestDealTasks = async (deal: Deal, existingTasks: Task[]): Promise<{ text: string }[]> => {
  const response = await fetch('/api/suggest-deal-tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ deal, existingTasks }),
  });
  if (!response.ok) {
    return [];
  }
  return response.json();
};

/**
 * Evaluate and rank affiliate lenders for the deal
 */
export const getLenderMatches = async (deal: Deal, lenders: AffiliateLender[]): Promise<LenderRecommendation[]> => {
  const response = await fetch('/api/lender-matches', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ deal, lenders }),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Lender match generation failed');
  }
  return response.json();
};

/**
 * Build a Quality of Earnings (QoE) report via AI
 */
export const analyzeQoE = async (qoeData: QoEData, deal: Deal): Promise<string> => {
  const response = await fetch('/api/analyze-qoe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ qoeData, deal }),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'QoE analysis failed');
  }
  const result = await response.json();
  return result.text;
};

/**
 * Fetch typical seller valuation multiples for an industry
 */
export const getIndustryMultiple = async (industry: string): Promise<IndustryMultipleRange> => {
  const response = await fetch('/api/industry-multiple', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ industry }),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Industry multiple lookup failed');
  }
  return response.json();
};
