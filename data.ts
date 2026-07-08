
import { Deal, Comment, Task, SharedDocument, AffiliateLender, User, DiligenceItem, DiligenceParty } from './types';

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

export const initialComments: Comment[] = [
  {
    id: 1,
    user: { id: 2, name: 'Sarah (Lawyer)', role: 'Broker', avatarInitials: 'SL' },
    text: "The initial capital stack from the AI looks solid, but we need to ensure the seller note's standby language is airtight per the latest SBA SOP.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: 2,
    user: { id: 3, name: 'David (Accountant)', role: 'Analyst', avatarInitials: 'DA' },
    text: "I've reviewed the DSCR estimates. They seem reasonable, but let's stress-test them with a 10% revenue decline scenario.",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  }
];

export const initialTasks: Task[] = [
  { 
    id: 1, text: 'Phase 1: Initial Diligence & Offer', 
    status: 'In Progress', 
    assignee: { id: 1, name: 'Alex (Me)', role: 'Admin', avatarInitials: 'A' }, 
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
    subtasks: [
      { id: 11, text: 'Finalize and sign Letter of Intent (LOI)', status: 'Completed', assignee: { id: 1, name: 'Alex (Me)', role: 'Admin', avatarInitials: 'A' }, dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString() },
      { id: 12, text: 'Engage legal counsel for due diligence', status: 'Completed', assignee: { id: 2, name: 'Sarah (Lawyer)', role: 'Broker', avatarInitials: 'SL' }, dependsOn: [11], dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString() },
      { id: 13, text: 'Secure financing pre-approval from lender', status: 'Pending', assignee: { id: 1, name: 'Alex (Me)', role: 'Admin', avatarInitials: 'A' }, dependsOn: [11], dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(), reminderDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString() },
    ]
  },
  { 
    id: 2, text: 'Phase 2: Deep Diligence', 
    status: 'Pending', 
    assignee: { id: 1, name: 'Alex (Me)', role: 'Admin', avatarInitials: 'A' },
    dependsOn: [12, 13],
    subtasks: [
        { id: 21, text: 'Complete financial due diligence on target company', status: 'Pending', assignee: { id: 3, name: 'David (Accountant)', role: 'Analyst', avatarInitials: 'DA' }, dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString() },
        { id: 22, text: 'Complete legal due diligence', status: 'Pending', assignee: { id: 2, name: 'Sarah (Lawyer)', role: 'Broker', avatarInitials: 'SL' }, dependsOn: [21] },
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

export const dealRoomUsers: User[] = [
  { id: 1, name: 'Alex (Me)', role: 'Admin', avatarInitials: 'A' },
  { id: 2, name: 'Sarah (Lawyer)', role: 'Broker', avatarInitials: 'SL' },
  { id: 3, name: 'David (Accountant)', role: 'Analyst', avatarInitials: 'DA' },
  { id: 4, name: 'Maria (Partner)', role: 'Broker', avatarInitials: 'MP' },
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
