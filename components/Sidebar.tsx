
import React from 'react';
import { AgentModule } from '../types';

interface SidebarProps {
  agents: AgentModule[];
  onSelectAgent: (agent: AgentModule) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ agents, onSelectAgent }) => {
  return (
    <div className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <h2 className="text-lg font-semibold text-brand-blue-700 dark:text-brand-blue-400">AI Agents</h2>
      </div>
      <nav className="flex-1 overflow-y-auto">
        <ul>
          {agents.map((agent) => (
            <li key={agent.id}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onSelectAgent(agent);
                }}
                className="flex items-center px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-brand-blue-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <agent.Icon className="w-5 h-5 mr-3 text-gray-400" />
                <span>{agent.title}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
