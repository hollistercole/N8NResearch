import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    // Test the connection with a simple query
    const result = await db.query('SELECT 1 as test');
    return NextResponse.json({
      status: 'success',
      message: 'Database connection successful',
      data: result
    });
  } catch (error) {
    console.error('Direct test error:', error);
    return NextResponse.json(
      { 
        status: 'error',
        message: 'Failed to connect to database', 
        error: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
} 