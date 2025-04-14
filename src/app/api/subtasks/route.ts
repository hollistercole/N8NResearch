import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { SubTask } from '@/types';

/**
 * GET /api/subtasks
 * Returns a list of all subtasks or filtered by task_id query parameter
 */
export async function GET(request: Request) {
  try {
    // Get the URL from the request
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('task_id');
    
    let sql = 'SELECT * FROM SubTask';
    const params: any[] = [];
    
    // If taskId is provided, filter by task_id
    if (taskId) {
      const parsedTaskId = parseInt(taskId);
      if (!isNaN(parsedTaskId)) {
        sql += ' WHERE task_id = ?';
        params.push(parsedTaskId);
      }
    }
    
    // Order by subtask_id in descending order (newest first)
    sql += ' ORDER BY subtask_id';
    
    // Execute the query
    const subtasks = await db.query<SubTask>(sql, params);
    
    return NextResponse.json({ 
      status: 'success', 
      message: 'Subtasks retrieved successfully',
      data: subtasks
    });
  } catch (error) {
    console.error('Error fetching subtasks:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Failed to retrieve subtasks', 
        error: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
} 