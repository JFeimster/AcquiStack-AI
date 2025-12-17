
import React from 'react';
import { UsersIcon, ChartBarIcon, SyndicateEngineIcon, FundingIcon, CalculatorIcon } from './icons';

interface TabsProps {
    activeTab: string;
    onTabClick: (tabId: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ activeTab, onTabClick }) => {
    const tabs = [
        { id: 'analysis', name: 'Deal Analysis & AI Agents' },
        { id: 'scenario_analysis', name: 'Scenario Analysis', Icon: ChartBarIcon },
        { id: 'deal_room', name: 'Deal Room', Icon: UsersIcon },
        { id: 'tools', name: 'Tools & Calculators', Icon: CalculatorIcon },
        { id: 'funding', name: 'Funding', Icon: FundingIcon },
        { id: 'reporting', name: 'Reporting', Icon: SyndicateEngineIcon },
    ];

    return (
        <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab.name}
                        onClick={() => onTabClick(tab.id)}
                        className={`
                            ${activeTab === tab.id
                                ? 'border-brand-blue-500 text-brand-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                            }
                            whitespace-nowrap flex py-4 px-1 border-b-2 font-medium text-sm transition-colors items-center
                        `}
                        aria-current={activeTab === tab.id ? 'page' : undefined}
                    >
                         {tab.Icon && <tab.Icon className="w-5 h-5 mr-2" />}
                        {tab.name}
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default Tabs;
