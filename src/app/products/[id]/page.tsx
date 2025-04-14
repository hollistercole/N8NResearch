'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { 
  ArrowLeftIcon,
  ExclamationCircleIcon,
  DocumentTextIcon,
  CalendarIcon,
  UserIcon
} from '@heroicons/react/24/outline';

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
  citations?: string;
  authored_by?: string;
  created_at: string;
  updated_at: string;
}

interface SubTask {
  subtask_id: number;
  task_id: number;
  subtask_name: string;
}

interface Task {
  task_id: number;
  task_name: string;
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const productId = parseInt(params.id);
  
  const [product, setProduct] = useState<Product | null>(null);
  const [subtask, setSubtask] = useState<SubTask | null>(null);
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProductAndRelations() {
      try {
        setLoading(true);
        
        // Fetch product details
        const productResponse = await fetch(`/api/products/${productId}`);
        if (!productResponse.ok) {
          throw new Error(`Error fetching product: ${productResponse.status}`);
        }
        
        const productResult = await productResponse.json();
        if (productResult.status !== 'success') {
          throw new Error(productResult.message || 'Failed to fetch product');
        }
        
        const productData = productResult.data;
        setProduct(productData);
        
        // Fetch parent subtask
        if (productData.subtask_id) {
          const subtaskResponse = await fetch(`/api/subtasks/${productData.subtask_id}`);
          if (subtaskResponse.ok) {
            const subtaskResult = await subtaskResponse.json();
            if (subtaskResult.status === 'success') {
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
            }
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    }

    if (isNaN(productId)) {
      setError('Invalid product ID');
      setLoading(false);
    } else {
      fetchProductAndRelations();
    }
  }, [productId]);
  
  // Helper function to format dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
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
                <p className="text-red-700 font-medium">Error loading product</p>
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

  if (!product) {
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
                <p className="text-yellow-700 font-medium">Product not found</p>
                <p className="text-yellow-600 text-sm">The requested product could not be found.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3">
          {task ? (
            <Link href={`/tasks/${task.task_id}`} className="inline-flex items-center text-blue-600 hover:text-blue-800">
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to {task.task_name}
            </Link>
          ) : subtask ? (
            <Link href={`/subtasks/${subtask.subtask_id}`} className="inline-flex items-center text-blue-600 hover:text-blue-800">
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to {subtask.subtask_name}
            </Link>
          ) : (
            <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800">
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to Tasks
            </Link>
          )}
        </div>
      </div>
      
      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          {task && (
            <>
              <span className="mx-2">/</span>
              <Link href={`/tasks/${task.task_id}`} className="hover:text-blue-600">
                {task.task_name}
              </Link>
            </>
          )}
          {subtask && (
            <>
              <span className="mx-2">/</span>
              <Link href={`/subtasks/${subtask.subtask_id}`} className="hover:text-blue-600">
                {subtask.subtask_name}
              </Link>
            </>
          )}
          <span className="mx-2">/</span>
          <span className="text-gray-700">{product.product_title}</span>
        </div>
        
        {/* Product Type Badge */}
        {product.type_name && (
          <div className="mb-4">
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
              {product.type_name}
            </span>
          </div>
        )}
        
        {/* Product Title */}
        <h1 className="text-3xl font-bold text-gray-900 md:text-4xl mb-4">
          {product.product_title}
        </h1>
        
        {/* Meta Information */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6">
          <div className="flex items-center">
            <CalendarIcon className="h-4 w-4 mr-1" />
            <span>{formatDate(product.created_at)}</span>
          </div>
          {product.authored_by && (
            <div className="flex items-center">
              <UserIcon className="h-4 w-4 mr-1" />
              <span>{product.authored_by}</span>
            </div>
          )}
        </div>
        
        {/* Featured Image */}
        {product.teaser_image_url && (
          <div className="mb-8 rounded-lg overflow-hidden">
            <img 
              src={product.teaser_image_url} 
              alt={product.product_title}
              className="w-full h-auto max-h-96 object-cover"
            />
          </div>
        )}
        
        {/* Abstract */}
        {product.abstract && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Abstract</h2>
            <div className="text-gray-700 leading-relaxed italic border-l-4 border-gray-200 pl-4 py-1">
              {product.abstract}
            </div>
          </div>
        )}
        
        {/* Product Content */}
        {product.content && (
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown>{product.content}</ReactMarkdown>
          </div>
        )}
        
        {/* Citations */}
        {product.citations && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Citations</h2>
            <div className="text-sm text-gray-700 leading-relaxed">
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown>{product.citations}</ReactMarkdown>
              </div>
            </div>
          </div>
        )}
        
        {/* No Content Case */}
        {!product.abstract && !product.content && (
          <div className="py-12 text-center">
            <DocumentTextIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No content available</h3>
            <p className="text-gray-500 mt-1">This product doesn't have any content yet.</p>
          </div>
        )}
      </article>
    </main>
  );
} 