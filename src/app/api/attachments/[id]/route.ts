import { NextResponse } from 'next/server';
import db from '@/lib/db';

/**
 * GET /api/attachments/[id]
 * Returns a specific attachment by ID
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid attachment ID' },
        { status: 400 }
      );
    }
    
    const sql = 'SELECT * FROM Attachments WHERE attachment_id = ?';
    const attachments = await db.query(sql, [id]);
    
    if (attachments.length === 0) {
      return NextResponse.json(
        { status: 'error', message: 'Attachment not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      status: 'success', 
      message: 'Attachment retrieved successfully',
      data: attachments[0]
    });
  } catch (error) {
    console.error('Error fetching attachment:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Failed to retrieve attachment', 
        error: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
} 