'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  CheckCircleIcon, 
  ClockIcon, 
  ArrowLeftIcon,
  ExclamationCircleIcon,
  DocumentTextIcon,
  NewspaperIcon,
  ChartBarIcon,
  TableCellsIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';

interface Task {
  task_id: number;
  task_name: string;
}

interface SubTask {
  subtask_id: number;
  task_id: number;
  subtask_name: string;
  subtask_description?: string;
  completion_status: number;
  created_at: string;
  updated_at: string;
}

interface Product {
  product_id: number;
  subtask_id: number;
  product_title: string;
  product_slug: string;
  product_type_id: number;
  type_name?: string;
  abstract?: string;
  content?: string;
  teaser_image_url?: string;
  created_at: string;
  updated_at: string;
}

export default function SubtaskDetailPage({ params }: { params: { id: string } }) {
  const subtaskId = parseInt(params.id);
  
  const [task, setTask] = useState<Task | null>(null);
  const [subtask, setSubtask] = useState<SubTask | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSubtaskAndProducts() {
      try {
        setLoading(true);
        
        // Fetch subtask details
        const subtaskResponse = await fetch(`/api/subtasks/${subtaskId}`);
        if (!subtaskResponse.ok) {
          throw new Error(`Error fetching subtask: ${subtaskResponse.status}`);
        }
        
        const subtaskResult = await subtaskResponse.json();
        if (subtaskResult.status !== 'success') {
          throw new Error(subtaskResult.message || 'Failed to fetch subtask');
        }
        
        setSubtask(subtaskResult.data);
        
        // Fetch parent task
        if (subtaskResult.data.task_id) {
          const taskResponse = await fetch(`/api/tasks/${subtaskResult.data.task_id}`);
          if (taskResponse.ok) {
            const taskResult = await taskResponse.json();
            if (taskResult.status === 'success') {
              setTask(taskResult.data);
            }
          }
        }
        
        // Fetch products for this subtask
        const productsResponse = await fetch(`/api/products?subtask_id=${subtaskId}`);
        if (!productsResponse.ok) {
          throw new Error(`Error fetching products: ${productsResponse.status}`);
        }
        
        const productsResult = await productsResponse.json();
        if (productsResult.status !== 'success') {
          throw new Error(productsResult.message || 'Failed to fetch products');
        }
        
        setProducts(productsResult.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    }

    if (isNaN(subtaskId)) {
      setError('Invalid subtask ID');
      setLoading(false);
    } else {
      fetchSubtaskAndProducts();
    }
  }, [subtaskId]);
  
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

  // Helper to choose an icon based on product type
  const getProductIcon = (typeName?: string) => {
    if (!typeName) return <DocumentTextIcon className="h-6 w-6 text-gray-400" />;
    
    const type = typeName.toLowerCase();
    
    if (type.includes('article') || type.includes('blog')) {
      return <NewspaperIcon className="h-6 w-6 text-blue-500" />;
    } else if (type.includes('report')) {
      return <DocumentTextIcon className="h-6 w-6 text-purple-500" />;
    } else if (type.includes('data') || type.includes('dataset')) {
      return <TableCellsIcon className="h-6 w-6 text-green-500" />;
    } else if (type.includes('chart') || type.includes('graph') || type.includes('analysis')) {
      return <ChartBarIcon className="h-6 w-6 text-orange-500" />;
    } else if (type.includes('image') || type.includes('photo')) {
      return <PhotoIcon className="h-6 w-6 text-indigo-500" />;
    }
    
    return <DocumentTextIcon className="h-6 w-6 text-gray-500" />;
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
                <p className="text-red-700 font-medium">Error loading subtask</p>
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

  if (!subtask) {
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
                <p className="text-yellow-700 font-medium">Subtask not found</p>
                <p className="text-yellow-600 text-sm">The requested subtask could not be found.</p>
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
          {task ? (
            <Link href={`/tasks/${task.task_id}`} className="inline-flex items-center text-blue-600 hover:text-blue-800">
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to {task.task_name}
            </Link>
          ) : (
            <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800">
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to Tasks
            </Link>
          )}
        </div>
      </div>
      
      {/* Subtask Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">{subtask.subtask_name}</h1>
              {subtask.subtask_description && (
                <p className="mt-2 text-gray-600 md:text-lg">{subtask.subtask_description}</p>
              )}
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
                {task && (
                  <div>
                    <span className="font-medium">Task:</span>{' '}
                    <Link href={`/tasks/${task.task_id}`} className="text-blue-600 hover:underline">
                      {task.task_name}
                    </Link>
                  </div>
                )}
                <div>
                  <span className="font-medium">Created:</span> {formatDate(subtask.created_at)}
                </div>
                <div>
                  <span className="font-medium">Updated:</span> {formatDate(subtask.updated_at)}
                </div>
              </div>
            </div>
            <div>
              {subtask.completion_status === 1 ? (
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
      
      {/* Products Section */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Products</h2>
          <div className="text-sm text-gray-500">
            {products.length} {products.length === 1 ? 'product' : 'products'}
          </div>
        </div>
        
        {/* No Products State */}
        {products.length === 0 && (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900">No products found</h3>
            <p className="text-gray-500 mt-1">This subtask doesn't have any products yet.</p>
          </div>
        )}
        
        {/* Products List */}
        {products.length > 0 && (
          <div className="space-y-4 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
            {products.map((product) => (
              <Link 
                href={`/products/${product.product_id}`}
                key={product.product_id}
                className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200 flex flex-col h-full"
              >
                {product.teaser_image_url && (
                  <div className="relative h-40 rounded-t-lg overflow-hidden">
                    <img 
                      src={product.teaser_image_url} 
                      alt={product.product_title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className={`p-4 md:p-5 flex-1 flex flex-col ${!product.teaser_image_url ? 'border-t-4 border-blue-500 rounded-t-lg' : ''}`}>
                  <div className="flex items-start gap-3 mb-2">
                    {getProductIcon(product.type_name)}
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 line-clamp-2">
                        {product.product_title}
                      </h3>
                    </div>
                  </div>
                  
                  {product.abstract && (
                    <p className="text-sm text-gray-600 line-clamp-3 mt-2 flex-1">
                      {product.abstract}
                    </p>
                  )}
                  
                  <div className="mt-auto pt-3 flex justify-between items-center text-xs text-gray-500">
                    <span>{product.type_name || 'Document'}</span>
                    <time>{formatDate(product.created_at)}</time>
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