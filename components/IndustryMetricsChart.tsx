import React, { useMemo } from 'react';
import { Deal } from '../types';
import { ChartBarIcon } from './icons';

interface IndustryMetricsChartProps {
    deals: Deal[];
}

const formatCurrency = (amount: number) => {
    if (amount >= 1_000_000) {
        return `$${(amount / 1_000_000).toFixed(1)}M`;
    }
    if (amount >= 1_000) {
        return `$${Math.round(amount / 1_000)}K`;
    }
    return `$${amount.toFixed(0)}`;
};

const IndustryMetricsChart: React.FC<IndustryMetricsChartProps> = ({ deals }) => {

    const chartData = useMemo(() => {
        const industryMap = new Map<string, { total: number; count: number }>();

        deals.forEach(deal => {
            const industry = deal.industry || 'Uncategorized';
            const data = industryMap.get(industry) || { total: 0, count: 0 };
            data.total += deal.purchase_price;
            data.count += 1;
            industryMap.set(industry, data);
        });

        const averages = Array.from(industryMap.entries()).map(([industry, data]) => ({
            industry,
            avgPrice: data.count > 0 ? data.total / data.count : 0,
        }));

        const maxAvg = Math.max(...averages.map(a => a.avgPrice), 0);

        return {
            averages: averages.sort((a,b) => b.avgPrice - a.avgPrice),
            maxAvg: maxAvg > 0 ? maxAvg : 1, // Avoid division by zero
        };

    }, [deals]);

    return (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md h-full">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                <ChartBarIcon className="w-5 h-5 mr-2" />
                Average Deal Size by Industry
            </h2>
            <div className="space-y-4">
                 {chartData.averages.map(item => {
                    const percentage = (item.avgPrice / chartData.maxAvg) * 100;
                    return (
                        <div key={item.industry} className="flex items-center gap-4 text-sm">
                            <span className="font-medium text-gray-600 dark:text-gray-300 w-1/3 truncate" title={item.industry}>
                                {item.industry}
                            </span>
                            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-5 flex items-center">
                                <div
                                    className="bg-teal-500 h-5 rounded-full flex items-center justify-end px-2"
                                    style={{ width: `${percentage}%` }}
                                >
                                     <span className="text-xs font-bold text-white">{formatCurrency(item.avgPrice)}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default IndustryMetricsChart;
