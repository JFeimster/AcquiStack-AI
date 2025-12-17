
import React from 'react';
import { AgentModule } from '../types';

interface AgentCardProps {
  agent: AgentModule;
  onSelect: () => void;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent, onSelect }) => {
  return (
    <div 
      className="bg-white dark:bg-gray-900 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col p-6 cursor-pointer"
      onClick={onSelect}
    >
      <div className="flex-shrink-0 mb-4">
        <div className="group relative w-12 h-12 rounded-full bg-brand-blue-100 dark:bg-brand-blue-900 flex items-center justify-center">
          <agent.Icon className="w-6 h-6 text-brand-blue-600 dark:text-brand-blue-400" />
          <div className="absolute bottom-full mb-2 w-72 p-3 bg-gray-800 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 invisible group-hover:visible z-10 pointer-events-none">
            <h4 className="font-bold text-sm mb-1 text-brand-blue-300">Purpose</h4>
            <p className="mb-2">{agent.description}</p>
            <h4 className="font-bold text-sm mb-1 text-brand-blue-300">Expected Output</h4>
            <pre className="text-gray-300 text-xs font-mono whitespace-pre-wrap bg-gray-900 p-2 rounded-md">{agent.outputRequirements}</pre>
            <div className="absolute left-1/2 -bottom-2 transform -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-gray-800"></div>
          </div>
        </div>
      </div>
      <div className="flex-grow">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">{agent.title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">{agent.description}</p>
      </div>
       <button 
        onClick={(e) => { e.stopPropagation(); onSelect(); }}
        className="mt-4 w-full text-sm text-white bg-brand-blue-600 hover:bg-brand-blue-700 focus:ring-4 focus:outline-none focus:ring-brand-blue-300 font-medium rounded-lg px-4 py-2 text-center dark:bg-brand-blue-500 dark:hover:bg-brand-blue-600 dark:focus:ring-brand-blue-800 transition-colors"
      >
        Engage Agent
      </button>
    </div>
  );
};

export default AgentCard;
