import React, { useState, useEffect } from 'react';
import { WorkflowModule, Deal, AgentResult, AgentModule } from '../types';
import { runAgent as runAgentService } from '../services/geminiService';
import { AGENT_MODULES } from '../constants';
import { marked } from 'https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js';
import { SpinnerIcon, CheckCircleIcon, XCircleIcon, MinusCircleIcon, ArrowRightCircleIcon } from './icons';

interface WorkflowModalProps {
  workflow: WorkflowModule;
  isOpen: boolean;
  onClose: () => void;
  deal: Deal;
  runAgent: typeof runAgentService;
}

type StepStatus = 'pending' | 'running' | 'completed' | 'skipped' | 'stopped' | 'failed';
type WorkflowStatus = 'idle' | 'running' | 'done';

const WorkflowModal: React.FC<WorkflowModalProps> = ({ workflow, isOpen, onClose, deal, runAgent }) => {
  const [stepStates, setStepStates] = useState<StepStatus[]>([]);
  const [stepResults, setStepResults] = useState<(AgentResult | null)[]>([]);
  const [workflowStatus, setWorkflowStatus] = useState<WorkflowStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStepStates(new Array(workflow.steps.length).fill('pending'));
      setStepResults(new Array(workflow.steps.length).fill(null));
      setWorkflowStatus('idle');
      setError(null);
    }
  }, [isOpen, workflow]);

  if (!isOpen) return null;

  const runWorkflow = async () => {
    setWorkflowStatus('running');
    setError(null);

    const results: (AgentResult | null)[] = [...stepResults];
    const states: StepStatus[] = [...stepStates];
    let previousResultText = '';

    for (let i = 0; i < workflow.steps.length; i++) {
      states[i] = 'running';
      setStepStates([...states]);

      const step = workflow.steps[i];
      const agent = AGENT_MODULES.find(a => a.id === step.agentId);

      if (!agent) {
        setError(`Configuration error: Agent with ID "${step.agentId}" not found.`);
        states[i] = 'failed';
        setStepStates([...states]);
        setWorkflowStatus('done');
        return;
      }
      
      // 1. Check condition
      if (step.condition) {
        const sourceStepIndex = workflow.steps.findIndex(s => s.agentId === step.condition.sourceAgentId);
        const sourceResult = results[sourceStepIndex];
        
        if (!sourceResult || !sourceResult.text.toLowerCase().includes(step.condition.outputContains.toLowerCase())) {
          if (step.condition.onFailure === 'stop') {
            states[i] = 'stopped';
            // Mark all subsequent steps as stopped as well
            for (let j = i + 1; j < states.length; j++) states[j] = 'stopped';
            setStepStates([...states]);
            setWorkflowStatus('done');
            return;
          } else { // 'skip'
            states[i] = 'skipped';
            setStepStates([...states]);
            continue;
          }
        }
      }

      // 2. Prepare and run agent
      try {
        const userInput = previousResultText 
          ? `Based on the previous analysis provided below, please perform your core task.\n\n---\nPREVIOUS ANALYSIS:\n${previousResultText}` 
          : ''; // No specific input for the first agent
        
        const result = await runAgent(agent, deal, userInput);
        results[i] = result;
        setStepResults([...results]);
        previousResultText = result.text;
        states[i] = 'completed';
        setStepStates([...states]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        states[i] = 'failed';
        setStepStates([...states]);
        setWorkflowStatus('done');
        return;
      }
    }
    setWorkflowStatus('done');
  };

  const getStatusIcon = (status: StepStatus) => {
    switch(status) {
      case 'running': return <SpinnerIcon className="w-5 h-5 text-brand-blue-500 animate-spin" />;
      case 'completed': return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'failed': return <XCircleIcon className="w-5 h-5 text-red-500" />;
      case 'skipped': return <ArrowRightCircleIcon className="w-5 h-5 text-gray-400" />;
      case 'stopped': return <MinusCircleIcon className="w-5 h-5 text-yellow-500" />;
      case 'pending':
      default:
        return <div className="w-5 h-5 flex items-center justify-center"><div className="w-2.5 h-2.5 bg-gray-300 dark:bg-gray-600 rounded-full"></div></div>;
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-brand-blue-100 dark:bg-brand-blue-900 flex items-center justify-center">
              <workflow.Icon className="w-5 h-5 text-brand-blue-600 dark:text-brand-blue-400" />
            </div>
            <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{workflow.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Automated Workflow</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto">
            {workflow.steps.map((step, index) => {
                const agent = AGENT_MODULES.find(a => a.id === step.agentId);
                const result = stepResults[index];
                const renderedHtml = result?.text ? marked.parse(result.text) : '';

                return (
                    <div key={index} className="flex items-start space-x-4">
                        <div className="flex flex-col items-center">
                            {getStatusIcon(stepStates[index])}
                            {index < workflow.steps.length - 1 && (
                                <div className="w-px h-8 bg-gray-200 dark:bg-gray-700 mt-2"></div>
                            )}
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-gray-800 dark:text-white">{agent?.title || 'Unknown Agent'}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{stepStates[index]}</p>
                            {stepStates[index] === 'completed' && result && (
                                 <div
                                    className="mt-2 prose prose-sm dark:prose-invert max-w-none bg-gray-50 dark:bg-gray-900/50 p-3 rounded-md border dark:border-gray-700 text-xs"
                                    dangerouslySetInnerHTML={{ __html: renderedHtml }}
                                />
                            )}
                        </div>
                    </div>
                );
            })}
             {error && (
                <div className="p-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-900 dark:text-red-400" role="alert">
                    <span className="font-medium">Workflow Error:</span> {error}
                </div>
            )}
        </div>

        <div className="flex items-center p-5 space-x-2 border-t border-gray-200 dark:border-gray-700 rounded-b flex-shrink-0">
          {workflowStatus === 'idle' && (
            <button
              onClick={runWorkflow}
              className="text-white bg-brand-blue-600 hover:bg-brand-blue-700 focus:ring-4 focus:outline-none focus:ring-brand-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-brand-blue-500 dark:hover:bg-brand-blue-600 dark:focus:ring-brand-blue-800"
            >
              Start Workflow
            </button>
          )}
          {workflowStatus === 'running' && (
            <button
              disabled
              className="text-white bg-brand-blue-400 dark:bg-brand-blue-800 cursor-not-allowed font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
            >
              <SpinnerIcon className="w-4 h-4 mr-2 animate-spin"/>
              Running...
            </button>
          )}
           {workflowStatus === 'done' && (
            <button
              onClick={onClose}
              className="text-white bg-brand-blue-600 hover:bg-brand-blue-700 focus:ring-4 focus:outline-none focus:ring-brand-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-brand-blue-500 dark:hover:bg-brand-blue-600 dark:focus:ring-brand-blue-800"
            >
              Finish
            </button>
          )}
          <button onClick={onClose} type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">
             {workflowStatus === 'done' ? 'Close' : 'Cancel'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkflowModal;