
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { DocumentAnalysisResult } from '../types';
import { UploadIcon } from './icons';

interface DocumentAnalyzerProps {
  onAnalyze: (file: File) => Promise<void>;
  isLoading: boolean;
  result: DocumentAnalysisResult | null;
  error: string | null;
}

const DocumentAnalyzer: React.FC<DocumentAnalyzerProps> = ({ onAnalyze, isLoading, result, error }) => {
  const [fileName, setFileName] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setFileName(file.name);
      onAnalyze(file);
    }
  }, [onAnalyze]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
  });

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">Document Intake Agent</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6">Upload a CIM or other deal document (PDF) to automatically extract key info.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div>
          <div
            {...getRootProps()}
            className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors
              ${isDragActive ? 'border-brand-blue-500 bg-brand-blue-50 dark:bg-gray-800' : 'border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800/60'}`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
              <UploadIcon className="w-10 h-10 mb-3 text-gray-400" />
              {isDragActive ? (
                <p className="text-brand-blue-600 font-semibold">Drop the file here...</p>
              ) : (
                <>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">PDF only (max 10MB)</p>
                </>
              )}
            </div>
          </div>
          {fileName && !isLoading && (
            <p className="text-sm text-center mt-2 text-gray-600 dark:text-gray-300">
              Selected file: <span className="font-medium">{fileName}</span>
            </p>
          )}
        </div>

        <div>
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-48">
              <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-brand-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-4 text-gray-600 dark:text-gray-300">Analyzing document... This may take a moment.</p>
            </div>
          )}
          {error && (
            <div className="p-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-900 dark:text-red-400 h-48 flex items-center justify-center" role="alert">
              <span className="font-medium">Error:</span> {error}
            </div>
          )}
          {result && !isLoading && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-white">AI Summary:</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{result.summary}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-white">Potential Risks & Discussion Points:</h4>
                <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 mt-1 space-y-1">
                  {result.risks.map((risk, i) => <li key={i}>{risk}</li>)}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentAnalyzer;
