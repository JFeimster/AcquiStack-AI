import React, { useState, useMemo, useEffect } from 'react';
import { AgentModule, Deal } from '../types';
import { LiveFinancialsIcon, LiveLiquidityIcon, SpinnerIcon } from './icons';

interface LiveDataAgentModalProps {
  agent: AgentModule;
  isOpen: boolean;
  onClose: () => void;
  onUpdateDeal: React.Dispatch<React.SetStateAction<Deal>>;
  setToastMessage: (message: string) => void;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

const BankLogo: React.FC<{ name: string }> = ({ name }) => (
    <div className="w-16 h-10 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
        {name}
    </div>
);


const LiveDataAgentModal: React.FC<LiveDataAgentModalProps> = ({ agent, isOpen, onClose, onUpdateDeal, setToastMessage }) => {
  const [step, setStep] = useState<'connect' | 'connecting' | 'review'>('connect');

  // Reset step when modal is opened
  useEffect(() => {
    if (isOpen) {
        setStep('connect');
    }
  }, [isOpen]);

  const config = useMemo(() => {
    if (agent.id === 'live_liquidity_agent') {
      return {
        title: 'Connect with Plaid',
        description: 'AcquiStack AI uses Plaid to securely connect to your financial accounts. This provides real-time, verified liquidity data to the AI agents.',
        Icon: LiveLiquidityIcon,
        buttonText: 'Continue',
        reviewTitle: 'Review Verified Liquidity',
        reviewData: [
            { label: 'Cash (Checking & Savings)', value: 125400 },
            { label: 'Investments (Brokerage)', value: 210850 },
            { label: 'Certificates of Deposit (CDs)', value: 50000 },
        ],
        updateFn: () => {
          onUpdateDeal(prev => ({
            ...prev,
            borrower_profile: {
                ...prev.borrower_profile,
                liquidity: {
                    ...prev.borrower_profile.liquidity,
                    cash: 125400,
                    brokerage: 210850,
                    cds: 50000,
                }
            }
          }));
        }
      };
    } else { // live_financials_agent
      return {
        title: 'Sync with QuickBooks',
        description: 'Connecting to the target\'s accounting software provides the most accurate and up-to-date financial data. This ensures the AI agents\' analysis is based on verified numbers.',
        Icon: LiveFinancialsIcon,
        buttonText: 'Continue',
        reviewTitle: 'Review Verified Financials (TTM)',
        reviewData: [
            { label: 'TTM Revenue', value: 620000 },
            { label: 'TTM EBITDA', value: 185000 },
        ],
        updateFn: () => {
            onUpdateDeal(prev => ({
                ...prev,
                revenue_ttm: 620000,
                ebitda_ttm: 185000,
            }));
        }
      };
    }
  }, [agent.id, onUpdateDeal]);

  if (!isOpen) return null;

  const handleConnect = () => {
    setStep('connecting');
    setTimeout(() => {
        setStep('review');
    }, 2500); // Simulate connection time
  };
  
  const handleUpdate = () => {
    config.updateFn();
    setToastMessage(`Data from ${agent.title} synced successfully.`);
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-brand-blue-100 dark:bg-brand-blue-900 flex items-center justify-center">
                    <agent.Icon className="w-5 h-5 text-brand-blue-600 dark:text-brand-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{agent.title}</h3>
            </div>
            <button type="button" onClick={handleClose} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
            </button>
        </div>

        {step === 'connect' && (
            <div className="p-8 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-brand-blue-100 dark:bg-brand-blue-900">
                    <config.Icon className="w-6 h-6 text-brand-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-4">{config.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">{config.description}</p>
                
                {agent.id === 'live_liquidity_agent' && (
                    <div className="mt-6">
                        <p className="text-xs text-gray-400 dark:text-gray-500 mb-2 uppercase font-semibold">Connect an account from providers like</p>
                        <div className="flex justify-center gap-3">
                            <BankLogo name="Chase" />
                            <BankLogo name="BofA" />
                            <BankLogo name="Wells" />
                            <BankLogo name="Citi" />
                        </div>
                    </div>
                )}

                <div className="mt-8 flex flex-col items-center">
                    <button onClick={handleConnect} className="w-full text-white bg-brand-blue-600 hover:bg-brand-blue-700 font-medium rounded-lg text-sm px-5 py-2.5">
                        {config.buttonText}
                    </button>
                    <button onClick={handleClose} className="mt-2 text-sm text-gray-500 dark:text-gray-400 hover:underline">
                        Cancel
                    </button>
                </div>
                 <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">By selecting "Continue" you agree to the Plaid End User Privacy Policy. This is a simulation.</p>
            </div>
        )}

        {step === 'connecting' && (
            <div className="p-8 text-center h-64 flex flex-col items-center justify-center">
                <SpinnerIcon className="w-8 h-8 text-brand-blue-500 animate-spin" />
                <p className="mt-4 text-gray-600 dark:text-gray-300">Connecting securely...</p>
            </div>
        )}

        {step === 'review' && (
             <div className="p-8">
                <h3 className="text-xl font-semibold text-center text-gray-900 dark:text-white mb-4">{config.reviewTitle}</h3>
                <div className="space-y-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 p-4 border dark:border-gray-600">
                    {config.reviewData.map(item => (
                        <div key={item.label} className="flex justify-between items-center">
                            <span className="text-gray-600 dark:text-gray-300">{item.label}</span>
                            <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(item.value)}</span>
                        </div>
                    ))}
                </div>
                <p className="text-xs text-center text-gray-500 mt-4">This verified data will update the corresponding fields in your deal information form.</p>
                 <div className="mt-6 flex justify-center space-x-3">
                    <button onClick={handleUpdate} className="w-full text-white bg-brand-blue-600 hover:bg-brand-blue-700 font-medium rounded-lg text-sm px-5 py-2.5">
                        Update Deal Info & Close
                    </button>
                </div>
             </div>
        )}
      </div>
    </div>
  );
};

export default LiveDataAgentModal;
