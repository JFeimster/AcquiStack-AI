import React, { useState, useMemo, useEffect } from 'react';
import { 
  Info, 
  HelpCircle, 
  TrendingUp, 
  DollarSign, 
  ShieldAlert, 
  CheckCircle, 
  AlertTriangle, 
  Calculator, 
  Sparkles,
  Plus,
  RefreshCw,
  ArrowRight
} from 'lucide-react';
import { Deal } from '../../types';

interface SDECalculatorProps {
  currentDeal?: Deal | null;
}

interface BenefitSuggestion {
  category: string;
  field: 'ownerSalary' | 'ownerBenefits' | 'personalExpenses' | 'oneTimeExpenses' | 'otherAddbacks';
  name: string;
  amount: number;
  description: string;
}

// Industry-specific typical discretionary add-backs
const INDUSTRY_BENEFIT_SUGGESTIONS: Record<string, BenefitSuggestion[]> = {
  'Home Services': [
    {
      category: 'Vehicle Perk',
      field: 'personalExpenses',
      name: 'Owner Personal/Business Truck Lease',
      amount: 9500,
      description: 'Typical dual-use vehicle lease, fuel, and insurance paid through the business.'
    },
    {
      category: 'Owner Health',
      field: 'ownerBenefits',
      name: 'Family Health & Life Premiums',
      amount: 14000,
      description: 'Owner-operator and spouse dental, health, and key-person insurance premiums.'
    },
    {
      category: 'Family Payroll',
      field: 'otherAddbacks',
      name: 'Inactive Family Member Wages',
      amount: 32000,
      description: 'Discretionary wage paid to family members who do not perform critical duties.'
    },
    {
      category: 'Telecom/Home Office',
      field: 'personalExpenses',
      name: 'Cell Phones & Home Utilities',
      amount: 2400,
      description: 'Personal mobile lines and home broadband expensed under corporate utility codes.'
    }
  ],
  'SaaS': [
    {
      category: 'Discretionary Subscriptions',
      field: 'otherAddbacks',
      name: 'Non-Essential Software/Cloud Perks',
      amount: 6500,
      description: 'High-tier personal productivity packages, developer perks, or non-essential server test beds.'
    },
    {
      category: 'Home Office',
      field: 'personalExpenses',
      name: 'High-end Hardware & Tech Stipends',
      amount: 5200,
      description: 'Personal tech gadgets, office ergonomic setups, and phone bills paid out of operations.'
    },
    {
      category: 'Travel & Leisure',
      field: 'personalExpenses',
      name: 'Conference & Leisure Hybrid Travel',
      amount: 8500,
      description: 'Travel to industry gatherings that integrated significant personal vacation/dining expenses.'
    },
    {
      category: 'Key-Person Insurance',
      field: 'ownerBenefits',
      name: 'Founder Key-Person Life Premium',
      amount: 4500,
      description: 'Corporate premium payments on life insurance policies benefiting the owner\'s estate.'
    }
  ],
  'Manufacturing': [
    {
      category: 'Machinery Overhaul',
      field: 'oneTimeExpenses',
      name: 'Non-Recurring Facility Repair',
      amount: 22000,
      description: 'One-time specialized machine overhaul or emergency roof repair that does not repeat.'
    },
    {
      category: 'Executive Benefits',
      field: 'ownerBenefits',
      name: 'Executive Medical Reimbursement',
      amount: 16500,
      description: 'Discretionary supplemental health plans and executive physicals for the primary owner.'
    },
    {
      category: 'Compliance Setup',
      field: 'oneTimeExpenses',
      name: 'OSHA One-time Upgrade Fees',
      amount: 14000,
      description: 'One-time consultancy and equipment retrofitting to comply with specialized local codes.'
    },
    {
      category: 'Company Truck',
      field: 'personalExpenses',
      name: 'Owner Heavy Duty Vehicle Perks',
      amount: 12000,
      description: 'Owner\'s executive utility truck lease and associated maintenance costs.'
    }
  ],
  'Retail': [
    {
      category: 'Owner Meals/Groceries',
      field: 'personalExpenses',
      name: 'Personal Meals & Store Supplies',
      amount: 7200,
      description: 'Personal travel meals, supplier lunches, and local groceries ran through trade accounts.'
    },
    {
      category: 'Mobile Plans',
      field: 'personalExpenses',
      name: 'Family Cellular Plans',
      amount: 3600,
      description: 'Family phone and tablet lines structured under the corporate telecommunication plan.'
    },
    {
      category: 'POS Migration',
      field: 'oneTimeExpenses',
      name: 'One-time POS Legacy Software Migration',
      amount: 8500,
      description: 'One-time cost to upgrade internal checkout terminals and migrate customer profiles.'
    },
    {
      category: 'Association Dues',
      field: 'otherAddbacks',
      name: 'Discretionary Trade Association Dues',
      amount: 2500,
      description: 'Owner\'s personal trade guilds, civic organization memberships, and country club dues.'
    }
  ],
  'Healthcare': [
    {
      category: 'CME Training',
      field: 'otherAddbacks',
      name: 'Discretionary CME & Retreat Travel',
      amount: 7500,
      description: 'Medical continuing education courses combined with private leisure travel and stays.'
    },
    {
      category: 'Liability Excess',
      field: 'ownerBenefits',
      name: 'Excess Premium Malpractice Plan',
      amount: 11000,
      description: 'Discretionary supplemental insurance premium payouts tailored to the founding practitioner.'
    },
    {
      category: 'Executive Auto',
      field: 'personalExpenses',
      name: 'Physician Luxury Car Lease',
      amount: 10500,
      description: 'Lease and fuel costs for practitioner\'s luxury commuter sedan.'
    }
  ],
  'General / Default': [
    {
      category: 'Owner Health',
      field: 'ownerBenefits',
      name: 'Owner Personal Medical Premiums',
      amount: 12000,
      description: 'Standard health insurance premium for the owner and dependent family.'
    },
    {
      category: 'Auto Perk',
      field: 'personalExpenses',
      name: 'Discretionary Car Allowance',
      amount: 7500,
      description: 'Corporate automobile reimbursement for personal commuting.'
    },
    {
      category: 'Mobile & Tech',
      field: 'personalExpenses',
      name: 'Personal Phones & Home Utilities',
      amount: 3000,
      description: 'Owner cellular, internet, and miscellaneous tech accessories.'
    },
    {
      category: 'One-time Legal',
      field: 'oneTimeExpenses',
      name: 'One-time Trademark Registration',
      amount: 5000,
      description: 'Legal fees for registering intellectual property assets during rebranding.'
    }
  ]
};

const SDECalculator: React.FC<SDECalculatorProps> = ({ currentDeal = null }) => {
  // Navigation & configuration state
  const [startType, setStartType] = useState<'ebitda' | 'netIncome'>('ebitda');
  
  // Starting financial inputs
  const [ebitdaInput, setEbitdaInput] = useState<number | ''>('');
  const [netIncome, setNetIncome] = useState<number | ''>('');
  const [interest, setInterest] = useState<number | ''>('');
  const [taxes, setTaxes] = useState<number | ''>('');
  const [depreciation, setDepreciation] = useState<number | ''>('');
  const [amortization, setAmortization] = useState<number | ''>('');

  // Add-backs state
  const [ownerSalary, setOwnerSalary] = useState<number | ''>('');
  const [ownerBenefits, setOwnerBenefits] = useState<number | ''>('');
  const [personalExpenses, setPersonalExpenses] = useState<number | ''>('');
  const [oneTimeExpenses, setOneTimeExpenses] = useState<number | ''>('');
  const [otherAddbacks, setOtherAddbacks] = useState<number | ''>('');

  // Subtractions state
  const [coOwnerSalaryAdjustment, setCoOwnerSalaryAdjustment] = useState<number | ''>('');
  const [managerReplacementSalary, setManagerReplacementSalary] = useState<number | ''>('');
  const [nonOperatingIncome, setNonOperatingIncome] = useState<number | ''>('');

  // SBA Sizing & Qualification state
  const [targetLoan, setTargetLoan] = useState<number | ''>('');
  const [interestRate, setInterestRate] = useState<number | ''>(11.5);
  const [loanTermYears, setLoanTermYears] = useState<number | ''>(10);
  const [requiredDscr, setRequiredDscr] = useState<number | ''>(1.25);
  const [ownerLivingExpenses, setOwnerLivingExpenses] = useState<number | ''>(75000);

  // Active help tooltip state
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // Industry selection override for AI suggestions
  const [selectedIndustry, setSelectedIndustry] = useState<string>('General / Default');

  // Load baseline values from the current deal if available
  useEffect(() => {
    if (currentDeal) {
      if (currentDeal.ebitda_ttm) {
        setEbitdaInput(currentDeal.ebitda_ttm);
      } else {
        setEbitdaInput('');
      }

      // Map the industry to standard lookup categories
      const dealIndustry = currentDeal.industry;
      if (dealIndustry.includes('Service') || dealIndustry.includes('Home')) {
        setSelectedIndustry('Home Services');
      } else if (dealIndustry.includes('SaaS') || dealIndustry.includes('Tech') || dealIndustry.includes('Software')) {
        setSelectedIndustry('SaaS');
      } else if (dealIndustry.includes('Mfg') || dealIndustry.includes('Manufacturing') || dealIndustry.includes('Industrial')) {
        setSelectedIndustry('Manufacturing');
      } else if (dealIndustry.includes('Retail') || dealIndustry.includes('Food') || dealIndustry.includes('Store')) {
        setSelectedIndustry('Retail');
      } else if (dealIndustry.includes('Medical') || dealIndustry.includes('Health') || dealIndustry.includes('Care')) {
        setSelectedIndustry('Healthcare');
      } else {
        setSelectedIndustry('General / Default');
      }

      // Pre-populate target loan as 90% of purchase price if target loan is empty
      if (currentDeal.purchase_price) {
        setTargetLoan(Math.round(currentDeal.purchase_price * 0.90));
      }
    }
  }, [currentDeal]);

  // Toggle tooltip helper
  const toggleTooltip = (tooltipId: string) => {
    setActiveTooltip(activeTooltip === tooltipId ? null : tooltipId);
  };

  // Get recommendations list based on selected industry
  const suggestedBenefits = useMemo(() => {
    return INDUSTRY_BENEFIT_SUGGESTIONS[selectedIndustry] || INDUSTRY_BENEFIT_SUGGESTIONS['General / Default'];
  }, [selectedIndustry]);

  // One-click category suggestion application
  const applySuggestion = (sug: BenefitSuggestion) => {
    if (sug.field === 'ownerSalary') {
      setOwnerSalary(prev => (Number(prev) || 0) + sug.amount);
    } else if (sug.field === 'ownerBenefits') {
      setOwnerBenefits(prev => (Number(prev) || 0) + sug.amount);
    } else if (sug.field === 'personalExpenses') {
      setPersonalExpenses(prev => (Number(prev) || 0) + sug.amount);
    } else if (sug.field === 'oneTimeExpenses') {
      setOneTimeExpenses(prev => (Number(prev) || 0) + sug.amount);
    } else if (sug.field === 'otherAddbacks') {
      setOtherAddbacks(prev => (Number(prev) || 0) + sug.amount);
    }
  };

  const autoFillAllSuggested = () => {
    suggestedBenefits.forEach(sug => {
      applySuggestion(sug);
    });
  };

  // Intermediate calculations
  const calculatedEbitda = useMemo(() => {
    if (startType === 'ebitda') {
      return Number(ebitdaInput) || 0;
    }
    return (
      (Number(netIncome) || 0) +
      (Number(interest) || 0) +
      (Number(taxes) || 0) +
      (Number(depreciation) || 0) +
      (Number(amortization) || 0)
    );
  }, [startType, ebitdaInput, netIncome, interest, taxes, depreciation, amortization]);

  const totalAddBacks = useMemo(() => {
    return (
      (Number(ownerSalary) || 0) +
      (Number(ownerBenefits) || 0) +
      (Number(personalExpenses) || 0) +
      (Number(oneTimeExpenses) || 0) +
      (Number(otherAddbacks) || 0)
    );
  }, [ownerSalary, ownerBenefits, personalExpenses, oneTimeExpenses, otherAddbacks]);

  const totalSubtractions = useMemo(() => {
    return (
      (Number(coOwnerSalaryAdjustment) || 0) +
      (Number(managerReplacementSalary) || 0) +
      (Number(nonOperatingIncome) || 0)
    );
  }, [coOwnerSalaryAdjustment, managerReplacementSalary, nonOperatingIncome]);

  const normalizedSde = useMemo(() => {
    return calculatedEbitda + totalAddBacks - totalSubtractions;
  }, [calculatedEbitda, totalAddBacks, totalSubtractions]);

  // SBA Debt Service & Capacity calculations
  const sbaMetrics = useMemo(() => {
    const loanVal = Number(targetLoan) || 0;
    const rateVal = Number(interestRate) || 0;
    const termVal = Number(loanTermYears) || 10;
    const livingVal = Number(ownerLivingExpenses) || 0;
    const minDscr = Number(requiredDscr) || 1.25;

    // Available Cash Flow for Debt Service (SDE minus Owner living allowance/salary required)
    const availableCashForDebt = Math.max(0, normalizedSde - livingVal);

    // Amortization calculation
    let monthlyPayment = 0;
    let annualDebtService = 0;

    if (loanVal > 0 && termVal > 0) {
      const r = rateVal / 100 / 12;
      const n = termVal * 12;

      if (r > 0) {
        monthlyPayment = (loanVal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      } else {
        monthlyPayment = loanVal / n;
      }
      annualDebtService = monthlyPayment * 12;
    }

    const actualDscr = annualDebtService > 0 ? availableCashForDebt / annualDebtService : 0;

    // Maximum loan sizing based on Cash Available and Min DSCR
    const maxAnnualDebtService = availableCashForDebt / minDscr;
    const maxMonthlyPayment = maxAnnualDebtService / 12;
    let maxSbaLoan = 0;

    if (rateVal > 0 && termVal > 0) {
      const r = rateVal / 100 / 12;
      const n = termVal * 12;
      maxSbaLoan = (maxMonthlyPayment * (Math.pow(1 + r, n) - 1)) / (r * Math.pow(1 + r, n));
    } else if (termVal > 0) {
      maxSbaLoan = maxMonthlyPayment * termVal * 12;
    }

    return {
      availableCashForDebt,
      monthlyPayment,
      annualDebtService,
      actualDscr,
      maxSbaLoan: Math.max(0, maxSbaLoan),
    };
  }, [normalizedSde, targetLoan, interestRate, loanTermYears, requiredDscr, ownerLivingExpenses]);

  // Format currency helper
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  const dscrStatus = useMemo(() => {
    if (!targetLoan) return { text: 'Enter target loan to calculate DSCR', colorClass: 'text-gray-500 bg-gray-100 dark:bg-gray-800' };
    if (sbaMetrics.actualDscr >= Number(requiredDscr)) {
      return {
        text: `Strong Qualification (${sbaMetrics.actualDscr.toFixed(2)}x DSCR)`,
        colorClass: 'text-green-800 bg-green-50 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-900/50',
        status: 'healthy',
      };
    } else if (sbaMetrics.actualDscr >= 1.0) {
      return {
        text: `Marginal / High Risk (${sbaMetrics.actualDscr.toFixed(2)}x DSCR)`,
        colorClass: 'text-yellow-800 bg-yellow-50 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-900/50',
        status: 'risky',
      };
    } else {
      return {
        text: `Insufficient Cash Flow (${sbaMetrics.actualDscr.toFixed(2)}x DSCR)`,
        colorClass: 'text-red-800 bg-red-50 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-900/50',
        status: 'unacceptable',
      };
    }
  }, [targetLoan, sbaMetrics.actualDscr, requiredDscr]);

  // Custom Chart Visualization dimensions & percentages
  const chartProps = useMemo(() => {
    const maxVal = Math.max(calculatedEbitda + totalAddBacks, normalizedSde, 50000);
    
    const ebitdaPercent = Math.max(5, (calculatedEbitda / maxVal) * 100);
    const addBackPercent = Math.max(2, (totalAddBacks / maxVal) * 100);
    const subtractionPercent = Math.max(2, (totalSubtractions / maxVal) * 100);
    const sdePercent = Math.max(5, (normalizedSde / maxVal) * 100);

    return {
      ebitdaPercent,
      addBackPercent,
      subtractionPercent,
      sdePercent,
      maxVal
    };
  }, [calculatedEbitda, totalAddBacks, totalSubtractions, normalizedSde]);

  const baseInputClasses = "block w-full px-3 py-2 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-brand-blue-500 focus:border-brand-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-brand-blue-500 dark:focus:border-brand-blue-500 transition-colors";

  return (
    <div id="sde-calc-container" className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-150 dark:border-gray-800 pb-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-brand-blue-50 dark:bg-brand-blue-900/40 rounded-lg text-brand-blue-600 dark:text-brand-blue-400">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Seller Discretionary Earnings (SDE) Calculator</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Normalize seller-reported financials and owner benefits to determine the true cash flow for SBA financing.
            </p>
          </div>
        </div>
        <div className="mt-3 md:mt-0 inline-flex rounded-md shadow-xs" role="group">
          <button
            type="button"
            id="sde-start-ebitda-toggle"
            onClick={() => setStartType('ebitda')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-l-md border ${
              startType === 'ebitda'
                ? 'bg-brand-blue-600 text-white border-brand-blue-600 dark:bg-brand-blue-500 dark:border-brand-blue-500'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700'
            }`}
          >
            Start with EBITDA
          </button>
          <button
            type="button"
            id="sde-start-netincome-toggle"
            onClick={() => setStartType('netIncome')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-r-md border-t border-b border-r ${
              startType === 'netIncome'
                ? 'bg-brand-blue-600 text-white border-brand-blue-600 dark:bg-brand-blue-500 dark:border-brand-blue-500'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700'
            }`}
          >
            Start with Net Income
          </button>
        </div>
      </div>

      {/* AI-driven Lookup Recommendations banner */}
      <div className="bg-gradient-to-r from-brand-blue-50/70 to-indigo-50/40 dark:from-brand-blue-950/20 dark:to-indigo-950/10 border border-brand-blue-100/50 dark:border-brand-blue-900/30 rounded-xl p-4.5 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-brand-blue-500 text-white rounded-lg animate-pulse">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white">AI Add-Back Finder</h4>
              <span className="text-2xs font-extrabold px-2 py-0.5 bg-brand-blue-100 text-brand-blue-800 dark:bg-brand-blue-900 dark:text-brand-blue-300 rounded-full">
                Active
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
              Suggested common seller discretionary cash write-offs for <span className="font-bold text-brand-blue-600 dark:text-brand-blue-400">{selectedIndustry}</span> targets. Click any item to add it instantly to your SDE stack.
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            id="sde-industry-select"
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="px-2.5 py-1.5 text-xs text-gray-800 bg-white rounded-lg border border-gray-300 focus:ring-brand-blue-500 focus:border-brand-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white font-semibold"
          >
            {Object.keys(INDUSTRY_BENEFIT_SUGGESTIONS).map((ind) => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>
          <button
            type="button"
            id="sde-autofill-all"
            onClick={autoFillAllSuggested}
            className="px-3 py-1.5 bg-brand-blue-600 hover:bg-brand-blue-700 text-white text-xs font-semibold rounded-lg flex items-center space-x-1 shadow-xs transition-all"
          >
            <span>Apply All Standards</span>
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Suggested categories list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {suggestedBenefits.map((sug, idx) => (
          <div 
            key={idx}
            onClick={() => applySuggestion(sug)}
            className="p-3.5 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-brand-blue-400 dark:hover:border-brand-blue-500 hover:shadow-xs cursor-pointer transition-all flex flex-col justify-between group text-left"
          >
            <div>
              <div className="flex justify-between items-start">
                <span className="text-3xs font-extrabold uppercase tracking-wider text-brand-blue-500 bg-brand-blue-50 dark:bg-brand-blue-950/50 px-2 py-0.5 rounded">
                  {sug.category}
                </span>
                <span className="text-xs font-mono font-bold text-green-600 dark:text-green-400 group-hover:scale-105 transition-transform">
                  +{formatCurrency(sug.amount)}
                </span>
              </div>
              <h5 className="text-xs font-bold text-gray-950 dark:text-gray-100 mt-2 truncate">{sug.name}</h5>
              <p className="text-3xs text-gray-400 dark:text-gray-500 mt-1 line-clamp-2 leading-tight">
                {sug.description}
              </p>
            </div>
            <div className="mt-2.5 pt-2 border-t border-gray-100 dark:border-gray-900/50 flex justify-between items-center text-3xs text-gray-400 dark:text-gray-500">
              <span>Adds to: {sug.field.replace('owner', 'Owner ').replace('personal', 'Personal ')}</span>
              <span className="text-brand-blue-500 font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-0.5">
                Add <ArrowRight className="w-2.5 h-2.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left column: Input parameters */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Starting Point Financials */}
          <div className="bg-gray-50/50 dark:bg-gray-800/30 p-5 rounded-xl border border-gray-100 dark:border-gray-800">
            <h4 className="text-sm font-bold text-gray-950 dark:text-gray-100 mb-3 uppercase tracking-wider flex items-center">
              <span className="w-1.5 h-3.5 bg-brand-blue-600 rounded-sm mr-2"></span>
              Step 1: Baseline Operating Cash Flow
            </h4>

            {startType === 'ebitda' ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="sde-input-ebitda" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    EBITDA ($)
                  </label>
                  <button
                    type="button"
                    onClick={() => toggleTooltip('ebitda')}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    id="tooltip-trigger-ebitda"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>
                </div>
                {activeTooltip === 'ebitda' && (
                  <div className="text-xs text-brand-blue-800 dark:text-brand-blue-300 bg-brand-blue-50 dark:bg-brand-blue-900/30 p-2.5 rounded-lg mb-2">
                    <strong>Earnings Before Interest, Taxes, Depreciation, and Amortization.</strong> This is the standard baseline of operating cash flow before owner adjustments.
                  </div>
                )}
                <div className="relative rounded-md shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <input
                    type="number"
                    id="sde-input-ebitda"
                    value={ebitdaInput}
                    onChange={(e) => setEbitdaInput(e.target.value === '' ? '' : parseFloat(e.target.value))}
                    className={`${baseInputClasses} pl-8`}
                    placeholder="e.g., 250000"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 space-y-1">
                  <label htmlFor="sde-input-netincome" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Net Income ($)
                  </label>
                  <div className="relative rounded-md shadow-xs">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <DollarSign className="w-4 h-4" />
                    </div>
                    <input
                      type="number"
                      id="sde-input-netincome"
                      value={netIncome}
                      onChange={(e) => setNetIncome(e.target.value === '' ? '' : parseFloat(e.target.value))}
                      className={`${baseInputClasses} pl-8`}
                      placeholder="Pre-tax or Net profit from P&L"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="sde-input-interest" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Interest Expense ($)
                  </label>
                  <input
                    type="number"
                    id="sde-input-interest"
                    value={interest}
                    onChange={(e) => setInterest(e.target.value === '' ? '' : parseFloat(e.target.value))}
                    className={baseInputClasses}
                    placeholder="Debt interest"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="sde-input-taxes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Taxes Paid ($)
                  </label>
                  <input
                    type="number"
                    id="sde-input-taxes"
                    value={taxes}
                    onChange={(e) => setTaxes(e.target.value === '' ? '' : parseFloat(e.target.value))}
                    className={baseInputClasses}
                    placeholder="Corporate income taxes"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="sde-input-depreciation" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Depreciation ($)
                  </label>
                  <input
                    type="number"
                    id="sde-input-depreciation"
                    value={depreciation}
                    onChange={(e) => setDepreciation(e.target.value === '' ? '' : parseFloat(e.target.value))}
                    className={baseInputClasses}
                    placeholder="Non-cash wear & tear"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="sde-input-amortization" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Amortization ($)
                  </label>
                  <input
                    type="number"
                    id="sde-input-amortization"
                    value={amortization}
                    onChange={(e) => setAmortization(e.target.value === '' ? '' : parseFloat(e.target.value))}
                    className={baseInputClasses}
                    placeholder="Intangible assets write-off"
                  />
                </div>
                
                <div className="md:col-span-2 pt-2 text-right">
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                    Equivalent EBITDA: <span className="text-brand-blue-600 dark:text-brand-blue-400 font-mono text-sm">{formatCurrency(calculatedEbitda)}</span>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Owner Add-backs */}
          <div className="bg-gray-50/50 dark:bg-gray-800/30 p-5 rounded-xl border border-gray-100 dark:border-gray-800">
            <h4 className="text-sm font-bold text-gray-950 dark:text-gray-100 mb-3 uppercase tracking-wider flex items-center">
              <span className="w-1.5 h-3.5 bg-green-500 rounded-sm mr-2"></span>
              Step 2: Owner Add-Backs (Discretionary Benefits)
            </h4>

            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label htmlFor="sde-input-ownersalary" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Primary Owner's W-2 Salary / Guaranteed Payments ($)
                  </label>
                  <button
                    type="button"
                    onClick={() => toggleTooltip('ownerSalary')}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    id="tooltip-trigger-ownersalary"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>
                </div>
                {activeTooltip === 'ownerSalary' && (
                  <div className="text-xs text-brand-blue-800 dark:text-brand-blue-300 bg-brand-blue-50 dark:bg-brand-blue-900/30 p-2.5 rounded-lg mb-2">
                    <strong>SBA Rule:</strong> You can only add back the salary of <strong>one</strong> full-time active owner-operator. If there are multiple active partners, only the primary operator's salary counts as an add-back.
                  </div>
                )}
                <div className="relative rounded-md shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <input
                    type="number"
                    id="sde-input-ownersalary"
                    value={ownerSalary}
                    onChange={(e) => setOwnerSalary(e.target.value === '' ? '' : parseFloat(e.target.value))}
                    className={`${baseInputClasses} pl-8`}
                    placeholder="e.g., 120000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label htmlFor="sde-input-ownerbenefits" className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                      Owner's Benefits & Insurance ($)
                    </label>
                    <button
                      type="button"
                      onClick={() => toggleTooltip('ownerBenefits')}
                      className="text-gray-400 hover:text-gray-500"
                      id="tooltip-trigger-ownerbenefits"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {activeTooltip === 'ownerBenefits' && (
                    <div className="text-xs text-brand-blue-800 dark:text-brand-blue-300 bg-brand-blue-50 dark:bg-brand-blue-900/30 p-2.5 rounded-lg mb-2">
                      Owner's corporate health insurance, dental, life insurance, retirement/401(k) company matching, and payroll taxes.
                    </div>
                  )}
                  <input
                    type="number"
                    id="sde-input-ownerbenefits"
                    value={ownerBenefits}
                    onChange={(e) => setOwnerBenefits(e.target.value === '' ? '' : parseFloat(e.target.value))}
                    className={baseInputClasses}
                    placeholder="Health, 401k match, etc."
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label htmlFor="sde-input-personalexpenses" className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                      Personal Expenses & Perks ($)
                    </label>
                    <button
                      type="button"
                      onClick={() => toggleTooltip('personalExpenses')}
                      className="text-gray-400 hover:text-gray-500"
                      id="tooltip-trigger-personalexpenses"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {activeTooltip === 'personalExpenses' && (
                    <div className="text-xs text-brand-blue-800 dark:text-brand-blue-300 bg-brand-blue-50 dark:bg-brand-blue-900/30 p-2.5 rounded-lg mb-2">
                      Personal automobile expenses, meals, mobile phones, club memberships, family travel, and other perks expensed through the company.
                    </div>
                  )}
                  <input
                    type="number"
                    id="sde-input-personalexpenses"
                    value={personalExpenses}
                    onChange={(e) => setPersonalExpenses(e.target.value === '' ? '' : parseFloat(e.target.value))}
                    className={baseInputClasses}
                    placeholder="Auto, club dues, family meals"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label htmlFor="sde-input-onetimeexpenses" className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                      Non-recurring/One-time Expenses ($)
                    </label>
                    <button
                      type="button"
                      onClick={() => toggleTooltip('oneTimeExpenses')}
                      className="text-gray-400 hover:text-gray-500"
                      id="tooltip-trigger-onetimeexpenses"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {activeTooltip === 'oneTimeExpenses' && (
                    <div className="text-xs text-brand-blue-800 dark:text-brand-blue-300 bg-brand-blue-50 dark:bg-brand-blue-900/30 p-2.5 rounded-lg mb-2">
                      Non-recurring outlays like legal fees for lawsuits, business relocation costs, website setup, or a one-time major roof repair.
                    </div>
                  )}
                  <input
                    type="number"
                    id="sde-input-onetimeexpenses"
                    value={oneTimeExpenses}
                    onChange={(e) => setOneTimeExpenses(e.target.value === '' ? '' : parseFloat(e.target.value))}
                    className={baseInputClasses}
                    placeholder="Lawsuit, move, system setup"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label htmlFor="sde-input-otheraddbacks" className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                      Other Discretionary Add-Backs ($)
                    </label>
                    <button
                      type="button"
                      onClick={() => toggleTooltip('otherAddbacks')}
                      className="text-gray-400 hover:text-gray-500"
                      id="tooltip-trigger-otheraddbacks"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {activeTooltip === 'otherAddbacks' && (
                    <div className="text-xs text-brand-blue-800 dark:text-brand-blue-300 bg-brand-blue-50 dark:bg-brand-blue-900/30 p-2.5 rounded-lg mb-2">
                      Any other verified, documented discretionary expenses that would not carry over to a new owner.
                    </div>
                  )}
                  <input
                    type="number"
                    id="sde-input-otheraddbacks"
                    value={otherAddbacks}
                    onChange={(e) => setOtherAddbacks(e.target.value === '' ? '' : parseFloat(e.target.value))}
                    className={baseInputClasses}
                    placeholder="Verified other add-backs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Subtractions / Normalization Adjustments */}
          <div className="bg-gray-50/50 dark:bg-gray-800/30 p-5 rounded-xl border border-gray-100 dark:border-gray-800">
            <h4 className="text-sm font-bold text-gray-950 dark:text-gray-100 mb-3 uppercase tracking-wider flex items-center">
              <span className="w-1.5 h-3.5 bg-red-500 rounded-sm mr-2"></span>
              Step 3: Normalization Subtractions (Deductions)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label htmlFor="sde-input-coownersalary" className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                    Co-Owner Salary Adj ($)
                  </label>
                  <button
                    type="button"
                    onClick={() => toggleTooltip('coOwnerSalary')}
                    className="text-gray-400 hover:text-gray-500"
                    id="tooltip-trigger-coownersalary"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                  </button>
                </div>
                {activeTooltip === 'coOwnerSalary' && (
                  <div className="text-xs text-brand-blue-800 dark:text-brand-blue-300 bg-brand-blue-50 dark:bg-brand-blue-900/30 p-2.5 rounded-lg mb-2">
                    <strong>Co-Owner Market Correction:</strong> If multiple active owners work in the business, you must subtract a market-rate salary for the second owner. They can't work for "free" under the new ownership.
                  </div>
                )}
                <input
                  type="number"
                  id="sde-input-coownersalary"
                  value={coOwnerSalaryAdjustment}
                  onChange={(e) => setCoOwnerSalaryAdjustment(e.target.value === '' ? '' : parseFloat(e.target.value))}
                  className={baseInputClasses}
                  placeholder="Replacement cost"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label htmlFor="sde-input-managerreplacement" className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                    Manager Replacement ($)
                  </label>
                  <button
                    type="button"
                    onClick={() => toggleTooltip('managerSalary')}
                    className="text-gray-400 hover:text-gray-500"
                    id="tooltip-trigger-managerreplacement"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                  </button>
                </div>
                {activeTooltip === 'managerSalary' && (
                  <div className="text-xs text-brand-blue-800 dark:text-brand-blue-300 bg-brand-blue-50 dark:bg-brand-blue-900/30 p-2.5 rounded-lg mb-2">
                    <strong>Hired Manager Adjustment:</strong> If the buyer plans to act as a passive investor rather than an active operator, they must subtract a market-rate salary to hire a general manager.
                  </div>
                )}
                <input
                  type="number"
                  id="sde-input-managerreplacement"
                  value={managerReplacementSalary}
                  onChange={(e) => setManagerReplacementSalary(e.target.value === '' ? '' : parseFloat(e.target.value))}
                  className={baseInputClasses}
                  placeholder="For passive buyers"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label htmlFor="sde-input-nonoperating" className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                    Non-operating Income ($)
                  </label>
                  <button
                    type="button"
                    onClick={() => toggleTooltip('nonOperating')}
                    className="text-gray-400 hover:text-gray-500"
                    id="tooltip-trigger-nonoperating"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                  </button>
                </div>
                {activeTooltip === 'nonOperating' && (
                  <div className="text-xs text-brand-blue-800 dark:text-brand-blue-300 bg-brand-blue-50 dark:bg-brand-blue-900/30 p-2.5 rounded-lg mb-2">
                    Subtract non-operational income, such as one-time asset sales, insurance payouts, rental income, PPP loan forgiveness, or passive gains.
                  </div>
                )}
                <input
                  type="number"
                  id="sde-input-nonoperating"
                  value={nonOperatingIncome}
                  onChange={(e) => setNonOperatingIncome(e.target.value === '' ? '' : parseFloat(e.target.value))}
                  className={baseInputClasses}
                  placeholder="One-time asset sale"
                />
              </div>
            </div>
          </div>

          {/* Section 4: SBA Loan Qualification Metrics Sizing */}
          <div className="bg-brand-blue-50/20 dark:bg-brand-blue-950/10 p-5 rounded-xl border border-brand-blue-100/50 dark:border-brand-blue-900/30">
            <h4 className="text-sm font-bold text-brand-blue-900 dark:text-brand-blue-300 mb-3 uppercase tracking-wider flex items-center">
              <span className="w-1.5 h-3.5 bg-brand-blue-600 rounded-sm mr-2"></span>
              SBA Loan Sizing & Qualification Settings
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label htmlFor="sde-input-targetloan" className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                  Target SBA Loan Amount ($)
                </label>
                <div className="relative rounded-md shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-gray-400">
                    <DollarSign className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="number"
                    id="sde-input-targetloan"
                    value={targetLoan}
                    onChange={(e) => setTargetLoan(e.target.value === '' ? '' : parseFloat(e.target.value))}
                    className={`${baseInputClasses} pl-7`}
                    placeholder="e.g., 900000"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="sde-input-interestrate" className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                  SBA Interest Rate (%)
                </label>
                <div className="relative rounded-md shadow-xs">
                  <input
                    type="number"
                    step="0.01"
                    id="sde-input-interestrate"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value === '' ? '' : parseFloat(e.target.value))}
                    className={baseInputClasses}
                    placeholder="Prime + 2.5% to 3%"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="sde-input-loanterm" className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                  Loan Term (Years)
                </label>
                <input
                  type="number"
                  id="sde-input-loanterm"
                  value={loanTermYears}
                  onChange={(e) => setLoanTermYears(e.target.value === '' ? '' : parseInt(e.target.value))}
                  className={baseInputClasses}
                  placeholder="10 is standard SBA 7(a)"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="sde-input-livingexpenses" className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                  Buyer Living Allowance ($)
                </label>
                <input
                  type="number"
                  id="sde-input-livingexpenses"
                  value={ownerLivingExpenses}
                  onChange={(e) => setOwnerLivingExpenses(e.target.value === '' ? '' : parseFloat(e.target.value))}
                  className={baseInputClasses}
                  placeholder="Min living salary"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="sde-input-minreqlenderdscr" className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                  Required DSCR (e.g., 1.25)
                </label>
                <input
                  type="number"
                  step="0.05"
                  id="sde-input-minreqlenderdscr"
                  value={requiredDscr}
                  onChange={(e) => setRequiredDscr(e.target.value === '' ? '' : parseFloat(e.target.value))}
                  className={baseInputClasses}
                  placeholder="Typically 1.25x"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Sticky live results & visualization dashboard */}
        <div className="lg:col-span-5 lg:sticky lg:top-6 space-y-6">
          
          {/* Visual stacked / waterfall progress chart from EBITDA to SDE */}
          <div id="sde-reconciliation-chart" className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-xs space-y-4">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center">
              <Sparkles className="w-4.5 h-4.5 text-brand-blue-500 mr-2" />
              EBITDA to SDE Cash Flow Breakdown
            </h4>
            
            <div className="space-y-4">
              {/* EBITDA bar */}
              <div>
                <div className="flex justify-between items-center text-xs font-bold text-gray-600 dark:text-gray-400 mb-1">
                  <span>Reported EBITDA</span>
                  <span className="font-mono text-gray-950 dark:text-white">{formatCurrency(calculatedEbitda)}</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-4 overflow-hidden flex">
                  <div 
                    style={{ width: `${chartProps.ebitdaPercent}%` }}
                    className="bg-brand-blue-500 h-full rounded-full transition-all duration-500"
                  ></div>
                </div>
              </div>

              {/* Add Backs breakdown bar chart */}
              {totalAddBacks > 0 && (
                <div>
                  <div className="flex justify-between items-center text-xs font-bold text-green-600 dark:text-green-400 mb-1">
                    <span>(+) Owner Discretionary Add-Backs</span>
                    <span className="font-mono">{formatCurrency(totalAddBacks)}</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-4 overflow-hidden flex space-x-0.5">
                    {/* Owner Salary */}
                    {ownerSalary > 0 && (
                      <div 
                        style={{ width: `${Math.max(5, (Number(ownerSalary) / chartProps.maxVal) * 100)}%` }}
                        className="bg-green-500 h-full transition-all duration-500"
                        title={`Salary: ${formatCurrency(Number(ownerSalary))}`}
                      ></div>
                    )}
                    {/* Owner Benefits */}
                    {ownerBenefits > 0 && (
                      <div 
                        style={{ width: `${Math.max(5, (Number(ownerBenefits) / chartProps.maxVal) * 100)}%` }}
                        className="bg-emerald-400 h-full transition-all duration-500"
                        title={`Benefits: ${formatCurrency(Number(ownerBenefits))}`}
                      ></div>
                    )}
                    {/* Perks / Personal expenses */}
                    {personalExpenses > 0 && (
                      <div 
                        style={{ width: `${Math.max(5, (Number(personalExpenses) / chartProps.maxVal) * 100)}%` }}
                        className="bg-teal-400 h-full transition-all duration-500"
                        title={`Perks: ${formatCurrency(Number(personalExpenses))}`}
                      ></div>
                    )}
                    {/* One time */}
                    {oneTimeExpenses > 0 && (
                      <div 
                        style={{ width: `${Math.max(5, (Number(oneTimeExpenses) / chartProps.maxVal) * 105)}%` }}
                        className="bg-green-300 h-full transition-all duration-500"
                        title={`One-time: ${formatCurrency(Number(oneTimeExpenses))}`}
                      ></div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-1.5 text-3xs font-semibold text-gray-500">
                    {ownerSalary > 0 && <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>Salary</span>}
                    {ownerBenefits > 0 && <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-emerald-400 mr-1"></span>Benefits</span>}
                    {personalExpenses > 0 && <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-teal-400 mr-1"></span>Perks/Auto</span>}
                    {oneTimeExpenses > 0 && <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-green-300 mr-1"></span>One-time</span>}
                  </div>
                </div>
              )}

              {/* Deductions bar if present */}
              {totalSubtractions > 0 && (
                <div>
                  <div className="flex justify-between items-center text-xs font-bold text-red-500 dark:text-red-400 mb-1">
                    <span>(-) Operating/Co-Owner Deductions</span>
                    <span className="font-mono">-{formatCurrency(totalSubtractions)}</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-4 overflow-hidden flex">
                    <div 
                      style={{ width: `${chartProps.subtractionPercent}%` }}
                      className="bg-red-500 h-full transition-all duration-500"
                    ></div>
                  </div>
                </div>
              )}

              {/* SDE Bar */}
              <div className="pt-2 border-t border-gray-150 dark:border-gray-800">
                <div className="flex justify-between items-center text-xs font-extrabold text-brand-blue-700 dark:text-brand-blue-400 mb-1">
                  <span>Normalized SDE</span>
                  <span className="font-mono text-sm">{formatCurrency(normalizedSde)}</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-5 overflow-hidden flex">
                  <div 
                    style={{ width: `${chartProps.sdePercent}%` }}
                    className="bg-gradient-to-r from-brand-blue-500 to-indigo-500 h-full rounded-full transition-all duration-500 shadow-sm"
                  ></div>
                </div>
                <div className="flex justify-between items-center mt-1.5 text-3xs text-gray-400">
                  <span>Operating Cash baseline</span>
                  <span className="font-bold text-green-600 dark:text-green-400">SDE multiple valuation anchor</span>
                </div>
              </div>
            </div>
          </div>

          {/* SDE Output Widget */}
          <div className="bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-xs">
            <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
              Normalized Cash Flow
            </h4>
            <div className="text-center py-4 bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-lg shadow-inner">
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium block">
                Normalized Seller Discretionary Earnings (SDE)
              </span>
              <span id="sde-calculated-result" className="text-4xl font-extrabold text-brand-blue-700 dark:text-brand-blue-400 font-sans tracking-tight mt-1 block">
                {formatCurrency(normalizedSde)}
              </span>
            </div>

            {/* Reconciliation breakdown */}
            <div className="mt-4 space-y-2.5 text-sm border-t border-gray-150 dark:border-gray-800 pt-4">
              <div className="flex justify-between items-center text-gray-600 dark:text-gray-300">
                <span>Baseline EBITDA</span>
                <span className="font-mono font-semibold">{formatCurrency(calculatedEbitda)}</span>
              </div>
              <div className="flex justify-between items-center text-green-600 dark:text-green-400">
                <span>Total Discretionary Add-backs</span>
                <span className="font-mono font-semibold">+{formatCurrency(totalAddBacks)}</span>
              </div>
              <div className="flex justify-between items-center text-red-600 dark:text-red-400">
                <span>Operating/Owner Deductions</span>
                <span className="font-mono font-semibold">-{formatCurrency(totalSubtractions)}</span>
              </div>
              <hr className="border-gray-150 dark:border-gray-800" />
              <div className="flex justify-between items-center font-bold text-gray-900 dark:text-white pt-1">
                <span>Adjusted SDE Cash Flow</span>
                <span className="font-mono text-base">{formatCurrency(normalizedSde)}</span>
              </div>
            </div>
          </div>

          {/* SBA Qualification Analysis Card */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-xs space-y-4">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center">
              <TrendingUp className="w-4 h-4 text-brand-blue-500 mr-2" />
              SBA Loan Qualification Insights
            </h4>

            {/* Qualification status badge */}
            <div className={`p-4 rounded-lg border text-sm font-semibold transition-colors flex items-start space-x-2.5 ${dscrStatus.colorClass}`}>
              {dscrStatus.status === 'healthy' && <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-green-600" />}
              {dscrStatus.status === 'risky' && <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-yellow-600" />}
              {dscrStatus.status === 'unacceptable' && <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-600" />}
              {!targetLoan && <Info className="w-5 h-5 flex-shrink-0 mt-0.5 text-gray-400" />}
              <div>
                <p className="font-bold">{dscrStatus.text}</p>
                <p className="text-xs mt-1 font-normal opacity-90">
                  {targetLoan 
                    ? `SBA lenders evaluate DSCR using SDE minus living costs (${formatCurrency(Number(ownerLivingExpenses))}). Target is >= ${requiredDscr}x.`
                    : 'Specify a proposed loan amount and interest rate on the left to analyze debt service capability and DSCR thresholds.'
                  }
                </p>
              </div>
            </div>

            {/* Financial sizing diagnostics */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center text-gray-600 dark:text-gray-400">
                <span>Annual Cash Available for Debt</span>
                <span className="font-mono font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(sbaMetrics.availableCashForDebt)}
                </span>
              </div>

              {targetLoan && (
                <>
                  <div className="flex justify-between items-center text-gray-600 dark:text-gray-400">
                    <span>Est. Monthly SBA Payment</span>
                    <span className="font-mono font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(sbaMetrics.monthlyPayment)}/mo
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-gray-600 dark:text-gray-400">
                    <span>Annual Debt Service Payment</span>
                    <span className="font-mono font-semibold text-gray-900 dark:text-white text-red-600 dark:text-red-400">
                      -{formatCurrency(sbaMetrics.annualDebtService)}
                    </span>
                  </div>
                </>
              )}

              <hr className="border-gray-150 dark:border-gray-800" />

              {/* Sizing metric - Max Supportable Loan */}
              <div className="pt-2">
                <span className="text-xs text-gray-500 dark:text-gray-400 block font-medium">
                  Est. Maximum Supportable SBA Loan Amount
                </span>
                <span id="sde-max-supportable-loan" className="text-2xl font-bold text-green-700 dark:text-green-400 font-mono block mt-1">
                  {formatCurrency(sbaMetrics.maxSbaLoan)}
                </span>
                <span className="text-2xs text-gray-400 dark:text-gray-500 block mt-0.5 italic">
                  Assumes {interestRate}% rate, {loanTermYears}-year amortization, and minimum {requiredDscr}x DSCR.
                </span>
              </div>
            </div>

            {/* SBA Lending Rule reminder */}
            <div className="bg-gray-50 dark:bg-gray-800/30 p-3.5 rounded-lg border border-gray-100 dark:border-gray-800/50 flex space-x-2 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              <Info className="w-4.5 h-4.5 text-brand-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-gray-700 dark:text-gray-300 block mb-0.5">Note on SBA Loan Structuring:</strong>
                SBA 7(a) acquisition loans require a minimum of 10% equity injection (down payment). SDE is the primary metric used to value small business acquisitions and secure commercial financing.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SDECalculator;
