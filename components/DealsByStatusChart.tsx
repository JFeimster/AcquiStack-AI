
import React, { useMemo } from 'react';
import { Deal, DealStatus } from '../types';
import { ChartPieIcon } from './icons';

interface DealsByStatusChartProps {
    deals: Deal[];
}

const statusColors: Record<DealStatus, string> = {
    'Initial Analysis': '#3b82f6', // brand-blue-500
    'Due Diligence': '#f59e0b',   // amber-500
    'Awaiting Financing': '#8b5cf6', // violet-500
    'Closing': '#10b981', // emerald-500
};

const DealsByStatusChart: React.FC<DealsByStatusChartProps> = ({ deals }) => {

    const chartData = useMemo(() => {
        const counts = deals.reduce((acc, deal) => {
            acc[deal.status] = (acc[deal.status] || 0) + 1;
            return acc;
        }, {} as Record<DealStatus, number>);

        return Object.entries(counts).map(([status, count]) => ({
            status: status as DealStatus,
            count,
            color: statusColors[status as DealStatus] || '#6b7280' // gray-500 fallback
        }));
    }, [deals]);

    if (deals.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                    <ChartPieIcon className="w-5 h-5 mr-2" />
                    Deals by Status
                </h2>
                <p className="text-sm text-center text-gray-500 dark:text-gray-400 py-8">No deals to display.</p>
            </div>
        );
    }

    const totalDeals = deals.length;
    let cumulativePercent = 0;

    const segments = chartData.map(data => {
        const percent = (data.count / totalDeals) * 100;
        const segment = { ...data, percent, offset: cumulativePercent };
        cumulativePercent += percent;
        return segment;
    });

    const circumference = 2 * Math.PI * 40; // 2 * pi * radius

    return (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                <ChartPieIcon className="w-5 h-5 mr-2" />
                Deals by Status
            </h2>
            <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative w-40 h-40 flex-shrink-0">
                    <svg viewBox="0 0 100 100" className="transform -rotate-90">
                        <circle cx="50" cy="50" r="40" fill="transparent" stroke="#e5e7eb" strokeWidth="15" className="dark:stroke-gray-700"/>
                        {segments.map(segment => (
                             <circle
                                key={segment.status}
                                cx="50"
                                cy="50"
                                r="40"
                                fill="transparent"
                                stroke={segment.color}
                                strokeWidth="15"
                                strokeDasharray={`${(segment.percent / 100) * circumference} ${circumference}`}
                                strokeDashoffset={-(segment.offset / 100) * circumference}
                            />
                        ))}
                    </svg>
                     <div className="absolute inset-0 flex items-center justify-center flex-col text-center">
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">{totalDeals}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Total Deals</span>
                    </div>
                </div>
                <div className="w-full">
                    <ul className="space-y-2">
                        {chartData.map(item => (
                            <li key={item.status} className="flex justify-between items-center text-sm">
                                <div className="flex items-center">
                                    <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }} />
                                    <span className="text-gray-600 dark:text-gray-300">{item.status}</span>
                                </div>
                                <span className="font-semibold text-gray-800 dark:text-white">{item.count}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default DealsByStatusChart;
