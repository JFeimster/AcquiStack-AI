


import React, { useState, useCallback, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { Comment, Task, User, SharedDocument, VDRChatMessage, AgentModule, DiligenceItem } from '../types';
import { FilePdfIcon, FileDocIcon, FileGenericIcon, TrashIcon, UploadIcon, CheckCircleIcon, XCircleIcon, SpinnerIcon, SparklesIcon, AlertIcon, DealTalkCopilotIcon, ChecklistIcon, ChatBubbleIcon, SummarizerIcon } from './icons';
import DocumentDetailModal from './DocumentDetailModal';
import VDRChat from './VDRChat';
import DueDiligenceChecklist from './DueDiligenceChecklist';

interface DealRoomProps {
  currentUser: User;
  users: User[];
  comments: Comment[];
  tasks: Task[];
  documents: SharedDocument[];
  diligenceItems: DiligenceItem[];
  onAddComment: (text: string) => void;
  onAddTask: (text: string, assigneeId?: number) => void;
  onToggleTask: (id: number) => void;
  onUploadDocument: (file: File) => void;
  onDeleteDocument: (id: number) => void;
  onUpdateDiligenceItem: (itemId: number, updates: Partial<DiligenceItem>) => void;
  vdrChatHistory: VDRChatMessage[];
  onVDRQuery: (query: string) => void;
  isVdrQueryLoading: boolean;
  onSelectAgent: (agent: AgentModule) => void;
  agents: AgentModule[];
  onSuggestTasks: () => void;
  isSuggestingTasks: boolean;
}

const DealRoom: React.FC<DealRoomProps> = (props) => {
  const [activeTab, setActiveTab] = useState('diligence');
  
  const tabs = [
    { id: 'diligence', name: 'Due Diligence', Icon: ChecklistIcon },
    { id: 'documents', name: 'Documents & VDR', Icon: UploadIcon },
    { id: 'discussion', name: 'Discussion & Tasks', Icon: ChatBubbleIcon },
  ];

  return (
    <div>
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                            ${activeTab === tab.id
                                ? 'border-brand-blue-500 text-brand-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                            }
                            whitespace-nowrap flex py-4 px-1 border-b-2 font-medium text-sm transition-colors items-center
                        `}
                    >
                        <tab.Icon className="w-5 h-5 mr-2" />
                        {tab.name}
                    </button>
                ))}
            </nav>
        </div>
        <div>
            {activeTab === 'diligence' && (
                <DueDiligenceChecklist 
                    items={props.diligenceItems}
                    documents={props.documents}
                    users={props.users}
                    onUpdateItem={props.onUpdateDiligenceItem}
                />
            )}
            {activeTab === 'documents' && (
                <DocumentsVDR {...props} />
            )}
            {activeTab === 'discussion' && (
                <DiscussionTasks {...props} />
            )}
        </div>
    </div>
  );
};

const DocumentsVDR: React.FC<DealRoomProps> = ({ 
    documents, onUploadDocument, onDeleteDocument, currentUser, 
    vdrChatHistory, onVDRQuery, isVdrQueryLoading 
}) => {
    const [selectedDocument, setSelectedDocument] = useState<SharedDocument | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
          onUploadDocument(acceptedFiles[0]);
        }
    }, [onUploadDocument]);
    
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'] },
        multiple: false,
    });

    const getFileIcon = (type: SharedDocument['type']) => {
        switch(type) {
            case 'PDF': return <FilePdfIcon className="w-6 h-6 text-red-500 flex-shrink-0" />;
            case 'Word': return <FileDocIcon className="w-6 h-6 text-blue-500 flex-shrink-0" />;
            case 'Spreadsheet': return <FileGenericIcon className="w-6 h-6 text-green-500 flex-shrink-0" />;
            default: return <FileGenericIcon className="w-6 h-6 text-gray-500 flex-shrink-0" />;
        }
    };

    const getStatusIcon = (state: SharedDocument['analysisState']) => {
        switch (state) {
            case 'analyzing': return <SpinnerIcon className="w-5 h-5 text-blue-500 animate-spin" />;
            case 'complete': return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
            case 'error': return <XCircleIcon className="w-5 h-5 text-red-500" />;
            default: return null;
        }
    };

    const canDelete = currentUser.role === 'Admin' || currentUser.role === 'Broker';

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">VDR Documents</h3>
                    <div {...getRootProps()} className={`flex flex-col items-center justify-center w-full p-4 mb-4 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDragActive ? 'border-brand-blue-500 bg-brand-blue-50 dark:bg-gray-800' : 'border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800/60'}`}>
                        <input {...getInputProps()} />
                        <UploadIcon className="w-8 h-8 mb-2 text-gray-400" />
                        <p className="text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop a PDF</p>
                    </div>
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                        {documents.map(doc => (
                            <div key={doc.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                                <button onClick={() => setSelectedDocument(doc)} className="flex items-center space-x-3 overflow-hidden text-left flex-grow">
                                    {getFileIcon(doc.type)}
                                    <div className="overflow-hidden">
                                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{doc.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{doc.size} - {new Date(doc.uploadedAt).toLocaleDateString()}</p>
                                    </div>
                                </button>
                                <div className="flex items-center space-x-2 pl-2">
                                    {getStatusIcon(doc.analysisState)}
                                    {canDelete && (<button onClick={() => onDeleteDocument(doc.id)} className="text-gray-400 hover:text-red-500 p-1"><TrashIcon className="w-4 h-4" /></button>)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Updated: VDRChat now takes onUploadDocument for direct dropping */}
                <VDRChat 
                    history={vdrChatHistory} 
                    onQuery={onVDRQuery} 
                    isLoading={isVdrQueryLoading} 
                    onUploadDocument={onUploadDocument} 
                />
            </div>
            {selectedDocument && <DocumentDetailModal document={selectedDocument} isOpen={!!selectedDocument} onClose={() => setSelectedDocument(null)} />}
        </>
    );
};

const TaskItem: React.FC<{
    task: Task;
    onToggleTask: (id: number) => void;
    users: User[];
    level?: number;
}> = ({ task, onToggleTask, users, level = 0 }) => (
    <div className="w-full">
        <div style={{ paddingLeft: `${level * 24}px` }} className={`flex items-center justify-between py-1.5 pr-2 rounded-md ${level > 0 ? 'bg-gray-50 dark:bg-gray-800/50' : ''}`}>
            <div className="flex items-center flex-1 min-w-0">
                <input
                    id={`task-${task.id}`}
                    type="checkbox"
                    checked={task.status === 'Completed'}
                    onChange={() => onToggleTask(task.id)}
                    className="h-4 w-4 rounded border-gray-300 text-brand-blue-600 focus:ring-brand-blue-500"
                />
                <label
                    htmlFor={`task-${task.id}`}
                    className={`ml-3 text-sm text-gray-800 dark:text-gray-200 truncate ${task.status === 'Completed' ? 'line-through text-gray-500' : ''}`}
                >
                    {task.text}
                </label>
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                {task.source === 'ai' && <div title="Suggested by AI"><SparklesIcon className="w-4 h-4 text-yellow-500" /></div>}
                {task.dueDate && <span className="text-xs text-gray-500">{new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>}
                {task.assignee && (
                    <div title={`Assigned to ${task.assignee.name}`}>
                        <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold bg-gray-500">
                            {task.assignee.avatarInitials}
                        </div>
                    </div>
                )}
            </div>
        </div>
        {task.subtasks && task.subtasks.map(subtask => (
            <TaskItem key={subtask.id} task={subtask} onToggleTask={onToggleTask} users={users} level={level + 1} />
        ))}
    </div>
);


const DiscussionTasks: React.FC<DealRoomProps> = ({ 
    currentUser, users, comments, tasks, onAddComment, onAddTask, 
    onToggleTask, onSelectAgent, agents, onSuggestTasks, isSuggestingTasks
}) => {
    const [newComment, setNewComment] = useState('');
    const [newTask, setNewTask] = useState('');
    const [newAssigneeId, setNewAssigneeId] = useState<string>('');
    const [filterAssignee, setFilterAssignee] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [sortBy, setSortBy] = useState<string>('dueDate');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newComment.trim()) {
            onAddComment(newComment.trim());
            setNewComment('');
        }
    };

    const handleTaskSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTask.trim()) {
            onAddTask(newTask.trim(), newAssigneeId ? parseInt(newAssigneeId) : undefined);
            setNewTask('');
            setNewAssigneeId('');
        }
    };
    
    const handleEngageCopilot = (agentId: 'dealtalk_copilot' | 'discussion_summarizer') => {
        const copilotAgent = agents.find(a => a.id === agentId);
        if (copilotAgent) onSelectAgent(copilotAgent);
    };

    const processedTasks = useMemo(() => {
        const recursiveFilter = (tasksToFilter: Task[]): [Task[], boolean] => {
            let containsMatch = false;
            const filtered = tasksToFilter.reduce((acc, task) => {
                const [filteredSubtasks, subtasksContainMatch] = task.subtasks ? recursiveFilter(task.subtasks) : [[], false];

                const assigneeMatch = filterAssignee === 'all' || (task.assignee && task.assignee.id === parseInt(filterAssignee));
                const statusMatch = filterStatus === 'all' ||
                                    (filterStatus === 'pending' && task.status !== 'Completed') ||
                                    (filterStatus === 'completed' && task.status === 'Completed');
                
                const currentTaskMatches = assigneeMatch && statusMatch;

                if (currentTaskMatches || subtasksContainMatch) {
                    acc.push({ ...task, subtasks: filteredSubtasks });
                    containsMatch = true;
                }
                
                return acc;
            }, [] as Task[]);
            return [filtered, containsMatch];
        };

        let [finalTasks] = recursiveFilter(tasks);

        finalTasks.sort((a, b) => {
            let compareA: any;
            let compareB: any;

            if (sortBy === 'dueDate') {
                compareA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
                compareB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
            } else if (sortBy === 'assignee') {
                compareA = a.assignee?.name || 'zzz';
                compareB = b.assignee?.name || 'zzz';
            } else { // status
                compareA = a.status === 'Completed';
                compareB = b.status === 'Completed';
            }

            if (compareA < compareB) return sortDirection === 'asc' ? -1 : 1;
            if (compareA > compareB) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        return finalTasks;
    }, [tasks, filterAssignee, filterStatus, sortBy, sortDirection]);
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">Deal Discussion</h3>
                    <button 
                        onClick={() => handleEngageCopilot('discussion_summarizer')} 
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-brand-blue-600 hover:bg-brand-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue-500"
                    >
                       <SummarizerIcon className="w-4 h-4 mr-2" /> Get AI Summary
                    </button>
                </div>
                <div className="space-y-4 max-h-[30rem] overflow-y-auto pr-2">
                {comments.map(comment => (
                    <div key={comment.id} className="flex items-start space-x-3">
                        <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold bg-gray-500`}>
                            {comment.user.avatarInitials}
                        </div>
                        <div className="flex-1">
                            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">{comment.user.name}</p>
                                <p className="text-sm text-gray-700 dark:text-gray-300">{comment.text}</p>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{new Date(comment.timestamp).toLocaleString()}</p>
                            {comment.risk?.isRisk && (
                                <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-md border border-yellow-200 dark:border-yellow-800/50">
                                    <div className="flex items-start space-x-2">
                                        <AlertIcon className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-xs font-semibold text-yellow-800 dark:text-yellow-300">AI Risk Flag</p>
                                            <p className="text-xs text-yellow-700 dark:text-yellow-400">{comment.risk.summary}</p>
                                        </div>
                                    </div>
                                    {comment.risk.suggestsCopilot && (
                                        <button onClick={() => handleEngageCopilot('dealtalk_copilot')} className="mt-2 text-xs font-semibold text-brand-blue-700 dark:text-brand-blue-400 hover:underline flex items-center">
                                            <DealTalkCopilotIcon className="w-4 h-4 mr-1.5" /> Engage DealTalk Copilot
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                </div>
                <form onSubmit={handleCommentSubmit} className="mt-4 flex space-x-2">
                    <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Add a comment..." className="flex-1 p-2 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-brand-blue-500 focus:border-brand-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" />
                    <button type="submit" className="text-white bg-brand-blue-600 hover:bg-brand-blue-700 font-medium rounded-lg text-sm px-4 py-2">Send</button>
                </form>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">Task Checklist</h3>
                    <button
                        onClick={onSuggestTasks}
                        disabled={isSuggestingTasks}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-brand-blue-600 hover:bg-brand-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue-500 disabled:bg-brand-blue-400 disabled:cursor-wait"
                    >
                        {isSuggestingTasks ? 
                            <SpinnerIcon className="w-4 h-4 mr-2 animate-spin" /> : 
                            <SparklesIcon className="w-4 h-4 mr-2" />
                        }
                        {isSuggestingTasks ? 'Suggesting...' : 'AI Suggest Tasks'}
                    </button>
                </div>
                <div className="flex flex-wrap gap-4 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex-grow">
                        <label className="text-xs text-gray-500">Filter by Assignee</label>
                        <select value={filterAssignee} onChange={e => setFilterAssignee(e.target.value)} className="w-full text-sm p-1.5 border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                            <option value="all">All Users</option>
                            {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                        </select>
                    </div>
                     <div className="flex-grow">
                        <label className="text-xs text-gray-500">Filter by Status</label>
                        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="w-full text-sm p-1.5 border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                            <option value="all">All</option>
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                     <div className="flex-grow">
                        <label className="text-xs text-gray-500">Sort By</label>
                        <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="w-full text-sm p-1.5 border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                            <option value="dueDate">Due Date</option>
                            <option value="assignee">Assignee</option>
                            <option value="status">Status</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 invisible">Direction</label>
                        <button onClick={() => setSortDirection(d => d === 'asc' ? 'desc' : 'asc')} className="w-full text-sm p-1.5 border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                           {sortDirection === 'asc' ? '↑ Asc' : '↓ Desc'}
                        </button>
                    </div>
                </div>
                <div className="space-y-1 max-h-[24rem] overflow-y-auto pr-2">
                    {processedTasks.map(task => (
                        <TaskItem key={task.id} task={task} onToggleTask={onToggleTask} users={users} />
                    ))}
                </div>
                <form onSubmit={handleTaskSubmit} className="mt-4 space-y-2">
                    <input type="text" value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="Add a new task..." className="w-full p-2 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-brand-blue-500 focus:border-brand-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" />
                    <div className="flex space-x-2">
                        <select value={newAssigneeId} onChange={(e) => setNewAssigneeId(e.target.value)} className="flex-1 p-2 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-brand-blue-500 focus:border-brand-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                            <option value="">Assign to...</option>
                            {users.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
                        </select>
                        <button type="submit" className="text-white bg-brand-blue-600 hover:bg-brand-blue-700 font-medium rounded-lg text-sm px-4 py-2">Add Task</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DealRoom;
