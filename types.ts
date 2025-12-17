
import React from 'react';
import type { FunctionDeclaration } from '@google/genai';

export { FunctionDeclaration };

export interface AgentModule {
  id: string;
  title: string;
  description: string;
  command: string;
  Icon: React.FC<{ className?: string }>;
  outputRequirements: string;
  promptPlaceholder: string;
  mode?: 'default' | 'thinking' | 'search';
}

export interface WorkflowStep {
  agentId: string;
  condition?: {
    sourceAgentId: string;
    outputContains: string;
    onFailure: 'skip' | 'stop';
  };
}

export interface WorkflowModule {
  id: string;
  title: string;
  description: string;
  Icon: React.FC<{ className?: string }>;
  steps: WorkflowStep[];
}

// New types based on the Deal Schema
export interface BorrowerProfile {
  liquidity: {
    cash: number;
    brokerage: number;
    cds: number;
    hsas: number;
    rsus: number;
  };
  debt_capacity: {
    heloc_limit: number;
    portfolio_line: number;
  };
  retirement_assets: {
    balance: number;
    robs_interest: boolean;
  };
  credit_score_band: '<620' | '620-680' | '680-720' | '720+';
  on_parole: boolean;
}

export interface SellerNote {
  proposed_amount: number;
  standby_full_life: boolean;
  interest: number;
}

export interface Gift {
  id: number;
  source: string;
  amount: number | '';
  relationship: string;
}

export interface ThirdPartyEquity {
  id: number;
  investor: string;
  amount: number | '';
  rights: 'non-control';
}

export interface LenderOverlays {
    seller_note_counts: boolean;
    gift_ok: boolean;
    min_borrower_cash_pct: number;
}

export type DealStatus = 'Initial Analysis' | 'Due Diligence' | 'Awaiting Financing' | 'Closing';

export type DiligenceParty = 'Buyer' | 'Seller' | 'Internal' | 'Lender';
export type DiligenceStatus = 'Pending' | 'In Review' | 'Completed' | 'Not Applicable';

export interface DiligenceItem {
  id: number;
  text: string;
  stage: string; // e.g., 'Stage 0: Intake'
  party: DiligenceParty;
  status: DiligenceStatus;
  linkedDocumentId: number | null;
  assigneeId: number | null;
  notes?: string;
}

export interface ScenarioMetrics {
  totalEquityNeeded: number | null;
  dscrEstimate: number | null;
  postCloseLiquidity: number | null;
}

export interface Scenario {
  id: number;
  name: string;
  notes: string;
  isPrimary: boolean;
  metrics: ScenarioMetrics;
  agentId: string;
  fullOutput: string;
}

export interface Deal {
  id: number;
  status: DealStatus;
  deal_name: string;
  purchase_type: 'asset' | 'stock' | 'leveraged_buyout' | 'management_buyout' | 'franchise';
  industry: string;
  business_location: 'US-based' | 'International';
  purchase_price: number;
  revenue_ttm: number;
  ebitda_ttm: number;
  working_capital: number;
  closing_costs: number;
  fees: number;
  borrower_profile: BorrowerProfile;
  seller_note: SellerNote;
  gifts: Gift[];
  third_party_equity: ThirdPartyEquity[];
  rollover_equity: number;
  lender_overlays: LenderOverlays;
  diligenceItems: DiligenceItem[];
  scenarios: Scenario[];
}


// New types for structured LenderMatch AI output
export interface Lender {
  name: string;
  overlay_notes: string;
}

export interface LenderMatchResult {
  compliance_status: 'pass' | 'fail' | 'review_needed';
  recommended_stack: string;
  dscr_estimate: number;
  lender_shortlist: Lender[];
  next_actions: string[];
}

export interface GroundingSource {
  web?: {
    uri: string;
    title: string;
  };
  maps?: {
    uri: string;
    title: string;
  }
}

export interface AgentResult {
  text: string;
  sources?: GroundingSource[];
  structuredMetrics?: ScenarioMetrics;
}

export interface TranscriptionTurn {
  speaker: 'user' | 'model';
  text: string;
}

// New types for added features
export interface DocumentAnalysisResult {
  summary: string;
  risks: string[];
  extracted_data: {
    deal_name?: string;
    purchase_price?: number;
    industry?: string;
    revenue_ttm?: number;
    ebitda_ttm?: number;
  };
}

export type UserRole = 'Admin' | 'Broker' | 'Analyst';

export interface User {
  id: number;
  name: string;
  role: UserRole;
  avatarInitials: string;
}

export interface CommentRisk {
  isRisk: boolean;
  summary: string;
  suggestsCopilot: boolean;
}

export interface Comment {
  id: number;
  user: User;
  text: string;
  timestamp: string;
  risk?: CommentRisk;
}

export type TaskStatus = 'Pending' | 'In Progress' | 'Completed' | 'Blocked';

export interface Task {
  id: number;
  text: string;
  status: TaskStatus;
  assignee?: User;
  source?: 'user' | 'ai';
  dueDate?: string;
  reminderDate?: string;
  dependsOn?: number[];
  subtasks?: Task[];
}

export interface DocumentAnalysis {
  summary: string;
  risks: string[];
  key_clauses: string[];
}

export interface SharedDocument {
  id: number;
  name: string;
  type: 'PDF' | 'Word' | 'Spreadsheet' | 'Other';
  size: string;
  uploadedAt: string;
  analysisState: 'pending' | 'analyzing' | 'complete' | 'error';
  analysis?: DocumentAnalysis;
  base64Content?: string;
  mimeType?: string;
}

export interface VDRChatMessage {
  id: number;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
}

export interface ChartDataPoint {
  name: string;
  value: number;
  color: string;
}

export interface AIRecommendation {
    agentId: string;
    reason: string;
    suggestedTask?: string;
}

export interface AffiliateLender {
    id: string;
    name: string;
    applyUrl: string;
    fundingAmount: string;
    requirements: string[];
    targetIndustries: string[];
    financingTypes: string[];
}

export interface LenderRecommendation {
    lenderId: string;
    reason: string;
}

// Types for SBA Form 413 (Personal Financial Statement)
export interface PFSLineItem {
  id: number;
  description: string;
  amount: number | '';
}

export interface PFSData {
  cashOnHandAndInBanks: number | '';
  savingsAccounts: number | '';
  iraOrOtherRetirement: number | '';
  accountsAndNotesReceivable: number | '';
  lifeInsuranceCashValue: number | '';
  stocksAndBonds: PFSLineItem[];
  realEstate: PFSLineItem[];
  automobiles: PFSLineItem[];
  otherPersonalAssets: PFSLineItem[];
  
  accountsPayable: number | '';
  notesPayableToBanks: PFSLineItem[];
  notesPayableToOthers: PFSLineItem[];
  realEstateMortgages: PFSLineItem[];
  otherLiabilities: PFSLineItem[];

  salary: number | '';
  netInvestmentIncome: number | '';
  otherIncome: number | '';
  
  contingentLiabilities: {
    asEndorser: number | '';
    legalClaims: number | '';
    federalTaxes: number | '';
    other: number | '';
  }
}

// Types for Quality of Earnings Analyzer
export interface QoEAddBack {
  id: number;
  description: string;
  amount: number | '';
}

export interface QoEData {
  totalRevenue: number | '';
  topCustomerRevenue: number | '';
  topFiveCustomersRevenue: number | '';
  recurringRevenuePercentage: number | '';
  reportedSDE: number | '';
  questionableAddBacks: QoEAddBack[];
  averageWorkingCapital: number | '';
  targetWorkingCapital: number | '';
}

// Types for Business Valuation Calculator
export interface IndustryMultipleRange {
  low: number;
  high: number;
  explanation: string;
}
