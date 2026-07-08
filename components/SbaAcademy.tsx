import React, { useState } from 'react';
import { 
  BookOpen, 
  ChevronDown, 
  HelpCircle, 
  Percent, 
  CheckSquare, 
  Calculator, 
  Scale, 
  CheckCircle2, 
  TrendingUp, 
  BookMarked,
  Info
} from 'lucide-react';

const SbaAcademy: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'playbook' | 'calculators' | 'checklist' | 'glossary'>('playbook');
  
  // DSCR Calculator states
  const [ebitdaInput, setEbitdaInput] = useState<number>(450000);
  const [debtServiceInput, setDebtServiceInput] = useState<number>(310000);

  // Equity Down Payment Calculator states
  const [purchasePriceInput, setPurchasePriceInput] = useState<number>(1800000);
  const [sellerNoteStandbyInput, setSellerNoteStandbyInput] = useState<number>(10); // %

  const calculatedDscr = ebitdaInput / (debtServiceInput || 1);
  const requiredEquity = purchasePriceInput * 0.10;
  const sellerNoteCredit = (purchasePriceInput * sellerNoteStandbyInput) / 100;
  const remainingCashNeeded = Math.max(0, requiredEquity - sellerNoteCredit);

  const [activeGlossaryTerm, setActiveGlossaryTerm] = useState<string | null>(null);

  const articles = [
    {
      title: "SBA SOP 50 10: New Equity Injection Rules Explained",
      category: "SBA Regulations",
      readTime: "4 min read",
      desc: "Historically, SBA lenders demanded strict 10% cash equivalent equity down from the buyer. Under the latest SOP revision, a seller note on a full standby basis (meaning no payments of principal or interest for the life of the SBA loan) can satisfy up to 100% of this equity requirement, reducing buyer cash injection to as little as $0 in certain seller-backed structures!"
    },
    {
      title: "Debt Service Coverage Ratio (DSCR) Thresholds",
      category: "Underwriting",
      readTime: "3 min read",
      desc: "Lenders look at the Debt Service Coverage Ratio (DSCR) as the primary indicator of deal safety. SBA regulations mandate a minimum DSCR of 1.15x, but most active underwriters overlay a requirement of 1.25x to 1.35x. DSCR is calculated by dividing normalized cash flow (EBITDA + owner compensation) by the total annual principal and interest payments."
    },
    {
      title: "Asset Purchase vs. Stock Purchase structures",
      category: "Deal Structuring",
      readTime: "5 min read",
      desc: "In small business M&A, asset purchases are heavily favored by buyers because they allow for a 'step-up' in asset tax basis and eliminate legacy liabilities. Stock purchases are preferred by sellers for capital gains tax benefits. SBA 7(a) programs support both, but asset purchases require precise inventory valuation audits during diligence."
    }
  ];

  const terms = [
    { term: "SDE (Seller's Discretionary Earnings)", def: "SDE is the total financial benefit returned to a single working owner. It starts with net income and adds back interest, taxes, depreciation, amortization, non-operating expenses, and the owner's personal salary." },
    { term: "EBITDA", def: "Earnings Before Interest, Taxes, Depreciation, and Amortization. Unlike SDE, EBITDA represents the profitability of the business assuming a professional manager is hired, and does not add back the general manager salary." },
    { term: "Full Standby Note", def: "A seller-financed debt note where the seller agrees to receive zero payments (of both principal and interest) for the entire duration of the senior SBA loan (normally 10 years)." },
    { term: "Working Capital Peg", def: "A negotiated dollar amount of working capital (current assets minus current liabilities) that the seller must deliver at closing to ensure the business can operate on day one." },
    { term: "LOI (Letter of Intent)", def: "A non-binding legal document signed by both buyer and seller outlining the proposed transaction price, capital structure, exclusivity window, and key diligence conditions." }
  ];

  // Checklist items
  const [checklist, setChecklist] = useState([
    { id: 1, text: "Sign NDA and Request Confidential Information Memorandum (CIM)", cat: "Pre-LOI", done: true },
    { id: 2, text: "Reconstruct last 3 years of P&L statements and match with tax returns", cat: "Pre-LOI", done: true },
    { id: 3, text: "Analyze customer concentration (Flag any account > 15% of revenues)", cat: "Pre-LOI", done: false },
    { id: 4, text: "Draft Letter of Intent (LOI) with proposed standby structures", cat: "LOI Stage", done: false },
    { id: 5, text: "Establish escrow account and submit earnest money deposit (EMD)", cat: "LOI Stage", done: false },
    { id: 6, text: "Initiate third-party Quality of Earnings (QofE) financial audit", cat: "Due Diligence", done: false },
    { id: 7, text: "Request SBA Form 1919 and personal financials from lender", cat: "Bank Underwriting", done: false },
    { id: 8, text: "Approve final lease assignment or commercial real estate transfer", cat: "Closing", done: false }
  ]);

  const toggleChecklistItem = (id: number) => {
    setChecklist(checklist.map(item => item.id === id ? { ...item, done: !item.done } : item));
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-8 py-2 animate-fadeIn">
      {/* Academy Header */}
      <div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-brand-blue-600 dark:text-brand-blue-400" />
          <span>SBA Acquisition Academy</span>
        </h1>
        <p className="text-gray-650 dark:text-gray-300 mt-1 max-w-xl font-medium text-sm">
          Master the rules of SBA acquisitions, perform quick calculations, and track your due diligence milestones.
        </p>
      </div>

      {/* Academy Tab Switcher */}
      <div className="flex border-b border-gray-250 dark:border-gray-800 space-x-6">
        {[
          { id: 'playbook', label: 'SOP Playbook', Icon: BookMarked },
          { id: 'calculators', label: 'Quick Debt Calculators', Icon: Calculator },
          { id: 'checklist', label: 'Acquisition Checklist', Icon: CheckSquare },
          { id: 'glossary', label: 'M&A Glossary', Icon: Scale },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`
              pb-3.5 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer
              ${activeTab === tab.id
                ? 'border-brand-blue-600 text-brand-blue-600 dark:border-brand-blue-400 dark:text-brand-blue-400'
                : 'border-transparent text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }
            `}
          >
            <tab.Icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="space-y-6">
        
        {/* Playbook tab */}
        {activeTab === 'playbook' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {articles.map((art, idx) => (
                <div key={idx} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-2xs space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="px-2 py-0.5 bg-brand-blue-50 text-brand-blue-700 dark:bg-brand-blue-950/40 dark:text-brand-blue-400 rounded text-4xs font-bold uppercase tracking-wider font-mono">
                      {art.category}
                    </span>
                    <span className="text-4xs text-gray-450 dark:text-gray-500 font-bold uppercase font-mono">{art.readTime}</span>
                  </div>
                  <h3 className="text-base md:text-lg font-extrabold text-gray-950 dark:text-white">{art.title}</h3>
                  <p className="text-xs text-gray-650 dark:text-gray-300 leading-relaxed font-medium">
                    {art.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Side Tips card */}
            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 space-y-4">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Info className="w-4 h-4 text-brand-blue-500" />
                <span>SBA 7(a) Quick facts</span>
              </h4>
              <ul className="space-y-3.5 text-xs text-gray-650 dark:text-gray-300 leading-normal font-medium">
                <li>• <strong>Max Loan:</strong> The maximum loan exposure for standard SBA 7(a) programs is $5,000,000.</li>
                <li>• <strong>Standard Term:</strong> Business acquisition loans without commercial real estate are structured on fully amortized 10-year terms.</li>
                <li>• <strong>Guaranties:</strong> SBA guarantees up to 75% of loans over $150,000, reducing risk for commercial lenders.</li>
                <li>• <strong>Personal Guaranty:</strong> Anyone holding a 20% or greater equity interest in the acquiring entity must sign an unconditional personal guaranty.</li>
              </ul>
            </div>
          </div>
        )}

        {/* Quick Debt Calculators tab */}
        {activeTab === 'calculators' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Calculator 1: DSCR */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-2xs space-y-5">
              <h3 className="text-sm font-bold text-gray-950 dark:text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-brand-blue-500" />
                <span>Debt Service Coverage Ratio (DSCR)</span>
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-4xs font-bold uppercase tracking-wider text-gray-450 dark:text-gray-400">Normalized Cash Flow (SDE / EBITDA)</label>
                  <input
                    type="number"
                    step="10000"
                    value={ebitdaInput}
                    onChange={(e) => setEbitdaInput(parseInt(e.target.value) || 0)}
                    className="w-full text-xs font-semibold px-3 py-2 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-850 rounded-lg dark:text-white font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-4xs font-bold uppercase tracking-wider text-gray-450 dark:text-gray-400">Total Annual Principal & Interest (P&I)</label>
                  <input
                    type="number"
                    step="10000"
                    value={debtServiceInput}
                    onChange={(e) => setDebtServiceInput(parseInt(e.target.value) || 0)}
                    className="w-full text-xs font-semibold px-3 py-2 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-850 rounded-lg dark:text-white font-mono"
                  />
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-850 rounded-xl border border-gray-150 dark:border-gray-800 flex justify-between items-center">
                  <div className="space-y-0.5">
                    <span className="text-4xs font-bold text-gray-400 uppercase tracking-wider">Estimated DSCR</span>
                    <p className={`text-2xl font-mono font-black ${calculatedDscr >= 1.15 ? 'text-green-600 dark:text-green-450' : 'text-red-500'}`}>
                      {calculatedDscr.toFixed(2)}x
                    </p>
                  </div>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-3xs font-bold leading-normal uppercase border ${
                    calculatedDscr >= 1.15 
                      ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-950/30 dark:border-green-900/20 dark:text-green-450' 
                      : 'bg-red-50 border-red-200 text-red-700 dark:bg-red-950/30 dark:border-red-900/20'
                  }`}>
                    {calculatedDscr >= 1.15 ? 'Meets SBA SOP' : 'Unfeasible'}
                  </span>
                </div>
              </div>
            </div>

            {/* Calculator 2: SBA Equity Injection */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-2xs space-y-5">
              <h3 className="text-sm font-bold text-gray-950 dark:text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Percent className="w-4 h-4 text-brand-blue-500" />
                <span>SBA 10% Equity Injection Calculator</span>
              </h3>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-4xs font-bold uppercase tracking-wider text-gray-450 dark:text-gray-400">Total Purchase Price</label>
                  <input
                    type="number"
                    step="50000"
                    value={purchasePriceInput}
                    onChange={(e) => setPurchasePriceInput(parseInt(e.target.value) || 0)}
                    className="w-full text-xs font-semibold px-3 py-2 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-850 rounded-lg dark:text-white font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-4xs font-bold uppercase tracking-wider text-gray-450 dark:text-gray-400">Seller Note Standby Amount (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={sellerNoteStandbyInput}
                    onChange={(e) => setSellerNoteStandbyInput(parseInt(e.target.value) || 0)}
                    className="w-full text-xs font-semibold px-3 py-2 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-850 rounded-lg dark:text-white font-mono"
                  />
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-850 rounded-xl border border-gray-150 dark:border-gray-800 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-550 dark:text-gray-400">Total Required 10% Injection:</span>
                    <span className="font-mono font-bold text-gray-950 dark:text-white">{formatCurrency(requiredEquity)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-550 dark:text-gray-400">Standby Note Credit:</span>
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{formatCurrency(sellerNoteCredit)}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 dark:border-gray-800 pt-2 font-bold">
                    <span className="text-gray-950 dark:text-white">Remaining Cash Required:</span>
                    <span className="font-mono text-green-600 dark:text-green-450">{formatCurrency(remainingCashNeeded)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Checklist tab */}
        {activeTab === 'checklist' && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-2xs space-y-5">
            <h3 className="text-sm font-bold text-gray-950 dark:text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
              <CheckSquare className="w-4 h-4 text-brand-blue-500" />
              <span>Interactive Due Diligence Milestones</span>
            </h3>

            <div className="space-y-2 max-h-[450px] overflow-y-auto pr-2 no-scrollbar">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleChecklistItem(item.id)}
                  className={`
                    p-3.5 border rounded-xl flex items-center justify-between cursor-pointer transition-all hover:bg-gray-50/50 dark:hover:bg-gray-850/40
                    ${item.done 
                      ? 'border-green-200 bg-green-50/30 dark:border-green-950/20 dark:bg-green-950/5' 
                      : 'border-gray-200 dark:border-gray-850 bg-white dark:bg-gray-900'
                    }
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={item.done}
                      onChange={() => toggleChecklistItem(item.id)}
                      className="rounded border-gray-300 text-brand-blue-600 focus:ring-brand-blue-500 h-4 w-4"
                    />
                    <span className={`text-xs md:text-sm font-semibold transition-all ${item.done ? 'line-through text-gray-400 dark:text-gray-550' : 'text-gray-800 dark:text-gray-200'}`}>
                      {item.text}
                    </span>
                  </div>
                  <span className="text-5xs font-bold uppercase font-mono px-2 py-0.5 rounded bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                    {item.cat}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Glossary tab */}
        {activeTab === 'glossary' && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">Click a term to read its definition</h3>
            
            <div className="space-y-2.5">
              {terms.map((item) => {
                const isOpen = activeGlossaryTerm === item.term;
                return (
                  <div 
                    key={item.term}
                    className="border border-gray-200 dark:border-gray-805 rounded-xl overflow-hidden"
                  >
                    <button
                      onClick={() => setActiveGlossaryTerm(isOpen ? null : item.term)}
                      className="w-full text-left p-4 flex justify-between items-center text-xs md:text-sm font-bold text-gray-950 dark:text-white hover:bg-gray-50/50 dark:hover:bg-gray-850/20"
                    >
                      <span>{item.term}</span>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180 text-brand-blue-500' : ''}`} />
                    </button>
                    {isOpen && (
                      <div className="p-4 bg-gray-50 dark:bg-gray-850 text-xs text-gray-650 dark:text-gray-300 leading-relaxed border-t border-gray-150/40 dark:border-gray-850/60 font-medium animate-fadeIn">
                        {item.def}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default SbaAcademy;
