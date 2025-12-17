import React, { useState, useMemo } from 'react';

const DSCRCalculator: React.FC = () => {
    const [ebitda, setEbitda] = useState<number | ''>('');
    const [capex, setCapex] = useState<number | ''>('');
    const [debtService, setDebtService] = useState<number | ''>('');

    const dscr = useMemo(() => {
        const numEbitda = Number(ebitda);
        const numCapex = Number(capex);
        const numDebtService = Number(debtService);

        if (numDebtService > 0) {
            return (numEbitda - numCapex) / numDebtService;
        }
        return 0;
    }, [ebitda, capex, debtService]);

    const getResultUI = () => {
        if (!ebitda || !debtService) {
            return {
                text: 'Enter values to calculate DSCR',
                bgColor: 'bg-gray-100 dark:bg-gray-700',
                textColor: 'text-gray-800 dark:text-gray-200',
            };
        }
        if (dscr >= 1.25) {
            return {
                text: `${dscr.toFixed(2)}x - Healthy`,
                bgColor: 'bg-green-100 dark:bg-green-900',
                textColor: 'text-green-800 dark:text-green-300',
            };
        }
        if (dscr >= 1.0) {
            return {
                text: `${dscr.toFixed(2)}x - Risky`,
                bgColor: 'bg-yellow-100 dark:bg-yellow-900',
                textColor: 'text-yellow-800 dark:text-yellow-300',
            };
        }
        return {
            text: `${dscr.toFixed(2)}x - Unacceptable`,
            bgColor: 'bg-red-100 dark:bg-red-900',
            textColor: 'text-red-800 dark:text-red-300',
        };
    };

    const resultUI = getResultUI();
    const baseInputClasses = "block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-brand-blue-500 focus:border-brand-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-brand-blue-500 dark:focus:border-brand-blue-500";

    return (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">DSCR Calculator</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Calculate the Debt Service Coverage Ratio to assess the ability to repay debt. Lenders typically require a DSCR of 1.25x or higher.</p>
            
            <div className="space-y-4">
                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">EBITDA / SDE ($)</label>
                    <input type="number" value={ebitda} onChange={(e) => setEbitda(e.target.value === '' ? '' : parseFloat(e.target.value))} className={baseInputClasses} placeholder="e.g., 250000" />
                </div>
                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Annual CAPEX ($) <span className="text-gray-400">(optional)</span></label>
                    <input type="number" value={capex} onChange={(e) => setCapex(e.target.value === '' ? '' : parseFloat(e.target.value))} className={baseInputClasses} placeholder="e.g., 15000" />
                </div>
                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Annual Debt Service ($)</label>
                    <input type="number" value={debtService} onChange={(e) => setDebtService(e.target.value === '' ? '' : parseFloat(e.target.value))} className={baseInputClasses} placeholder="e.g., 180000" />
                </div>
            </div>

            <div className="mt-6 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">Calculated DSCR</p>
                <div className={`mt-1 py-3 px-4 rounded-lg text-2xl font-bold transition-colors ${resultUI.bgColor} ${resultUI.textColor}`}>
                    {resultUI.text}
                </div>
            </div>
        </div>
    );
};

export default DSCRCalculator;
