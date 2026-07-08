
import React from 'react';
import { UsersIcon, ChartBarIcon, SyndicateEngineIcon, FundingIcon, CalculatorIcon, SparklesIcon } from './icons';

interface TabsProps {
    activeTab: string;
    onTabClick: (tabId: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ activeTab, onTabClick }) => {
    const tabs = [
        { id: 'analysis', name: 'Deal Analysis & AI Agents', Icon: SparklesIcon },
        { id: 'scenario_analysis', name: 'Scenario Analysis', Icon: ChartBarIcon },
        { id: 'deal_room', name: 'Deal Room', Icon: UsersIcon },
        { id: 'tools', name: 'Tools & Calculators', Icon: CalculatorIcon },
        { id: 'funding', name: 'Funding', Icon: FundingIcon },
        { id: 'reporting', name: 'Reporting', Icon: SyndicateEngineIcon },
    ];

    return (
        <nav className="flex space-x-1 md:space-x-2 py-2 md:py-3 overflow-x-auto no-scrollbar scroll-smooth" aria-label="Deal Navigation">
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        id={`nav-tab-${tab.id}`}
                        onClick={() => onTabClick(tab.id)}
                        className={`
                            whitespace-nowrap flex items-center px-3.5 py-2 rounded-lg font-medium text-xs md:text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-blue-500/20
                            ${isActive
                                ? 'bg-brand-blue-50 text-brand-blue-700 dark:bg-brand-blue-950/40 dark:text-brand-blue-400 shadow-xs border border-brand-blue-100/50 dark:border-brand-blue-900/30 font-semibold'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-850/60 border border-transparent'
                            }
                        `}
                        aria-current={isActive ? 'page' : undefined}
                    >
                        {tab.Icon && (
                            <tab.Icon 
                                className={`w-4 h-4 md:w-4.5 md:h-4.5 mr-2 transition-transform duration-200 ${
                                    isActive ? 'text-brand-blue-600 dark:text-brand-blue-400 scale-105' : 'text-gray-400 dark:text-gray-500'
                                }`} 
                            />
                        )}
                        <span>{tab.name}</span>
                    </button>
                );
            })}
        </nav>
    );
};

export default Tabs;

