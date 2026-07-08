import { Deal, Comment, Task, SharedDocument } from '../types';

/**
 * Deal Actions - Frontend helpers to call CRUD APIs on our Express server.
 * This guarantees proper server synchronization and persistence across page reloads.
 */

export const fetchDealsFromApi = async (): Promise<Deal[]> => {
  const response = await fetch('/api/deals');
  if (!response.ok) {
    throw new Error('Failed to fetch deals from server');
  }
  return response.json();
};

export const addDealToApi = async (deal: Omit<Deal, 'id'> & { id?: number }): Promise<Deal> => {
  const response = await fetch('/api/deals', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(deal),
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Failed to create deal on server');
  }
  return response.json();
};

export const updateDealInApi = async (deal: Deal): Promise<Deal> => {
  const response = await fetch(`/api/deals/${deal.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(deal),
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Failed to update deal on server');
  }
  return response.json();
};

export const deleteDealFromApi = async (id: number): Promise<boolean> => {
  const response = await fetch(`/api/deals/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Failed to delete deal from server');
  }
  const result = await response.json();
  return result.success;
};

export const fetchCommentsFromApi = async (): Promise<Comment[]> => {
  const response = await fetch('/api/comments');
  if (!response.ok) {
    throw new Error('Failed to fetch comments from server');
  }
  return response.json();
};

export const addCommentToApi = async (comment: Partial<Comment>): Promise<Comment> => {
  const response = await fetch('/api/comments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(comment),
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Failed to add comment on server');
  }
  return response.json();
};

export const fetchTasksFromApi = async (): Promise<Task[]> => {
  const response = await fetch('/api/tasks');
  if (!response.ok) {
    throw new Error('Failed to fetch tasks from server');
  }
  return response.json();
};

export const saveTaskToApi = async (task: Task): Promise<Task> => {
  const response = await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Failed to save task on server');
  }
  return response.json();
};

export const fetchDocumentsFromApi = async (): Promise<SharedDocument[]> => {
  const response = await fetch('/api/documents');
  if (!response.ok) {
    throw new Error('Failed to fetch documents from server');
  }
  return response.json();
};

export const saveDocumentToApi = async (doc: SharedDocument): Promise<SharedDocument> => {
  const response = await fetch('/api/documents', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(doc),
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Failed to save document on server');
  }
  return response.json();
};
