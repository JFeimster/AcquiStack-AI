import React, { useState } from 'react';
import { SharedDocument } from '../types';
import { FilePdfIcon } from './icons';

interface LinkDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  documents: SharedDocument[];
  onLinkDocument: (documentId: number | null) => void;
}

const LinkDocumentModal: React.FC<LinkDocumentModalProps> = ({ isOpen, onClose, documents, onLinkDocument }) => {
  const [selectedDocId, setSelectedDocId] = useState<number | null>(null);

  if (!isOpen) return null;
  
  const handleLink = () => {
    onLinkDocument(selectedDocId);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Link a Document</h3>
          <button type="button" onClick={onClose} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto">
          <p className="text-sm text-gray-600 dark:text-gray-400">Select a document from the VDR to link to this checklist item.</p>
          <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
            {documents.length > 0 ? documents.map(doc => (
              <div
                key={doc.id}
                onClick={() => setSelectedDocId(doc.id)}
                className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${selectedDocId === doc.id ? 'bg-brand-blue-100 dark:bg-brand-blue-900 ring-2 ring-brand-blue-500' : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'}`}
              >
                <FilePdfIcon className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
                <div className="overflow-hidden">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{doc.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{doc.size} - Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}</p>
                </div>
              </div>
            )) : <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No documents available in the VDR.</p>}
          </div>
        </div>

        <div className="flex items-center justify-end p-5 space-x-2 border-t border-gray-200 dark:border-gray-700">
          <button onClick={onClose} type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600">Cancel</button>
          <button onClick={handleLink} disabled={!selectedDocId} className="text-white bg-brand-blue-600 hover:bg-brand-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 disabled:bg-brand-blue-400 dark:disabled:bg-brand-blue-800 disabled:cursor-not-allowed">
            Link Document
          </button>
        </div>
      </div>
    </div>
  );
};

export default LinkDocumentModal;