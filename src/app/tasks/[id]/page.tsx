'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  CheckCircleIcon, 
  ClockIcon, 
  ArrowLeftIcon,
  ExclamationCircleIcon,
  DocumentMagnifyingGlassIcon
} from '@heroicons/react/24/outline';

interface Task {
  task_id: number;
  task_name: string;
  task_description?: string;
  original_prompt?: string;
  completion_status: number;
  created_at: string;
  updated_at: string;
}

interface SubTask {
  subtask_id: number;
  task_id: number;
  subtask_name: string;
  subtaskdescript_ion?: string;
  completion_status: number;
  created_at: string;
  updated_at: string;
  product?: any;
}

export default function TaskDetailPage({ params }: { params: { id: string } }) {
  const taskId = parseInt(params.id);
  
  const [task, setTask] = useState<Task | null>(null);
  const [subtasks, setSubtasks] = useState<SubTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTaskAndSubtasks() {
      try {
        setLoading(true);
        
        // Fetch task details
        const taskResponse = await fetch(`/api/tasks/${taskId}`);
        if (!taskResponse.ok) {
          throw new Error(`Error fetching task: ${taskResponse.status}`);
        }
        
        const taskResult = await taskResponse.json();
        if (taskResult.status !== 'success') {
          throw new Error(taskResult.message || 'Failed to fetch task');
        }
        
        setTask(taskResult.data);
        
        // Fetch subtasks for this task
        const subtasksResponse = await fetch(`/api/subtasks?task_id=${taskId}`);
        if (!subtasksResponse.ok) {
          throw new Error(`Error fetching subtasks: ${subtasksResponse.status}`);
        }
        
        const subtasksResult = await subtasksResponse.json();
        if (subtasksResult.status !== 'success') {
          throw new Error(subtasksResult.message || 'Failed to fetch subtasks');
        }
        
        // Get subtasks data
        const subtasksData = subtasksResult.data;
        
        // For each subtask, fetch its associated product
        const subtasksWithProducts = await Promise.all(subtasksData.map(async (subtask: SubTask) => {
          try {
            const productsResponse = await fetch(`/api/products?subtask_id=${subtask.subtask_id}`);
            if (productsResponse.ok) {
              const productsResult = await productsResponse.json();
              if (productsResult.status === 'success' && productsResult.data.length > 0) {
                // Add the first product to the subtask object
                return { ...subtask, product: productsResult.data[0] };
              }
            }
            return subtask;
          } catch (error) {
            console.error(`Error fetching products for subtask ${subtask.subtask_id}:`, error);
            return subtask;
          }
        }));
        
        setSubtasks(subtasksWithProducts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    }

    if (isNaN(taskId)) {
      setError('Invalid task ID');
      setLoading(false);
    } else {
      fetchTaskAndSubtasks();
    }
  }, [taskId]);
  
  // Helper function to format dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Tasks
          </Link>
          
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex">
              <ExclamationCircleIcon className="h-6 w-6 text-red-500 mr-3" />
              <div>
                <p className="text-red-700 font-medium">Error loading task</p>
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
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Tasks
          </Link>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
            <div className="flex">
              <ExclamationCircleIcon className="h-6 w-6 text-yellow-500 mr-3" />
              <div>
                <p className="text-yellow-700 font-medium">Task not found</p>
                <p className="text-yellow-600 text-sm">The requested task could not be found.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Tasks
          </Link>
        </div>
      </div>
      
      {/* Task Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">{task.task_name}</h1>
              {task.task_description && (
                <p className="mt-2 text-gray-600 md:text-lg">{task.task_description}</p>
              )}
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
                <div>
                  <span className="font-medium">Created:</span> {formatDate(task.created_at)}
                </div>
                <div>
                  <span className="font-medium">Updated:</span> {formatDate(task.updated_at)}
                </div>
              </div>
            </div>
            <div>
              {task.completion_status === 1 ? (
                <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full flex items-center">
                  <CheckCircleIcon className="h-4 w-4 mr-1.5" />
                  Completed
                </span>
              ) : (
                <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full flex items-center">
                  <ClockIcon className="h-4 w-4 mr-1.5" />
                  In Progress
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Original Prompt Section (if available) */}
      {task.original_prompt && (
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Original Prompt</h2>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-gray-800 whitespace-pre-wrap">
            {task.original_prompt}
          </div>
        </div>
      )}
      
      {/* Subtasks Section */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Subtasks</h2>
          <div className="text-sm text-gray-500">
            {subtasks.length} {subtasks.length === 1 ? 'subtask' : 'subtasks'}
          </div>
        </div>
        
        {/* No Subtasks State */}
        {subtasks.length === 0 && (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <DocumentMagnifyingGlassIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900">No subtasks found</h3>
            <p className="text-gray-500 mt-1">This task doesn't have any subtasks yet.</p>
          </div>
        )}
        
        {/* Subtasks List */}
        {subtasks.length > 0 && (
          <div className="space-y-4">
            {subtasks.map((subtask) => (
              <Link 
                href={subtask.product ? `/products/${subtask.product.product_id}` : `/subtasks/${subtask.subtask_id}`}
                key={subtask.subtask_id}
                className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-4 md:p-5">
                  <div className="flex items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">
                        {subtask.subtask_name}
                      </h3>
                      {subtask.subtaskdescript_ion && (
                        <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                          {subtask.subtaskdescript_ion}
                        </p>
                      )}
                    </div>
                    <div className="ml-4">
                      {subtask.completion_status === 1 ? (
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