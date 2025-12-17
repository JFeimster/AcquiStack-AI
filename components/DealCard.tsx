import React from 'react';
import { Deal, DealStatus } from '../types';

interface DealCardProps {
    deal: Deal;
    onSelectDeal: (dealId: number) => void;
}

const DealCard: React.FC<DealCardProps> = ({ deal, onSelectDeal }) => {
    const { id, deal_name, status, purchase_price, industry } = deal;

    const statusColors: Record<DealStatus, string> = {
        'Initial Analysis': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
        'Due Diligence': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        'Awaiting Financing': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
        'Closing': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div
            onClick={() => onSelectDeal(id)}
            className="bg-white dark:bg-gray-900 rounded-lg shadow-md hover:shadow-xl hover:ring-2 hover:ring-brand-blue-500 transition-all duration-200 cursor-pointer flex flex-col p-5"
        >
            <div>
                <span className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full ${statusColors[status]}`}>
                    {status}
                </span>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mt-3">{deal_name}</h3>
            </div>
            
            <div className="mt-auto space-y-3 pt-4">
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Purchase Price</p>
                    <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">{formatCurrency(purchase_price)}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Industry</p>
                    <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">{industry}</p>
                </div>
            </div>
        </div>
    );
};

export default DealCard;
