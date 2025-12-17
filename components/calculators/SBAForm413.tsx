
import React, { useState, useMemo } from 'react';
import { PFSData, PFSLineItem } from '../../types';
import { FormIcon, PlusCircleIcon, TrashIcon } from '../icons';

const initialPFSData: PFSData = {
  cashOnHandAndInBanks: '',
  savingsAccounts: '',
  iraOrOtherRetirement: '',
  accountsAndNotesReceivable: '',
  lifeInsuranceCashValue: '',
  stocksAndBonds: [{ id: Date.now(), description: '', amount: '' }],
  realEstate: [{ id: Date.now(), description: '', amount: '' }],
  automobiles: [{ id: Date.now(), description: '', amount: '' }],
  otherPersonalAssets: [{ id: Date.now(), description: '', amount: '' }],
  
  accountsPayable: '',
  notesPayableToBanks: [{ id: Date.now(), description: '', amount: '' }],
  notesPayableToOthers: [{ id: Date.now(), description: '', amount: '' }],
  realEstateMortgages: [{ id: Date.now(), description: '', amount: '' }],
  otherLiabilities: [{ id: Date.now(), description: '', amount: '' }],

  salary: '',
  netInvestmentIncome: '',
  otherIncome: '',

  contingentLiabilities: {
    asEndorser: '',
    legalClaims: '',
    federalTaxes: '',
    other: '',
  }
};

const AccordionSection: React.FC<{ title: string; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
            <button type="button" className="flex items-center justify-between w-full p-4 font-semibold text-left" onClick={() => setIsOpen(!isOpen)}>
                <span>{title}</span>
                <svg className={`w-5 h-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
            </button>
            {isOpen && <div className="p-4 border-t border-gray-200 dark:border-gray-700">{children}</div>}
        </div>
    );
};

const SBAForm413: React.FC = () => {
    const [pfsData, setPfsData] = useState<PFSData>(initialPFSData);
    const baseInputClasses = "block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-brand-blue-500 focus:border-brand-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-brand-blue-500 dark:focus:border-brand-blue-500 p-2.5";

    const handleSimpleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const keys = name.split('.');
        const finalValue = value === '' ? '' : parseFloat(value);
        
        if (keys.length > 1) {
            setPfsData(prev => ({
                ...prev,
                [keys[0]]: {
                    ...(prev as any)[keys[0]],
                    [keys[1]]: finalValue
                }
            }));
        } else {
            setPfsData(prev => ({...prev, [name]: finalValue}));
        }
    };
    
    const handleDynamicListChange = (
        listName: keyof PFSData, 
        id: number, 
        field: 'description' | 'amount', 
        value: string
    ) => {
        setPfsData(prev => ({
            ...prev,
            [listName]: (prev[listName] as PFSLineItem[]).map(item =>
                item.id === id 
                ? { ...item, [field]: field === 'amount' ? (value === '' ? '' : parseFloat(value)) : value }
                : item
            )
        }));
    };

    const addDynamicListItem = (listName: keyof PFSData) => {
        setPfsData(prev => ({
            ...prev,
            [listName]: [...(prev[listName] as PFSLineItem[]), { id: Date.now(), description: '', amount: '' }]
        }));
    };

    const removeDynamicListItem = (listName: keyof PFSData, id: number) => {
        setPfsData(prev => ({
            ...prev,
            [listName]: (prev[listName] as PFSLineItem[]).filter(item => item.id !== id)
        }));
    };
    
    const totals = useMemo(() => {
        const sumList = (list: PFSLineItem[]) => list.reduce((sum, item) => sum + Number(item.amount), 0);
        
        const totalAssets = Number(pfsData.cashOnHandAndInBanks) + Number(pfsData.savingsAccounts) + Number(pfsData.iraOrOtherRetirement) + Number(pfsData.accountsAndNotesReceivable) + Number(pfsData.lifeInsuranceCashValue) +
            sumList(pfsData.stocksAndBonds) + sumList(pfsData.realEstate) + sumList(pfsData.automobiles) + sumList(pfsData.otherPersonalAssets);
        
        const totalLiabilities = Number(pfsData.accountsPayable) +
            sumList(pfsData.notesPayableToBanks) + sumList(pfsData.notesPayableToOthers) + sumList(pfsData.realEstateMortgages) + sumList(pfsData.otherLiabilities);
            
        const netWorth = totalAssets - totalLiabilities;

        return { totalAssets, totalLiabilities, netWorth };
    }, [pfsData]);

    const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(val);
    
    const DynamicListInput: React.FC<{listName: keyof PFSData, title: string}> = ({ listName, title }) => (
        <div className="space-y-2">
             <h4 className="font-semibold text-gray-800 dark:text-white">{title}</h4>
            {(pfsData[listName] as PFSLineItem[]).map(item => (
                <div key={item.id} className="flex items-center gap-2">
                    <input type="text" placeholder="Description" value={item.description} onChange={e => handleDynamicListChange(listName, item.id, 'description', e.target.value)} className={`${baseInputClasses} flex-grow`} />
                    <input type="number" placeholder="Amount ($)" value={item.amount} onChange={e => handleDynamicListChange(listName, item.id, 'amount', e.target.value)} className={`${baseInputClasses} w-40`} />
                    <button type="button" onClick={() => removeDynamicListItem(listName, item.id)} className="text-gray-400 hover:text-red-500"><TrashIcon className="w-5 h-5" /></button>
                </div>
            ))}
            <button type="button" onClick={() => addDynamicListItem(listName)} className="mt-1 text-sm text-brand-blue-600 dark:text-brand-blue-400 font-medium flex items-center"><PlusCircleIcon className="w-4 h-4 mr-1" /> Add Item</button>
        </div>
    );
    
    return (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-1">
                <FormIcon className="w-8 h-8 text-brand-blue-600 dark:text-brand-blue-400 mr-3" />
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">SBA Personal Financial Statement (Form 413)</h2>
                </div>
            </div>
            <p className="text-gray-500 dark:text-gray-400 mb-6 ml-11">A digital worksheet to prepare your personal financial statement for an SBA loan application.</p>

            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border dark:border-gray-700 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div><span className="text-sm text-gray-500 dark:text-gray-400 block">Total Assets</span><span className="text-2xl font-bold text-green-600 dark:text-green-400">{formatCurrency(totals.totalAssets)}</span></div>
                <div><span className="text-sm text-gray-500 dark:text-gray-400 block">Total Liabilities</span><span className="text-2xl font-bold text-red-600 dark:text-red-400">{formatCurrency(totals.totalLiabilities)}</span></div>
                <div><span className="text-sm text-gray-500 dark:text-gray-400 block">Net Worth</span><span className="text-2xl font-bold text-brand-blue-600 dark:text-brand-blue-400">{formatCurrency(totals.netWorth)}</span></div>
            </div>

            <div className="space-y-4">
                <AccordionSection title="Assets" defaultOpen>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                             <div><label className="text-sm font-medium">Cash on Hand & In Banks ($)</label><input type="number" name="cashOnHandAndInBanks" value={pfsData.cashOnHandAndInBanks} onChange={handleSimpleChange} className={baseInputClasses}/></div>
                            <div><label className="text-sm font-medium">Savings Accounts ($)</label><input type="number" name="savingsAccounts" value={pfsData.savingsAccounts} onChange={handleSimpleChange} className={baseInputClasses}/></div>
                            <div><label className="text-sm font-medium">IRA or Other Retirement Account ($)</label><input type="number" name="iraOrOtherRetirement" value={pfsData.iraOrOtherRetirement} onChange={handleSimpleChange} className={baseInputClasses}/></div>
                            <div><label className="text-sm font-medium">Accounts & Notes Receivable ($)</label><input type="number" name="accountsAndNotesReceivable" value={pfsData.accountsAndNotesReceivable} onChange={handleSimpleChange} className={baseInputClasses}/></div>
                            <div><label className="text-sm font-medium">Cash Surrender Value of Life Insurance ($)</label><input type="number" name="lifeInsuranceCashValue" value={pfsData.lifeInsuranceCashValue} onChange={handleSimpleChange} className={baseInputClasses}/></div>
                        </div>
                        <div className="space-y-6">
                           <DynamicListInput listName="stocksAndBonds" title="Stocks and Bonds" />
                           <DynamicListInput listName="realEstate" title="Real Estate" />
                           <DynamicListInput listName="automobiles" title="Automobile(s)" />
                           <DynamicListInput listName="otherPersonalAssets" title="Other Personal Assets" />
                        </div>
                    </div>
                </AccordionSection>
                 <AccordionSection title="Liabilities">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div><label className="text-sm font-medium">Accounts Payable ($)</label><input type="number" name="accountsPayable" value={pfsData.accountsPayable} onChange={handleSimpleChange} className={baseInputClasses}/></div>
                             <DynamicListInput listName="notesPayableToBanks" title="Notes Payable to Banks" />
                             <DynamicListInput listName="notesPayableToOthers" title="Notes Payable to Others" />
                        </div>
                        <div className="space-y-6">
                           <DynamicListInput listName="realEstateMortgages" title="Mortgages on Real Estate" />
                           <DynamicListInput listName="otherLiabilities" title="Other Liabilities" />
                        </div>
                    </div>
                </AccordionSection>
                <AccordionSection title="Source of Income & Contingent Liabilities">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-4">
                            <h4 className="font-semibold text-gray-800 dark:text-white">Annual Income</h4>
                            <div><label className="text-sm font-medium">Salary ($)</label><input type="number" name="salary" value={pfsData.salary} onChange={handleSimpleChange} className={baseInputClasses}/></div>
                            <div><label className="text-sm font-medium">Net Investment Income ($)</label><input type="number" name="netInvestmentIncome" value={pfsData.netInvestmentIncome} onChange={handleSimpleChange} className={baseInputClasses}/></div>
                            <div><label className="text-sm font-medium">Other Income ($)</label><input type="number" name="otherIncome" value={pfsData.otherIncome} onChange={handleSimpleChange} className={baseInputClasses}/></div>
                        </div>
                         <div className="space-y-4">
                            <h4 className="font-semibold text-gray-800 dark:text-white">Contingent Liabilities</h4>
                            <div><label className="text-sm font-medium">As Endorser or Co-Maker ($)</label><input type="number" name="contingentLiabilities.asEndorser" value={pfsData.contingentLiabilities.asEndorser} onChange={handleSimpleChange} className={baseInputClasses}/></div>
                            <div><label className="text-sm font-medium">On Legal Claims & Judgments ($)</label><input type="number" name="contingentLiabilities.legalClaims" value={pfsData.contingentLiabilities.legalClaims} onChange={handleSimpleChange} className={baseInputClasses}/></div>
                            <div><label className="text-sm font-medium">Provision for Federal Income Tax ($)</label><input type="number" name="contingentLiabilities.federalTaxes" value={pfsData.contingentLiabilities.federalTaxes} onChange={handleSimpleChange} className={baseInputClasses}/></div>
                            <div><label className="text-sm font-medium">Other Special Debt ($)</label><input type="number" name="contingentLiabilities.other" value={pfsData.contingentLiabilities.other} onChange={handleSimpleChange} className={baseInputClasses}/></div>
                        </div>
                    </div>
                </AccordionSection>
            </div>
        </div>
    );
};

export default SBAForm413;
