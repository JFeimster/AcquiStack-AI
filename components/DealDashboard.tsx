import React, { useState, useMemo } from 'react';
import { Deal, DealStatus, Task } from '../types';
import DealCard from './DealCard';
import { PlusCircleIcon } from './icons';
import DashboardMetrics from './DashboardMetrics';
import DealsByStatusChart from './DealsByStatusChart';
import UpcomingTasks from './UpcomingTasks';
import PriceDistributionChart from './PriceDistributionChart';
import IndustryMetricsChart from './IndustryMetricsChart';

interface DealDashboardProps {
    deals: Deal[];
    tasks: Task[];
    onSelectDeal: (dealId: number) => void;
    onCreateNewDeal: () => void;
}

const DealDashboard: React.FC<DealDashboardProps> = ({ deals, tasks, onSelectDeal, onCreateNewDeal }) => {
    const [statusFilter, setStatusFilter] = useState<DealStatus | 'all'>('all');
    const [sortBy, setSortBy] = useState<'deal_name' | 'purchase_price' | 'status'>('deal_name');

    const filteredAndSortedDeals = useMemo(() => {
        let processedDeals = [...deals];

        // Filter
        if (statusFilter !== 'all') {
            processedDeals = processedDeals.filter(deal => deal.status === statusFilter);
        }

        // Sort
        processedDeals.sort((a, b) => {
            if (sortBy === 'purchase_price') {
                 return b.purchase_price - a.purchase_price;
            }
            if (a[sortBy] < b[sortBy]) return -1;
            if (a[sortBy] > b[sortBy]) return 1;
            return 0;
        });

        return processedDeals;
    }, [deals, statusFilter, sortBy]);

    const dealStatuses: DealStatus[] = ['Initial Analysis', 'Due Diligence', 'Awaiting Financing', 'Closing'];

    return (
        <div className="space-y-8">
            <div className="flex flex-wrap gap-4 justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Deal Dashboard</h1>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">Manage your acquisition pipeline at a glance.</p>
                </div>
                <button
                    onClick={onCreateNewDeal}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-blue-600 hover:bg-brand-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue-500"
                >
                    <PlusCircleIcon className="w-5 h-5 mr-2" />
                    Create New Deal
                </button>
            </div>

            <DashboardMetrics deals={deals} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <PriceDistributionChart deals={deals} />
                <IndustryMetricsChart deals={deals} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
                        <div className="flex flex-wrap gap-4 justify-between items-center mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Deals Pipeline</h2>
                            <div className="flex flex-wrap gap-4">
                                <div>
                                    <label htmlFor="status-filter" className="sr-only">Filter by status</label>
                                    <select
                                        id="status-filter"
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value as DealStatus | 'all')}
                                        className="text-sm rounded-md border-gray-300 shadow-sm focus:border-brand-blue-500 focus:ring-brand-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                    >
                                        <option value="all">All Statuses</option>
                                        {dealStatuses.map(status => <option key={status} value={status}>{status}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="sort-by" className="sr-only">Sort by</label>
                                    <select
                                        id="sort-by"
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value as 'deal_name' | 'purchase_price' | 'status')}
                                        className="text-sm rounded-md border-gray-300 shadow-sm focus:border-brand-blue-500 focus:ring-brand-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                    >
                                        <option value="deal_name">Sort by Name</option>
                                        <option value="purchase_price">Sort by Price</option>
                                        <option value="status">Sort by Status</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {filteredAndSortedDeals.length > 0 ? (
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {filteredAndSortedDeals.map(deal => (
                                    <DealCard key={deal.id} deal={deal} onSelectDeal={onSelectDeal} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-gray-500 dark:text-gray-400">No deals match the current filters.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-8">
                    <DealsByStatusChart deals={deals} />
                    <UpcomingTasks tasks={tasks} />
                </div>
            </div>
        </div>
    );
};

export default DealDashboard;