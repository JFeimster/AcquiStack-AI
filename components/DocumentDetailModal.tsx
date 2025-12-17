import React from 'react';
import { SharedDocument } from '../types';
import { AlertIcon, CheckCircleIcon } from './icons';

interface DocumentDetailModalProps {
  document: SharedDocument;
  isOpen: boolean;
  onClose: () => void;
}

const DocumentDetailModal: React.FC<DocumentDetailModalProps> = ({ document, isOpen, onClose }) => {
  if (!isOpen) return null;

  const { name, type, size, uploadedAt, analysisState, analysis } = document;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{type} - {size} - Uploaded on {new Date(uploadedAt).toLocaleDateString()}</p>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto">
          {analysisState === 'analyzing' && <p>Analyzing...</p>}
          {analysisState === 'error' && <p className="text-red-500">Analysis failed.</p>}
          {analysisState === 'pending' && <p className="text-gray-500">This document has not been analyzed yet.</p>}
          
          {analysisState === 'complete' && analysis && (
            <>
              <div>
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 flex items-center">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                  AI Summary
                </h4>
                <p className="text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-md border dark:border-gray-700">
                  {analysis.summary}
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 flex items-center">
                  <AlertIcon className="w-5 h-5 text-yellow-500 mr-2" />
                  Potential Risks & Discussion Points
                </h4>
                <ul className="space-y-2">
                  {analysis.risks.map((risk, index) => (
                    <li key={index} className="text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-md border dark:border-gray-700">
                      {risk}
                    </li>
                  ))}
                </ul>
              </div>

              {analysis.key_clauses && analysis.key_clauses.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Extracted Key Clauses</h4>
                  <ul className="space-y-2">
                    {analysis.key_clauses.map((clause, index) => (
                      <li key={index} className="text-gray-600 dark:text-gray-300 font-mono text-sm bg-gray-50 dark:bg-gray-900/50 p-3 rounded-md border dark:border-gray-700">
                        "{clause}"
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex items-center justify-end p-5 space-x-2 border-t border-gray-200 dark:border-gray-700 rounded-b flex-shrink-0">
          <button onClick={onClose} type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">Close</button>
        </div>
      </div>
    </div>
  );
};

export default DocumentDetailModal;