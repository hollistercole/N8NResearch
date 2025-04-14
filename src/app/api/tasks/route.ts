import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { Task } from '@/types';

/**
 * GET /api/tasks
 * Returns a list of all tasks
 */
export async function GET() {
  try {
    // Fetch all tasks ordered by most recent
    const tasks = await db.query<Task>(
      'SELECT * FROM Task ORDER BY task_id DESC'
    );
    
    return NextResponse.json({ 
      status: 'success', 
      message: 'Tasks retrieved successfully',
      data: tasks
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Failed to retrieve tasks', 
        error: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
} 