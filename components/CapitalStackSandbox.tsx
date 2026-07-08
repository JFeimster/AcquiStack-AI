import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  HelpCircle, 
  CheckCircle, 
  AlertTriangle, 
  Percent, 
  DollarSign, 
  Sparkles, 
  TrendingUp, 
  Scale, 
  Coins 
} from 'lucide-react';

const CapitalStackSandbox: React.FC = () => {
  const [purchasePrice, setPurchasePrice] = useState<number>(1500000);
  const [borrowerCashPct, setBorrowerCashPct] = useState<number>(10);
  const [sellerNotePct, setSellerNotePct] = useState<number>(15);
  const [sellerNoteStandby, setSellerNoteStandby] = useState<boolean>(true);
  const [interestRate, setInterestRate] = useState<number>(11.25); // SBA standard prime + 2.75%
  const [amortizationYears, setAmortizationYears] = useState<number>(10); // Standard SBA term

  // Assumed multiple of EBITDA for DSCR calculations
  const [multiple, setMultiple] = useState<number>(3.5);

  const calculatedStack = useMemo(() => {
    // Math logic
    const sbaLoanPct = Math.max(0, 100 - borrowerCashPct - sellerNotePct);
    const sbaLoanAmount = (purchasePrice * sbaLoanPct) / 100;
    const sellerNoteAmount = (purchasePrice * sellerNotePct) / 100;
    const borrowerCashAmount = (purchasePrice * borrowerCashPct) / 100;

    // Assumed EBITDA based on Multiple
    const assumedEbitda = purchasePrice / multiple;

    // Standard Amortization PMT calculation
    const monthlyRate = interestRate / 100 / 12;
    const totalMonths = amortizationYears * 12;
    let monthlyDebtService = 0;
    if (monthlyRate > 0) {
      monthlyDebtService = sbaLoanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
    } else {
      monthlyDebtService = sbaLoanAmount / totalMonths;
    }
    const annualDebtService = monthlyDebtService * 12;

    // DSCR
    const dscr = assumedEbitda / annualDebtService;

    // Compliance Checklist Checks
    // 1. Borrower cash equivalent injection. SBA requires min 10% equity injection.
    // If seller note is on standby for the life of the loan, it counts as equity injection (up to 5% of the 10%, or as part of it depending on latest guidelines).
    // Let's model: Equity injection = cash % + (sellerNoteStandby ? sellerNotePct : 0)
    const effectiveEquityPct = borrowerCashPct + (sellerNoteStandby ? sellerNotePct : 0);
    const isEquityInjectionCompliant = effectiveEquityPct >= 10 && borrowerCashPct >= 5;

    // 2. Max SBA Loan exposure limit is $5,000,000
    const isSbaLimitCompliant = sbaLoanAmount <= 5000000;

    // 3. Min DSCR is typically 1.15x
    const isDscrCompliant = dscr >= 1.15;

    const complianceScore = (isEquityInjectionCompliant ? 33 : 0) + (isSbaLimitCompliant ? 33 : 0) + (isDscrCompliant ? 34 : 0);

    return {
      sbaLoanPct,
      sbaLoanAmount,
      sellerNoteAmount,
      borrowerCashAmount,
      assumedEbitda,
      annualDebtService,
      dscr,
      isEquityInjectionCompliant,
      isSbaLimitCompliant,
      isDscrCompliant,
      complianceScore,
      effectiveEquityPct
    };
  }, [purchasePrice, borrowerCashPct, sellerNotePct, sellerNoteStandby, interestRate, amortizationYears, multiple]);

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
      {/* Title */}
      <div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
          <Calculator className="w-8 h-8 text-brand-blue-600 dark:text-brand-blue-400" />
          <span>Capital Stack Sandbox</span>
        </h1>
        <p className="text-gray-650 dark:text-gray-300 mt-1 max-w-xl font-medium text-sm">
          Fiddle with parameters in real-time to model compliant financing structures. See the SBA rules checklist update instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Sliders and Inputs Panel */}
        <div className="lg:col-span-2 space-y-6 bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xs">
          <h2 className="text-base font-bold text-gray-950 dark:text-white pb-3 border-b border-gray-150 dark:border-gray-800 flex items-center gap-2">
            <Coins className="w-4 h-4 text-brand-blue-500" />
            <span>Deal Parameters</span>
          </h2>

          <div className="space-y-5">
            {/* Purchase Price Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">Purchase Price (Enterprise Value)</span>
                <span className="text-gray-950 dark:text-white font-bold font-mono">{formatCurrency(purchasePrice)}</span>
              </div>
              <input
                type="range"
                min="250000"
                max="8000000"
                step="25000"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-brand-blue-600"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Buyer Cash Injection */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-gray-500 dark:text-gray-400">
                  <span>Borrower Cash Contribution (%)</span>
                  <span className="text-gray-950 dark:text-white font-bold font-mono">{borrowerCashPct}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="1"
                  value={borrowerCashPct}
                  onChange={(e) => setBorrowerCashPct(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-brand-blue-600"
                />
              </div>

              {/* Seller Note % */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-gray-500 dark:text-gray-400">
                  <span>Seller Note (%)</span>
                  <span className="text-gray-950 dark:text-white font-bold font-mono">{sellerNotePct}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  step="1"
                  value={sellerNotePct}
                  onChange={(e) => setSellerNotePct(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-brand-blue-600"
                />
              </div>
            </div>

            {/* Seller Note Standby Toggle */}
            {sellerNotePct > 0 && (
              <div className="p-4 bg-gray-50 dark:bg-gray-850 rounded-xl border border-gray-150 dark:border-gray-800 flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-gray-950 dark:text-white flex items-center gap-1.5">
                    Seller Note Standby (Life of SBA Loan)
                  </h4>
                  <p className="text-4xs text-gray-550 dark:text-gray-400 leading-normal max-w-sm">
                    If on full standby (no payments made), SBA guidelines count this toward the mandatory 10% equity injection requirement.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSellerNoteStandby(!sellerNoteStandby)}
                  className={`
                    relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none
                    ${sellerNoteStandby ? 'bg-brand-blue-600' : 'bg-gray-200 dark:bg-gray-750'}
                  `}
                >
                  <span
                    aria-hidden="true"
                    className={`
                      pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out
                      ${sellerNoteStandby ? 'translate-x-5' : 'translate-x-0'}
                    `}
                  />
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3">
              {/* EBITDA Multiple (to estimate cash flow) */}
              <div className="space-y-1.5">
                <label className="block text-4xs font-bold uppercase tracking-wider text-gray-450 dark:text-gray-400">Assumed Valuation Multiple</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="10"
                    value={multiple}
                    onChange={(e) => setMultiple(parseFloat(e.target.value) || 3.5)}
                    className="w-full text-xs font-semibold px-3 py-1.5 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-850 rounded-lg dark:text-white"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">x SDE</span>
                </div>
              </div>

              {/* SBA Debt Term Interest Rate */}
              <div className="space-y-1.5">
                <label className="block text-4xs font-bold uppercase tracking-wider text-gray-450 dark:text-gray-400">Interest Rate</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.25"
                    min="4"
                    max="20"
                    value={interestRate}
                    onChange={(e) => setInterestRate(parseFloat(e.target.value) || 11.25)}
                    className="w-full text-xs font-semibold px-3 py-1.5 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-850 rounded-lg dark:text-white"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">%</span>
                </div>
              </div>

              {/* Debt Amortization */}
              <div className="space-y-1.5">
                <label className="block text-4xs font-bold uppercase tracking-wider text-gray-450 dark:text-gray-400">Amortization Term</label>
                <div className="relative">
                  <input
                    type="number"
                    min="5"
                    max="25"
                    value={amortizationYears}
                    onChange={(e) => setAmortizationYears(parseInt(e.target.value) || 10)}
                    className="w-full text-xs font-semibold px-3 py-1.5 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-850 rounded-lg dark:text-white"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">Years</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Outputs & Compliance Summary Card */}
        <div className="space-y-6">
          {/* Output Card */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-2xs space-y-5">
            <h3 className="text-sm font-bold text-gray-950 dark:text-white uppercase tracking-wider font-mono">Structured Stack</h3>
            
            {/* Multi-layered custom bar graph */}
            <div className="space-y-3">
              <div className="w-full bg-gray-250 dark:bg-gray-805 h-6 rounded-lg overflow-hidden flex">
                <div 
                  className="bg-brand-blue-500 h-full transition-all duration-300 flex items-center justify-center text-5xs font-black text-white" 
                  style={{ width: `${calculatedStack.sbaLoanPct}%` }}
                  title={`SBA Loan: ${calculatedStack.sbaLoanPct}%`}
                >
                  {calculatedStack.sbaLoanPct >= 15 ? 'SBA' : ''}
                </div>
                <div 
                  className="bg-indigo-500 h-full transition-all duration-300 flex items-center justify-center text-5xs font-black text-white" 
                  style={{ width: `${sellerNotePct}%` }}
                  title={`Seller Note: ${sellerNotePct}%`}
                >
                  {sellerNotePct >= 15 ? 'Seller' : ''}
                </div>
                <div 
                  className="bg-green-500 h-full transition-all duration-300 flex items-center justify-center text-5xs font-black text-white" 
                  style={{ width: `${borrowerCashPct}%` }}
                  title={`Buyer Cash: ${borrowerCashPct}%`}
                >
                  {borrowerCashPct >= 15 ? 'Cash' : ''}
                </div>
              </div>

              {/* Grid Legend */}
              <div className="grid grid-cols-3 gap-2 text-4xs font-bold uppercase font-mono border-b border-gray-150 dark:border-gray-800 pb-3">
                <div>
                  <p className="text-gray-400">SBA 7(a) ({calculatedStack.sbaLoanPct}%)</p>
                  <p className="text-gray-900 dark:text-white mt-0.5">{formatCurrency(calculatedStack.sbaLoanAmount)}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400">Seller Note ({sellerNotePct}%)</p>
                  <p className="text-gray-900 dark:text-white mt-0.5">{formatCurrency(calculatedStack.sellerNoteAmount)}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400">Buyer Cash ({borrowerCashPct}%)</p>
                  <p className="text-gray-900 dark:text-white mt-0.5">{formatCurrency(calculatedStack.borrowerCashAmount)}</p>
                </div>
              </div>
            </div>

            {/* SDE & DSCR estimation */}
            <div className="space-y-3.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-gray-500 dark:text-gray-400">Estimated Annual EBITDA</span>
                <span className="font-mono font-bold text-gray-950 dark:text-white">{formatCurrency(calculatedStack.assumedEbitda)}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-gray-500 dark:text-gray-400">Annual SBA Debt Service</span>
                <span className="font-mono font-bold text-gray-950 dark:text-white">{formatCurrency(calculatedStack.annualDebtService)}</span>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-850 rounded-xl border border-gray-150 dark:border-gray-800 flex justify-between items-center">
                <div className="space-y-0.5">
                  <span className="text-4xs font-bold text-gray-400 uppercase tracking-wider">Estimated DSCR</span>
                  <p className={`text-xl font-mono font-black ${calculatedStack.isDscrCompliant ? 'text-green-600 dark:text-green-450' : 'text-red-500'}`}>
                    {calculatedStack.dscr.toFixed(2)}x
                  </p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-3xs font-bold leading-normal uppercase border ${
                    calculatedStack.isDscrCompliant 
                      ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-950/30 dark:border-green-900/20 dark:text-green-450' 
                      : 'bg-red-50 border-red-200 text-red-700 dark:bg-red-950/30 dark:border-red-900/20'
                  }`}>
                    {calculatedStack.isDscrCompliant ? 'Compliant' : 'Unfeasible'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* AI SBA Underwriting Scorecard */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-gray-950 dark:text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-brand-blue-500" />
              <span>SBA Compliance Scorecard</span>
            </h3>

            {/* Compliance Percent gauge */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-4xs font-black text-gray-400 uppercase tracking-widest font-mono">
                <span>Feasibility Score</span>
                <span className="text-brand-blue-600 dark:text-brand-blue-400">{calculatedStack.complianceScore}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-800 h-2.5 rounded-full">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${
                    calculatedStack.complianceScore === 100 
                      ? 'bg-green-500' 
                      : calculatedStack.complianceScore >= 66 
                        ? 'bg-amber-500' 
                        : 'bg-red-500'
                  }`} 
                  style={{ width: `${calculatedStack.complianceScore}%` }}
                ></div>
              </div>
            </div>

            {/* Checklist */}
            <ul className="space-y-3 pt-1">
              {/* Check 1: Equity Injection */}
              <li className="flex items-start gap-3 text-xs text-gray-650 dark:text-gray-300">
                {calculatedStack.isEquityInjectionCompliant ? (
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-semibold text-gray-950 dark:text-white">Min Equity Injection (10%)</p>
                  <p className="text-4xs text-gray-400 leading-normal mt-0.5">
                    {calculatedStack.isEquityInjectionCompliant 
                      ? `Approved: Your effective equity of ${calculatedStack.effectiveEquityPct}% is SBA compliant.`
                      : "Rejected: SBA rules mandate at least 10% equity injection (cash or qualifying standby seller note) with at least 5% buyer cash."
                    }
                  </p>
                </div>
              </li>

              {/* Check 2: SBA Exposure Limit */}
              <li className="flex items-start gap-3 text-xs text-gray-650 dark:text-gray-300">
                {calculatedStack.isSbaLimitCompliant ? (
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-semibold text-gray-950 dark:text-white">SBA Loan Cap ($5,000,000)</p>
                  <p className="text-4xs text-gray-400 leading-normal mt-0.5">
                    {calculatedStack.isSbaLimitCompliant 
                      ? `Approved: SBA Loan is ${formatCurrency(calculatedStack.sbaLoanAmount)} (under the $5M SOP cap).`
                      : `Rejected: SBA Loan exceeds the max allowed limit of $5,000,000. Increase borrower equity.`
                    }
                  </p>
                </div>
              </li>

              {/* Check 3: DSCR Feasibility */}
              <li className="flex items-start gap-3 text-xs text-gray-650 dark:text-gray-300">
                {calculatedStack.isDscrCompliant ? (
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-semibold text-gray-950 dark:text-white">Debt Service Coverage (min 1.15x)</p>
                  <p className="text-4xs text-gray-400 leading-normal mt-0.5">
                    {calculatedStack.isDscrCompliant 
                      ? `Approved: Assumed cash flow is sufficient to cover SBA debt requirements.`
                      : "Alert: Debt service ratio is tight. Consider negotiating a lower multiple or lower SBA loan size."
                    }
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CapitalStackSandbox;
