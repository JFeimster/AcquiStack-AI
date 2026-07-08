import React, { useState } from 'react';
import { 
  Sparkles, 
  ChevronRight, 
  DollarSign, 
  ShieldCheck, 
  Compass, 
  TrendingUp, 
  FileText, 
  Zap, 
  HelpCircle,
  ArrowRight,
  Calculator,
  Award,
  Users,
  CheckCircle2
} from 'lucide-react';

interface MarketingLandingPageProps {
  onStartStructuring: () => void;
  onViewSandbox: () => void;
  onViewScanner: () => void;
}

const MarketingLandingPage: React.FC<MarketingLandingPageProps> = ({ 
  onStartStructuring, 
  onViewSandbox,
  onViewScanner 
}) => {
  const [dealSize, setDealSize] = useState<number>(1500000);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Quick live math for the interactive SBA teaser
  const sbaLoan = dealSize * 0.75;
  const sellerNote = dealSize * 0.15;
  const borrowerCash = dealSize * 0.10;

  const features = [
    {
      icon: ShieldCheck,
      title: "SBA 7(a) Compliance Guard",
      desc: "Instant automated auditing against the latest SBA SOP guidelines, ensuring structure feasibility.",
      tag: "Live Engine"
    },
    {
      icon: Sparkles,
      title: "Multi-Agent M&A Copilot",
      desc: "Specialized virtual agents analyze debt capacity, legal overlays, and business liquidity in real-time.",
      tag: "AI Model"
    },
    {
      icon: FileText,
      title: "CIM Financial Scanner",
      desc: "Extract normalized EBITDA, SDE, and balance sheet metrics from CIMs or teasers instantly.",
      tag: "OCR Scan"
    },
    {
      icon: TrendingUp,
      title: "Interactive Scenario Modeler",
      desc: "Model primary, best, and worst-case scenarios side-by-side to stress-test your debt service.",
      tag: "Sandbox"
    }
  ];

  const steps = [
    {
      num: "01",
      title: "Import or Add a Deal",
      desc: "Select from our marketplace, upload a CIM, or manually input core business financials."
    },
    {
      num: "02",
      title: "Structure the Capital Stack",
      desc: "Define your cash injection, seller note standby terms, and SBA debt structure."
    },
    {
      num: "03",
      title: "Consult Specialized AI Agents",
      desc: "Deploy SBA Experts, Liquidity Checkers, and Financial Analysts to audit your deal."
    },
    {
      num: "04",
      title: "Generate Lender Package",
      desc: "Export institutional-grade investment memos and SBA underwriting submission folders."
    }
  ];

  const plans = [
    {
      name: "Starter",
      price: "$149",
      period: "per month",
      desc: "Perfect for searchers modeling their first target acquisitions.",
      features: [
        "Up to 3 Active Deal Models",
        "SBA Capital Stack Playground",
        "Basic AI Underwriter feedback",
        "Standard M&A Academy access",
        "PDF Report Exports"
      ],
      buttonText: "Get Started",
      popular: false
    },
    {
      name: "Professional",
      price: "$299",
      period: "per month",
      desc: "Our most popular tier for active searchers, brokers, and advisors.",
      features: [
        "Unlimited Deal Pipeline Management",
        "All Specialized AI Agents active",
        "CIM Financial Scanner (OCR)",
        "Advanced Scenario Sandbox Stress-Testing",
        "Custom Lender Package Generator",
        "CRM & QuickBooks Live Integrations"
      ],
      buttonText: "Start Free Trial",
      popular: true
    },
    {
      name: "Enterprise",
      price: "$799",
      period: "per month",
      desc: "Designed for boutique investment banks, private equity, and search funds.",
      features: [
        "Multi-User Deal Rooms & Live Chat",
        "White-labeled Virtual Data Rooms (VDR)",
        "Priority AI Token Processing & API Access",
        "Custom SBA Compliance Overlay Rules",
        "Dedicated Account Executive & SBA Advisory"
      ],
      buttonText: "Contact Sales",
      popular: false
    }
  ];

  const faqs = [
    {
      q: "How does the SBA 7(a) Compliance checking engine work?",
      a: "Our compliance engine parses the current SBA Standard Operating Procedures (SOP 50 10) rules. It analyzes variables such as debt service coverage ratio (DSCR must be above 1.15x), minimum borrower cash injection of 10% (unless specific seller standby notes are used), and max SBA exposure of $5,000,000 to instantly flag deal structure violations."
    },
    {
      q: "Can I import deals from external brokerage listings?",
      a: "Yes! Our integrated Deal Marketplace lets you browse curated small businesses for sale and import them into your active pipeline with one click. You can also paste unstructured listing details or upload a CIM to have the AI extract the data."
    },
    {
      q: "Does AcquiStack AI store confidential business documents?",
      a: "All documents uploaded to the Virtual Deal Room (VDR) or scanned via the CIM Scanner are processed securely and can be permanently removed at your discretion. We support state-of-the-art secure data persistence and follow enterprise-grade data handling guidelines."
    },
    {
      q: "Can a seller note really count as the buyer's equity injection?",
      a: "Yes! Under the latest SBA rules, a seller note can count toward the mandatory 10% equity injection if it is structured on a full standby basis (no payments of principal or interest) for the life of the SBA loan (normally 10 years). Our sandbox automatically highlights and calculates this rule."
    }
  ];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-16 py-4 animate-fadeIn">
      {/* Hero Section */}
      <div className="relative text-center max-w-4xl mx-auto space-y-6 pt-6">
        <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-blue-50 dark:bg-brand-blue-950/40 text-brand-blue-700 dark:text-brand-blue-400 border border-brand-blue-100/50 dark:border-brand-blue-900/30">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>V2.4 Live: New SBA Standby Note Rules Supported</span>
        </span>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-gray-900 dark:text-white leading-tight">
          The Intelligent M&A Copilot for <br className="hidden md:block"/>
          <span className="bg-gradient-to-r from-brand-blue-600 to-indigo-600 dark:from-brand-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
            SBA-Compliant Acquisitions
          </span>
        </h1>
        <p className="text-lg md:text-xl text-gray-650 dark:text-gray-300 max-w-2xl mx-auto font-medium">
          Model capital stacks, extract CIM financials, run advanced multi-agent stress tests, and assemble investor-ready lender packages automatically.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <button
            onClick={onStartStructuring}
            className="px-6 py-3 bg-brand-blue-600 hover:bg-brand-blue-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 group text-sm md:text-base cursor-pointer"
          >
            <span>Launch Pipeline Dashboard</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={onViewSandbox}
            className="px-6 py-3 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-850 font-bold rounded-xl border border-gray-300 dark:border-gray-700 shadow-sm transition-all flex items-center gap-2 text-sm md:text-base cursor-pointer"
          >
            <Calculator className="w-5 h-5 text-gray-400" />
            <span>Try Capital Stack Sandbox</span>
          </button>
        </div>
      </div>

      {/* Interactive Capital Stack Slider Teaser */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800/80 rounded-2xl p-6 md:p-8 max-w-4xl mx-auto shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-450 border border-green-100/50 dark:border-green-900/20 text-3xs font-bold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5" />
              <span>Interactive Quick-Modeling</span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-950 dark:text-white leading-snug">
              Visualize Your SBA 7(a) Capital Stack
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              Drag the slider to adjust the Enterprise Acquisition Value. See how the capital stack dynamically structures itself under standard SBA debt parameters.
            </p>
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs font-semibold text-gray-500 dark:text-gray-400">
                <span>Enterprise Value (Purchase Price)</span>
                <span className="text-gray-900 dark:text-white font-bold font-mono">{formatCurrency(dealSize)}</span>
              </div>
              <input
                type="range"
                min="500000"
                max="6000000"
                step="50000"
                value={dealSize}
                onChange={(e) => setDealSize(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-brand-blue-600"
              />
              <div className="flex justify-between text-4xs text-gray-400 font-bold uppercase">
                <span>$500k min</span>
                <span>$6M max (SBA 7a loan max is $5M)</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-950 border border-gray-150 dark:border-gray-800 rounded-xl p-5 md:p-6 space-y-4 font-sans">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">SBA 10% Down Capital Structure</h4>
            
            {/* Custom Stack Graphic */}
            <div className="space-y-3 pt-1">
              {/* SBA 7a Loan */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-gray-800 dark:text-gray-200 flex items-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-blue-500 mr-2"></span>
                    SBA 7(a) Loan (75%)
                  </span>
                  <span className="font-bold font-mono text-gray-950 dark:text-white">{formatCurrency(sbaLoan)}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-850 h-3.5 rounded-full overflow-hidden">
                  <div className="bg-brand-blue-500 h-full rounded-full transition-all duration-300" style={{ width: '75%' }}></div>
                </div>
              </div>

              {/* Seller Standby Note */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-gray-800 dark:text-gray-200 flex items-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 mr-2"></span>
                    Seller Standby Note (15%)
                  </span>
                  <span className="font-bold font-mono text-gray-950 dark:text-white">{formatCurrency(sellerNote)}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-850 h-3.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full transition-all duration-300" style={{ width: '15%' }}></div>
                </div>
              </div>

              {/* Borrower Cash Injection */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-gray-800 dark:text-gray-200 flex items-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 mr-2"></span>
                    Borrower Cash Injection (10%)
                  </span>
                  <span className="font-bold font-mono text-gray-950 dark:text-white">{formatCurrency(borrowerCash)}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-850 h-3.5 rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full rounded-full transition-all duration-300" style={{ width: '10%' }}></div>
                </div>
              </div>
            </div>

            {/* AI Insight */}
            <div className="p-3 bg-brand-blue-50/50 dark:bg-brand-blue-950/20 border border-brand-blue-100/30 dark:border-brand-blue-900/20 rounded-lg text-2xs text-brand-blue-700 dark:text-brand-blue-300 flex gap-2">
              <Sparkles className="w-4 h-4 text-brand-blue-500 flex-shrink-0 mt-0.5" />
              <p>
                {dealSize > 5000000 
                  ? "⚠️ Note: Your total deal size exceeds standard SBA loan limits. We'll automatically structure a pari-passu companion loan or extra mezzanine equity inside the workspace."
                  : "✅ Feasibility Check: This structured capital stack strictly satisfies standard SBA debt rules, requiring exactly 10% cash equivalent equity."
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="space-y-10 max-w-7xl mx-auto">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Expertly Engineered For Searchers</h2>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 max-w-xl mx-auto font-medium">
            Stop guessing if your deal structures satisfy strict SBA lenders. Let our expert M&A tool verify compliance instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => (
            <div 
              key={idx} 
              className="bg-white dark:bg-gray-900 border border-gray-250/70 dark:border-gray-800/80 rounded-xl p-6 shadow-2xs hover:border-brand-blue-400 dark:hover:border-brand-blue-500 hover:-translate-y-1 transition-all group duration-200"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 bg-brand-blue-50 dark:bg-brand-blue-950/40 text-brand-blue-600 dark:text-brand-blue-400 rounded-lg group-hover:scale-110 transition-transform">
                  <feat.icon className="w-5 h-5" />
                </div>
                <span className="text-3xs font-bold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-650 dark:text-gray-450">
                  {feat.tag}
                </span>
              </div>
              <h3 className="text-base font-bold text-gray-950 dark:text-white mb-2">{feat.title}</h3>
              <p className="text-xs text-gray-650 dark:text-gray-300 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Step-by-Step Acquisition Roadmap */}
      <div className="bg-gray-100/50 dark:bg-gray-950/40 border border-gray-200 dark:border-gray-850/80 rounded-2xl p-8 max-w-7xl mx-auto space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">The AcquiStack Framework</h2>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 max-w-lg mx-auto font-medium">
            From discovering a target listing to generating structured credit memos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, idx) => (
            <div key={idx} className="relative space-y-3">
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-black text-brand-blue-500/20 dark:text-brand-blue-400/15 font-mono">{step.num}</span>
                <div className="h-0.5 flex-1 bg-gray-250 dark:bg-gray-800 hidden lg:block"></div>
              </div>
              <h3 className="text-sm md:text-base font-bold text-gray-950 dark:text-white">{step.title}</h3>
              <p className="text-xs text-gray-650 dark:text-gray-300 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Section */}
      <div className="space-y-10 max-w-7xl mx-auto">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Clear, Transparent Pricing</h2>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 max-w-lg mx-auto font-medium">
            Accelerate your search with tools that scale alongside your acquisitions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {plans.map((plan, idx) => (
            <div 
              key={idx} 
              className={`
                bg-white dark:bg-gray-900 border rounded-2xl p-6 md:p-8 shadow-xs space-y-6 relative duration-200 transition-all
                ${plan.popular 
                  ? 'border-2 border-brand-blue-500 dark:border-brand-blue-400 shadow-md ring-4 ring-brand-blue-500/10 scale-102 z-10' 
                  : 'border-gray-250 dark:border-gray-800/80 hover:border-gray-350 dark:hover:border-gray-700'
                }
              `}
            >
              {plan.popular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-brand-blue-600 dark:bg-brand-blue-500 text-white text-3xs font-black rounded-full uppercase tracking-widest shadow-xs">
                  RECOMMENDED
                </span>
              )}
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-normal">{plan.desc}</p>
              </div>

              <div className="flex items-baseline space-x-1.5 border-b border-gray-150 dark:border-gray-800 pb-5">
                <span className="text-3xl md:text-4xl font-extrabold text-gray-950 dark:text-white font-sans">{plan.price}</span>
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{plan.period}</span>
              </div>

              <ul className="space-y-3.5">
                {plan.features.map((feat, fidx) => (
                  <li key={fidx} className="flex items-start text-xs text-gray-650 dark:text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-brand-blue-500 flex-shrink-0 mr-2.5 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={onStartStructuring}
                className={`
                  w-full py-2.5 px-4 rounded-xl font-bold text-sm transition-all shadow-xs cursor-pointer
                  ${plan.popular 
                    ? 'bg-brand-blue-600 text-white hover:bg-brand-blue-700 hover:shadow-md' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-750'
                  }
                `}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive FAQ Accordion */}
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Frequently Asked Questions</h2>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 font-medium">
            Learn more about AcquiStack AI, SBA underwriting, and deal rules.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div 
                key={idx} 
                className="bg-white dark:bg-gray-900 border border-gray-250/70 dark:border-gray-800/80 rounded-xl overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full text-left p-5 flex justify-between items-center font-bold text-sm md:text-base text-gray-950 dark:text-white focus:outline-none focus:bg-gray-50/50 dark:focus:bg-gray-850/20"
                >
                  <span className="pr-4">{faq.q}</span>
                  <HelpCircle className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-brand-blue-500' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs md:text-sm text-gray-650 dark:text-gray-300 leading-relaxed border-t border-gray-150/40 dark:border-gray-850/60 animate-fadeIn">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Footer */}
      <div className="bg-brand-blue-600 dark:bg-brand-blue-950/60 border border-brand-blue-700/10 dark:border-brand-blue-900/30 rounded-2xl p-8 md:p-12 text-center text-white max-w-5xl mx-auto space-y-5 shadow-lg relative overflow-hidden">
        {/* Decorative background blurs */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-2xl -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl -ml-16 -mb-16"></div>

        <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight">
          Ready to structure your acquisition?
        </h2>
        <p className="text-sm md:text-lg text-brand-blue-100 max-w-2xl mx-auto font-medium">
          Deploy specialized AI underwriters to stress-test debt, draft investment summaries, and prepare compliant bank submittals.
        </p>
        <div className="pt-2">
          <button
            onClick={onStartStructuring}
            className="px-6 py-3 bg-white text-brand-blue-700 hover:bg-brand-blue-50 hover:shadow-md font-bold rounded-xl text-sm md:text-base transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Launch Workspace Free</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarketingLandingPage;
