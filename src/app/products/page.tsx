'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

interface ProductType {
  product_type_id: number;
  type_name: string;
  description: string;
  created_at?: string;
}

export default function ProductsPage() {
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProductTypes() {
      try {
        setLoading(true);
        const response = await fetch('/api/product-types');
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
          setProductTypes(result.data);
        } else {
          throw new Error(result.error || 'Failed to fetch product types');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Error fetching product types:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProductTypes();
  }, []);

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/" className="flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Home
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6">Product Types</h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p className="font-medium">Error loading product types</p>
          <p className="text-sm mt-1">{error}</p>
          <button 
            className="mt-3 text-sm text-red-600 hover:text-red-800 underline"
            onClick={() => window.location.reload()}
          >
            Try again
          </button>
        </div>
      ) : productTypes.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
          No product types found in the database.
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                {productTypes[0]?.created_at && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {productTypes.map((productType) => (
                <tr key={productType.product_type_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {productType.product_type_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {productType.type_name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {productType.description || '-'}
                  </td>
                  {productTypes[0]?.created_at && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {productType.created_at ? new Date(productType.created_at).toLocaleString() : '-'}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-8 text-center">
        <p className="text-gray-600 mb-4">
          Connection status: {loading ? 'Testing...' : error ? 'Failed' : 'Connected'}
        </p>
        <p className="text-sm text-gray-500">
          Displaying data from MariaDB using direct connection
        </p>
      </div>
    </main>
  );
} 