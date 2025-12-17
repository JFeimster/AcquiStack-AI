import React, { useState, FormEvent, useEffect } from 'react';
import { AgentModule, AgentResult } from '../types';
import { SalesforceIcon, PushToCloudIcon } from './icons';
// A simple markdown-to-html converter
import { marked } from 'https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js';

interface AgentModalProps {
  agent: AgentModule;
  isOpen: boolean;
  onClose: () => void;
  onNewQuery: () => void;
  onSubmit: (userInput: string) => Promise<void>;
  isLoading: boolean;
  result: AgentResult | null;
  error: string | null;
  setToastMessage: (message: string) => void;
  onSaveScenario: (name: string, result: AgentResult) => void;
}

const AgentModal: React.FC<AgentModalProps> = ({ agent, isOpen, onClose, onNewQuery, onSubmit, isLoading, result, error, setToastMessage, onSaveScenario }) => {
  const [userInput, setUserInput] = useState('');
  const [scenarioName, setScenarioName] = useState('');

  useEffect(() => {
    // When the modal opens for a new agent, clear previous input
    if (isOpen) {
      setUserInput('');
      setScenarioName(agent.title + " Output");
    }
  }, [isOpen, agent]);

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(userInput);
  };
  
  const handlePushToCrm = () => {
    setToastMessage(`Report from '${agent.title}' pushed to Salesforce.`);
  };

  const handleSaveScenario = () => {
    if (scenarioName.trim() && result) {
      onSaveScenario(scenarioName.trim(), result);
    }
  };
  
  const renderedHtml = result?.text ? marked.parse(result.text) : '';
  const sources = result?.sources?.filter(s => s.web?.uri && s.web?.title);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-brand-blue-100 dark:bg-brand-blue-900 flex items-center justify-center">
              <agent.Icon className="w-5 h-5 text-brand-blue-600 dark:text-brand-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{agent.title}</h3>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto">
          {!result && !isLoading && !error && (
            <form onSubmit={handleSubmit} id="agent-input-form">
              <label htmlFor="userInput" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                {agent.command}
                <span className="text-gray-500 dark:text-gray-400 ml-2">(Optional: Add specific instructions)</span>
              </label>
              <textarea
                id="userInput"
                rows={5}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-brand-blue-500 focus:border-brand-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-brand-blue-500 dark:focus:border-brand-blue-500"
                placeholder={agent.promptPlaceholder}
              ></textarea>
            </form>
          )}

          {isLoading && (
            <div className="flex flex-col items-center justify-center h-48">
              <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-brand-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
               {agent.mode === 'thinking' ? (
                 <p className="mt-4 text-gray-600 dark:text-gray-300">Performing a deep analysis. This may take a moment...</p>
               ) : (
                <p className="mt-4 text-gray-600 dark:text-gray-300">AcquiStack AI is thinking...</p>
               )}
            </div>
          )}

          {error && (
            <div className="p-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-900 dark:text-red-400" role="alert">
              <span className="font-medium">Error:</span> {error}
            </div>
          )}

          {result && (
            <div>
               <div className="flex justify-between items-center mb-3">
                 <h4 className="text-lg font-semibold text-gray-800 dark:text-white">AI Generated Output:</h4>
                 <button 
                    onClick={handlePushToCrm}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-xs font-medium rounded-md shadow-sm text-gray-700 bg-white dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue-500"
                  >
                   <SalesforceIcon className="w-4 h-4 mr-2" />
                   Push to CRM
                 </button>
               </div>
              <div
                className="prose prose-sm dark:prose-invert max-w-none bg-gray-50 dark:bg-gray-900/50 p-4 rounded-md border dark:border-gray-700"
                dangerouslySetInnerHTML={{ __html: renderedHtml }}
              />

              {sources && sources.length > 0 && (
                 <div className="mt-4">
                    <h5 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">Sources from Google Search:</h5>
                    <ul className="list-disc list-inside space-y-1">
                      {sources.map((source, index) => (
                        <li key={index} className="text-sm">
                          <a 
                            href={source.web!.uri} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-brand-blue-600 hover:underline dark:text-brand-blue-400"
                           >
                            {source.web!.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                 </div>
              )}
               {agent.id === 'capital_stack_builder' && result.structuredMetrics && (
                <div className="mt-6 bg-brand-blue-50 dark:bg-gray-700/50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Save for Comparison</h4>
                    <div className="flex items-center space-x-2">
                        <input
                            type="text"
                            value={scenarioName}
                            onChange={(e) => setScenarioName(e.target.value)}
                            placeholder="Enter scenario name"
                            className="flex-grow p-2 text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-brand-blue-500 focus:border-brand-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                        />
                        <button
                            onClick={handleSaveScenario}
                            className="text-white bg-brand-blue-600 hover:bg-brand-blue-700 font-medium rounded-lg text-sm px-4 py-2"
                        >
                            Save Scenario
                        </button>
                    </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center p-5 space-x-2 border-t border-gray-200 dark:border-gray-700 rounded-b flex-shrink-0">
         {result || error || isLoading ? (
            <button
              onClick={onNewQuery}
              disabled={isLoading}
              className="text-white bg-brand-blue-600 hover:bg-brand-blue-700 focus:ring-4 focus:outline-none focus:ring-brand-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50 disabled:cursor-not-allowed dark:bg-brand-blue-500 dark:hover:bg-brand-blue-600 dark:focus:ring-brand-blue-800"
            >
              New Query
            </button>
          ) : (
            <button
              type="submit"
              form="agent-input-form"
              className="text-white bg-brand-blue-600 hover:bg-brand-blue-700 focus:ring-4 focus:outline-none focus:ring-brand-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-brand-blue-500 dark:hover:bg-brand-blue-600 dark:focus:ring-brand-blue-800"
            >
              Generate Response
            </button>
          )}
          <button onClick={onClose} type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">Close</button>
        </div>
      </div>
    </div>
  );
};

export default AgentModal;