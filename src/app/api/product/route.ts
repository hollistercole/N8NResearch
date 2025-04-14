import { NextResponse } from 'next/server';
import { directQuery } from '@/lib/db-direct';

export async function GET() {
  try {
    // Simple test query with direct connection
    const result = await directQuery('SELECT 1 as test', []);
    
    return NextResponse.json({ 
      status: 'success', 
      message: 'Direct connection successful',
      data: result 
    });
  } catch (error: any) {
    console.error('API route error:', error);
    
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Database connection failed', 
        error: error.message,
        stack: error.stack 
      },
      { status: 500 }
    );
  }
}