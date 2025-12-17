import React, { useState } from 'react';
import { Deal } from '../types';
import { SalesforceIcon } from './icons';

interface CrmConnectButtonProps {
    onDealChange: React.Dispatch<React.SetStateAction<Deal>>;
}

const CrmConnectButton: React.FC<CrmConnectButtonProps> = ({ onDealChange }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleConnect = () => {
        // Simulate pulling data from a Salesforce opportunity
        const crmData = {
            deal_name: "Project Peak (from Salesforce)",
            purchase_type: 'stock' as 'stock',
            industry: 'E-commerce',
            business_location: 'US-based' as 'US-based',
            purchase_price: 2500000,
            revenue_ttm: 1200000,
            ebitda_ttm: 450000,
            working_capital: 100000,
            closing_costs: 40000,
            fees: 25000,
        };

        onDealChange(prevState => ({
            ...prevState,
            ...crmData,
        }));
        setIsModalOpen(false);
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white dark:text-gray-200 dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue-500"
            >
                <SalesforceIcon className="w-5 h-5 mr-2" />
                Connect CRM
            </button>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-md text-center p-8">
                         <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                             <SalesforceIcon className="w-7 h-7 text-blue-600" />
                         </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-4">Connect Your CRM</h3>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                           Connecting your CRM (like Salesforce) allows you to pull deal data directly from your pipeline into AcquiStack AI.
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
                            This avoids manual data entry and ensures consistency. For this demo, we'll populate the form with sample data from a Salesforce opportunity.
                        </p>

                        <div className="mt-6 flex justify-center space-x-3">
                             <button
                                onClick={handleConnect}
                                className="text-white bg-brand-blue-600 hover:bg-brand-blue-700 font-medium rounded-lg text-sm px-5 py-2.5"
                            >
                                Simulate Sync
                            </button>
                             <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-500 bg-white hover:bg-gray-100 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CrmConnectButton;