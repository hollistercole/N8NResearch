import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { SubTask } from '@/types';

/**
 * GET /api/subtasks/[id]
 * Returns a specific subtask by ID
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid subtask ID' },
        { status: 400 }
      );
    }
    
    const sql = 'SELECT * FROM SubTask WHERE subtask_id = ?';
    const subtasks = await db.query<SubTask>(sql, [id]);
    
    if (subtasks.length === 0) {
      return NextResponse.json(
        { status: 'error', message: 'Subtask not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      status: 'success', 
      message: 'Subtask retrieved successfully',
      data: subtasks[0]
    });
  } catch (error) {
    console.error('Error fetching subtask:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Failed to retrieve subtask', 
        error: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
} 