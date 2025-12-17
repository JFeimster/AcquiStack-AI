import React from 'react';
import { WorkflowModule } from '../types';

interface WorkflowCardProps {
  workflow: WorkflowModule;
  onSelect: () => void;
}

const WorkflowCard: React.FC<WorkflowCardProps> = ({ workflow, onSelect }) => {
  return (
    <div 
      className="bg-white dark:bg-gray-900 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col p-6 cursor-pointer border-2 border-transparent hover:border-brand-blue-500"
      onClick={onSelect}
    >
      <div className="flex-shrink-0 mb-4">
        <div className="w-12 h-12 rounded-full bg-brand-blue-100 dark:bg-brand-blue-900 flex items-center justify-center">
          <workflow.Icon className="w-6 h-6 text-brand-blue-600 dark:text-brand-blue-400" />
        </div>
      </div>
      <div className="flex-grow">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">{workflow.title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">{workflow.description}</p>
      </div>
       <button 
        onClick={(e) => { e.stopPropagation(); onSelect(); }}
        className="mt-4 w-full text-sm text-white bg-brand-blue-600 hover:bg-brand-blue-700 focus:ring-4 focus:outline-none focus:ring-brand-blue-300 font-medium rounded-lg px-4 py-2 text-center dark:bg-brand-blue-500 dark:hover:bg-brand-blue-600 dark:focus:ring-brand-blue-800 transition-colors"
      >
        Run Workflow
      </button>
    </div>
  );
};

export default WorkflowCard;
