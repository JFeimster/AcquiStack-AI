
import React, { useState } from 'react';
import { QoEData, QoEAddBack, Deal } from '../../types';
import { analyzeQoE } from '../../services/geminiService';
import { QoEIcon, PlusCircleIcon, TrashIcon, SpinnerIcon, SparklesIcon } from '../icons';
import { marked } from 'https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js';

const initialQoEData: QoEData = {
    totalRevenue: '',
    topCustomerRevenue: '',
    topFiveCustomersRevenue: '',
    recurringRevenuePercentage: '',
    reportedSDE: '',
    questionableAddBacks: [{ id: Date.now(), description: 'Excess Owner Salary', amount: '' }],
    averageWorkingCapital: '',
    targetWorkingCapital: '',
};

const AccordionSection: React.FC<{ title: string; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
            <button type="button" className="flex items-center justify-between w-full p-4 font-semibold text-left" onClick={() => setIsOpen(!isOpen)}>
                <span>{title}</span>
                <svg className={`w-5 h-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
            </button>
            {isOpen && <div className="p-4 border-t border-gray-200 dark:border-gray-700">{children}</div>}
        </div>
    );
};

// A dummy deal context for the standalone tool
const dummyDeal: Deal = {
    id: 0,
    deal_name: 'Hypothetical Deal',
    industry: 'Not Specified',
    purchase_price: 0,
} as Deal;


const QoEAnalyzer: React.FC = () => {
    const [qoeData, setQoeData] = useState<QoEData>(initialQoEData);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const baseInputClasses = "block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-brand-blue-500 focus:border-brand-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-brand-blue-500 dark:focus:border-brand-blue-500 p-2.5";
    const lineItemInputClasses = "text-sm text-gray-900 bg-gray-50 rounded-md border border-gray-300 focus:ring-brand-blue-500 focus:border-brand-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white";


    const handleSimpleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setQoeData(prev => ({ ...prev, [name]: value === '' ? '' : parseFloat(value) }));
    };

    const handleAddBackChange = (id: number, field: 'description' | 'amount', value: string) => {
        setQoeData(prev => ({
            ...prev,
            questionableAddBacks: prev.questionableAddBacks.map(item =>
                item.id === id
                ? { ...item, [field]: field === 'amount' ? (value === '' ? '' : parseFloat(value)) : value }
                : item
            )
        }));
    };

    const addAddBack = () => {
        setQoeData(prev => ({
            ...prev,
            questionableAddBacks: [...prev.questionableAddBacks, { id: Date.now(), description: '', amount: '' }]
        }));
    };

    const removeAddBack = (id: number) => {
        setQoeData(prev => ({
            ...prev,
            questionableAddBacks: prev.questionableAddBacks.filter(item => item.id !== id)
        }));
    };

    const handleAnalyze = async () => {
        setIsLoading(true);
        setResult(null);
        setError(null);
        try {
            const response = await analyzeQoE(qoeData, dummyDeal);
            setResult(response);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred during analysis.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-1">
                <QoEIcon className="w-8 h-8 text-brand-blue-600 dark:text-brand-blue-400 mr-3" />
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Quality of Earnings (QoE) Analyzer</h2>
                </div>
            </div>
            <p className="text-gray-500 dark:text-gray-400 mb-6 ml-11">Go beyond the surface-level numbers. Use this tool to analyze the true financial health and sustainable earnings of a target business.</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Section */}
                <div className="space-y-4">
                    <AccordionSection title="Revenue Quality" defaultOpen>
                        <div className="space-y-4">
                             <div><label className="text-sm font-medium">Total Annual Revenue ($)</label><input type="number" name="totalRevenue" value={qoeData.totalRevenue} onChange={handleSimpleChange} className={baseInputClasses} placeholder="e.g., 1200000" /></div>
                             <div><label className="text-sm font-medium">Revenue from Largest Customer ($)</label><input type="number" name="topCustomerRevenue" value={qoeData.topCustomerRevenue} onChange={handleSimpleChange} className={baseInputClasses} placeholder="e.g., 300000" /></div>
                             <div><label className="text-sm font-medium">Revenue from Top 5 Customers ($)</label><input type="number" name="topFiveCustomersRevenue" value={qoeData.topFiveCustomersRevenue} onChange={handleSimpleChange} className={baseInputClasses} placeholder="e.g., 750000" /></div>
                             <div><label className="text-sm font-medium">Recurring Revenue (%)</label><input type="number" name="recurringRevenuePercentage" value={qoeData.recurringRevenuePercentage} onChange={handleSimpleChange} className={baseInputClasses} placeholder="e.g., 85" /></div>
                        </div>
                    </AccordionSection>

                    <AccordionSection title="Profitability & Add-Backs">
                        <div className="space-y-4">
                           <div><label className="text-sm font-medium">Seller's Reported SDE ($)</label><input type="number" name="reportedSDE" value={qoeData.reportedSDE} onChange={handleSimpleChange} className={baseInputClasses} placeholder="e.g., 450000"/></div>
                            <div>
                                <label className="text-sm font-medium mb-2 block">Questionable Add-Backs to Scrutinize</label>
                                <div className="space-y-2">
                                {qoeData.questionableAddBacks.map(item => (
                                    <div key={item.id} className="flex items-center gap-2">
                                        <input type="text" placeholder="Add-Back Description" value={item.description} onChange={e => handleAddBackChange(item.id, 'description', e.target.value)} className={`${lineItemInputClasses} flex-grow p-2`} />
                                        <input type="number" placeholder="Amount" value={item.amount} onChange={e => handleAddBackChange(item.id, 'amount', e.target.value)} className={`${lineItemInputClasses} w-32 p-2`} />
                                        <button onClick={() => removeAddBack(item.id)} className="text-gray-400 hover:text-red-500"><TrashIcon className="w-4 h-4" /></button>
                                    </div>
                                ))}
                                </div>
                                <button onClick={addAddBack} className="mt-2 text-sm text-brand-blue-600 dark:text-brand-blue-400 font-medium flex items-center"><PlusCircleIcon className="w-4 h-4 mr-1" /> Add Item</button>
                            </div>
                        </div>
                    </AccordionSection>

                    <AccordionSection title="Working Capital">
                        <div className="space-y-4">
                            <div><label className="text-sm font-medium">Average Working Capital (last 12 mos.) ($)</label><input type="number" name="averageWorkingCapital" value={qoeData.averageWorkingCapital} onChange={handleSimpleChange} className={baseInputClasses} placeholder="e.g., 50000" /></div>
                             <div><label className="text-sm font-medium">Target Working Capital at Close ($)</label><input type="number" name="targetWorkingCapital" value={qoeData.targetWorkingCapital} onChange={handleSimpleChange} className={baseInputClasses} placeholder="e.g., 75000" /></div>
                        </div>
                    </AccordionSection>
                </div>

                {/* AI Analysis Section */}
                <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg border dark:border-gray-700 flex flex-col">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">AI-Powered Analysis</h3>
                     <div className="flex-grow overflow-y-auto pr-2 -mr-2">
                        {isLoading && (
                             <div className="flex flex-col items-center justify-center h-full">
                                <SpinnerIcon className="w-8 h-8 text-brand-blue-600 animate-spin" />
                                <p className="mt-4 text-gray-600 dark:text-gray-300">AI analyst is reviewing the numbers...</p>
                            </div>
                        )}
                        {error && (
                            <div className="p-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-900 dark:text-red-400 h-full flex items-center justify-center">
                                <span className="font-medium">Error:</span> {error}
                            </div>
                        )}
                        {result && (
                            <div
                                className="prose prose-sm dark:prose-invert max-w-none"
                                dangerouslySetInnerHTML={{ __html: marked.parse(result) }}
                            />
                        )}
                        {!isLoading && !result && !error && (
                            <div className="text-center text-gray-500 dark:text-gray-400 h-full flex flex-col justify-center items-center">
                                <QoEIcon className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-2"/>
                                <p>Fill in the financial data on the left and click "Analyze" to generate a QoE Lite report.</p>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleAnalyze}
                        disabled={isLoading}
                        className="mt-6 w-full inline-flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-blue-600 hover:bg-brand-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue-500 disabled:bg-brand-blue-400 disabled:cursor-wait"
                    >
                         {isLoading ? <SpinnerIcon className="w-5 h-5 mr-2 animate-spin" /> : <SparklesIcon className="w-5 h-5 mr-2" />}
                         {isLoading ? 'Analyzing...' : 'Analyze with AI'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QoEAnalyzer;
