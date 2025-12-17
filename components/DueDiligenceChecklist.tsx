import React, { useState, useMemo } from 'react';
import { DiligenceItem, DiligenceParty, SharedDocument, User, DiligenceStatus } from '../types';
import { DILIGENCE_STAGES } from '../constants';
import { BuyerIcon, SellerIcon, InternalIcon, LenderIcon, LinkIcon, FilePdfIcon } from './icons';
import LinkDocumentModal from './LinkDocumentModal';

interface DueDiligenceChecklistProps {
    items: DiligenceItem[];
    documents: SharedDocument[];
    users: User[];
    onUpdateItem: (itemId: number, updates: Partial<DiligenceItem>) => void;
}

const partyIcons: Record<DiligenceParty, React.FC<{ className?: string }>> = {
    'Buyer': BuyerIcon,
    'Seller': SellerIcon,
    'Internal': InternalIcon,
    'Lender': LenderIcon,
};

const statusColors: Record<DiligenceStatus, { bg: string; text: string }> = {
    'Pending': { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-800 dark:text-gray-300' },
    'In Review': { bg: 'bg-yellow-100 dark:bg-yellow-900', text: 'text-yellow-800 dark:text-yellow-300' },
    'Completed': { bg: 'bg-green-100 dark:bg-green-900', text: 'text-green-800 dark:text-green-300' },
    'Not Applicable': { bg: 'bg-gray-200 dark:bg-gray-600', text: 'text-gray-500 dark:text-gray-400' },
};


const DueDiligenceChecklist: React.FC<DueDiligenceChecklistProps> = ({ items, documents, users, onUpdateItem }) => {
    const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
    const [currentItemId, setCurrentItemId] = useState<number | null>(null);

    const handleOpenLinkModal = (itemId: number) => {
        setCurrentItemId(itemId);
        setIsLinkModalOpen(true);
    };

    const handleLinkDocument = (documentId: number | null) => {
        if (currentItemId !== null) {
            onUpdateItem(currentItemId, { linkedDocumentId: documentId });
        }
        setIsLinkModalOpen(false);
        setCurrentItemId(null);
    };

    const groupedItems = useMemo(() => {
        return DILIGENCE_STAGES.map(stage => ({
            ...stage,
            items: items.filter(item => item.stage === stage.id)
        }));
    }, [items]);

    return (
        <div className="space-y-8">
            {groupedItems.map((stage) => {
                const completedCount = stage.items.filter(item => item.status === 'Completed').length;
                const totalCount = stage.items.length;
                const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
                const StageIcon = stage.Icon;

                return (
                    <div key={stage.id} className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
                        <div className="flex items-center mb-1">
                            <StageIcon className="w-8 h-8 text-brand-blue-600 dark:text-brand-blue-400 mr-3 flex-shrink-0" />
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white">{stage.id}: {stage.title}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{stage.description}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 my-4">
                             <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                <div className="bg-brand-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                            </div>
                             <span className="text-sm font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">{completedCount} / {totalCount}</span>
                        </div>


                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 w-2/5">Item</th>
                                        <th scope="col" className="px-6 py-3">Party</th>
                                        <th scope="col" className="px-6 py-3">Status</th>
                                        <th scope="col" className="px-6 py-3">Assignee</th>
                                        <th scope="col" className="px-6 py-3">Linked Document</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stage.items.map(item => {
                                        const linkedDoc = documents.find(doc => doc.id === item.linkedDocumentId);
                                        const PartyIcon = partyIcons[item.party];
                                        return (
                                            <tr key={item.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{item.text}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        <PartyIcon className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                                                        <span>{item.party}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <select value={item.status} onChange={(e) => onUpdateItem(item.id, { status: e.target.value as DiligenceStatus })} className={`text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full border-none outline-none focus:ring-2 focus:ring-brand-blue-500 ${statusColors[item.status].bg} ${statusColors[item.status].text}`}>
                                                        <option>Pending</option>
                                                        <option>In Review</option>
                                                        <option>Completed</option>
                                                        <option>Not Applicable</option>
                                                    </select>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <select value={item.assigneeId ?? ''} onChange={(e) => onUpdateItem(item.id, { assigneeId: e.target.value ? parseInt(e.target.value) : null })} className="text-sm bg-transparent border-none focus:ring-0 p-1">
                                                        <option value="">Unassigned</option>
                                                        {users.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
                                                    </select>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {linkedDoc ? (
                                                        <div className="flex items-center space-x-2">
                                                            <FilePdfIcon className="w-4 h-4 text-gray-500" />
                                                            <span className="text-gray-700 dark:text-gray-300">{linkedDoc.name}</span>
                                                        </div>
                                                    ) : (
                                                        <button onClick={() => handleOpenLinkModal(item.id)} className="flex items-center text-brand-blue-600 hover:underline">
                                                            <LinkIcon className="w-4 h-4 mr-1" /> Link
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            })}
            {isLinkModalOpen && (
                <LinkDocumentModal
                    isOpen={isLinkModalOpen}
                    onClose={() => setIsLinkModalOpen(false)}
                    documents={documents}
                    onLinkDocument={handleLinkDocument}
                />
            )}
        </div>
    );
};

export default DueDiligenceChecklist;