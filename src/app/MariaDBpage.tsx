import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 mb-6">
            Next.js with MariaDB
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mb-8">
            A demo application connecting to a MariaDB database using direct connections.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/api/direct-test" 
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition"
            >
              Test Connection
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition"
            >
              View Products
            </Link>
          </div>
        </div>
      </section>

      {/* Database Connection Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">
            Database Connection Details
          </h2>
          
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Connection Configuration</h3>
            <div className="space-y-2 text-gray-700">
              <p><span className="font-medium">Host:</span> 54.176.154.219</p>
              <p><span className="font-medium">Port:</span> 3306</p>
              <p><span className="font-medium">User:</span> demo_user</p>
              <p><span className="font-medium">Database:</span> AgentTasks</p>
              <p><span className="font-medium">Server Version:</span> 10.2.10-MariaDB</p>
              <p><span className="font-medium">Connection Type:</span> Direct connection (no pooling)</p>
              <p className="text-sm text-gray-500 mt-4">This application uses direct connections optimized for serverless environments.</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Connection Features</h3>
              <ul className="text-gray-600 space-y-2 list-disc pl-5">
                <li>Secure password handling with BASE64 encoding</li>
                <li>Query timeout protection (4 seconds)</li>
                <li>Connection timeout settings (5 seconds)</li>
                <li>Automatic connection cleanup</li>
                <li>Error logging with detailed diagnostics</li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Available APIs</h3>
              <ul className="text-gray-600 space-y-2 list-disc pl-5">
                <li><Link href="/api/direct-test" className="text-blue-600 hover:underline">Connection Test</Link></li>
                <li><Link href="/api/password-test" className="text-blue-600 hover:underline">Password Test</Link></li>
                <li><Link href="/api/product-types" className="text-blue-600 hover:underline">Product Types</Link></li>
                <li><Link href="/api/products" className="text-blue-600 hover:underline">Products</Link></li>
                <li><Link href="/api/tasks" className="text-blue-600 hover:underline">Tasks</Link></li>
                <li><Link href="/api/subtasks" className="text-blue-600 hover:underline">Subtasks</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Code Example Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Connection Code Example
          </h2>
          
          <div className="bg-gray-900 text-gray-300 p-6 rounded-lg shadow overflow-x-auto">
            <pre className="text-sm">
{`// Direct connection approach
async function query<T>(sql: string, params: any[] = []): Promise<QueryResult<T>> {
  let conn;
  
  // Get connection parameters
  const dbHost = process.env.DB_HOST || '54.176.154.219';
  const dbPort = parseInt(process.env.DB_PORT || '3306');
  const dbUser = process.env.DB_USER || 'demo_user';
  const dbName = process.env.DB_NAME || 'AgentTasks';
  
  // Get the decoded password from BASE64
  const dbPassword = getPassword() || 'Password123!';
  
  try {
    // Create a new connection every time (better for serverless)
    conn = await mariadb.createConnection({
      host: dbHost,
      port: dbPort,
      user: dbUser,
      password: dbPassword,
      database: dbName,
      // Short timeout for serverless environments
      connectTimeout: 5000,
      socketTimeout: 5000,
    });
    
    // Execute query with a timeout
    const rows = await Promise.race([
      conn.query(sql, params),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Query timeout after 4s')), 4000)
      )
    ]);
    
    return rows as QueryResult<T>;
  } finally {
    if (conn) await conn.end();
  }
}`}
            </pre>
          </div>
          
          <div className="mt-8 text-center">
            <Link 
              href="/products" 
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition"
            >
              Browse Product Data
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}