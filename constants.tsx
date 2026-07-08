import React from 'react';
import { AgentModule, WorkflowModule, DiligenceItem, DiligenceParty } from './types';
import { 
  RuleEnforcerIcon, CapitalStackBuilderIcon, EquityEngineIcon, FundingFriendFinderIcon, 
  SellerNoteStudioIcon, RolloverShieldIcon, MicroRoundMakerIcon, RetirementUnlockerIcon, 
  LiquidityGuardIcon, LenderMatchAIIcon, DealTalkCopilotIcon, ClosingPackGeneratorIcon, 
  CompatibilityAnalyzerIcon, SBAEligibilityScreenerIcon, ValuationModelerIcon,
  WebScraperIcon, WorkflowIcon, DealPulseIcon, LiveLiquidityIcon, LiveFinancialsIcon, BusinessHealthCheckIcon,
  SummarizerIcon, ChecklistIcon, PaperAirplaneIcon,
  BuyerIcon, SellerIcon, InternalIcon, LenderIcon,
  ClipboardCheckIcon, DealHealthScorerIcon
} from './components/icons';

export const AGENT_MODULES: AgentModule[] = [
  {
    id: 'rule_enforcer',
    title: 'Rule Enforcer',
    description: 'Interpret SBA SOP 5 10 8 & lender overlays.',
    command: 'Assess_SOP_Applicability',
    Icon: RuleEnforcerIcon,
    outputRequirements: `- Compliance memo (paste below)
- Evidence checklist created
- Red flags logged`,
    promptPlaceholder: 'Enter any specific questions or scenarios to check against the deal info for compliance issues. E.g., "Confirm if the seller note structure is compliant."'
  },
  {
    id: 'sba_eligibility_screener',
    title: 'SBA Eligibility Screener',
    description: 'Run a preliminary check for core SBA 7(a) eligibility.',
    command: 'Screen_SBA_Eligibility',
    Icon: SBAEligibilityScreenerIcon,
    outputRequirements: `- Eligibility Status (Eligible/Ineligible/Review Needed)
- Key Eligibility Factors Checked (e.g., Industry, Location, Borrower Status)
- Potential Red Flags Identified
- Next Steps for Borrower`,
    promptPlaceholder: 'The agent will check core SBA eligibility rules. Add any specific concerns, like business type or location.'
  },
  {
    id: 'business_health_check',
    title: 'Business Health Check',
    description: 'Run a D&B/Experian credit & risk report on the target.',
    command: 'Check_Business_Health',
    Icon: BusinessHealthCheckIcon,
    outputRequirements: `- D&B PAYDEX Score
- Payment History Summary
- UCC Lien Search Results
- Judgements & Collections
- Overall Risk Assessment & Recommendation`,
    promptPlaceholder: 'The agent will run a simulated credit check on the target business. Add any specific areas of concern.'
  },
  {
    id: 'diligence_checklist_generator',
    title: 'Diligence Checklist Generator',
    description: 'Generates a tailored due diligence checklist based on industry and deal type.',
    command: 'Generate_Diligence_Checklist',
    Icon: ClipboardCheckIcon,
    outputRequirements: `- Comprehensive diligence checklist in Markdown
- Categorized by stage (e.g., Financial, Legal, Operational)
- Prioritized items flagged`,
    promptPlaceholder: 'Specify industry, purchase type, and size. E.g., "SaaS asset purchase under $1M."'
  },
  {
    id: 'deal_health_scorer',
    title: 'Deal Health Scorer',
    description: 'Synthesizes key metrics into a single health score and summary of strengths/weaknesses.',
    command: 'Score_Deal_Health',
    Icon: DealHealthScorerIcon,
    outputRequirements: `- Overall Deal Score (e.g., A-, B+, C)
- Summary of Strengths (2-3 bullet points)
- Summary of Weaknesses / Risks (2-3 bullet points)
- Recommended Next Step`,
    promptPlaceholder: 'The agent will synthesize the deal\'s structure, financials, and compliance risks into a single score.',
    mode: 'thinking'
  },
  {
    id: 'capital_stack_builder',
    title: 'Capital Stack Builder',
    description: 'Generate 2–3 Sources & Uses (S&U) scenarios.',
    command: 'Build_Compliance_Model',
    Icon: CapitalStackBuilderIcon,
    outputRequirements: `- S&U v1 (conservative)
- S&U v2 (balanced)
- S&U v3 (aggressive)
- DSCR notes & risks
- **KEY_METRICS_START**
- Total Equity Needed: $[amount]
- DSCR Estimate: [value]x
- Post-Close Liquidity: $[amount]
- **KEY_METRICS_END**`,
    promptPlaceholder: 'Any specific requests for the capital stack? E.g., "Model one scenario with maximum seller financing and another with a 15% cash injection."',
    mode: 'thinking',
  },
  {
    id: 'valuation_modeler',
    title: 'Valuation Modeler',
    description: 'Triangulate a defensible valuation range for the target business.',
    command: 'Triangulate_Valuation',
    Icon: ValuationModelerIcon,
    outputRequirements: `- Recommended Valuation Range (e.g., $1.2M - $1.45M)
- Market Comps Analysis (Baseline Multiple)
- Financial Health Adjustment Rationale
- SBA Debt Capacity Analysis (Valuation Ceiling)
- Final Recommendation Memo`,
    promptPlaceholder: 'The agent will use deal info to generate a valuation. Add any specific comps or multiples you want it to consider.',
    mode: 'search',
  },
  {
    id: 'web_scraper',
    title: 'Web Scraper',
    description: 'Fetch content from a URL to extract deal information.',
    command: 'Web_Fetch_URL',
    Icon: WebScraperIcon,
    outputRequirements: `- Summary of extracted information
- Key data points identified
- Potential inconsistencies or red flags`,
    promptPlaceholder: 'Enter a URL and what information you want to extract. E.g., "https://example.com/listing/123 - Extract the TTM Revenue and Asking Price."',
    mode: 'default'
  },
  {
    id: 'live_liquidity_agent',
    title: 'Live Liquidity Agent',
    description: 'Connect to Plaid to verify borrower liquidity.',
    command: 'Connect_Plaid',
    Icon: LiveLiquidityIcon,
    outputRequirements: '',
    promptPlaceholder: ''
  },
  {
    id: 'live_financials_agent',
    title: 'Live Financials Agent',
    description: 'Connect to QuickBooks for real-time financials.',
    command: 'Connect_QuickBooks',
    Icon: LiveFinancialsIcon,
    outputRequirements: '',
    promptPlaceholder: ''
  },
  {
    id: 'equity_engine',
    title: 'Equity Engine',
    description: 'Map borrower liquidity & plan cash equity conversion.',
    command: 'Harvest_Liquid_Equity',
    Icon: EquityEngineIcon,
    outputRequirements: `- Equity sources ranked
- Verification docs list
- Timeline to liquidate`,
    promptPlaceholder: 'Ask for specific strategies. E.g., "What is the most efficient way to use my assets for the equity injection?"'
  },
  {
    id: 'funding_friend_finder',
    title: 'Funding Friend Finder',
    description: 'Evaluate gifted funds or third-party equity.',
    command: 'Validate_Gifts_and_Equity',
    Icon: FundingFriendFinderIcon,
    outputRequirements: `- Gift letter(s) drafted
- AML/KYC checklist
- Cap table before/after`,
    promptPlaceholder: 'Ask for compliance checks. E.g., "Generate the required gift letter template for the gift from my parents."'
  },
  {
    id: 'seller_note_studio',
    title: 'Seller-Note Studio',
    description: 'Draft 2-tranche seller-note term sheet.',
    command: 'Draft_Standby_Termsheet',
    Icon: SellerNoteStudioIcon,
    outputRequirements: `- Standby note term sheet
- Subordinated tranche (if any)
- Seller email draft`,
    promptPlaceholder: 'Specify desired terms. E.g., "Draft a term sheet where half the note is on full standby."'
  },
  {
    id: 'rollover_shield',
    title: 'Rollover Shield',
    description: 'Analyze ownership structure & rollover treatment.',
    command: 'Audit_Rollover_Treatment',
    Icon: RolloverShieldIcon,
    outputRequirements: `- Ownership/cap table validated
- Lender memo drafted`,
    promptPlaceholder: 'Explain the ownership change to audit. E.g., "The seller is rolling 20% equity. Explain the SBA compliance implications."'
  },
  {
    id: 'micro_round_maker',
    title: 'Micro-Round Maker',
    description: 'Assemble micro-investor equity to meet 10% min.',
    command: 'Assemble_MicroEquity_Round',
    Icon: MicroRoundMakerIcon,
    outputRequirements: `- Investor memo
- Subscription checklist
- Allocation table`,
    promptPlaceholder: 'Detail the equity shortfall and potential investors. E.g., "I need to raise $40k. Generate an investor memo."'
  },
  {
    id: 'retirement_unlocker',
    title: 'Retirement Unlocker',
    description: 'Compare ROBS vs. HELOC/portfolio-line options.',
    command: 'Evaluate_ROBS_Path',
    Icon: RetirementUnlockerIcon,
    outputRequirements: `- Decision matrix
- Risk/audit notes`,
    promptPlaceholder: 'Ask for a comparison. E.g., "Based on my 401k, generate a risk/reward matrix for ROBS vs. using my HELOC."'
  },
  {
    id: 'liquidity_guard',
    title: 'Liquidity Guard',
    description: 'Model post-close liquidity buffer and DSCR.',
    command: 'Bolster_PostClose_Liquidity',
    Icon: LiquidityGuardIcon,
    outputRequirements: `- Working capital plan
- Vendor term plays
- DSCR resilience notes`,
    promptPlaceholder: 'Provide desired liquidity goals. E.g., "Model a post-close liquidity buffer equal to 3 months of operating expenses."'
  },
  {
    id: 'lendermatch_ai',
    title: 'LenderMatch AI',
    description: 'Match structure to your affiliate funding partners.',
    command: 'Select_Lender_Matches',
    Icon: LenderMatchAIIcon,
    outputRequirements: `- Top 3 lenders + why
- Q&A pack
- Intro email plan`,
    promptPlaceholder: 'The AI will analyze your deal against the built-in affiliate lender list to find the best matches.',
    mode: 'default',
  },
    {
    id: 'dealpulse_ai',
    title: 'DealPulse AI',
    description: 'Draft emails, prep for calls, and manage deal communications.',
    command: 'Coach_Communications',
    Icon: DealPulseIcon,
    outputRequirements: `- Drafted Communication (Email/Script)
- Key Talking Points
- Suggested Next Actions`,
    promptPlaceholder: 'e.g., "Draft a firm email to the seller\'s broker requesting the P&L statements by EOD Friday."'
  },
  {
    id: 'discussion_summarizer',
    title: 'Discussion Summarizer',
    description: 'Analyzes the discussion thread to summarize key points and extract action items.',
    command: 'Summarize_Discussion',
    Icon: SummarizerIcon,
    outputRequirements: `- Key Points Summary
- Extracted Action Items`,
    promptPlaceholder: 'The agent will analyze all comments in the discussion thread.'
  },
  {
    id: 'task_suggester',
    title: 'AI Task Suggester',
    description: 'Analyzes the deal state to suggest relevant next-step tasks.',
    command: 'Suggest_Deal_Tasks',
    Icon: ChecklistIcon,
    outputRequirements: `- List of suggested tasks as JSON
- Each task should have a text description`,
    promptPlaceholder: 'The agent will analyze the current deal info to suggest tasks.'
  },
  {
    id: 'lender_package_generator',
    title: 'Lender Package Generator',
    description: 'Generates a tailored submission package for a specific lender.',
    command: 'Generate_Lender_Package',
    Icon: PaperAirplaneIcon,
    outputRequirements: `- Executive Summary
- Borrower Profile Highlights
- Key Financial Metrics (DSCR, LTV, Equity Injection)
- Sources & Uses Table
- Lender-Specific Notes`,
    promptPlaceholder: 'Enter any specific notes to include for the lender.'
  },
  {
    id: 'dealtalk_copilot',
    title: 'DealTalk Copilot',
    description: 'Generate negotiation scripts & LOI adjustments.',
    command: 'Coach_Deal_Negotiations',
    Icon: DealTalkCopilotIcon,
    outputRequirements: `- Script v1
- Redline summary
- Trade-off matrix`,
    promptPlaceholder: 'Describe the negotiation point. E.g., "I need to convince the seller to put their note on full standby. Generate talking points."'
  },
  {
    id: 'closing_pack_generator',
    title: 'Closing Pack Generator',
    description: 'Generate SBA-ready closing documentation.',
    command: 'Compile_SBA_Closing_Pack',
    Icon: ClosingPackGeneratorIcon,
    outputRequirements: `- S&U table final
- Gift letters + equity proof
- SBA forms checklist`,
    promptPlaceholder: 'Confirm all components are ready. E.g., "Generate a final checklist and all required document templates based on my deal info."'
  },
  {
    id: 'lender_compatibility_analyzer',
    title: 'Lender Compatibility Analyzer',
    description: 'Analyze lender overlays and suggest deal adjustments for better compatibility.',
    command: 'Analyze_Lender_Compatibility',
    Icon: CompatibilityAnalyzerIcon,
    outputRequirements: `- Compatibility Score (Pass/Fail/Review)
- Key Issues Identified
- Recommended Adjustments to Deal Structure
- Rationale for Recommendations`,
    promptPlaceholder: 'The agent will analyze the lender overlays provided in the deal info. Add any specific questions or concerns here.'
  }
];

export const WORKFLOW_MODULES: WorkflowModule[] = [
  {
    id: 'full_initial_analysis',
    title: 'Full Initial Analysis',
    description: 'A complete workflow that screens for SBA eligibility, builds capital stacks, and matches lenders automatically.',
    Icon: WorkflowIcon,
    steps: [
      { agentId: 'sba_eligibility_screener' },
      { 
        agentId: 'capital_stack_builder',
        condition: {
          sourceAgentId: 'sba_eligibility_screener',
          outputContains: 'Eligible',
          onFailure: 'stop'
        }
      },
      { agentId: 'lendermatch_ai' }
    ]
  }
];

export const DILIGENCE_STAGES: { id: string; title: string; description: string; Icon: React.FC<{className?: string}> }[] = [
    { id: 'Stage 0: Intake', title: 'Buyer Intake & Pre-Qualification', description: 'Initial buyer screening and capacity assessment.', Icon: BuyerIcon },
    { id: 'Stage 1: Financeability', title: 'Financeability Snapshot', description: 'Rapid assessment of buyer\'s borrowing capacity.', Icon: InternalIcon },
    { id: 'Stage 3: Diligence & LOI', title: 'Due Diligence Documents (from Seller)', description: 'Core diligence package provided by the seller.', Icon: SellerIcon },
    { id: 'Stage 4: Lender Packaging', title: 'SBA Lender Package Assembly', description: 'Assembling the bank-ready financing request packet.', Icon: InternalIcon },
    { id: 'Stage 5: Underwriting to Close', title: 'SBA Closing Documents', description: 'Final requirements for underwriting and closing.', Icon: LenderIcon },
];


