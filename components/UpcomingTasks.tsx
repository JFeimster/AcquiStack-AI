
import React, { useMemo } from 'react';
import { Task } from '../types';
import { ChecklistIcon, ClockIcon } from './icons';

interface UpcomingTasksProps {
    tasks: Task[];
}

const flattenTasks = (tasks: Task[]): Task[] => {
    let allTasks: Task[] = [];
    tasks.forEach(task => {
        allTasks.push(task);
        if (task.subtasks) {
            allTasks = allTasks.concat(flattenTasks(task.subtasks));
        }
    });
    return allTasks;
};

const UpcomingTasks: React.FC<UpcomingTasksProps> = ({ tasks }) => {
    const upcoming = useMemo(() => {
        const now = new Date();
        // Set time to start of day for comparison
        now.setHours(0, 0, 0, 0); 
        
        return flattenTasks(tasks)
            .filter(task => task.status !== 'Completed' && task.dueDate)
            .map(task => ({ ...task, dueDateObj: new Date(task.dueDate!) }))
            .filter(task => task.dueDateObj >= now)
            .sort((a, b) => a.dueDateObj.getTime() - b.dueDateObj.getTime())
            .slice(0, 5); // Show top 5 upcoming tasks
    }, [tasks]);

    return (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                <ChecklistIcon className="w-5 h-5 mr-2" />
                Upcoming Tasks
            </h2>
            {upcoming.length > 0 ? (
                <ul className="space-y-3">
                    {upcoming.map(task => (
                        <li key={task.id} className="flex items-start justify-between pb-2 border-b border-gray-100 dark:border-gray-800 last:border-b-0">
                            <span className="text-sm text-gray-800 dark:text-gray-200 pr-4">{task.text}</span>
                            <div className="flex items-center flex-shrink-0 text-xs text-gray-500 dark:text-gray-400">
                                <ClockIcon className="w-3 h-3 mr-1" />
                                {task.dueDateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-sm text-center text-gray-500 dark:text-gray-400 py-8">No upcoming tasks with due dates.</p>
            )}
        </div>
    );
};

export default UpcomingTasks;
