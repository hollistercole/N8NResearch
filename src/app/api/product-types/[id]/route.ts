import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { ProductType } from '@/types';

/**
 * GET /api/product-types/[id]
 * Returns a specific product type by ID
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid product type ID' },
        { status: 400 }
      );
    }
    
    const sql = 'SELECT * FROM ProductTypeRef WHERE product_type_id = ?';
    const productTypes = await db.query<ProductType>(sql, [id]);
    
    if (productTypes.length === 0) {
      return NextResponse.json(
        { status: 'error', message: 'Product type not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      status: 'success', 
      message: 'Product type retrieved successfully',
      data: productTypes[0]
    });
  } catch (error) {
    console.error('Error fetching product type:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Failed to retrieve product type', 
        error: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
} 