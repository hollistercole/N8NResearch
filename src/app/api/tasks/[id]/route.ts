import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { Task } from '@/types';

/**
 * GET /api/tasks/[id]
 * Returns a specific task by ID
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid task ID' },
        { status: 400 }
      );
    }
    
    const sql = 'SELECT * FROM Task WHERE task_id = ?';
    const tasks = await db.query<Task>(sql, [id]);
    
    if (tasks.length === 0) {
      return NextResponse.json(
        { status: 'error', message: 'Task not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      status: 'success', 
      message: 'Task retrieved successfully',
      data: tasks[0]
    });
  } catch (error) {
    console.error('Error fetching task:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Failed to retrieve task', 
        error: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
} 