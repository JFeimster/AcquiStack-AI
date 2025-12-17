
import React, { ChangeEvent, useState } from 'react';
import { Deal, ThirdPartyEquity } from '../types';
import { PlusCircleIcon, TrashIcon } from './icons';

interface DealInfoFormProps {
  deal: Deal;
  onDealChange: React.Dispatch<React.SetStateAction<Deal>>;
}

// Reusable Accordion Component for a compact layout
const AccordionSection: React.FC<{ title: string; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const uniqueId = title.replace(/\s+/g, '-').toLowerCase();

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden transition-all duration-300">
      <h2 id={`accordion-heading-${uniqueId}`}>
        <button
          type="button"
          className="flex items-center justify-between w-full p-4 font-semibold text-left text-gray-800 dark:text-white bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-blue-500"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls={`accordion-body-${uniqueId}`}
        >
          <span>{title}</span>
          <svg className={`w-5 h-5 transform transition-transform text-gray-500 ${isOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
        </button>
      </h2>
      {isOpen && (
        <div id={`accordion-body-${uniqueId}`} className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          {children}
        </div>
      )}
    </div>
  );
};


const DealInfoForm: React.FC<DealInfoFormProps> = ({ deal, onDealChange }) => {

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    const finalValue = type === 'checkbox' ? checked : type === 'number' && value !== '' ? parseFloat(value) : value;

    onDealChange(prevState => {
      const keys = name.split('.');
      
      const updateNestedState = (state: any, keys: string[], value: any): any => {
        const key = keys[0];
        if (keys.length === 1) {
          return { ...state, [key]: value };
        }
        
        const nextState = state[key] ? { ...state[key] } : {};

        return {
          ...state,
          [key]: updateNestedState(nextState, keys.slice(1), value),
        };
      };

      return updateNestedState(prevState, keys, finalValue);
    });
  };

    const handleThirdPartyEquityChange = (id: number, field: keyof Omit<ThirdPartyEquity, 'id'>, value: string | number) => {
      onDealChange(prev => ({
          ...prev,
          third_party_equity: prev.third_party_equity.map(item =>
              item.id === id ? { ...item, [field]: value } : item
          )
      }));
  };

  const addThirdPartyEquity = () => {
      onDealChange(prev => ({
          ...prev,
          third_party_equity: [
              ...(prev.third_party_equity || []),
              { id: Date.now(), investor: '', amount: '', rights: 'non-control' }
          ]
      }));
  };

  const removeThirdPartyEquity = (id: number) => {
      onDealChange(prev => ({
          ...prev,
          third_party_equity: prev.third_party_equity.filter(item => item.id !== id)
      }));
  };

  const FormField: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div>
      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      {children}
    </div>
  );
  
  const baseInputClasses = "block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-brand-blue-500 focus:border-brand-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-brand-blue-500 dark:focus:border-brand-blue-500";
  
  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">Deal Information</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6">Enter the details of your acquisition target. This information will be used by all AI agents.</p>

      <div className="space-y-4">
        <AccordionSection title="Deal Basics & Eligibility" defaultOpen>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField label="Deal Name">
              <input type="text" name="deal_name" value={deal.deal_name} onChange={handleInputChange} className={baseInputClasses} />
            </FormField>
            <FormField label="Purchase Type">
              <select name="purchase_type" value={deal.purchase_type} onChange={handleInputChange} className={baseInputClasses}>
                <option value="asset">Asset</option>
                <option value="stock">Stock</option>
                <option value="leveraged_buyout">Leveraged Buyout (LBO)</option>
                <option value="management_buyout">Management Buyout (MBO)</option>
                <option value="franchise">Franchise Acquisition</option>
              </select>
            </FormField>
             <FormField label="Industry">
               <input type="text" name="industry" value={deal.industry} onChange={handleInputChange} className={baseInputClasses} />
            </FormField>
             <FormField label="Credit Score Band">
               <select name="borrower_profile.credit_score_band" value={deal.borrower_profile.credit_score_band} onChange={handleInputChange} className={baseInputClasses}>
                <option value="720+">720+</option>
                <option value="680-720">680-720</option>
                <option value="620-680">620-680</option>
                <option value="<620">&lt;620</option>
              </select>
            </FormField>
             <FormField label="Business Location">
              <select name="business_location" value={deal.business_location} onChange={handleInputChange} className={baseInputClasses}>
                <option value="US-based">US-based</option>
                <option value="International">International</option>
              </select>
            </FormField>
            <FormField label="Borrower Status">
                <div className="flex items-center h-10">
                    <input id="on_parole" name="borrower_profile.on_parole" checked={deal.borrower_profile.on_parole} onChange={handleInputChange} type="checkbox" className="h-4 w-4 rounded border-gray-300 text-brand-blue-600 focus:ring-brand-blue-500" />
                    <label htmlFor="on_parole" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">Currently on parole</label>
                </div>
            </FormField>
          </div>
        </AccordionSection>

        <AccordionSection title="Target Financials (TTM)">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <FormField label="Revenue ($)">
                <input type="number" name="revenue_ttm" value={deal.revenue_ttm} onChange={handleInputChange} className={baseInputClasses} />
             </FormField>
             <FormField label="EBITDA / SDE ($)">
                <input type="number" name="ebitda_ttm" value={deal.ebitda_ttm} onChange={handleInputChange} className={baseInputClasses} />
             </FormField>
          </div>
        </AccordionSection>

        <AccordionSection title="Project Costs ($)">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
             <FormField label="Purchase Price">
                <input type="number" name="purchase_price" value={deal.purchase_price} onChange={handleInputChange} className={baseInputClasses} />
             </FormField>
             <FormField label="Working Capital">
                <input type="number" name="working_capital" value={deal.working_capital} onChange={handleInputChange} className={baseInputClasses} />
             </FormField>
             <FormField label="Closing Costs">
                <input type="number" name="closing_costs" value={deal.closing_costs} onChange={handleInputChange} className={baseInputClasses} />
             </FormField>
             <FormField label="Fees">
                <input type="number" name="fees" value={deal.fees} onChange={handleInputChange} className={baseInputClasses} />
             </FormField>
          </div>
        </AccordionSection>

        <AccordionSection title="Borrower Liquidity ($)">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
             <FormField label="Cash"><input type="number" name="borrower_profile.liquidity.cash" value={deal.borrower_profile.liquidity.cash} onChange={handleInputChange} className={baseInputClasses} /></FormField>
             <FormField label="Brokerage"><input type="number" name="borrower_profile.liquidity.brokerage" value={deal.borrower_profile.liquidity.brokerage} onChange={handleInputChange} className={baseInputClasses} /></FormField>
             <FormField label="CDs"><input type="number" name="borrower_profile.liquidity.cds" value={deal.borrower_profile.liquidity.cds} onChange={handleInputChange} className={baseInputClasses} /></FormField>
             <FormField label="HSAs"><input type="number" name="borrower_profile.liquidity.hsas" value={deal.borrower_profile.liquidity.hsas} onChange={handleInputChange} className={baseInputClasses} /></FormField>
             <FormField label="RSUs"><input type="number" name="borrower_profile.liquidity.rsus" value={deal.borrower_profile.liquidity.rsus} onChange={handleInputChange} className={baseInputClasses} /></FormField>
          </div>
        </AccordionSection>
        
        <AccordionSection title="Other Potential Funding Sources">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                  <h4 className="font-medium dark:text-gray-200 mb-2">Retirement Assets</h4>
                  <div className="space-y-3">
                      <FormField label="401k/IRA Balance ($)">
                          <input type="number" name="borrower_profile.retirement_assets.balance" value={deal.borrower_profile.retirement_assets.balance} onChange={handleInputChange} className={baseInputClasses} />
                      </FormField>
                      <div className="flex items-center">
                          <input id="robs_interest" name="borrower_profile.retirement_assets.robs_interest" checked={deal.borrower_profile.retirement_assets.robs_interest} onChange={handleInputChange} type="checkbox" className="h-4 w-4 rounded border-gray-300 text-brand-blue-600 focus:ring-brand-blue-500" />
                          <label htmlFor="robs_interest" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">Interested in ROBS?</label>
                      </div>
                  </div>
              </div>
              <div>
                  <h4 className="font-medium dark:text-gray-200 mb-2">Seller Note</h4>
                  <div className="space-y-3">
                      <FormField label="Proposed Amount ($)">
                          <input type="number" name="seller_note.proposed_amount" value={deal.seller_note.proposed_amount} onChange={handleInputChange} className={baseInputClasses} />
                      </FormField>
                       <div className="flex items-center">
                          <input id="standby_full_life" name="seller_note.standby_full_life" checked={deal.seller_note.standby_full_life} onChange={handleInputChange} type="checkbox" className="h-4 w-4 rounded border-gray-300 text-brand-blue-600 focus:ring-brand-blue-500" />
                          <label htmlFor="standby_full_life" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">On Full Standby?</label>
                      </div>
                  </div>
              </div>
               <div>
                  <h4 className="font-medium dark:text-gray-200 mb-2">Rollover</h4>
                  <div className="space-y-3">
                      <FormField label="Rollover Equity ($)">
                          <input type="number" name="rollover_equity" value={deal.rollover_equity} onChange={handleInputChange} className={baseInputClasses} />
                      </FormField>
                  </div>
              </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h4 className="font-medium dark:text-gray-200 mb-3">Third-Party Equity</h4>
            <div className="space-y-3">
                {(deal.third_party_equity || []).map(equity => (
                <div key={equity.id} className="grid grid-cols-[1fr_10rem_8rem_auto] gap-2 items-center">
                    <div>
                        <label htmlFor={`investor-${equity.id}`} className="sr-only">Investor Name</label>
                        <input id={`investor-${equity.id}`} type="text" placeholder="Investor Name" value={equity.investor} onChange={e => handleThirdPartyEquityChange(equity.id, 'investor', e.target.value)} className={`${baseInputClasses} p-2`} />
                    </div>
                    <div>
                        <label htmlFor={`amount-${equity.id}`} className="sr-only">Amount</label>
                        <input id={`amount-${equity.id}`} type="number" placeholder="Amount ($)" value={equity.amount} onChange={e => handleThirdPartyEquityChange(equity.id, 'amount', e.target.value === '' ? '' : parseFloat(e.target.value))} className={`${baseInputClasses} p-2`} />
                    </div>
                    <div>
                        <label htmlFor={`rights-${equity.id}`} className="sr-only">Rights</label>
                        <select id={`rights-${equity.id}`} value={equity.rights} onChange={e => handleThirdPartyEquityChange(equity.id, 'rights', e.target.value as 'non-control')} className={`${baseInputClasses} p-2`}>
                            <option value="non-control">Non-Control</option>
                        </select>
                    </div>
                    <button type="button" onClick={() => removeThirdPartyEquity(equity.id)} className="text-gray-400 hover:text-red-500 p-2">
                        <TrashIcon className="w-5 h-5" />
                    </button>
                </div>
                ))}
                {(!deal.third_party_equity || deal.third_party_equity.length === 0) && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">No third-party equity sources added.</p>
                )}
            </div>
            <button type="button" onClick={addThirdPartyEquity} className="mt-3 text-sm text-brand-blue-600 dark:text-brand-blue-400 font-medium flex items-center">
                <PlusCircleIcon className="w-4 h-4 mr-1" /> Add Investor
            </button>
          </div>
        </AccordionSection>
      </div>
    </div>
  );
};

export default DealInfoForm;
