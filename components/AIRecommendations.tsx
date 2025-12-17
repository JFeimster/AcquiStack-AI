import React from 'react';
import { AIRecommendation, AgentModule, Task } from '../types';
import { AGENT_MODULES } from '../constants';
import { LightbulbIcon, SpinnerIcon } from './icons';

interface AIRecommendationsProps {
    recommendations: AIRecommendation[];
    isLoading: boolean;
    onSelectAgent: (agent: AgentModule) => void;
    onAddTask: (text: string, assigneeId: undefined, source: 'ai') => void;
    tasks: Task[];
    setToastMessage: (message: string) => void;
}

const AIRecommendations: React.FC<AIRecommendationsProps> = ({ recommendations, isLoading, onSelectAgent, onAddTask, tasks, setToastMessage }) => {
    const recommendedAgents = recommendations
        .map(rec => {
            const agent = AGENT_MODULES.find(a => a.id === rec.agentId);
            return agent ? { ...agent, ...rec } : null;
        })
        .filter((a): a is AgentModule & AIRecommendation => a !== null);

    const handleSelect = (agent: AgentModule) => {
        onSelectAgent(agent);
    }

    return (
        <div className="bg-brand-blue-50 dark:bg-gray-900/50 p-6 rounded-lg shadow-inner my-8 border border-brand-blue-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
                <LightbulbIcon className="w-6 h-6 text-brand-blue-600 dark:text-brand-blue-400 mr-3" />
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">AI Recommendations</h2>
            </div>
            {isLoading && (
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <SpinnerIcon className="w-5 h-5 mr-2 animate-spin" />
                    <span>Analyzing deal info for next steps...</span>
                </div>
            )}
            {!isLoading && recommendedAgents.length === 0 && (
                <p className="text-gray-600 dark:text-gray-400">No specific recommendations at this time. Fill out more deal information for tailored suggestions.</p>
            )}
            {!isLoading && recommendedAgents.length > 0 && (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recommendedAgents.map(agent => {
                        const taskExists = agent.suggestedTask ? tasks.some(task => task.text === agent.suggestedTask) : false;

                        return (
                            <div key={agent.id} className="bg-white dark:bg-gray-800/70 rounded-lg shadow-md hover:shadow-lg hover:ring-2 hover:ring-brand-blue-500 transition-all duration-200 flex flex-col">
                                <div onClick={() => handleSelect(agent)} className="p-4 flex-grow cursor-pointer">
                                    <div className="flex items-center mb-2">
                                        <div className="w-8 h-8 rounded-full bg-brand-blue-100 dark:bg-brand-blue-900 flex items-center justify-center mr-3 flex-shrink-0">
                                            <agent.Icon className="w-4 h-4 text-brand-blue-600 dark:text-brand-blue-400" />
                                        </div>
                                        <h3 className="text-md font-semibold text-gray-800 dark:text-white">{agent.title}</h3>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 flex-grow mb-3">{agent.reason}</p>
                                    <p className="text-sm text-brand-blue-600 dark:text-brand-blue-400 font-semibold">Engage Agent →</p>
                                </div>
                                {agent.suggestedTask && (
                                    <div className="px-4 pb-4 pt-3 border-t border-brand-blue-100 dark:border-gray-700">
                                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-wider">SUGGESTED TASK</p>
                                        <p className="text-sm text-gray-700 dark:text-gray-200 mt-1 mb-2">{agent.suggestedTask}</p>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if(agent.suggestedTask && !taskExists) {
                                                    onAddTask(agent.suggestedTask, undefined, 'ai');
                                                    setToastMessage(`Task added to Deal Room.`);
                                                }
                                            }}
                                            disabled={taskExists}
                                            className="w-full text-sm font-medium rounded-lg px-3 py-1.5 text-center transition-colors disabled:opacity-100 bg-brand-blue-100 text-brand-blue-800 hover:bg-brand-blue-200 dark:bg-brand-blue-900 dark:text-brand-blue-200 dark:hover:bg-brand-blue-800 disabled:bg-green-100 disabled:text-green-800 dark:disabled:bg-green-900 dark:disabled:text-green-300"
                                        >
                                            {taskExists ? '✓ Added' : '+ Add to Tasks'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                 </div>
            )}
        </div>
    );
};

export default AIRecommendations;