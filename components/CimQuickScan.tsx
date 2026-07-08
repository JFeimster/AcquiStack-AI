import React, { useState } from 'react';
import { 
  FileText, 
  Upload, 
  Sparkles, 
  CheckCircle, 
  TrendingUp, 
  AlertOctagon, 
  Download, 
  ArrowRight,
  RefreshCw,
  Clock,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { Deal } from '../types';

interface CimQuickScanProps {
  onImportDeal: (deal: Omit<Deal, 'id'>) => void;
}

interface SampleCim {
  id: string;
  fileName: string;
  fileSize: string;
  title: string;
  industry: string;
  location: string;
  askingPrice: number;
  revenue: number;
  ebitda: number;
  sde: number;
  description: string;
  multiple: number;
  extractedRiskSummary: string;
  extractedFaqs: string[];
}

const CimQuickScan: React.FC<CimQuickScanProps> = ({ onImportDeal }) => {
  const [selectedCimId, setSelectedCimId] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanStep, setScanStep] = useState<string>('');
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [scanResult, setScanResult] = useState<SampleCim | null>(null);

  const sampleCims: SampleCim[] = [
    {
      id: 'cim-1',
      fileName: 'Apex_HVAC_Confidential_Memo.pdf',
      fileSize: '4.2 MB',
      title: 'Apex HVAC & Commercial Services',
      industry: 'Services',
      location: 'Atlanta, GA',
      askingPrice: 1650000,
      revenue: 2200000,
      ebitda: 480000,
      sde: 520000,
      multiple: 3.2,
      description: 'Active commercial HVAC service contracts. Key risk is owner acts as general manager. Growth opportunities exist in regional service line expansions.',
      extractedRiskSummary: '⚠️ OWNER DEPENDENCY: Owner spends 45+ hours per week in daily dispatch and scheduling operations. Key staff transition package is critical. CUSTOMER CONCENTRATION: Top customer represents 14.5% of total annual revenues. Highly stable medical building contract.',
      extractedFaqs: [
        'Is working capital included in the purchase price? Yes, a standard peg is specified in section 4.1.',
        'What license is required to run the company? Georgia Warm Air Heating License required by the designated manager.'
      ]
    },
    {
      id: 'cim-2',
      fileName: 'CloudScribe_SaaS_Investor_Teaser.pdf',
      fileSize: '2.8 MB',
      title: 'CloudScribe B2B SaaS Platform',
      industry: 'Technology',
      location: 'Austin, TX',
      askingPrice: 2800000,
      revenue: 1200000,
      ebitda: 710000,
      sde: 710000,
      multiple: 3.9,
      description: 'Generates specialized corporate compliance copy using proprietary fine-tuned language models. Highly stable SaaS model with low annual subscriber churn.',
      extractedRiskSummary: '✅ CHURN METRIC: Extremely low annual logo churn of 4.2%. Net revenue retention at 108%. TECH OVERHEAD: Heavy reliance on third-party API providers for translation models. Recommend building localized hosting failovers.',
      extractedFaqs: [
        'How many developers are staying with the business? Both lead backend engineers are willing to offer a 1-year transition contract.',
        'Is there intellectual property registered? Yes, 3 proprietary software copyrights are included in the assets list.'
      ]
    },
    {
      id: 'cim-3',
      fileName: 'Precision_CNC_Machine_Teaser_V2.pdf',
      fileSize: '6.1 MB',
      title: 'Tri-County Precision Machine Shop',
      industry: 'Manufacturing',
      location: 'Detroit, MI',
      askingPrice: 3200000,
      revenue: 4100000,
      ebitda: 820000,
      sde: 850000,
      multiple: 3.8,
      description: 'Automotive and defense-certified high-precision parts manufacturing facility. Generates extensive cash flows backed by massive fixed asset equipment list.',
      extractedRiskSummary: '⚠️ EQUIPMENT DEPRECIATION: Extensive CNC machine battery requires approximately $85,000 in capital expenditures (CapEx) over the next 24 months. CLIENT CONCENTRATION: Leading automotive sub-contractor represents 28.5% of sales. Mitigation recommended.',
      extractedFaqs: [
        'What CNC equipment is included? 8 Haas multi-axis systems valued at over $1.2M in current fair market value.',
        'Is the manufacturing facility included? Real estate is leased with an option to purchase for $1.1M.'
      ]
    }
  ];

  const triggerScan = (cim: SampleCim) => {
    setSelectedCimId(cim.id);
    setIsScanning(true);
    setScanResult(null);
    setScanProgress(5);
    setScanStep('OCR Processing: Splitting PDF pages...');

    // Interactive loading phase simulation
    const steps = [
      { p: 25, label: 'Extracting balance sheet assets & inventories...' },
      { p: 45, label: 'Scanning income statements & normalizing EBITDA...' },
      { p: 70, label: 'Evaluating seller discretionary earnings (SDE) add-backs...' },
      { p: 85, label: 'Auditing owner dependency & customer concentration risk metrics...' },
      { p: 100, label: 'Drafting executive investment summary memo...' }
    ];

    let currentStepIdx = 0;

    const interval = setInterval(() => {
      if (currentStepIdx < steps.length) {
        setScanProgress(steps[currentStepIdx].p);
        setScanStep(steps[currentStepIdx].label);
        currentStepIdx++;
      } else {
        clearInterval(interval);
        setIsScanning(false);
        setScanResult(cim);
      }
    }, 700);
  };

  const handleImportToWorkspace = () => {
    if (!scanResult) return;

    // Standard Omit<Deal, 'id'> payload
    const dealPayload: Omit<Deal, 'id'> = {
      deal_name: scanResult.title,
      status: 'Initial Analysis',
      purchase_type: 'asset',
      industry: scanResult.industry,
      business_location: scanResult.location,
      purchase_price: scanResult.askingPrice,
      revenue_ttm: scanResult.revenue,
      ebitda_ttm: scanResult.ebitda,
      working_capital: Math.round(scanResult.revenue * 0.05),
      closing_costs: Math.round(scanResult.askingPrice * 0.02),
      fees: 12500,
      borrower_profile: {
        liquidity: { cash: 300000, brokerage: 100000, cds: 0, hsas: 0, rsus: 0 },
        debt_capacity: { heloc_limit: 50000, portfolio_line: 0 },
        retirement_assets: { balance: 200000, robs_interest: true },
        credit_score_band: '720+',
        on_parole: false,
      },
      seller_note: {
        proposed_amount: Math.round(scanResult.askingPrice * 0.15),
        standby_full_life: true,
        interest: 9.0,
      },
      gifts: [],
      third_party_equity: [],
      rollover_equity: 0,
      lender_overlays: {
        seller_note_counts: true,
        gift_ok: true,
        min_borrower_cash_pct: 0.10,
      },
      diligenceItems: [
        { id: Date.now() + 1, task_name: 'Audit QuickBooks against past 3 years of Federal Tax filings', category: 'financial', is_completed: false },
        { id: Date.now() + 2, task_name: 'Validate key HVAC field employee retention agreements', category: 'operational', is_completed: false },
        { id: Date.now() + 3, task_name: 'Request SBA Form 1919 and personal history', category: 'legal', is_completed: false },
      ],
      scenarios: [
        {
          id: Date.now() + 4,
          scenario_name: 'AI Extracted Base Case',
          ebitda: scanResult.ebitda,
          revenue: scanResult.revenue,
          interest_rate: 11.25,
          amortization_years: 10,
          isPrimary: true,
        },
        {
          id: Date.now() + 5,
          scenario_name: 'AI Downside Stress-Test',
          ebitda: Math.round(scanResult.ebitda * 0.85),
          revenue: Math.round(scanResult.revenue * 0.90),
          interest_rate: 11.25,
          amortization_years: 10,
          isPrimary: false,
        }
      ]
    };

    onImportDeal(dealPayload);
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
      {/* Header Description */}
      <div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
          <FileText className="w-8 h-8 text-brand-blue-600 dark:text-brand-blue-400" />
          <span>CIM Quick AI Scan</span>
        </h1>
        <p className="text-gray-650 dark:text-gray-300 mt-1 max-w-xl font-medium text-sm">
          Simulate uploading a private business pitch deck or Confidential Information Memorandum (CIM). Let our AI agent parse income statements and generate draft summaries.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column: upload simulation & samples */}
        <div className="space-y-6">
          {/* Drag and Drop Box Simulation */}
          <div className="bg-white dark:bg-gray-900 border-2 border-dashed border-gray-300 dark:border-gray-800 rounded-2xl p-8 text-center space-y-4 hover:border-brand-blue-500 hover:bg-gray-50/50 dark:hover:bg-gray-850/25 transition-all">
            <div className="mx-auto w-12 h-12 rounded-full bg-brand-blue-50 dark:bg-brand-blue-950/40 text-brand-blue-600 dark:text-brand-blue-400 flex items-center justify-center">
              <Upload className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-1">
              <p className="text-xs md:text-sm font-bold text-gray-900 dark:text-white">Drag and drop your target CIM here</p>
              <p className="text-4xs text-gray-500 dark:text-gray-400 uppercase tracking-widest font-mono">Supports PDF, DOCX, XLSX (Max 15MB)</p>
            </div>
            <p className="text-3xs text-gray-400 dark:text-gray-500 font-medium">Or select one of our premium sample document streams below:</p>
          </div>

          {/* Sample Files Selection */}
          <div className="space-y-3.5">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">Available Sample CIM Feeds</h3>
            <div className="space-y-2.5">
              {sampleCims.map((cim) => {
                const isSelected = selectedCimId === cim.id;
                return (
                  <div
                    key={cim.id}
                    onClick={() => !isScanning && triggerScan(cim)}
                    className={`
                      p-4 bg-white dark:bg-gray-900 border rounded-xl hover:border-brand-blue-500 cursor-pointer transition-all flex items-center justify-between group
                      ${isSelected ? 'border-brand-blue-500 shadow-3xs ring-2 ring-brand-blue-500/10' : 'border-gray-200 dark:border-gray-850'}
                      ${isScanning ? 'opacity-60 cursor-not-allowed' : ''}
                    `}
                  >
                    <div className="flex items-center space-x-3 pr-4">
                      <div className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-lg group-hover:bg-brand-blue-50 dark:group-hover:bg-brand-blue-950/30 group-hover:text-brand-blue-600 dark:group-hover:text-brand-blue-400 transition-colors">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-950 dark:text-white truncate max-w-[140px] md:max-w-[180px]" title={cim.fileName}>
                          {cim.fileName}
                        </h4>
                        <span className="text-4xs font-mono font-semibold text-gray-450 dark:text-gray-500 uppercase tracking-wider">
                          {cim.fileSize} • {cim.industry}
                        </span>
                      </div>
                    </div>
                    
                    <button
                      disabled={isScanning}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-brand-blue-600 text-gray-700 hover:text-white dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-brand-blue-600 font-bold rounded-lg text-3xs shadow-3xs transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span>Scan</span>
                      <Sparkles className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right column: Interactive Scan Logs & Result metrics */}
        <div className="lg:col-span-2">
          {isScanning ? (
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 md:p-8 space-y-6 flex flex-col justify-center items-center h-full min-h-[400px]">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-brand-blue-100 dark:border-brand-blue-950/50 border-t-brand-blue-600 dark:border-t-brand-blue-400 rounded-full animate-spin"></div>
                <Sparkles className="w-6 h-6 text-brand-blue-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <div className="space-y-2 text-center max-w-sm">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white animate-pulse">Running AI CIM Underwriting scan...</h4>
                <p className="text-xs text-brand-blue-600 dark:text-brand-blue-400 font-semibold font-mono">
                  {scanStep}
                </p>
              </div>

              {/* Progress bar */}
              <div className="w-full max-w-xs bg-gray-200 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                <div className="bg-brand-blue-600 h-full transition-all duration-300" style={{ width: `${scanProgress}%` }}></div>
              </div>
            </div>
          ) : scanResult ? (
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 md:p-8 shadow-2xs space-y-6 animate-scaleIn">
              {/* Result Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-150 dark:border-gray-800/80 pb-5 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center rounded-md bg-green-50 dark:bg-green-950/30 px-2 py-0.5 text-4xs font-bold text-green-700 dark:text-green-450 ring-1 ring-inset ring-green-600/10 uppercase font-mono tracking-wider">
                      AI SCAN SUCCESSFUL
                    </span>
                    <span className="text-4xs text-gray-450 dark:text-gray-500 uppercase font-mono font-bold">{scanResult.location}</span>
                  </div>
                  <h2 className="text-lg md:text-xl font-black text-gray-950 dark:text-white">
                    {scanResult.title}
                  </h2>
                </div>

                <button
                  onClick={handleImportToWorkspace}
                  className="px-5 py-2.5 bg-brand-blue-600 hover:bg-brand-blue-700 text-white font-bold rounded-xl text-xs flex items-center space-x-2 shadow-md hover:shadow-lg hover:scale-101 transition-all flex-shrink-0 cursor-pointer"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Import Scanned Deal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Financial Metrics Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-850 border border-gray-150 dark:border-gray-800 rounded-xl text-center md:text-left">
                  <span className="text-5xs font-bold text-gray-450 dark:text-gray-500 uppercase tracking-widest font-mono">Target asking</span>
                  <p className="text-sm md:text-base font-mono font-bold text-gray-950 dark:text-white mt-1">
                    {formatCurrency(scanResult.askingPrice)}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-850 border border-gray-150 dark:border-gray-800 rounded-xl text-center md:text-left">
                  <span className="text-5xs font-bold text-gray-450 dark:text-gray-500 uppercase tracking-widest font-mono">Revenue (TTM)</span>
                  <p className="text-sm md:text-base font-mono font-bold text-gray-950 dark:text-white mt-1">
                    {formatCurrency(scanResult.revenue)}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-850 border border-gray-150 dark:border-gray-800 rounded-xl text-center md:text-left">
                  <span className="text-5xs font-bold text-gray-450 dark:text-gray-500 uppercase tracking-widest font-mono">Normalized EBITDA</span>
                  <p className="text-sm md:text-base font-mono font-bold text-gray-950 dark:text-white mt-1">
                    {formatCurrency(scanResult.ebitda)}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-850 border border-gray-150 dark:border-gray-800 rounded-xl text-center md:text-left">
                  <span className="text-5xs font-bold text-gray-450 dark:text-gray-500 uppercase tracking-widest font-mono">Seller cash flow</span>
                  <p className="text-sm md:text-base font-mono font-bold text-gray-950 dark:text-white mt-1">
                    {formatCurrency(scanResult.sde)}
                  </p>
                </div>
              </div>

              {/* Risks Heatmap */}
              <div className="p-4 bg-red-50/45 dark:bg-red-950/15 border border-red-200/50 dark:border-red-900/10 rounded-xl text-xs space-y-1.5">
                <h4 className="font-extrabold text-red-750 dark:text-red-400 flex items-center gap-1.5 uppercase tracking-wider font-mono text-3xs">
                  <AlertOctagon className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <span>AI Risk Extractor Findings</span>
                </h4>
                <p className="text-red-900 dark:text-red-300 leading-relaxed font-semibold">
                  {scanResult.extractedRiskSummary}
                </p>
              </div>

              {/* Sample extracted FAQs */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">AI Extracted Memo Q&A</h4>
                <div className="space-y-2.5">
                  {scanResult.extractedFaqs.map((faq, idx) => (
                    <div key={idx} className="p-3.5 bg-gray-50 dark:bg-gray-850 border border-gray-150 dark:border-gray-800 rounded-xl text-xs flex gap-2">
                      <Clock className="w-4 h-4 text-brand-blue-500 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-650 dark:text-gray-300 leading-normal">
                        <strong className="text-gray-900 dark:text-white">{faq.split('?')[0]}?</strong>
                        <span className="block mt-1 text-gray-500 dark:text-gray-400 font-medium">{faq.split('?')[1]}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Underwriter Note */}
              <div className="p-4 bg-brand-blue-50/50 dark:bg-brand-blue-950/20 border border-brand-blue-100/30 dark:border-brand-blue-900/20 rounded-xl text-xs flex gap-2.5">
                <ShieldCheck className="w-5 h-5 text-brand-blue-500 flex-shrink-0 mt-0.5" />
                <p className="text-brand-blue-700 dark:text-brand-blue-300 leading-relaxed">
                  <strong>AI Lender Recommendation:</strong> This deal structures beautifully at {scanResult.multiple}x Cash Flow. Under current SBA prime overlays, the borrower cash requirement will match exactly 10% cash equivalent down with a full-standby 15% Seller standby note. Click <strong>Import Scanned Deal</strong> to analyze the capital stack details!
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 md:p-8 text-center space-y-3 flex flex-col justify-center items-center h-full min-h-[400px]">
              <Sparkles className="w-8 h-8 text-gray-400 animate-pulse" />
              <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Ready to analyze target documents.</h4>
              <p className="text-3xs text-gray-400 max-w-xs leading-normal">
                Click <strong>Scan</strong> next to any sample CIM file in the left panel to execute an instant AI underwriting and metrics-extraction scan.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CimQuickScan;
