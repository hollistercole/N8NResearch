import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { ProductType } from '@/types';

/**
 * GET /api/product-types
 * Returns a list of all product types
 */
export async function GET() {
  try {
    const productTypes = await db.query<ProductType>(
      'SELECT * FROM ProductTypeRef ORDER BY product_type_id'
    );
    
    return NextResponse.json({ 
      status: 'success', 
      message: 'Product types retrieved successfully',
      data: productTypes
    });
  } catch (error) {
    console.error('Error fetching product types:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Failed to retrieve product types', 
        error: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}