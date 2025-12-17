
import React, { useState, useMemo } from 'react';
import { IndustryMultipleRange } from '../../types';
import { getIndustryMultiple } from '../../services/geminiService';
import { SpinnerIcon, SparklesIcon } from '../icons';

const BusinessValuationCalculator: React.FC = () => {
    const [sde, setSde] = useState<number | ''>('');
    const [multiple, setMultiple] = useState<number | ''>('');
    const [industry, setIndustry] = useState<string>('SaaS');

    const [isAiLoading, setIsAiLoading] = useState(false);
    const [aiResult, setAiResult] = useState<IndustryMultipleRange | null>(null);
    const [aiError, setAiError] = useState<string | null>(null);

    const estimatedValue = useMemo(() => {
        return Number(sde) * Number(multiple);
    }, [sde, multiple]);

    const handleGetAiSuggestion = async () => {
        if (!industry.trim()) {
            setAiError("Please enter an industry.");
            return;
        }
        setIsAiLoading(true);
        setAiError(null);
        setAiResult(null);
        try {
            const result = await getIndustryMultiple(industry);
            setAiResult(result);
            // set the multiple to the average of the suggested range
            if (result.low && result.high) {
                setMultiple(parseFloat(((result.low + result.high) / 2).toFixed(2)));
            }
        } catch (err) {
            setAiError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsAiLoading(false);
        }
    };
    
    const formatCurrency = (val: number) => {
        if (isNaN(val) || val === 0) return '$0';
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(val);
    };

    const baseInputClasses = "block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-brand-blue-500 focus:border-brand-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-brand-blue-500 dark:focus:border-brand-blue-500";

    return (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Business Valuation Calculator</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Estimate business value using an SDE multiple, common for SBA deals. Use the AI assistant to suggest a multiple for your target industry.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Seller's Discretionary Earnings (SDE) ($)</label>
                    <input type="number" value={sde} onChange={(e) => setSde(e.target.value === '' ? '' : parseFloat(e.target.value))} className={baseInputClasses} placeholder="e.g., 300000" />
                </div>
                 <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Industry Multiple (e.g., 2.5)</label>
                    <input type="number" step="0.1" value={multiple} onChange={(e) => setMultiple(e.target.value === '' ? '' : parseFloat(e.target.value))} className={baseInputClasses} placeholder="e.g., 3.2" />
                </div>
            </div>

            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border dark:border-gray-700">
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Target Industry</label>
                <div className="flex gap-2">
                    <input type="text" value={industry} onChange={(e) => setIndustry(e.target.value)} className={`${baseInputClasses} flex-grow`} placeholder="e.g., Landscaping, E-commerce" />
                    <button onClick={handleGetAiSuggestion} disabled={isAiLoading} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-blue-600 hover:bg-brand-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue-500 disabled:bg-brand-blue-400">
                        {isAiLoading ? <SpinnerIcon className="w-5 h-5 animate-spin" /> : <SparklesIcon className="w-5 h-5" />}
                        <span className="ml-2 hidden sm:inline">Get AI Suggestion</span>
                    </button>
                </div>
                {aiResult && (
                    <div className="mt-3 text-sm text-gray-700 dark:text-gray-300 bg-brand-blue-50 dark:bg-brand-blue-900/50 p-3 rounded-md">
                        <p className="font-semibold">AI Suggestion for {industry}: <span className="text-brand-blue-600 dark:text-brand-blue-400">{aiResult.low}x - {aiResult.high}x</span></p>
                        <p className="text-xs mt-1">{aiResult.explanation}</p>
                    </div>
                )}
                {aiError && <p className="mt-2 text-sm text-red-500">{aiError}</p>}
            </div>

            <div className="mt-6 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">Estimated Business Value</p>
                <div className="mt-1 py-3 px-4 rounded-lg text-3xl font-bold bg-green-50 dark:bg-green-900/50 text-green-800 dark:text-green-300">
                    {formatCurrency(estimatedValue)}
                </div>
            </div>
        </div>
    );
};

export default BusinessValuationCalculator;
