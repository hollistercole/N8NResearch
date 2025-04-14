'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface ProductType {
  product_type_id: number;
  type_name: string;
}

export default function ProductTypesPage() {
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [endpoint, setEndpoint] = useState('/api/product-types'); 
  const [dataEndpoint, setDataEndpoint] = useState('');
  const [connectionInfo, setConnectionInfo] = useState({
    host: '54.176.154.219',
    database: 'AgentTasks',
    table: 'ProductTypeRef',
    method: 'Network'
  });

  // Function to fetch data from the selected endpoint
  const fetchData = async (apiEndpoint: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(apiEndpoint);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch data from ${apiEndpoint}`);
      }
      
      const data = await response.json();
      
      if (data.status === 'success') {
        // If this is a test endpoint, fetch the product types
        if (apiEndpoint.includes('-test')) {
          // Determine the corresponding data endpoint
          const method = apiEndpoint.split('/').pop()?.replace('-test', '') || '';
          const productTypesEndpoint = `/api/${method}-product-types`;
          setDataEndpoint(productTypesEndpoint);
          
          // Fetch actual product types data
          const dataResponse = await fetch(productTypesEndpoint);
          if (!dataResponse.ok) {
            throw new Error(`Failed to fetch data from ${productTypesEndpoint}`);
          }
          
          const productData = await dataResponse.json();
          if (productData.status === 'success') {
            setProductTypes(productData.data);
          } else {
            throw new Error(productData.message || `Failed to fetch data from ${productTypesEndpoint}`);
          }
        } else {
          // This is already a product types endpoint
          setProductTypes(data.data);
        }
        
        setConnectionInfo({
          ...connectionInfo,
          method: apiEndpoint.split('/').pop()?.replace('-test', '').replace('-product-types', '') || 'Unknown'
        });
      } else {
        throw new Error(data.message || `Failed to fetch data from ${apiEndpoint}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchData(endpoint);
  }, []);

  // Handler for changing the endpoint
  const handleEndpointChange = (newEndpoint: string) => {
    setEndpoint(newEndpoint);
    fetchData(newEndpoint);
  };

  if (loading && productTypes.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading Product Types...</h1>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center p-24">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Product Types</h1>
        
        <div className="mb-6 text-center">
          <Link href="/" className="text-blue-500 hover:underline">
            Back to Home
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
            <h3 className="font-bold mb-2">Error</h3>
            <p>{error}</p>
          </div>
        )}

        <div className="mb-8 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
          <h3 className="font-semibold mb-3">Select Connection Method:</h3>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => handleEndpointChange('/api/net-test')}
              className={`px-3 py-2 text-white rounded transition-colors text-sm ${endpoint === '/api/net-test' ? 'bg-blue-600' : 'bg-blue-500 hover:bg-blue-600'}`}
            >
              Network ✓
            </button>
            
            <button 
              onClick={() => handleEndpointChange('/api/heidi-test')}
              className={`px-3 py-2 text-white rounded transition-colors text-sm ${endpoint === '/api/heidi-test' ? 'bg-blue-600' : 'bg-blue-500 hover:bg-blue-600'}`}
            >
              HeidiSQL ✓
            </button>
            
            <button 
              onClick={() => handleEndpointChange('/api/basic-test')}
              className={`px-3 py-2 text-white rounded transition-colors text-sm ${endpoint === '/api/basic-test' ? 'bg-blue-600' : 'bg-blue-500 hover:bg-blue-600'}`}
            >
              Basic
            </button>
            
            <button 
              onClick={() => handleEndpointChange('/api/hardcoded-test')}
              className={`px-3 py-2 text-white rounded transition-colors text-sm ${endpoint === '/api/hardcoded-test' ? 'bg-blue-600' : 'bg-blue-500 hover:bg-blue-600'}`}
            >
              Hardcoded
            </button>
          </div>
          
          {loading && (
            <div className="mt-3 flex items-center">
              <div className="animate-spin h-4 w-4 border-t-2 border-b-2 border-blue-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Loading...</span>
            </div>
          )}
          
          <div className="mt-3 text-sm text-green-600">
            <p>✓ Network and HeidiSQL methods are confirmed working!</p>
            {dataEndpoint && (
              <p className="mt-1 text-gray-500">Data source: {dataEndpoint}</p>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden mb-8">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Type Name
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {productTypes.length > 0 ? (
                productTypes.map((type) => (
                  <tr key={type.product_type_id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {type.product_type_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {type.type_name}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-300">
                    {error ? 'Error loading data' : 'No data available'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 text-sm">
          <h3 className="font-semibold mb-2">Connection Details:</h3>
          <p>Connected to <span className="font-mono">{connectionInfo.host}</span></p>
          <p>Database: <span className="font-mono">{connectionInfo.database}</span></p>
          <p>Table: <span className="font-mono">{connectionInfo.table}</span></p>
          <p>Method: <span className="font-mono capitalize">{connectionInfo.method}</span></p>
          <p className="text-green-600 mt-2">
            {error 
              ? 'Connection failed - try another method'
              : 'Connection successful!'
            }
          </p>
        </div>
      </div>
    </div>
  );
} 