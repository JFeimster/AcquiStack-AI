import React from 'react';
import CrmConnectButton from './CrmConnectButton';
import { Deal } from '../types';
import { DashboardIcon } from './icons';

interface HeaderProps {
  onDealChange: React.Dispatch<React.SetStateAction<Deal>>;
  currentDeal: Deal | null;
  onBackToDashboard: () => void;
}

const Header: React.FC<HeaderProps> = ({ onDealChange, currentDeal, onBackToDashboard }) => {
  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-3">
        {currentDeal ? (
           <button onClick={onBackToDashboard} className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 hover:text-brand-blue-600 dark:hover:text-brand-blue-400">
             <DashboardIcon className="w-5 h-5" />
             <span>Dashboard</span>
           </button>
        ) : (
          <div className="flex items-center space-x-3">
             <svg
              className="w-8 h-8 text-brand-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              ></path>
            </svg>
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">AcquiStack AI</h1>
          </div>
        )}
      </div>
      <div className="flex items-center space-x-4">
        {currentDeal && (
          <>
            <div className="hidden sm:block h-6 w-px bg-gray-200 dark:bg-gray-700"></div>
            <h2 className="hidden sm:block text-lg font-semibold text-gray-700 dark:text-gray-200 truncate">{currentDeal.deal_name}</h2>
          </>
        )}
        {currentDeal && <CrmConnectButton onDealChange={onDealChange} />}
      </div>
    </header>
  );
};

export default Header;