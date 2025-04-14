import mariadb from 'mariadb';
import { QueryResult } from '../types';

/**
 * Decodes the Base64 encoded password from environment variables
 * This is a secure way to handle special characters in passwords
 */
function getPassword(): string {
  const base64Password = process.env.DB_PASSWORD_BASE64 || process.env.DB_PASSWORD || '';
  
  if (!base64Password) {
    console.error('DB_PASSWORD environment variable is missing');
    return '';
  }
  
  try {
    // Decode the BASE64 encoded password
    return Buffer.from(base64Password, 'base64').toString();
  } catch (err) {
    console.error('Error decoding password:', err);
    return ''; // Return empty string on error
  }
}

/**
 * Execute a query using a direct MariaDB connection (no pooling)
 * Optimized for serverless environments where connection pooling can be problematic
 * @param sql SQL query string
 * @param params Array of parameters to bind to the query
 * @returns Promise resolving to the query results
 */
export async function directQuery<T>(sql: string, params: any[] = []): Promise<QueryResult<T>> {
  let conn;
  
  // Get connection parameters
  const dbHost = process.env.DB_HOST || '54.176.154.219';
  const dbPort = parseInt(process.env.DB_PORT || '3306');
  const dbUser = process.env.DB_USER || 'demo_user';
  const dbName = process.env.DB_NAME || 'demo_database';
  
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
    
    console.log('MariaDB direct connection established');
    
    // Execute query with a timeout
    const rows = await Promise.race([
      conn.query(sql, params),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Query timeout after 4s')), 4000)
      )
    ]);
    
    return rows as QueryResult<T>;
  } catch (error) {
    console.error('MariaDB direct query error:', error);
    console.error('Connection parameters used:');
    console.error('- Host:', dbHost);
    console.error('- User:', dbUser);
    console.error('- Database:', dbName);
    throw error;
  } finally {
    if (conn) {
      try {
        // Always close the connection
        await conn.end();
        console.log('MariaDB direct connection closed');
      } catch (e) {
        console.error('Error closing connection:', e);
      }
    }
  }
}

// Test database connection
export async function testConnection(): Promise<{ success: boolean, message: string }> {
  try {
    await directQuery('SELECT 1 as test');
    return { success: true, message: 'Database connection successful' };
  } catch (error) {
    console.error('Connection test failed:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown database error' 
    };
  }
}

export default {
  directQuery,
  testConnection
}; 