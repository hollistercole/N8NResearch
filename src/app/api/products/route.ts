import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { Product } from '@/types';

/**
 * GET /api/products
 * Returns a list of all products or filtered by subtask_id query parameter
 */
export async function GET(request: Request) {
  try {
    // Get the URL from the request
    const { searchParams } = new URL(request.url);
    const subtaskId = searchParams.get('subtask_id');
    
    // Base SQL with product type join
    let sql = `
      SELECT p.*, pt.type_name 
      FROM Product p 
      LEFT JOIN ProductTypeRef pt ON p.product_type_id = pt.product_type_id
    `;
    const params: any[] = [];
    
    // If subtaskId is provided, filter by subtask_id
    if (subtaskId) {
      const parsedSubtaskId = parseInt(subtaskId);
      if (!isNaN(parsedSubtaskId)) {
        sql += ' WHERE p.subtask_id = ?';
        params.push(parsedSubtaskId);
      }
    }
    
    // Order by product_id in descending order (newest first)
    sql += ' ORDER BY p.product_id DESC';
    
    // Execute the query
    const products = await db.query<Product>(sql, params);
    
    return NextResponse.json({ 
      status: 'success', 
      message: 'Products retrieved successfully',
      data: products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Failed to retrieve products', 
        error: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
} 