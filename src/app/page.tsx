'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  CheckCircleIcon, 
  ClockIcon, 
  DocumentTextIcon,
  ChevronRightIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

interface Task {
  task_id: number;
  task_name: string;
  task_description?: string;
  completion_status: number;
  created_at: string;
  updated_at: string;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTasks() {
      try {
        setLoading(true);
        const response = await fetch('/api/tasks');
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.status === 'success') {
          setTasks(result.data);
        } else {
          throw new Error(result.message || 'Failed to fetch tasks');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Error fetching tasks:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
  }, []);

  // Helper function to format dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-b from-blue-600 to-blue-700 text-white py-8 px-4 md:py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold md:text-4xl">Research Task Navigator</h1>
          <p className="mt-2 text-blue-100 md:text-lg">
            Track and browse AI-generated research content
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 md:text-2xl">
            Research Tasks
          </h2>
          <div className="text-sm text-gray-500">
            {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <ExclamationCircleIcon className="h-6 w-6 text-red-500 mr-3" />
              <div>
                <p className="text-red-700 font-medium">Error loading tasks</p>
                <p className="text-red-600 text-sm">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && tasks.length === 0 && (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900">No tasks found</h3>
            <p className="text-gray-500 mt-1">No research tasks are currently available.</p>
          </div>
        )}

        {/* Tasks List */}
        {!loading && !error && tasks.length > 0 && (
          <div className="space-y-4">
            {tasks.map((task) => (
              <Link 
                href={`/tasks/${task.task_id}`} 
                key={task.task_id}
                className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 md:text-xl">
                        {task.task_name}
                      </h3>
                      {task.task_description && (
                        <p className="mt-1 text-sm text-gray-600 line-clamp-2 md:text-base">
                          {task.task_description}
                        </p>
                      )}
                      <div className="mt-3 flex items-center text-xs text-gray-500 md:text-sm">
                        <span>Updated: {formatDate(task.updated_at)}</span>
                      </div>
                    </div>
                    <div className="ml-4 flex flex-col items-end">
                      <div className="flex items-center">
                        {task.completion_status === 1 ? (
                          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                            <CheckCircleIcon className="h-3.5 w-3.5 mr-1" />
                            Completed
                          </span>
                        ) : (
                          <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                            <ClockIcon className="h-3.5 w-3.5 mr-1" />
                            In Progress
                          </span>
                        )}
                      </div>
                      <div className="mt-4">
                        <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
} 