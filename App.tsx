



import React, { useState, useCallback, useEffect, useRef } from 'react';
import { AGENT_MODULES, WORKFLOW_MODULES, initialDeals, initialComments, initialTasks, dealRoomUsers, currentUser as initialUser, initialDocuments, initialDiligenceChecklist, AFFILIATE_LENDERS } from './constants';
import { AgentModule, Deal, AgentResult, DocumentAnalysisResult, Comment, Task, User, SharedDocument, VDRChatMessage, UserRole, AIRecommendation, WorkflowModule, DiligenceItem, Scenario } from './types';
import { runAgent, analyzeDocument, analyzeVDRDocument, queryVDR, suggestTasksFromDocument, analyzeCommentForRisks, getAIRecommendations, suggestDealTasks } from './services/geminiService';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import AgentCard from './components/AgentCard';
import AgentModal from './components/AgentModal';
import DealInfoForm from './components/DealInfoForm';
import VoiceAssistant from './components/VoiceAssistant';
import DocumentAnalyzer from './components/DocumentAnalyzer';
import DealRoom from './components/DealRoom';
import Tabs from './components/Tabs';
import Toast from './components/Toast';
import AIRecommendations from './components/AIRecommendations';
import WorkflowCard from './components/WorkflowCard';
import WorkflowModal from './components/WorkflowModal';
import DealDashboard from './components/DealDashboard';
import ScenarioDashboard from './components/ScenarioDashboard';
import { MicrophoneIcon } from './components/icons';
import LiveDataAgentModal from './components/LiveDataAgentModal';
import SyndicateEngine from './components/SyndicateEngine';
import ReportModal from './components/ReportModal';
import SubmissionModal from './components/SubmissionModal';
import FundingMarketplace from './components/FundingMarketplace';
import ToolsCalculators from './components/ToolsCalculators';

const flattenTasksForApp = (tasks: Task[]): Task[] => {
    let allTasks: Task[] = [];
    tasks.forEach(task => {
        allTasks.push(task);
        if (task.subtasks) {
            allTasks = allTasks.concat(flattenTasksForApp(task.subtasks));
        }
    });
    return allTasks;
};

const App: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<AgentModule | null>(null);
  const [selectedLiveDataAgent, setSelectedLiveDataAgent] = useState<AgentModule | null>(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowModule | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<AgentResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // New state for multi-deal management
  const [deals, setDeals] = useState<Deal[]>(initialDeals);
  const [currentDeal, setCurrentDeal] = useState<Deal | null>(null);

  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('analysis');
  
  // State for new features
  const [isAnalyzingDoc, setIsAnalyzingDoc] = useState(false);
  const [docAnalysisResult, setDocAnalysisResult] = useState<DocumentAnalysisResult | null>(null);
  const [docAnalysisError, setDocAnalysisError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [isRecommendationsLoading, setIsRecommendationsLoading] = useState(false);
  const recommendationTimeoutRef = useRef<number | null>(null);
  const [isSuggestingTasks, setIsSuggestingTasks] = useState(false);
  const isInitialImport = useRef(false);


  // Syndicate Engine State
  const [reportType, setReportType] = useState<'investment_memo' | 'lender_package' | null>(null);
  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);
  const [submissionLender, setSubmissionLender] = useState<string | null>(null);


  // Deal Room State
  const [currentUser, setCurrentUser] = useState<User>(initialUser);
  const [users, setUsers] = useState<User[]>(dealRoomUsers);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [documents, setDocuments] = useState<SharedDocument[]>(initialDocuments);
  const [vdrChatHistory, setVdrChatHistory] = useState<VDRChatMessage[]>([]);
  const [isVdrQueryLoading, setIsVdrQueryLoading] = useState(false);

  // FIX: Moved handleSelectAgent before the useEffect that uses it to fix block-scoped variable error.
  const handleSelectAgent = useCallback((agent: AgentModule) => {
    if (agent.id === 'live_liquidity_agent' || agent.id === 'live_financials_agent') {
        setSelectedLiveDataAgent(agent);
    } else {
        setSelectedAgent(agent);
        setResult(null);
        setError(null);
    }
  }, []);

  // Effect to handle importing deal data from the browser extension via URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const dealName = params.get('deal_name');
    const purchasePriceStr = params.get('purchase_price');
    const industry = params.get('industry');
    const purchaseType = params.get('purchase_type');

    if (dealName || purchasePriceStr || industry || purchaseType) {
        const newDealFromExtension: Deal = {
            id: Date.now(),
            status: 'Initial Analysis',
            deal_name: dealName || "Imported Deal",
            purchase_type: (['asset', 'stock', 'leveraged_buyout', 'management_buyout', 'franchise'].includes(purchaseType || '') ? purchaseType : 'asset') as Deal['purchase_type'],
            industry: industry || '',
            business_location: 'US-based',
            purchase_price: purchasePriceStr ? parseFloat(purchasePriceStr) : 0,
            revenue_ttm: 0,
            ebitda_ttm: 0,
            working_capital: 0,
            closing_costs: 0,
            fees: 0,
            borrower_profile: {
                liquidity: { cash: 0, brokerage: 0, cds: 0, hsas: 0, rsus: 0 },
                debt_capacity: { heloc_limit: 0, portfolio_line: 0 },
                retirement_assets: { balance: 0, robs_interest: false },
                credit_score_band: '720+',
                on_parole: false,
            },
            seller_note: {
                proposed_amount: 0,
                standby_full_life: false,
                interest: 0,
            },
            gifts: [],
            third_party_equity: [],
            rollover_equity: 0,
            lender_overlays: {
                seller_note_counts: false,
                gift_ok: true,
                min_borrower_cash_pct: 0.10,
            },
            diligenceItems: initialDiligenceChecklist.map(item => ({...item, id: Date.now() + Math.random()})),
            scenarios: [],
        };
        
        setDeals(prev => [newDealFromExtension, ...prev]);
        setCurrentDeal(newDealFromExtension);
        isInitialImport.current = true;
        
        // Clean the URL to avoid re-importing on refresh
        window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Effect to run "AI First Look" on a deal imported from the extension
  useEffect(() => {
    if (currentDeal && isInitialImport.current) {
        isInitialImport.current = false; // Reset the flag so it only runs once per import

        const agentToRun = AGENT_MODULES.find(a => a.id === 'sba_eligibility_screener');
        if (agentToRun) {
            // Open the modal for this agent
            handleSelectAgent(agentToRun);
            
            // Immediately trigger the agent's logic
            const runAutoAnalysis = async () => {
                setIsLoading(true);
                setResult(null);
                setError(null);
                try {
                    const response = await runAgent(agentToRun, currentDeal, 'Perform initial screen based on imported data.');
                    setResult(response);
                } catch (err) {
                    setError(err instanceof Error ? err.message : 'Initial AI analysis failed.');
                } finally {
                    setIsLoading(false);
                }
            };
            
            runAutoAnalysis();
        }
    }
  }, [currentDeal, handleSelectAgent]);


  // Effect for fetching AI recommendations with debouncing, now dependent on currentDeal, tasks, and comments
  useEffect(() => {
    if (!currentDeal) {
        setRecommendations([]);
        return;
    };

    if (recommendationTimeoutRef.current) {
        clearTimeout(recommendationTimeoutRef.current);
    }
    
    setIsRecommendationsLoading(true);

    recommendationTimeoutRef.current = window.setTimeout(async () => {
        try {
            const newRecommendations = await getAIRecommendations(currentDeal, tasks, comments, documents);
            setRecommendations(newRecommendations);
        } catch (error) {
            console.error("Failed to fetch AI recommendations:", error);
            setRecommendations([]);
        } finally {
            setIsRecommendationsLoading(false);
        }
    }, 1500);

    return () => {
        if (recommendationTimeoutRef.current) {
            clearTimeout(recommendationTimeoutRef.current);
        }
    };
  }, [currentDeal, tasks, comments, documents]);

  const handleSelectWorkflow = useCallback((workflow: WorkflowModule) => {
    setSelectedWorkflow(workflow);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedAgent(null);
  }, []);
  
  const handleCloseLiveDataModal = useCallback(() => {
    setSelectedLiveDataAgent(null);
  }, []);

  const handleCloseWorkflowModal = useCallback(() => {
    setSelectedWorkflow(null);
  }, []);
  
  const handleNewQuery = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  const handleSubmitAgent = useCallback(async (specificInput: string) => {
    if (!selectedAgent) return;
    setIsLoading(true);
    setResult(null);
    setError(null);
    try {
      let context: any = currentDeal;
      if (selectedAgent.id === 'discussion_summarizer') {
          context = { comments: comments.map(c => ({ user: c.user.name, text: c.text })) };
      }

      const response = await runAgent(selectedAgent, context, specificInput);
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedAgent, currentDeal, comments]);
  
  const handleCurrentDealChange = useCallback((updater: React.SetStateAction<Deal | null>) => {
    setCurrentDeal(prevDeal => {
        const updatedDeal = typeof updater === 'function' ? updater(prevDeal!) : updater;
        if (updatedDeal) {
          setDeals(prevDeals => prevDeals.map(d => d.id === updatedDeal.id ? updatedDeal : d));
        }
        return updatedDeal;
    });
  }, []);

  const handleUpdateDiligenceItem = useCallback((itemId: number, updates: Partial<DiligenceItem>) => {
    setCurrentDeal(prevDeal => {
        if (!prevDeal) return null;

        const updatedItems = prevDeal.diligenceItems.map(item =>
            item.id === itemId ? { ...item, ...updates } : item
        );

        const updatedDeal = { ...prevDeal, diligenceItems: updatedItems };

        setDeals(prevDeals => prevDeals.map(d => d.id === updatedDeal.id ? updatedDeal : d));
        return updatedDeal;
    });
  }, []);

  const handleAnalyzeDocument = useCallback(async (file: File) => {
    if (!currentDeal) return;
    setIsAnalyzingDoc(true);
    setDocAnalysisResult(null);
    setDocAnalysisError(null);
    try {
      const response = await analyzeDocument(file);
      setDocAnalysisResult(response);
      
      handleCurrentDealChange(prev => {
        if (!prev) return null;
        return {
        ...prev,
        deal_name: response.extracted_data.deal_name || prev.deal_name,
        purchase_price: response.extracted_data.purchase_price || prev.purchase_price,
        industry: response.extracted_data.industry || prev.industry,
        revenue_ttm: response.extracted_data.revenue_ttm || prev.revenue_ttm,
        ebitda_ttm: response.extracted_data.ebitda_ttm || prev.ebitda_ttm,
      }});

    } catch (err) {
      setDocAnalysisError(err instanceof Error ? err.message : 'Failed to analyze document.');
    } finally {
      setIsAnalyzingDoc(false);
    }
  }, [currentDeal, handleCurrentDealChange]);

  // Task Management Handlers
  const handleUpdateTask = useCallback((taskId: number, updates: Partial<Omit<Task, 'id' | 'subtasks'>>) => {
      const updateRecursively = (tasksToSearch: Task[]): Task[] => {
          return tasksToSearch.map(task => {
              if (task.id === taskId) {
                  return { ...task, ...updates };
              }
              if (task.subtasks) {
                  return { ...task, subtasks: updateRecursively(task.subtasks) };
              }
              return task;
          });
      };
      setTasks(prevTasks => updateRecursively(prevTasks));
  }, []);

  const handleAddTask = useCallback((text: string, parentId: number | null = null, assigneeId?: number, source: 'user' | 'ai' = 'user') => {
      const assignee = assigneeId ? users.find(u => u.id === assigneeId) : undefined;
      const newTask: Task = {
          id: Date.now(),
          text,
          status: 'Pending',
          source,
          assignee,
          subtasks: []
      };

      if (parentId === null) {
          setTasks(prev => [...prev, newTask]);
      } else {
          const addRecursively = (tasksToSearch: Task[]): Task[] => {
              return tasksToSearch.map(task => {
                  if (task.id === parentId) {
                      return { ...task, subtasks: [...(task.subtasks || []), newTask] };
                  }
                  if (task.subtasks) {
                      return { ...task, subtasks: addRecursively(task.subtasks) };
                  }
                  return task;
              });
          };
          setTasks(prevTasks => addRecursively(prevTasks));
      }
  }, [users]);

  const handleDeleteTask = useCallback((taskId: number) => {
    const deleteRecursively = (tasksToSearch: Task[]): Task[] => {
        return tasksToSearch.filter(task => {
            if (task.id === taskId) {
                return false;
            }
            if (task.subtasks) {
                task.subtasks = deleteRecursively(task.subtasks);
            }
            return true;
        });
    };
    setTasks(prevTasks => deleteRecursively(prevTasks));
  }, []);

  const handleAddTaskFromAI = useCallback((text: string) => {
    handleAddTask(text, null, undefined, 'ai');
  }, [handleAddTask]);
  
  const handleAddComment = async (text: string) => {
    const newCommentId = Date.now();
    const newComment: Comment = { id: newCommentId, user: currentUser, text, timestamp: new Date().toISOString() };
    setComments(prev => [...prev, newComment]);

    const riskResult = await analyzeCommentForRisks(text);
    if (riskResult.isRisk) {
      setComments(prev => prev.map(c => c.id === newCommentId ? { ...c, risk: riskResult } : c));
    }
  };
  
  const handleUploadDocument = async (file: File) => {
    const newDocId = Date.now();
    const newFile: SharedDocument = {
        id: newDocId,
        name: file.name,
        type: file.type.includes('pdf') ? 'PDF' : file.type.includes('word') ? 'Word' : file.type.includes('sheet') ? 'Spreadsheet' : 'Other',
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        uploadedAt: new Date().toISOString(),
        analysisState: 'analyzing',
    };
    setDocuments(prev => [newFile, ...prev]);

    try {
        const analysisResult = await analyzeVDRDocument(file);
        setDocuments(prev => prev.map(doc => doc.id === newDocId ? { ...doc, analysisState: 'complete', analysis: analysisResult } : doc));
        
        const suggestedTasks = await suggestTasksFromDocument(file.name, analysisResult.summary);
        if (suggestedTasks.length > 0) {
          suggestedTasks.forEach(task => {
            handleAddTaskFromAI(task.text);
          });
          setToastMessage('AI has suggested new tasks based on the document.');
        }

    } catch (error) {
        console.error("VDR Analysis failed:", error);
        setDocuments(prev => prev.map(doc => doc.id === newDocId ? { ...doc, analysisState: 'error' } : doc));
    }
  };
  
  const handleDeleteDocument = (id: number) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };
  
  const handleVDRQuery = async (query: string) => {
    const userMessage: VDRChatMessage = { 
        id: Date.now(), 
        sender: 'user', 
        text: query,
        timestamp: new Date().toISOString(),
        status: 'sent'
    };
    setVdrChatHistory(prev => [...prev, userMessage]);
    setIsVdrQueryLoading(true);
    
    // Simulate 'delivered' status update
    setTimeout(() => {
        setVdrChatHistory(prev => prev.map(msg => msg.id === userMessage.id ? { ...msg, status: 'delivered' } : msg));
    }, 1000);

    try {
      const responseText = await queryVDR(query, documents);
      const aiMessage: VDRChatMessage = { 
          id: Date.now() + 1, 
          sender: 'ai', 
          text: responseText,
          timestamp: new Date().toISOString()
      };
      
      // Mark user message as read when AI responds
      setVdrChatHistory(prev => [
          ...prev.map(msg => msg.id === userMessage.id ? { ...msg, status: 'read' as 'read' } : msg), 
          aiMessage
      ]);
    } catch (error) {
      const errorMessage: VDRChatMessage = { 
          id: Date.now() + 1, 
          sender: 'ai', 
          text: "Sorry, I encountered an error. Please try again.",
          timestamp: new Date().toISOString()
      };
      setVdrChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsVdrQueryLoading(false);
    }
  };

  const handleSuggestTasks = async () => {
    if (!currentDeal) return;
    setIsSuggestingTasks(true);
    try {
        const suggested = await suggestDealTasks(currentDeal, tasks);
        if (suggested && suggested.length > 0) {
            const existingTaskTexts = new Set(flattenTasksForApp(tasks).map(t => t.text));
            const newUniqueTasks = suggested.filter(t => !existingTaskTexts.has(t.text));

            if (newUniqueTasks.length > 0) {
                newUniqueTasks.forEach(task => handleAddTaskFromAI(task.text));
                setToastMessage(`${newUniqueTasks.length} new task(s) suggested by AI.`);
            } else {
                setToastMessage("AI analysis complete. No new task suggestions at this time.");
            }
        } else {
             setToastMessage("AI analysis complete. No new task suggestions at this time.");
        }
    } catch (error) {
        console.error("Failed to suggest tasks:", error);
        setToastMessage("An error occurred while suggesting tasks.");
    } finally {
        setIsSuggestingTasks(false);
    }
  };

  const handleSelectDeal = (dealId: number) => {
    const deal = deals.find(d => d.id === dealId);
    if (deal) {
      setCurrentDeal(deal);
    }
  };

  const handleBackToDashboard = () => {
    setCurrentDeal(null);
  };

  const handleCreateNewDeal = () => {
    const newDeal: Deal = {
        id: Date.now(),
        status: 'Initial Analysis',
        deal_name: "New Untitled Deal",
        purchase_type: 'asset',
        industry: '',
        business_location: 'US-based',
        purchase_price: 0,
        revenue_ttm: 0,
        ebitda_ttm: 0,
        working_capital: 0,
        closing_costs: 0,
        fees: 0,
        borrower_profile: {
            liquidity: { cash: 0, brokerage: 0, cds: 0, hsas: 0, rsus: 0 },
            debt_capacity: { heloc_limit: 0, portfolio_line: 0 },
            retirement_assets: { balance: 0, robs_interest: false },
            credit_score_band: '720+',
            on_parole: false,
        },
        seller_note: {
            proposed_amount: 0,
            standby_full_life: false,
            interest: 0,
        },
        gifts: [],
        third_party_equity: [],
        rollover_equity: 0,
        lender_overlays: {
            seller_note_counts: false,
            gift_ok: true,
            min_borrower_cash_pct: 0.10,
        },
        diligenceItems: initialDiligenceChecklist.map(item => ({...item, id: Date.now() + Math.random()})),
        scenarios: [],
    };
    setCurrentDeal(newDeal);
    setDeals(prev => [...prev, newDeal]);
  };
  
  const handleToggleTask = useCallback((taskId: number) => {
    const findTask = (tasksToSearch: Task[], id: number): Task | undefined => {
        for (const task of tasksToSearch) {
            if (task.id === id) return task;
            if (task.subtasks) {
                const found = findTask(task.subtasks, id);
                if (found) return found;
            }
        }
        return undefined;
    };

    const taskToToggle = findTask(tasks, taskId);
    if (taskToToggle) {
        handleUpdateTask(taskId, { status: taskToToggle.status === 'Completed' ? 'Pending' : 'Completed' });
    }
}, [tasks, handleUpdateTask]);

  const handleSaveScenario = (name: string, result: AgentResult) => {
    if (!currentDeal || !result.structuredMetrics || !selectedAgent) return;
    const newScenario: Scenario = {
      id: Date.now(),
      name,
      notes: '',
      isPrimary: currentDeal.scenarios.length === 0,
      metrics: result.structuredMetrics,
      agentId: selectedAgent.id,
      fullOutput: result.text
    };
    handleCurrentDealChange(prev => {
        if (!prev) return null;
        return {
            ...prev,
            scenarios: [...prev.scenarios, newScenario]
        }
    });
    setToastMessage("Scenario saved successfully!");
    handleCloseModal();
  };

  const handleUpdateScenario = (scenarioId: number, updates: Partial<Scenario>) => {
    if (!currentDeal) return;
    handleCurrentDealChange(prev => {
        if (!prev) return null;
        return {
            ...prev,
            scenarios: prev.scenarios.map(s => s.id === scenarioId ? { ...s, ...updates } : s)
        }
    });
  };
  
  const handleDeleteScenario = (scenarioId: number) => {
    if (!currentDeal) return;
    handleCurrentDealChange(prev => {
        if (!prev) return null;
        return {
            ...prev,
            scenarios: prev.scenarios.filter(s => s.id !== scenarioId)
        }
    });
  };

  const handleSetPrimaryScenario = (scenarioId: number) => {
    if (!currentDeal) return;
    handleCurrentDealChange(prev => {
        if (!prev) return null;
        return {
            ...prev,
            scenarios: prev.scenarios.map(s => ({ ...s, isPrimary: s.id === scenarioId }))
        }
    });
  };

  const handleRunNewScenario = () => {
    const agent = AGENT_MODULES.find(a => a.id === 'capital_stack_builder');
    if (agent) handleSelectAgent(agent);
  };
  
  const handleGenerateAndSubmit = (lender: string) => {
    setSubmissionLender(lender);
    setIsSubmissionModalOpen(true);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header onDealChange={handleCurrentDealChange as any} currentDeal={currentDeal} onBackToDashboard={handleBackToDashboard} />
      <div className="flex flex-1 overflow-hidden">
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {!currentDeal ? (
            <DealDashboard deals={deals} tasks={tasks} onSelectDeal={handleSelectDeal} onCreateNewDeal={handleCreateNewDeal} />
          ) : (
            <>
              <Tabs activeTab={activeTab} onTabClick={setActiveTab} />
              <div className="mt-8">
                {activeTab === 'analysis' && (
                  <>
                    <DealInfoForm deal={currentDeal} onDealChange={handleCurrentDealChange as any} />
                    <DocumentAnalyzer onAnalyze={handleAnalyzeDocument} isLoading={isAnalyzingDoc} result={docAnalysisResult} error={docAnalysisError} />
                    <AIRecommendations recommendations={recommendations} isLoading={isRecommendationsLoading} onSelectAgent={handleSelectAgent} onAddTask={handleAddTaskFromAI} tasks={tasks} setToastMessage={setToastMessage}/>
                    <div className="mt-8">
                      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Workflow Automation</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {WORKFLOW_MODULES.map(workflow => (
                          <WorkflowCard key={workflow.id} workflow={workflow} onSelect={() => handleSelectWorkflow(workflow)} />
                        ))}
                      </div>
                    </div>
                    <div className="mt-8">
                      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Individual AI Agents</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {AGENT_MODULES.map(agent => (
                          <AgentCard key={agent.id} agent={agent} onSelect={() => handleSelectAgent(agent)} />
                        ))}
                      </div>
                    </div>
                  </>
                )}
                {activeTab === 'scenario_analysis' && (
                  <ScenarioDashboard 
                    scenarios={currentDeal.scenarios} 
                    onUpdateScenario={handleUpdateScenario}
                    onDeleteScenario={handleDeleteScenario}
                    onSetPrimaryScenario={handleSetPrimaryScenario}
                    onRunNewScenario={handleRunNewScenario}
                  />
                )}
                {activeTab === 'deal_room' && (
                  <DealRoom
                    currentUser={currentUser}
                    users={users}
                    comments={comments}
                    tasks={tasks}
                    documents={documents}
                    diligenceItems={currentDeal.diligenceItems}
                    onAddComment={handleAddComment}
                    onAddTask={(text, assigneeId) => handleAddTask(text, null, assigneeId, 'user')}
                    onToggleTask={handleToggleTask}
                    onUploadDocument={handleUploadDocument}
                    onDeleteDocument={handleDeleteDocument}
                    onUpdateDiligenceItem={handleUpdateDiligenceItem}
                    vdrChatHistory={vdrChatHistory}
                    onVDRQuery={handleVDRQuery}
                    isVdrQueryLoading={isVdrQueryLoading}
                    onSelectAgent={handleSelectAgent}
                    agents={AGENT_MODULES}
                    onSuggestTasks={handleSuggestTasks}
                    isSuggestingTasks={isSuggestingTasks}
                  />
                )}
                 {activeTab === 'tools' && (
                  <ToolsCalculators />
                )}
                {activeTab === 'funding' && (
                  <FundingMarketplace 
                    lenders={AFFILIATE_LENDERS}
                    currentDeal={currentDeal}
                  />
                )}
                {activeTab === 'reporting' && (
                  <SyndicateEngine 
                    onGenerateReport={setReportType} 
                    onGenerateAndSubmit={handleGenerateAndSubmit}
                  />
                )}
              </div>
            </>
          )}
        </main>
      </div>

      {/* Modals */}
      {selectedAgent && currentDeal && (
        <AgentModal
          agent={selectedAgent}
          isOpen={!!selectedAgent}
          onClose={handleCloseModal}
          onNewQuery={handleNewQuery}
          onSubmit={handleSubmitAgent}
          isLoading={isLoading}
          result={result}
          error={error}
          setToastMessage={setToastMessage}
          onSaveScenario={handleSaveScenario}
        />
      )}
       {selectedLiveDataAgent && currentDeal && (
        <LiveDataAgentModal
          agent={selectedLiveDataAgent}
          isOpen={!!selectedLiveDataAgent}
          onClose={handleCloseLiveDataModal}
          onUpdateDeal={handleCurrentDealChange as any}
          setToastMessage={setToastMessage}
        />
      )}
       {selectedWorkflow && currentDeal && (
        <WorkflowModal
          workflow={selectedWorkflow}
          isOpen={!!selectedWorkflow}
          onClose={handleCloseWorkflowModal}
          deal={currentDeal}
          runAgent={runAgent}
        />
      )}
      {reportType && currentDeal && (
        <ReportModal 
          isOpen={!!reportType}
          onClose={() => setReportType(null)}
          reportType={reportType}
          deal={currentDeal}
          documents={documents}
          setToastMessage={setToastMessage}
        />
      )}
      {isSubmissionModalOpen && currentDeal && submissionLender && (
        <SubmissionModal
            isOpen={isSubmissionModalOpen}
            onClose={() => setIsSubmissionModalOpen(false)}
            deal={currentDeal}
            lender={submissionLender}
            setToastMessage={setToastMessage}
        />
      )}


      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      
      {currentDeal && (<button
        onClick={() => setIsVoiceAssistantOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-brand-blue-600 text-white rounded-full shadow-lg hover:bg-brand-blue-700 transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue-500"
        aria-label="Open Voice Assistant"
      >
        <MicrophoneIcon className="w-8 h-8" />
      </button>)}

      {isVoiceAssistantOpen && currentDeal && (
        <VoiceAssistant
          isOpen={isVoiceAssistantOpen}
          onClose={() => setIsVoiceAssistantOpen(false)}
          deal={currentDeal}
        />
      )}
    </div>
  );
};

export default App;
