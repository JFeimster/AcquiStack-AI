
import React, { useMemo } from 'react';
import { Deal } from '../types';
import { ChartBarIcon, CurrencyDollarIcon, CollectionIcon, ClipboardCheckIcon } from './icons';

interface DashboardMetricsProps {
    deals: Deal[];
}

const formatCurrency = (amount: number) => {
    if (amount >= 1_000_000) {
        return `$${(amount / 1_000_000).toFixed(1)}M`;
    }
    if (amount >= 1_000) {
        return `$${Math.round(amount / 1_000)}K`;
    }
    return `$${amount}`;
};

const MetricCard: React.FC<{ title: string; value: string | number; Icon: React.FC<{className?:string}> }> = ({ title, value, Icon }) => (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md flex-1 min-w-[200px]">
        <div className="flex items-center">
            <div className="p-2 bg-brand-blue-100 dark:bg-gray-800 rounded-md mr-4">
                <Icon className="w-6 h-6 text-brand-blue-600 dark:text-brand-blue-400"/>
            </div>
            <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{title}</h3>
                <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
            </div>
        </div>
    </div>
);


const DashboardMetrics: React.FC<DashboardMetricsProps> = ({ deals }) => {
    const metrics = useMemo(() => {
        const totalDeals = deals.length;
        const totalValue = deals.reduce((sum, deal) => sum + deal.purchase_price, 0);
        const avgDealSize = totalDeals > 0 ? totalValue / totalDeals : 0;
        const dueDiligenceCount = deals.filter(deal => deal.status === 'Due Diligence').length;

        return {
            totalDeals,
            totalValue: formatCurrency(totalValue),
            avgDealSize: formatCurrency(avgDealSize),
            dueDiligenceCount
        };
    }, [deals]);

    return (
        <div className="flex flex-wrap gap-6">
            <MetricCard title="Total Deals" value={metrics.totalDeals} Icon={CollectionIcon} />
            <MetricCard title="Total Pipeline Value" value={metrics.totalValue} Icon={CurrencyDollarIcon} />
            <MetricCard title="Average Deal Size" value={metrics.avgDealSize} Icon={ChartBarIcon} />
            <MetricCard title="In Due Diligence" value={metrics.dueDiligenceCount} Icon={ClipboardCheckIcon} />
        </div>
    );
};

export default DashboardMetrics;
