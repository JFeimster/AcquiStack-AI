import React, { useState } from 'react';
import CrmConnectButton from './CrmConnectButton';
import { Deal } from '../types';
import { 
  DashboardIcon, 
  SparklesIcon, 
  ChartBarIcon, 
  UsersIcon, 
  CalculatorIcon, 
  FundingIcon, 
  SyndicateEngineIcon 
} from './icons';
import { X, ChevronRight } from 'lucide-react';

interface HeaderProps {
  onDealChange: React.Dispatch<React.SetStateAction<Deal>>;
  currentDeal: Deal | null;
  onBackToDashboard: () => void;
  deals?: Deal[];
  onSelectDeal?: (dealId: number) => void;
  setActiveTab?: (tabId: string) => void;
  landingTab?: string;
  setLandingTab?: (tabId: string) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  onDealChange, 
  currentDeal, 
  onBackToDashboard,
  deals = [],
  onSelectDeal,
  setActiveTab,
  landingTab = 'dashboard',
  setLandingTab
}) => {
  const [selectedNavTab, setSelectedNavTab] = useState<string | null>(null);

  const headerNavItems = [
    { id: 'dashboard', name: 'Dashboard', Icon: DashboardIcon },
    { id: 'analysis', name: 'AI Agents', Icon: SparklesIcon },
    { id: 'scenario_analysis', name: 'Scenario Analysis', Icon: ChartBarIcon },
    { id: 'deal_room', name: 'Deal Room', Icon: UsersIcon },
    { id: 'tools', name: 'Tools & Calculators', Icon: CalculatorIcon },
    { id: 'funding', name: 'Funding', Icon: FundingIcon },
    { id: 'reporting', name: 'Reporting', Icon: SyndicateEngineIcon },
  ];

  const landingNavItems = [
    { id: 'dashboard', name: 'Pipeline Dashboard', Icon: DashboardIcon },
    { id: 'landing', name: 'About AcquiStack', Icon: SparklesIcon },
    { id: 'playground', name: 'Capital Stack Sandbox', Icon: CalculatorIcon },
    { id: 'scanner', name: 'CIM Quick Scan', Icon: SyndicateEngineIcon },
    { id: 'marketplace', name: 'Deal Marketplace', Icon: FundingIcon },
    { id: 'academy', name: 'SBA Academy', Icon: UsersIcon },
  ];

  const handleNavItemClick = (itemId: string) => {
    if (itemId === 'dashboard') {
      onBackToDashboard();
      return;
    }
    
    // Open selection modal to choose a deal
    setSelectedNavTab(itemId);
  };

  const handleLandingNavItemClick = (itemId: string) => {
    if (setLandingTab) {
      setLandingTab(itemId);
    }
  };

  const handleDealSelect = (dealId: number) => {
    if (onSelectDeal && selectedNavTab) {
      onSelectDeal(dealId);
      if (setActiveTab) {
        setActiveTab(selectedNavTab);
      }
      setSelectedNavTab(null);
    }
  };

  const getModalTitle = () => {
    switch (selectedNavTab) {
      case 'analysis': return 'Deal Analysis & AI Agents';
      case 'scenario_analysis': return 'Scenario Analysis';
      case 'deal_room': return 'Deal Room & Team VDR';
      case 'tools': return 'Tools & Calculators';
      case 'funding': return 'Funding Marketplace';
      case 'reporting': return 'Reporting & Syndicate';
      default: return 'Feature Workspace';
    }
  };

  const getModalDescription = () => {
    return `To open ${getModalTitle()}, please select one of your active pipeline deals below:`;
  };

  // Helper to format currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <>
      <header className="bg-white dark:bg-gray-900 shadow-sm px-6 py-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-850 z-30 transition-colors">
        <div className="flex items-center space-x-8">
          {currentDeal ? (
            <button onClick={onBackToDashboard} className="flex items-center space-x-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-brand-blue-600 dark:hover:text-brand-blue-400 transition-colors">
              <DashboardIcon className="w-5 h-5 text-gray-400 hover:text-brand-blue-500" />
              <span>Back to Dashboard</span>
            </button>
          ) : (
            <div className="flex items-center space-x-3 cursor-pointer" onClick={onBackToDashboard}>
              <svg
                className="w-8 h-8 text-brand-blue-600 dark:text-brand-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                ></path>
              </svg>
              <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">AcquiStack AI</h1>
            </div>
          )}

          {/* Primary Dashboard Header Navigation (Visible ONLY on landing page when no specific deal is viewed) */}
          {!currentDeal && (
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-1.5" aria-label="Global Navigation">
              {landingNavItems.map((item) => {
                const isActive = item.id === landingTab;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleLandingNavItemClick(item.id)}
                    className={`
                      whitespace-nowrap flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150
                      ${isActive
                        ? 'bg-brand-blue-50 text-brand-blue-700 dark:bg-brand-blue-950/40 dark:text-brand-blue-400 border border-brand-blue-100/50 dark:border-brand-blue-900/30'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/80 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-850/60 border border-transparent'
                      }
                    `}
                  >
                    <item.Icon className={`w-3.5 h-3.5 mr-1.5 ${isActive ? 'text-brand-blue-600 dark:text-brand-blue-400' : 'text-gray-400 dark:text-gray-500'}`} />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </nav>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {currentDeal && (
            <>
              <div className="hidden sm:block h-6 w-px bg-gray-200 dark:bg-gray-700"></div>
              <h2 className="hidden sm:block text-lg font-bold text-gray-700 dark:text-gray-200 truncate max-w-[200px]">{currentDeal.deal_name}</h2>
            </>
          )}
          {currentDeal && <CrmConnectButton onDealChange={onDealChange} />}
        </div>
      </header>

      {/* Select a Deal Modal */}
      {selectedNavTab && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-2xl p-6 max-w-lg w-full overflow-hidden animate-scaleIn flex flex-col max-h-[85vh]">
            <div className="flex justify-between items-center pb-4 border-b border-gray-150 dark:border-gray-800/80">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-brand-blue-50 dark:bg-brand-blue-950/40 rounded-lg text-brand-blue-600 dark:text-brand-blue-400">
                  {React.createElement(headerNavItems.find(item => item.id === selectedNavTab)?.Icon || SparklesIcon, { className: "w-5 h-5" })}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Select a Deal</h3>
                  <p className="text-2xs text-gray-500 dark:text-gray-400 mt-0.5">Choose a pipeline deal to open this feature</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedNavTab(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 text-sm text-gray-600 dark:text-gray-300 font-medium">
              {getModalDescription()}
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1 py-1 no-scrollbar">
              {deals.length > 0 ? (
                deals.map((deal) => (
                  <div
                    key={deal.id}
                    onClick={() => handleDealSelect(deal.id)}
                    className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800/85 rounded-xl hover:border-brand-blue-400 dark:hover:border-brand-blue-500 hover:shadow-xs cursor-pointer transition-all flex justify-between items-center group"
                  >
                    <div className="space-y-1 pr-4">
                      <h4 className="text-sm font-bold text-gray-950 dark:text-white group-hover:text-brand-blue-600 dark:group-hover:text-brand-blue-400 transition-colors">
                        {deal.deal_name}
                      </h4>
                      <div className="flex flex-wrap gap-2 items-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-3xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                          {deal.industry || 'General / Unknown'}
                        </span>
                        <span className="text-3xs text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold font-mono">
                          {deal.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 flex-shrink-0">
                      <div className="text-right">
                        <span className="text-xs font-mono font-bold text-gray-950 dark:text-white">
                          {formatCurrency(deal.purchase_price)}
                        </span>
                        <p className="text-4xs text-gray-400 dark:text-gray-500 uppercase tracking-wider">Purchase Price</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 group-hover:text-brand-blue-500 transition-all" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
                  <p className="text-sm text-gray-500 dark:text-gray-400">No active deals found in your pipeline.</p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-gray-150 dark:border-gray-800/80 flex justify-end">
              <button
                onClick={() => setSelectedNavTab(null)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
