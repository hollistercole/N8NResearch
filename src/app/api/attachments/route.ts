import { NextResponse } from 'next/server';
import db from '@/lib/db';

/**
 * GET /api/attachments
 * Returns a list of all attachments or filtered by subtask_id query parameter
 */
export async function GET(request: Request) {
  try {
    // Get the URL from the request
    const { searchParams } = new URL(request.url);
    const subtaskId = searchParams.get('subtask_id');
    
    let sql = 'SELECT * FROM Attachments';
    const params: any[] = [];
    
    // If subtaskId is provided, filter by subtask_id
    if (subtaskId) {
      const parsedSubtaskId = parseInt(subtaskId);
      if (!isNaN(parsedSubtaskId)) {
        sql += ' WHERE subtask_id = ?';
        params.push(parsedSubtaskId);
      }
    }
    
    // Order by attachment_id in descending order (newest first)
    sql += ' ORDER BY attachment_id DESC';
    
    // Execute the query
    const attachments = await db.query(sql, params);
    
    return NextResponse.json({ 
      status: 'success', 
      message: 'Attachments retrieved successfully',
      data: attachments
    });
  } catch (error) {
    console.error('Error fetching attachments:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Failed to retrieve attachments', 
        error: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
} 