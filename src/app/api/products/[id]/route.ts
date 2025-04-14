import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { Product } from '@/types';

/**
 * GET /api/products/[id]
 * Returns a specific product by ID
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid product ID' },
        { status: 400 }
      );
    }
    
    const sql = `
      SELECT p.*, pt.type_name 
      FROM Product p 
      LEFT JOIN ProductTypeRef pt ON p.product_type_id = pt.product_type_id 
      WHERE p.product_id = ?
    `;
    const products = await db.query<Product>(sql, [id]);
    
    if (products.length === 0) {
      return NextResponse.json(
        { status: 'error', message: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      status: 'success', 
      message: 'Product retrieved successfully',
      data: products[0]
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Failed to retrieve product', 
        error: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
} 