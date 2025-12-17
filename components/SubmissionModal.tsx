import React, { useState, useEffect } from 'react';
import { AgentModule, AgentResult, Deal } from '../types';
import { runAgent } from '../services/geminiService';
import { AGENT_MODULES } from '../constants';
import { marked } from 'https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js';
import { SpinnerIcon, PaperAirplaneIcon } from './icons';

interface SubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  deal: Deal;
  lender: string;
  setToastMessage: (message: string) => void;
}

const SubmissionModal: React.FC<SubmissionModalProps> = ({ isOpen, onClose, deal, lender, setToastMessage }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AgentResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const agent = AGENT_MODULES.find(a => a.id === 'lender_package_generator');

  useEffect(() => {
    if (isOpen && agent) {
      generatePackage();
    }
  }, [isOpen, agent]);

  if (!isOpen || !agent) return null;

  const generatePackage = async () => {
    setIsLoading(true);
    setResult(null);
    setError(null);
    try {
      // The user input here is the specific lender we're targeting.
      const userInput = `Target Lender: ${lender}`;
      const response = await runAgent(agent, deal, userInput);
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubmit = () => {
    setToastMessage(`Submission package sent to ${lender}.`);
    onClose();
  };

  const renderedHtml = result?.text ? marked.parse(result.text) : '';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
             <div className="w-10 h-10 rounded-full bg-brand-blue-100 dark:bg-brand-blue-900 flex items-center justify-center">
              <agent.Icon className="w-5 h-5 text-brand-blue-600 dark:text-brand-blue-400" />
            </div>
            <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Lender Submission Package</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">To: {lender}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto">
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-64">
                <SpinnerIcon className="w-8 h-8 text-brand-blue-600 animate-spin" />
                <p className="mt-4 text-gray-600 dark:text-gray-300">AI is generating a tailored package for {lender}...</p>
            </div>
          )}

          {error && (
            <div className="p-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-900 dark:text-red-400" role="alert">
              <span className="font-medium">Error:</span> {error}
            </div>
          )}

          {result && (
            <div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Generated Submission Package:</h4>
              <div
                className="prose prose-sm dark:prose-invert max-w-none bg-gray-50 dark:bg-gray-900/50 p-4 rounded-md border dark:border-gray-700"
                dangerouslySetInnerHTML={{ __html: renderedHtml }}
              />
            </div>
          )}
        </div>

        <div className="flex items-center justify-end p-5 space-x-2 border-t border-gray-200 dark:border-gray-700">
          <button onClick={onClose} type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600">Cancel</button>
           <button
              onClick={handleSubmit}
              disabled={isLoading || !!error || !result}
              className="inline-flex items-center text-white bg-brand-blue-600 hover:bg-brand-blue-700 focus:ring-4 focus:outline-none focus:ring-brand-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50 disabled:cursor-not-allowed dark:bg-brand-blue-500 dark:hover:bg-brand-blue-600 dark:focus:ring-brand-blue-800"
            >
              <PaperAirplaneIcon className="w-5 h-5 mr-2" />
              Send to Lender (Simulated)
            </button>
        </div>
      </div>
    </div>
  );
};

export default SubmissionModal;
