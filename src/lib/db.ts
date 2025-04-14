import mariadb from 'mariadb';
import { Task, SubTask, Product, Attachment, ProductType, QueryResult } from '../types';

/**
 * Decodes the Base64 encoded password from environment variables
 * This is a secure way to handle special characters in passwords
 */
function getPassword(): string {
  // Use the BASE64 encoded password from environment variables
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
      charset: 'utf8mb4',
      collation: 'utf8mb4_unicode_ci'
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
    await query('SELECT 1 as test');
    return { success: true, message: 'Database connection successful' };
  } catch (error) {
    console.error('Connection test failed:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown database error' 
    };
  }
}

// Tasks related functions
export async function getTasks(): Promise<Task[]> {
  return await query<Task>('SELECT * FROM Task ORDER BY task_id DESC');
}

export async function getTaskById(taskId: number): Promise<Task | null> {
  const results = await query<Task>('SELECT * FROM Task WHERE task_id = ?', [taskId]);
  return results.length > 0 ? results[0] : null;
}

// Subtasks related functions
export async function getSubtasks(taskId?: number): Promise<SubTask[]> {
  if (taskId) {
    return await query<SubTask>('SELECT * FROM SubTask WHERE task_id = ? ORDER BY subtask_id DESC', [taskId]);
  }
  return await query<SubTask>('SELECT * FROM SubTask ORDER BY subtask_id DESC');
}

export async function getSubtaskById(subtaskId: number): Promise<SubTask | null> {
  const results = await query<SubTask>('SELECT * FROM SubTask WHERE subtask_id = ?', [subtaskId]);
  return results.length > 0 ? results[0] : null;
}

// Products related functions
export async function getProducts(subtaskId?: number): Promise<Product[]> {
  if (subtaskId) {
    return await query<Product>(
      'SELECT p.*, pt.type_name FROM Product p LEFT JOIN ProductTypeRef pt ON p.product_type_id = pt.product_type_id WHERE p.subtask_id = ? ORDER BY p.product_id DESC',
      [subtaskId]
    );
  }
  return await query<Product>(
    'SELECT p.*, pt.type_name FROM Product p LEFT JOIN ProductTypeRef pt ON p.product_type_id = pt.product_type_id ORDER BY p.product_id DESC'
  );
}

export async function getProductById(productId: number): Promise<Product | null> {
  const results = await query<Product>(
    'SELECT p.*, pt.type_name FROM Product p LEFT JOIN ProductTypeRef pt ON p.product_type_id = pt.product_type_id WHERE p.product_id = ?',
    [productId]
  );
  return results.length > 0 ? results[0] : null;
}

// Attachments related functions
export async function getAttachments(subtaskId?: number): Promise<Attachment[]> {
  if (subtaskId) {
    return await query<Attachment>('SELECT * FROM Attachments WHERE subtask_id = ? ORDER BY attachment_id DESC', [subtaskId]);
  }
  return await query<Attachment>('SELECT * FROM Attachments ORDER BY attachment_id DESC');
}

export async function getAttachmentById(attachmentId: number): Promise<Attachment | null> {
  const results = await query<Attachment>('SELECT * FROM Attachments WHERE attachment_id = ?', [attachmentId]);
  return results.length > 0 ? results[0] : null;
}

// Product types related functions
export async function getProductTypes(): Promise<ProductType[]> {
  return await query<ProductType>('SELECT * FROM ProductTypeRef ORDER BY product_type_id');
}

export async function getProductTypeById(productTypeId: number): Promise<ProductType | null> {
  const results = await query<ProductType>('SELECT * FROM ProductTypeRef WHERE product_type_id = ?', [productTypeId]);
  return results.length > 0 ? results[0] : null;
}

export default {
  query,
  getTasks,
  getTaskById,
  getSubtasks,
  getSubtaskById,
  getProducts,
  getProductById,
  getAttachments,
  getAttachmentById,
  getProductTypes,
  getProductTypeById
}; 