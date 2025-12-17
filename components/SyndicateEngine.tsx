import React, { useState } from 'react';
import { SyndicateEngineIcon, ClosingPackGeneratorIcon, LenderMatchAIIcon, PaperAirplaneIcon } from './icons';

interface SyndicateEngineProps {
    onGenerateReport: (type: 'investment_memo' | 'lender_package') => void;
    onGenerateAndSubmit: (lender: string) => void;
}

const LENDERS = ["Live Oak Bank", "Byline Bank", "Huntington Bank", "First Financial Bank", "Poppy Bank"];

const SyndicateEngine: React.FC<SyndicateEngineProps> = ({ onGenerateReport, onGenerateAndSubmit }) => {
    const [selectedLender, setSelectedLender] = useState(LENDERS[0]);

    return (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-1">
                <SyndicateEngineIcon className="w-8 h-8 text-brand-blue-600 dark:text-brand-blue-400 mr-3" />
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Syndicate Engine: Reporting & Submissions</h2>
                </div>
            </div>
            <p className="text-gray-500 dark:text-gray-400 mb-6 ml-11">Generate polished reports and submit tailored financing packages to lenders.</p>

            <div className="space-y-8">
                {/* Reporting Section */}
                <div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Internal & Investor Reporting</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg border dark:border-gray-700 flex flex-col">
                            <div className="flex items-center mb-3">
                                <ClosingPackGeneratorIcon className="w-6 h-6 text-gray-500 dark:text-gray-400 mr-3" />
                                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Investment Memo</h3>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 flex-grow">
                                For presenting to partners or equity investors. This memo combines the deal summary, valuation analysis, final capital stack, and key VDR risks into a single, cohesive document.
                            </p>
                            <button
                                onClick={() => onGenerateReport('investment_memo')}
                                className="w-full text-sm text-white bg-brand-blue-600 hover:bg-brand-blue-700 focus:ring-4 focus:outline-none focus:ring-brand-blue-300 font-medium rounded-lg px-4 py-2 text-center dark:bg-brand-blue-500 dark:hover:bg-brand-blue-600 dark:focus:ring-brand-blue-800 transition-colors"
                            >
                                Generate Memo
                            </button>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg border dark:border-gray-700 flex flex-col">
                            <div className="flex items-center mb-3">
                                <LenderMatchAIIcon className="w-6 h-6 text-gray-500 dark:text-gray-400 mr-3" />
                                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Lender Package</h3>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 flex-grow">
                                A tailored report for bankers. It highlights SBA eligibility checks, DSCR coverage, borrower liquidity verification, and the final Sources & Uses table.
                            </p>
                            <button
                                onClick={() => onGenerateReport('lender_package')}
                                className="w-full text-sm text-white bg-brand-blue-600 hover:bg-brand-blue-700 focus:ring-4 focus:outline-none focus:ring-brand-blue-300 font-medium rounded-lg px-4 py-2 text-center dark:bg-brand-blue-500 dark:hover:bg-brand-blue-600 dark:focus:ring-brand-blue-800 transition-colors"
                            >
                                Generate Package
                            </button>
                        </div>
                    </div>
                </div>

                {/* Submission Section */}
                <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
                     <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Direct Lender Submissions</h3>
                     <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                        Generate and send a tailored package directly to a specific lender's underwriting team using the AI Package Generator.
                    </p>
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg border dark:border-gray-700">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                            <div className="flex-1 mb-4 sm:mb-0">
                                <label htmlFor="lender-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Lender</label>
                                <select 
                                    id="lender-select"
                                    value={selectedLender} 
                                    onChange={e => setSelectedLender(e.target.value)}
                                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-blue-500 focus:border-brand-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                >
                                    {LENDERS.map(lender => <option key={lender} value={lender}>{lender}</option>)}
                                </select>
                            </div>
                            <button
                                onClick={() => onGenerateAndSubmit(selectedLender)}
                                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-brand-blue-600 hover:bg-brand-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue-500"
                            >
                                <PaperAirplaneIcon className="w-5 h-5 mr-2 -ml-1" />
                                Generate & Submit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SyndicateEngine;
