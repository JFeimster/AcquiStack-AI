import React, { useMemo } from 'react';
import { Deal } from '../types';
import { CurrencyDollarIcon } from './icons';

interface PriceDistributionChartProps {
    deals: Deal[];
}

const PriceDistributionChart: React.FC<PriceDistributionChartProps> = ({ deals }) => {

    const chartData = useMemo(() => {
        const brackets = [
            { label: `< $250k`, min: 0, max: 249999, count: 0 },
            { label: `$250k - $1M`, min: 250000, max: 999999, count: 0 },
            { label: `$1M - $2.5M`, min: 1000000, max: 2499999, count: 0 },
            { label: `> $2.5M`, min: 2500000, max: Infinity, count: 0 },
        ];

        deals.forEach(deal => {
            const bracket = brackets.find(b => deal.purchase_price >= b.min && deal.purchase_price <= b.max);
            if (bracket) {
                bracket.count++;
            }
        });

        const maxCount = Math.max(...brackets.map(b => b.count), 0);

        return {
            brackets,
            maxCount: maxCount > 0 ? maxCount : 1, // Avoid division by zero
        };

    }, [deals]);

    return (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md h-full">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                <CurrencyDollarIcon className="w-5 h-5 mr-2" />
                Deals by Purchase Price
            </h2>
            <div className="space-y-4">
                {chartData.brackets.map(bracket => {
                    const percentage = (bracket.count / chartData.maxCount) * 100;
                    return (
                        <div key={bracket.label} className="flex items-center gap-4">
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 w-24 text-right">{bracket.label}</span>
                            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                                <div
                                    className="bg-brand-blue-500 h-4 rounded-full flex items-center justify-end pr-2"
                                    style={{ width: `${percentage}%` }}
                                >
                                    <span className="text-xs font-bold text-white">{bracket.count > 0 ? bracket.count : ''}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PriceDistributionChart;
