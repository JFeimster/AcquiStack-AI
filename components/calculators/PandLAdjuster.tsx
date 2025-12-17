import React, { useState, useMemo } from 'react';
import { TrashIcon, PlusCircleIcon } from '../icons';

type LineItem = {
    id: number;
    name: string;
    amount: number | '';
};

const PandLAdjuster: React.FC = () => {
    const [revenue, setRevenue] = useState<number | ''>('');
    const [cogs, setCogs] = useState<number | ''>('');
    const [expenses, setExpenses] = useState<LineItem[]>([{ id: Date.now(), name: 'Rent', amount: '' }]);
    const [addBacks, setAddBacks] = useState<LineItem[]>([{ id: Date.now(), name: "Owner's Salary", amount: '' }]);

    const handleItemChange = (
        id: number, 
        field: 'name' | 'amount', 
        value: string, 
        setter: React.Dispatch<React.SetStateAction<LineItem[]>>
    ) => {
        setter(prev => prev.map(item => 
            item.id === id 
                ? { ...item, [field]: field === 'amount' ? (value === '' ? '' : parseFloat(value)) : value } 
                : item
        ));
    };

    const addItem = (setter: React.Dispatch<React.SetStateAction<LineItem[]>>) => {
        setter(prev => [...prev, { id: Date.now(), name: '', amount: '' }]);
    };
    
    const removeItem = (id: number, setter: React.Dispatch<React.SetStateAction<LineItem[]>>) => {
        setter(prev => prev.filter(item => item.id !== id));
    };

    const calculations = useMemo(() => {
        const numRevenue = Number(revenue);
        const numCogs = Number(cogs);
        const grossProfit = numRevenue - numCogs;
        const totalExpenses = expenses.reduce((sum, item) => sum + Number(item.amount), 0);
        const netOperatingIncome = grossProfit - totalExpenses;
        const totalAddBacks = addBacks.reduce((sum, item) => sum + Number(item.amount), 0);
        const sde = netOperatingIncome + totalAddBacks;
        return { grossProfit, totalExpenses, netOperatingIncome, totalAddBacks, sde };
    }, [revenue, cogs, expenses, addBacks]);

    const formatCurrency = (val: number | '') => {
        if (val === '' || isNaN(Number(val))) return '$0';
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(Number(val));
    };
    
    const baseInputClasses = "block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-brand-blue-500 focus:border-brand-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-brand-blue-500 dark:focus:border-brand-blue-500";
    const lineItemInputClasses = "text-sm text-gray-900 bg-gray-50 rounded-md border border-gray-300 focus:ring-brand-blue-500 focus:border-brand-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white";

    return (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">P&L Adjuster (SDE Calculator)</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Normalize a Profit & Loss statement by adding back discretionary expenses to find the Seller's Discretionary Earnings (SDE).</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Inputs */}
                <div className="space-y-4">
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Total Revenue ($)</label>
                        <input type="number" value={revenue} onChange={e => setRevenue(e.target.value === '' ? '' : parseFloat(e.target.value))} className={baseInputClasses} placeholder="e.g., 1000000" />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Cost of Goods Sold (COGS) ($)</label>
                        <input type="number" value={cogs} onChange={e => setCogs(e.target.value === '' ? '' : parseFloat(e.target.value))} className={baseInputClasses} placeholder="e.g., 400000" />
                    </div>
                    
                    <div className="pt-2">
                        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Operating Expenses</label>
                        <div className="space-y-2">
                            {expenses.map(exp => (
                                <div key={exp.id} className="flex items-center gap-2">
                                    <input type="text" placeholder="Expense Name" value={exp.name} onChange={e => handleItemChange(exp.id, 'name', e.target.value, setExpenses)} className={`${lineItemInputClasses} flex-grow p-2`} />
                                    <input type="number" placeholder="Amount" value={exp.amount} onChange={e => handleItemChange(exp.id, 'amount', e.target.value, setExpenses)} className={`${lineItemInputClasses} w-32 p-2`} />
                                    <button onClick={() => removeItem(exp.id, setExpenses)} className="text-gray-400 hover:text-red-500"><TrashIcon className="w-4 h-4" /></button>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => addItem(setExpenses)} className="mt-2 text-sm text-brand-blue-600 dark:text-brand-blue-400 font-medium flex items-center"><PlusCircleIcon className="w-4 h-4 mr-1" /> Add Expense</button>
                    </div>

                     <div className="pt-2">
                        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Owner Add-Backs</label>
                        <div className="space-y-2">
                           {addBacks.map(ab => (
                                <div key={ab.id} className="flex items-center gap-2">
                                    <input type="text" placeholder="Add-Back Name" value={ab.name} onChange={e => handleItemChange(ab.id, 'name', e.target.value, setAddBacks)} className={`${lineItemInputClasses} flex-grow p-2`} />
                                    <input type="number" placeholder="Amount" value={ab.amount} onChange={e => handleItemChange(ab.id, 'amount', e.target.value, setAddBacks)} className={`${lineItemInputClasses} w-32 p-2`} />
                                    <button onClick={() => removeItem(ab.id, setAddBacks)} className="text-gray-400 hover:text-red-500"><TrashIcon className="w-4 h-4" /></button>
                                </div>
                            ))}
                        </div>
                         <button onClick={() => addItem(setAddBacks)} className="mt-2 text-sm text-brand-blue-600 dark:text-brand-blue-400 font-medium flex items-center"><PlusCircleIcon className="w-4 h-4 mr-1" /> Add Add-Back</button>
                    </div>
                </div>

                {/* Results */}
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg space-y-2 text-sm">
                    <div className="flex justify-between"><span>Gross Profit</span><span className="font-semibold">{formatCurrency(calculations.grossProfit)}</span></div>
                    <div className="flex justify-between"><span>Total OpEx</span><span className="font-semibold text-red-600 dark:text-red-400">({formatCurrency(calculations.totalExpenses)})</span></div>
                    <hr className="dark:border-gray-700" />
                    <div className="flex justify-between font-bold"><span>Net Operating Income</span><span>{formatCurrency(calculations.netOperatingIncome)}</span></div>
                    <div className="flex justify-between"><span>Total Add-Backs</span><span className="font-semibold text-green-600 dark:text-green-400">{formatCurrency(calculations.totalAddBacks)}</span></div>
                    <hr className="dark:border-gray-700" />
                    <div className="flex justify-between text-lg font-bold pt-2 text-brand-blue-800 dark:text-brand-blue-300 bg-brand-blue-50 dark:bg-brand-blue-900/50 -mx-4 -mb-4 px-4 py-3 rounded-b-lg">
                        <span>Seller's Discretionary Earnings (SDE)</span>
                        <span>{formatCurrency(calculations.sde)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PandLAdjuster;
