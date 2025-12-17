
import React, { useState, useMemo } from 'react';
import { AffiliateLender, Deal, LenderRecommendation } from '../types';
import { getLenderMatches } from '../services/geminiService';
import { LenderMatchAIIcon, SparklesIcon, SpinnerIcon } from './icons';

interface FundingMarketplaceProps {
    lenders: AffiliateLender[];
    currentDeal: Deal;
}

const LenderCard: React.FC<{ lender: AffiliateLender; isRecommended: boolean; recommendationReason?: string; }> = ({ lender, isRecommended, recommendationReason }) => {
    return (
        <div className={`bg-white dark:bg-gray-800/70 rounded-lg shadow-md flex flex-col transition-all duration-300 ${isRecommended ? 'ring-2 ring-brand-blue-500 shadow-xl' : 'hover:shadow-lg'}`}>
            {isRecommended && (
                <div className="px-4 py-1 bg-brand-blue-500 text-white text-xs font-bold rounded-t-lg flex items-center">
                    <SparklesIcon className="w-4 h-4 mr-1.5" />
                    AI Recommended
                </div>
            )}
            <div className="p-5 flex-grow flex flex-col">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">{lender.name}</h3>
                <p className="text-sm font-semibold text-brand-blue-600 dark:text-brand-blue-400 mb-3">{lender.fundingAmount}</p>

                {isRecommended && recommendationReason && (
                     <div className="mb-4 p-3 bg-brand-blue-50 dark:bg-gray-700/50 rounded-md border border-brand-blue-200 dark:border-brand-blue-900">
                        <p className="text-xs font-semibold text-brand-blue-800 dark:text-brand-blue-300 mb-1">AI's Reason:</p>
                        <p className="text-xs text-brand-blue-700 dark:text-brand-blue-300">{recommendationReason}</p>
                    </div>
                )}
               
                <div className="text-xs text-gray-600 dark:text-gray-400 space-y-2 flex-grow">
                    <div>
                        <p className="font-semibold mb-1">Requirements:</p>
                        <ul className="list-disc list-inside space-y-0.5">
                            {lender.requirements.map((req, i) => <li key={i}>{req}</li>)}
                        </ul>
                    </div>
                     <div>
                        <p className="font-semibold mb-1 mt-2">Best For:</p>
                        <div className="flex flex-wrap gap-1">
                            {[...lender.targetIndustries, ...lender.financingTypes].map((tag, i) => (
                                <span key={i} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">{tag}</span>
                            ))}
                        </div>
                    </div>
                </div>

                <a
                    href={lender.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 block w-full text-sm text-white bg-brand-blue-600 hover:bg-brand-blue-700 focus:ring-4 focus:outline-none focus:ring-brand-blue-300 font-medium rounded-lg px-4 py-2.5 text-center dark:bg-brand-blue-500 dark:hover:bg-brand-blue-600 dark:focus:ring-brand-blue-800 transition-colors"
                >
                    Apply Now
                </a>
            </div>
        </div>
    );
};


const FundingMarketplace: React.FC<FundingMarketplaceProps> = ({ lenders, currentDeal }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [recommendations, setRecommendations] = useState<LenderRecommendation[]>([]);

    const handleFindMatches = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const matches = await getLenderMatches(currentDeal, lenders);
            setRecommendations(matches);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const sortedLenders = useMemo(() => {
        if (recommendations.length === 0) {
            return lenders;
        }

        const recommendedIds = new Set(recommendations.map(r => r.lenderId));
        const recommended = lenders.filter(l => recommendedIds.has(l.id));
        const others = lenders.filter(l => !recommendedIds.has(l.id));

        // Sort recommended lenders according to the AI's order
        recommended.sort((a, b) => {
            const indexA = recommendations.findIndex(r => r.lenderId === a.id);
            const indexB = recommendations.findIndex(r => r.lenderId === b.id);
            return indexA - indexB;
        });

        return [...recommended, ...others];
    }, [lenders, recommendations]);


    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
                <div className="flex flex-wrap gap-4 justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Funding Marketplace</h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Explore affiliate funding partners or use AI to find the perfect match for your deal.</p>
                    </div>
                    <button
                        onClick={handleFindMatches}
                        disabled={isLoading}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-blue-600 hover:bg-brand-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue-500 disabled:bg-brand-blue-400 disabled:cursor-wait"
                    >
                        {isLoading ? 
                            <SpinnerIcon className="w-5 h-5 mr-2 animate-spin" /> : 
                            <LenderMatchAIIcon className="w-5 h-5 mr-2" />
                        }
                        {isLoading ? 'Analyzing...' : 'Find Best Matches with AI'}
                    </button>
                </div>
                 {error && (
                    <div className="mt-4 p-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-900 dark:text-red-400" role="alert">
                        <span className="font-medium">Error:</span> {error}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedLenders.map(lender => {
                    const recommendation = recommendations.find(r => r.lenderId === lender.id);
                    return (
                        <LenderCard 
                            key={lender.id} 
                            lender={lender} 
                            isRecommended={!!recommendation}
                            recommendationReason={recommendation?.reason}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default FundingMarketplace;
