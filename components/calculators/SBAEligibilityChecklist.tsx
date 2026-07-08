import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  HelpCircle, 
  User, 
  Building, 
  MapPin, 
  ShieldAlert, 
  Scale, 
  DollarSign, 
  Info 
} from 'lucide-react';
import { Deal } from '../../types';

interface SBAEligibilityChecklistProps {
  currentDeal?: Deal | null;
}

interface EligibilityFactor {
  id: string;
  category: 'borrower' | 'business' | 'deal';
  label: string;
  description: string;
  sopReference: string;
  defaultOn: (deal: Deal | null) => boolean;
}

const ELIGIBILITY_FACTORS: EligibilityFactor[] = [
  {
    id: 'criminal_record',
    category: 'borrower',
    label: 'Borrower on Parole, Probation, or Incarcerated',
    description: 'SBA cannot lend to businesses where any 20%+ owner is currently incarcerated, on parole, probation, or under active criminal indictment.',
    sopReference: 'SOP 50 10 7 - Character Determination',
    defaultOn: (deal) => deal?.borrower_profile?.on_parole === true
  },
  {
    id: 'poor_credit',
    category: 'borrower',
    label: 'Credit Score under 620',
    description: 'SBA lenders typically enforce a hard minimum personal credit score (often 620 or 680) for guarantors.',
    sopReference: 'Lender Overlay / SBA Credit Standards',
    defaultOn: (deal) => deal?.borrower_profile?.credit_score_band === '<620'
  },
  {
    id: 'foreign_operation',
    category: 'business',
    label: 'Foreign-Based or Non-US Operations',
    description: 'The business must operate primarily within the United States or its territories and make use of domestic labor/materials.',
    sopReference: 'SOP 50 10 7 - Citizenship & Location',
    defaultOn: (deal) => deal?.business_location === 'International'
  },
  {
    id: 'restricted_industry',
    category: 'business',
    label: 'Ineligible Industry (Passive, Gambling, Adult, Lending, etc.)',
    description: 'Passive real estate holdings, speculative investing, banks/lenders, gambling, life insurance firms, lobbying, and adult entertainment are strictly ineligible.',
    sopReference: 'SOP 50 10 7 - Ineligible Businesses',
    defaultOn: (deal) => {
      if (!deal) return false;
      const lowerInd = deal.industry.toLowerCase();
      return (
        lowerInd.includes('real estate') ||
        lowerInd.includes('landlord') ||
        lowerInd.includes('investing') ||
        lowerInd.includes('gambling') ||
        lowerInd.includes('casino') ||
        lowerInd.includes('adult') ||
        lowerInd.includes('lobbying') ||
        lowerInd.includes('cannabis') ||
        lowerInd.includes('marijuana')
      );
    }
  },
  {
    id: 'partial_ownership_transfer',
    category: 'deal',
    label: 'Partial Buyout / Seller Retaining Equity & Control',
    description: 'SBA 7(a) requires a 100% change of ownership. The seller cannot remain an officer, director, or retain equity indefinitely, except under short-term transition periods (<12 months).',
    sopReference: 'SOP 50 10 7 - Change of Ownership',
    defaultOn: (deal) => {
      if (!deal) return false;
      // If there is significant rollover equity or partial acquisition signals
      return (deal.rollover_equity > 0 && deal.rollover_equity < deal.purchase_price * 0.99);
    }
  },
  {
    id: 'prior_federal_default',
    category: 'borrower',
    label: 'Prior Default on Federal Debt (e.g. Student Loans, SBA)',
    description: 'Borrowers with delinquent federal debt or previous defaults causing a loss to the federal government are disqualified unless waived.',
    sopReference: 'SOP 50 10 7 - Prior Loss to Government',
    defaultOn: () => false
  },
  {
    id: 'size_limit',
    category: 'business',
    label: 'Exceeds SBA Small Business Size Standards',
    description: 'Business must qualify as a small business under SBA size standards (typically <$15M net worth and <$5.0M average net income after taxes for preceding 2 years).',
    sopReference: '13 CFR § 121.301 - Size Standards',
    defaultOn: (deal) => {
      if (!deal) return false;
      // If deal is extremely large (e.g. over $15M purchase price as proxy)
      return deal.purchase_price > 15000000;
    }
  },
  {
    id: 'franchise_not_approved',
    category: 'deal',
    label: 'Unlisted / Unapproved Franchise System',
    description: 'If the target is a franchise, it must be listed on the active SBA Franchise Directory to be eligible for funding.',
    sopReference: 'SOP 50 10 7 - Franchise Registry',
    defaultOn: (deal) => deal?.purchase_type === 'franchise'
  }
];

const SBAEligibilityChecklist: React.FC<SBAEligibilityChecklistProps> = ({ currentDeal = null }) => {
  // Store the active (disqualifying) factors toggled by the user
  const [activeDisqualifiers, setActiveDisqualifiers] = useState<string[]>([]);
  const [expandedFactor, setExpandedFactor] = useState<string | null>(null);

  // Synchronize checklist with the current deal when currentDeal changes
  useEffect(() => {
    const disqualifiedFromDeal = ELIGIBILITY_FACTORS.filter(factor => factor.defaultOn(currentDeal)).map(f => f.id);
    setActiveDisqualifiers(disqualifiedFromDeal);
  }, [currentDeal]);

  // Toggle factor status
  const handleToggleFactor = (id: string) => {
    setActiveDisqualifiers(prev => 
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  const getOverallStatus = () => {
    if (activeDisqualifiers.length === 0) {
      return {
        status: 'Pass',
        badgeColor: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        borderColor: 'border-green-200 dark:border-green-900/50',
        message: 'No active disqualifying factors detected. Deal appears highly viable for SBA 7(a) backing!',
        icon: <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
      };
    } else if (activeDisqualifiers.length === 1) {
      return {
        status: 'Review Needed',
        badgeColor: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
        borderColor: 'border-yellow-200 dark:border-yellow-900/50',
        message: '1 active eligibility flag requires structured analysis, mitigation explanation, or a waiver request.',
        icon: <AlertTriangle className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
      };
    } else {
      return {
        status: 'Disqualified / High Risk',
        badgeColor: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
        borderColor: 'border-red-200 dark:border-red-900/50',
        message: `${activeDisqualifiers.length} critical disqualifying factors are toggled. These will trigger immediate rejection by standard SBA underwriters.`,
        icon: <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
      };
    }
  };

  const currentStatus = getOverallStatus();

  return (
    <div id="sba-eligibility-checklist-tool" className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 p-6">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-150 dark:border-gray-800 pb-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-brand-blue-50 dark:bg-brand-blue-900/40 rounded-lg text-brand-blue-600 dark:text-brand-blue-400">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">SBA SOP 50 10 Eligibility Checklist</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Run interactive compliance validation of SBA 7(a) parameters. Toggle factors to assess mitigation strategies.
            </p>
          </div>
        </div>
        {currentDeal && (
          <div className="mt-3 md:mt-0 px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-semibold rounded-full border border-gray-200 dark:border-gray-700">
            Syncing: <span className="text-brand-blue-600 dark:text-brand-blue-400 font-mono">{currentDeal.deal_name}</span>
          </div>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column - Factor Selection Checklist */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex justify-between items-center mb-1">
            <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Disqualifying Toggles
            </h4>
            <button 
              type="button"
              onClick={() => setActiveDisqualifiers([])}
              className="text-xs text-brand-blue-600 hover:text-brand-blue-700 dark:text-brand-blue-400 dark:hover:text-brand-blue-300 font-semibold"
            >
              Reset to Perfect Clean Pass
            </button>
          </div>

          <div className="space-y-3">
            {ELIGIBILITY_FACTORS.map((factor) => {
              const isChecked = activeDisqualifiers.includes(factor.id);
              const isDefaultOn = currentDeal ? factor.defaultOn(currentDeal) : false;

              return (
                <div 
                  key={factor.id}
                  className={`p-4 rounded-xl border transition-all duration-200 ${
                    isChecked 
                      ? 'bg-red-50/40 border-red-200 dark:bg-red-950/10 dark:border-red-900/40' 
                      : 'bg-gray-50/50 border-gray-200 dark:bg-gray-800/20 dark:border-gray-800'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 pr-2">
                      <input 
                        type="checkbox"
                        id={`checklist-toggle-${factor.id}`}
                        checked={isChecked}
                        onChange={() => handleToggleFactor(factor.id)}
                        className="mt-1 h-4.5 w-4.5 rounded-sm border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer"
                      />
                      <div>
                        <label 
                          htmlFor={`checklist-toggle-${factor.id}`}
                          className={`text-sm font-bold block cursor-pointer transition-colors ${
                            isChecked 
                              ? 'text-red-900 dark:text-red-400' 
                              : 'text-gray-900 dark:text-white'
                          }`}
                        >
                          {factor.label}
                        </label>
                        <span className="text-2xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                          Category: {factor.category} | {factor.sopReference}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setExpandedFactor(expandedFactor === factor.id ? null : factor.id)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-0.5"
                    >
                      <HelpCircle className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Expanded Help Information */}
                  {expandedFactor === factor.id && (
                    <div className="mt-3 pt-3 border-t border-gray-250 dark:border-gray-800 text-xs text-gray-600 dark:text-gray-400 space-y-1 bg-white dark:bg-gray-950 p-2.5 rounded-lg">
                      <p>{factor.description}</p>
                      <p className="font-semibold text-brand-blue-600 dark:text-brand-blue-400 mt-1">
                        SOP Guideline: {factor.sopReference}
                      </p>
                    </div>
                  )}

                  {/* Visual Tag for Auto-Flagging from Deal Data */}
                  {isDefaultOn && (
                    <div className="mt-2 inline-flex items-center space-x-1 px-2 py-0.5 bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 text-2xs font-bold rounded-full">
                      <Info className="w-3 h-3" />
                      <span>Auto-detected from Deal profile</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column - Compliance Diagnostic Analysis */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-6">
          {/* Status Display Widget */}
          <div className={`p-5 rounded-xl border-2 shadow-xs transition-all duration-200 ${currentStatus.borderColor} bg-white dark:bg-gray-900`}>
            <div className="flex items-center space-x-3 mb-3">
              {currentStatus.icon}
              <div>
                <span className={`px-2.5 py-0.5 text-xs font-extrabold rounded-full ${currentStatus.badgeColor}`}>
                  {currentStatus.status}
                </span>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mt-1">SOP Clearance Status</h4>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {currentStatus.message}
            </p>

            {currentDeal && activeDisqualifiers.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-150 dark:border-gray-800 space-y-2">
                <span className="text-2xs font-extrabold text-gray-400 uppercase tracking-wider block">
                  Identified Barriers for {currentDeal.deal_name}
                </span>
                <ul className="text-xs text-red-600 dark:text-red-400 space-y-1.5 font-medium list-disc list-inside">
                  {ELIGIBILITY_FACTORS.filter(f => activeDisqualifiers.includes(f.id)).map(f => (
                    <li key={f.id} className="leading-snug">{f.label}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* SOP Rules Explainer card */}
          <div className="bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-800 rounded-xl p-5 space-y-4">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center">
              <ShieldAlert className="w-4 h-4 text-brand-blue-500 mr-2" />
              SBA Loan Rules Decoded
            </h4>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-start space-x-2.5">
                <User className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-gray-700 dark:text-gray-300 block">Personal Guaranty Rule:</strong>
                  Every individual holding 20% or more ownership in the acquisition target must provide a full, unconditional personal guaranty. There are no exceptions under SBA rules.
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <Building className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-gray-700 dark:text-gray-300 block">100% Equity Buyout:</strong>
                  SBA will not finance general passive partner buyins. The transaction must transition absolute full voting control and ownership to the buyer. Sellers can only carry standby debt.
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-gray-700 dark:text-gray-300 block">US Operations Constraint:</strong>
                  If any subsidiary, significant warehouse, or intellectual asset operates overseas, the lender must document that more than 50% of the cash flow benefits the United States.
                </div>
              </div>
            </div>

            <div className="bg-brand-blue-50/50 dark:bg-brand-blue-950/20 p-3 rounded-lg text-2xs text-brand-blue-800 dark:text-brand-blue-300 leading-normal">
              <strong>Need an Eligibility Waiver?</strong> Certain factors (like prior bankruptcies or minor non-violent criminal records old than 5-10 years) can be mitigated via SBA Form 912 and detailed lender explanations.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SBAEligibilityChecklist;
