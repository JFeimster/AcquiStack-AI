
import React from 'react';
import { AgentModule, Deal, Comment, Task, User, SharedDocument, WorkflowModule, DiligenceItem, DiligenceParty, AffiliateLender } from './types';
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

const createDiligenceItems = (stage: string, party: DiligenceParty, items: string[]): DiligenceItem[] => {
    return items.map((text, index) => ({
        id: Math.random(), // In a real app, use a better ID system
        stage,
        party,
        text,
        status: 'Pending',
        linkedDocumentId: null,
        assigneeId: null
    }));
};

export const initialDiligenceChecklist: DiligenceItem[] = [
    ...createDiligenceItems('Stage 0: Intake', 'Buyer', [
        'Personal Financial Statement (PFS)',
        'Credit score check (minimum 680 preferred)',
        'Liquidity verification (10-15% of target EV)',
        'Industry experience / resume',
        'Target business profile (industry, size, location)',
        'Timeline expectations',
        'NDA executed',
        'Engagement agreement signed',
        'Initial consultation call scheduled'
    ]),
    ...createDiligenceItems('Stage 1: Financeability', 'Internal', [
        'Pull & review personal tax returns (2 years)',
        'Run preliminary DSCR scenarios at 1.25× and 1.5×',
        'Calculate maximum supportable loan amount',
        'Assess equity position (cash + seller note capacity)',
        'Generate 2-page pre-qual memo',
        'Identify any red flags (credit, liquidity, experience)',
        'Present financeability range to buyer',
        'Deliver "bank-ready documents checklist"'
    ]),
    ...createDiligenceItems('Stage 3: Diligence & LOI', 'Seller', [
        'Business tax returns (3 years)',
        'Personal tax returns (if pass-through entity, 3 years)',
        'Interim P&L and Balance Sheet (YTD)',
        'Monthly P&Ls (trailing 24 months)',
        'Bank statements (12 months, all accounts)',
        'A/R aging report',
        'A/P aging report',
        'Customer list with revenue by customer',
        'Contracts / recurring revenue agreements',
        'Lease agreements (facilities, equipment)',
        'Employee roster with salaries',
        'Insurance policies (GL, WC, etc.)',
        'Cap table / ownership structure',
        'Licenses and permits'
    ]),
    ...createDiligenceItems('Stage 4: Lender Packaging', 'Internal', [
        'Executive summary (1-page deal overview)',
        'DSCR calculation memo with assumptions',
        'Normalized SDE / add-backs schedule',
        'Valuation memo with market comps',
        'Customer concentration analysis',
        'Working capital peg calculation',
        'Risk assessment with mitigants',
        'SBA Form 159 (fee disclosure) - completed',
        'Buyer PFS and resume',
        'Seller financials (tax returns, P&Ls)',
        'Signed LOI',
        'NDA (if applicable)',
        'Lender intro email with doc index'
    ]),
    ...createDiligenceItems('Stage 5: Underwriting to Close', 'Lender', [
        'SBA loan authorization / commitment letter',
        'IRS Form 4506-C (tax transcript authorization)',
        'Life insurance application and approval',
        'Landlord consent / estoppel certificate',
        'UCC lien search',
        'Corporate resolution (buyer entity)',
        'Operating agreement / bylaws',
        'Final loan documents package',
        'Hazard insurance binders',
        'Final purchase agreement (APA)',
        'Bill of sale',
        'Assignment of contracts',
        'Non-compete agreement',
        'Transition services agreement (if applicable)',
        'Closing settlement statement'
    ]),
].map((item, index) => ({ ...item, id: index + 1 }));



export const initialDeals: Deal[] = [
  {
    id: 1,
    status: 'Initial Analysis',
    deal_name: "My SaaS Acquisition",
    purchase_type: 'asset',
    industry: 'Software as a Service (SaaS)',
    business_location: 'US-based',
    purchase_price: 1000000,
    revenue_ttm: 500000,
    ebitda_ttm: 150000,
    working_capital: 50000,
    closing_costs: 20000,
    fees: 15000,
    borrower_profile: {
      liquidity: { cash: 75000, brokerage: 50000, cds: 0, hsas: 10000, rsus: 0 },
      debt_capacity: { heloc_limit: 150000, portfolio_line: 0 },
      retirement_assets: { balance: 400000, robs_interest: false },
      credit_score_band: '720+',
      on_parole: false,
    },
    seller_note: {
      proposed_amount: 100000,
      standby_full_life: false,
      interest: 6.0
    },
    gifts: [],
    third_party_equity: [],
    rollover_equity: 0,
    lender_overlays: {
      seller_note_counts: true,
      gift_ok: true,
      min_borrower_cash_pct: 0.05
    },
    diligenceItems: initialDiligenceChecklist,
    scenarios: [
      {
        id: 1,
        name: "Initial AI-Generated Scenario",
        notes: "This is the first pass from the AI, focusing on a balanced structure.",
        isPrimary: true,
        metrics: {
          totalEquityNeeded: 125000,
          dscrEstimate: 1.75,
          postCloseLiquidity: 85000,
        },
        agentId: "capital_stack_builder",
        fullOutput: "### Scenario 1: Balanced Approach\n\n**Sources:**\n- SBA 7(a) Loan: $850,000\n- Seller Note: $100,000\n- Borrower Equity: $125,000\n\n**Uses:**\n- Purchase Price: $1,000,000\n- Working Capital: $50,000\n- Closing Costs & Fees: $35,000\n\n**KEY_METRICS_START**\nTotal Equity Needed: $125,000\nDSCR Estimate: 1.75x\nPost-Close Liquidity: $85,000\n**KEY_METRICS_END**"
      }
    ],
  },
  {
    id: 2,
    status: 'Due Diligence',
    deal_name: "Project Peak E-commerce",
    purchase_type: 'stock',
    industry: 'E-commerce',
    business_location: 'US-based',
    purchase_price: 2500000,
    revenue_ttm: 1200000,
    ebitda_ttm: 450000,
    working_capital: 100000,
    closing_costs: 40000,
    fees: 25000,
    borrower_profile: {
      liquidity: { cash: 250000, brokerage: 100000, cds: 0, hsas: 5000, rsus: 75000 },
      debt_capacity: { heloc_limit: 200000, portfolio_line: 0 },
      retirement_assets: { balance: 600000, robs_interest: false },
      credit_score_band: '720+',
      on_parole: false,
    },
    seller_note: {
      proposed_amount: 250000,
      standby_full_life: true,
      interest: 5.0
    },
    gifts: [],
    third_party_equity: [],
    rollover_equity: 0,
    lender_overlays: {
      seller_note_counts: false,
      gift_ok: true,
      min_borrower_cash_pct: 0.10
    },
    diligenceItems: initialDiligenceChecklist,
    scenarios: [],
  },
    {
    id: 3,
    status: 'Awaiting Financing',
    deal_name: "Local Landscaping Co.",
    purchase_type: 'asset',
    industry: 'Home Services',
    business_location: 'US-based',
    purchase_price: 750000,
    revenue_ttm: 900000,
    ebitda_ttm: 225000,
    working_capital: 75000,
    closing_costs: 15000,
    fees: 10000,
    borrower_profile: {
      liquidity: { cash: 80000, brokerage: 25000, cds: 10000, hsas: 0, rsus: 0 },
      debt_capacity: { heloc_limit: 100000, portfolio_line: 0 },
      retirement_assets: { balance: 150000, robs_interest: true },
      credit_score_band: '680-720',
      on_parole: false,
    },
    seller_note: {
      proposed_amount: 75000,
      standby_full_life: true,
      interest: 7.0
    },
    gifts: [],
    third_party_equity: [],
    rollover_equity: 0,
    lender_overlays: {
      seller_note_counts: true,
      gift_ok: false,
      min_borrower_cash_pct: 0.07
    },
    diligenceItems: initialDiligenceChecklist,
    scenarios: [],
  }
];


// Initial data for Deal Room feature
export const dealRoomUsers: User[] = [
  { id: 1, name: 'Alex (Me)', role: 'Admin', avatarInitials: 'A' },
  { id: 2, name: 'Sarah (Lawyer)', role: 'Broker', avatarInitials: 'SL' },
  { id: 3, name: 'David (Accountant)', role: 'Analyst', avatarInitials: 'DA' },
  { id: 4, name: 'Maria (Partner)', role: 'Broker', avatarInitials: 'MP' },
];

export const currentUser = dealRoomUsers[0];

export const initialComments: Comment[] = [
  {
    id: 1,
    user: dealRoomUsers[1], // Sarah (Lawyer)
    text: "The initial capital stack from the AI looks solid, but we need to ensure the seller note's standby language is airtight per the latest SBA SOP.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: 2,
    user: dealRoomUsers[2], // David (Accountant)
    text: "I've reviewed the DSCR estimates. They seem reasonable, but let's stress-test them with a 10% revenue decline scenario.",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  }
];

export const initialTasks: Task[] = [
  { 
    id: 1, text: 'Phase 1: Initial Diligence & Offer', 
    status: 'In Progress', 
    assignee: dealRoomUsers[0], 
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
    subtasks: [
      { id: 11, text: 'Finalize and sign Letter of Intent (LOI)', status: 'Completed', assignee: dealRoomUsers[0], dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString() },
      { id: 12, text: 'Engage legal counsel for due diligence', status: 'Completed', assignee: dealRoomUsers[1], dependsOn: [11], dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString() },
      { id: 13, text: 'Secure financing pre-approval from lender', status: 'Pending', assignee: dealRoomUsers[0], dependsOn: [11], dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(), reminderDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString() },
    ]
  },
  { 
    id: 2, text: 'Phase 2: Deep Diligence', 
    status: 'Pending', 
    assignee: dealRoomUsers[0],
    dependsOn: [12, 13],
    subtasks: [
        { id: 21, text: 'Complete financial due diligence on target company', status: 'Pending', assignee: dealRoomUsers[2], dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString() },
        { id: 22, text: 'Complete legal due diligence', status: 'Pending', assignee: dealRoomUsers[1], dependsOn: [21] },
    ]
  },
  { id: 3, text: 'Draft definitive purchase agreement', status: 'Pending', dependsOn: [22], source: 'user' },
];


export const initialDocuments: SharedDocument[] = [
    { 
      id: 1, 
      name: 'Initial_Term_Sheet_v1.pdf', 
      type: 'PDF', 
      size: '1.2 MB', 
      uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
      analysisState: 'complete',
      analysis: {
        summary: 'A non-binding term sheet outlining the key terms for the acquisition, including price, financing, and a 30-day exclusivity period.',
        risks: ['Exclusivity period is relatively short.', 'No mention of working capital adjustment.', 'Financing contingency is broad.'],
        key_clauses: ['Purchase Price: $1,000,000', 'Seller Note: $100,000 at 6% interest', 'Exclusivity: 30 days from signing.']
      }
    },
    { 
      id: 2, 
      name: 'Target_Co_Financials.xlsx', 
      type: 'Spreadsheet', 
      size: '876 KB', 
      uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      analysisState: 'complete',
      analysis: {
        summary: 'TTM financial statements showing $500k in revenue and $150k in EBITDA. Shows steady growth over the last 3 years.',
        risks: ['Revenue concentration: Top 2 clients account for 45% of revenue.', 'Gross margins declined slightly in the most recent quarter.', 'High owner add-backs need to be verified.'],
        key_clauses: []
      }
    },
    { 
      id: 3, 
      name: 'Due_Diligence_Request_List.docx', 
      type: 'Word', 
      size: '45 KB', 
      uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      analysisState: 'pending',
    },
];

export const AFFILIATE_LENDERS: AffiliateLender[] = [
  {
    id: 'uncapped',
    name: 'Uncapped',
    applyUrl: 'https://portal.weareuncapped.com/',
    fundingAmount: '$100K - $10M',
    requirements: [],
    targetIndustries: ['E-commerce'],
    financingTypes: ['Line of Credit', 'Working Capital']
  },
  {
    id: 'david-allen-capital',
    name: 'David Allen Capital',
    applyUrl: 'https://davidallencapital.com/jason',
    fundingAmount: '$10k - $2M',
    requirements: ['Minimum 6 months in business', '$10k/month revenue', '500+ credit score'],
    targetIndustries: ['Small Business'],
    financingTypes: ['Merchant Cash Advance', 'Working Capital']
  },
  {
    id: 'credit-suite',
    name: 'Credit Suite',
    applyUrl: 'Credit Suite Partner Portal',
    fundingAmount: 'Varies',
    requirements: ['Business owners seeking to build business credit profiles'],
    targetIndustries: ['Small Business'],
    financingTypes: ['Business Credit', 'Financing Consulting']
  },
  {
    id: 'fora-financial',
    name: 'Fora Financial',
    applyUrl: 'https://forafinancial.pxf.io/gOWX1v',
    fundingAmount: '$5k - $500k',
    requirements: ['6+ months in business', '$12k/month revenue', '500+ credit score', 'citizen/permanent resident'],
    targetIndustries: ['Restaurants', 'Retail', 'Small Business', 'General Consumers'],
    financingTypes: ['Line of Credit', 'Merchant Cash Advance', 'SBA Loans', 'Term Loans', 'Working Capital', 'Home Improvement', 'Personal Loans']
  },
  {
    id: 'rok-financial',
    name: 'ROK Financial',
    applyUrl: 'https://go.mypartner.io/business-fin',
    fundingAmount: '$20k - $5M',
    requirements: ['2+ years in business', '$15k/month revenue', '600+ credit score'],
    targetIndustries: ['Construction', 'Healthcare', 'Small Business'],
    financingTypes: ['Equipment Financing', 'Merchant Cash Advance', 'SBA Loans', 'Term Loans']
  },
  {
    id: 'credibly',
    name: 'Credibly',
    applyUrl: 'Affiliate Link',
    fundingAmount: '$5k - $600k',
    requirements: ['6+ months in business', '$15k/month revenue', '500+ credit score'],
    targetIndustries: ['Healthcare', 'Retail', 'Small Business'],
    financingTypes: ['Equipment Financing', 'Line of Credit', 'Merchant Cash Advance', 'SBA Loans', 'Working Capital']
  },
  {
    id: 'fund-and-grow',
    name: 'Fund&Grow',
    applyUrl: 'Fund&Grow Partner Portal',
    fundingAmount: 'Up to $250k',
    requirements: ['700+ credit score', 'U.S. citizen', 'no recent bankruptcies'],
    targetIndustries: ['Small Business', 'Startups'],
    financingTypes: ['Business Credit']
  },
  {
    id: '7-figures-funding',
    name: '7 Figures Funding',
    applyUrl: 'https://www.7figurescredit.com/?a_',
    fundingAmount: '$10k - $150k',
    requirements: ['680+ credit score', 'U.S. citizen', 'no recent bankruptcies'],
    targetIndustries: ['Entrepreneurs', 'Startups'],
    financingTypes: ['Business Credit Lines', 'Startup Funding']
  },
  {
    id: 'gokapital',
    name: 'GoKapital',
    applyUrl: 'GoKapital Partner Portal',
    fundingAmount: '$50k - $5M',
    requirements: ['1+ year in business', '$30k/month revenue', '600+ credit score'],
    targetIndustries: ['Healthcare', 'Real Estate', 'Retail'],
    financingTypes: ['Business Loans', 'E-commerce', 'Equipment Financing', 'Real Estate Financing', 'SBA Loans']
  },
  {
    id: 'uplyft-capital',
    name: 'Uplyft Capital',
    applyUrl: 'Uplyft Capital Partner Portal',
    fundingAmount: '$5k - $500k',
    requirements: ['6+ months in business', '$10k/month revenue', '500+ credit score'],
    targetIndustries: ['Restaurants', 'Retail', 'Small Business'],
    financingTypes: ['Merchant Cash Advance', 'Working Capital']
  },
  {
    id: '8fig',
    name: '8fig',
    applyUrl: 'https://grow.8fig.co/lh7ictz6db3r',
    fundingAmount: '$10k - $500k',
    requirements: ['E-commerce businesses with consistent sales history, seeking growth capital'],
    targetIndustries: ['E-commerce Businesses'],
    financingTypes: ['E-commerce']
  },
  {
    id: 'guidant',
    name: 'Guidant',
    applyUrl: 'Guidant Financial Partner Portal',
    fundingAmount: '$50k - $5M',
    requirements: ['Clients interested in using retirement funds for business startup or expansion'],
    targetIndustries: ['Franchises', 'Small Business', 'Startups'],
    financingTypes: ['Rollover for Business Startups (ROBS)', 'SBA Loans', 'Unsecured Loans']
  },
  {
    id: 'sellersfi',
    name: 'SellersFi',
    applyUrl: 'https://pstack.sellersfi.app/8lm0r34',
    fundingAmount: '$10k - $10M',
    requirements: ['E-commerce businesses with significant sales volume, seeking working capital or expansion funding'],
    targetIndustries: ['E-commerce Businesses'],
    financingTypes: ['E-commerce', 'Merchant Cash Advance', 'Working Capital']
  },
  {
    id: 'onramp',
    name: 'Onramp',
    applyUrl: 'https://onrampfunds.partnerlinks.io',
    fundingAmount: '$10k - $2M',
    requirements: ['E-commerce businesses with stable revenue, seeking inventory or marketing funding'],
    targetIndustries: ['E-commerce Businesses'],
    financingTypes: ['E-commerce', 'Marketplace', 'SBA Loans']
  },
  {
    id: 'capchase',
    name: 'Capchase',
    applyUrl: 'https://capchase.com/referrals?refe',
    fundingAmount: '$2.5k to 7-figures',
    requirements: ['Recurring-revenue business (MRR/ARR)', 'No personal guarantee or collateral'],
    targetIndustries: ['SaaS', 'Recurring Revenue'],
    financingTypes: ['Revenue-based Financing']
  },
  {
    id: 'the-finance-factory',
    name: 'The Finance Factory',
    applyUrl: 'https://lp.thefinancefactory.com/lp/',
    fundingAmount: 'SBA: $30k-$5M, Working Capital: up to $500k, Equipment: up to $1M',
    requirements: ['General: 600+ FICO, 3+ months in business, $10k+ monthly revenue', 'Revenue-based: min 500 FICO, 6+ months in business'],
    targetIndustries: ['All industries accepted'],
    financingTypes: ['SBA Loans', 'Working Capital', 'Term Loans', 'Equipment Leases']
  }
];
