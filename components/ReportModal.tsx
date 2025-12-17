import React, { useMemo } from 'react';
import { Deal, SharedDocument } from '../types';
import { SyndicateEngineIcon, PushToCloudIcon } from './icons';
import { marked } from 'https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportType: 'investment_memo' | 'lender_package';
  deal: Deal;
  documents: SharedDocument[];
  setToastMessage: (message: string) => void;
}

const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);

const ReportSection: React.FC<{ title: string; children: React.ReactNode; }> = ({ title, children }) => (
    <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 border-b-2 border-brand-blue-200 dark:border-brand-blue-800 pb-1">{title}</h3>
        <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">{children}</div>
    </div>
);

const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, reportType, deal, documents, setToastMessage }) => {
  const { reportTitle, reportContent } = useMemo(() => {
    if (!deal) return { reportTitle: '', reportContent: [] };

    const primaryScenario = deal.scenarios.find(s => s.isPrimary);
    const valuationScenario = deal.scenarios.find(s => s.agentId === 'valuation_modeler');
    const eligibilityScenario = deal.scenarios.find(s => s.agentId === 'sba_eligibility_screener');

    // FIX: Use the 'documents' prop which is passed into the component,
    // instead of trying to access a non-existent 'documents' property on the 'deal' object.
    const allRisks = documents
        .filter(doc => doc.analysisState === 'complete' && doc.analysis && doc.analysis.risks.length > 0)
        .flatMap(doc => doc.analysis.risks.map(risk => ({ risk, docName: doc.name })));

    if (reportType === 'investment_memo') {
      return {
        reportTitle: 'Investment Memo',
        reportContent: [
          { title: 'Executive Summary', content: `This memo outlines the proposed acquisition of ${deal.deal_name}, a ${deal.industry} business. The total project cost is estimated at ${formatCurrency(deal.purchase_price + deal.working_capital + deal.closing_costs + deal.fees)}, with a recommended capital structure detailed below.` },
          { title: 'Valuation Analysis', content: valuationScenario?.fullOutput ? <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: marked.parse(valuationScenario.fullOutput) }} /> : 'No valuation analysis has been run for this deal.' },
          { title: 'Proposed Capital Stack (Primary Scenario)', content: primaryScenario?.fullOutput ? <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: marked.parse(primaryScenario.fullOutput) }} /> : 'No primary capital stack has been set.' },
          { title: 'Key Risks from Due Diligence', content: allRisks.length > 0 ? <ul>{allRisks.map((item, i) => <li key={i}><strong>From {item.docName}:</strong> {item.risk}</li>)}</ul> : 'No significant risks were identified in the analyzed documents.' }
        ]
      };
    } else { // lender_package
        const sourcesAndUses = primaryScenario?.fullOutput.match(/\*\*Sources:\*\*\n([\s\S]*?)\n\n\*\*Uses:\*\*/)?.[0] || 'Not available.';

        return {
            reportTitle: 'Lender Financing Package',
            reportContent: [
                { title: 'Borrower & Deal Overview', content: `This package supports a financing request for the acquisition of ${deal.deal_name}. The borrower's credit score is in the ${deal.borrower_profile.credit_score_band} band.`},
                { title: 'SBA Eligibility Screener Output', content: eligibilityScenario?.fullOutput ? <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: marked.parse(eligibilityScenario.fullOutput) }} /> : 'SBA Eligibility has not been run for this deal.' },
                { title: 'Key Financial Metrics (Primary Scenario)', content: primaryScenario ? 
                    <ul className="list-disc list-inside">
                        <li><strong>DSCR Estimate:</strong> {primaryScenario.metrics.dscrEstimate?.toFixed(2) || 'N/A'}x</li>
                        <li><strong>Post-Close Liquidity:</strong> {formatCurrency(primaryScenario.metrics.postCloseLiquidity || 0)}</li>
                    </ul> : 'No primary scenario set.'
                },
                { title: 'Sources & Uses', content: <pre className="whitespace-pre-wrap font-sans text-sm">{sourcesAndUses}</pre> },
                { title: 'Borrower Liquidity Statement', content: 
                    <ul className="list-disc list-inside">
                        <li><strong>Cash:</strong> {formatCurrency(deal.borrower_profile.liquidity.cash)}</li>
                        <li><strong>Brokerage:</strong> {formatCurrency(deal.borrower_profile.liquidity.brokerage)}</li>
                        <li><strong>Retirement Assets:</strong> {formatCurrency(deal.borrower_profile.retirement_assets.balance)}</li>
                    </ul>
                }
            ]
        };
    }
  }, [deal, reportType, documents]);

  if (!isOpen) return null;

  const handleDownload = () => {
    setToastMessage(`Your "${reportTitle}" has been generated.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-brand-blue-100 dark:bg-brand-blue-900 flex items-center justify-center">
              <SyndicateEngineIcon className="w-5 h-5 text-brand-blue-600 dark:text-brand-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{reportTitle}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Generated for: {deal.deal_name}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto bg-gray-50 dark:bg-gray-800/50">
          {reportContent.map((section, index) => (
            <ReportSection key={index} title={section.title}>
              {section.content}
            </ReportSection>
          ))}
        </div>

        <div className="flex items-center p-5 space-x-2 border-t border-gray-200 dark:border-gray-700 rounded-b flex-shrink-0">
          <button
            onClick={handleDownload}
            type="button"
            className="text-white bg-brand-blue-600 hover:bg-brand-blue-700 focus:ring-4 focus:outline-none focus:ring-brand-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-brand-blue-500 dark:hover:bg-brand-blue-600 dark:focus:ring-brand-blue-800 inline-flex items-center"
          >
            <PushToCloudIcon className="w-5 h-5 mr-2" />
            Download PDF (Simulated)
          </button>
          <button onClick={onClose} type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
