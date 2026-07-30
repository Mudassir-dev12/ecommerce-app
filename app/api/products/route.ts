import { NextRequest, NextResponse } from 'next/server';
import { getProducts, createProduct } from '@/lib/api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;
    const sort = (searchParams.get('sort') as any) || 'featured';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const perPage = parseInt(searchParams.get('perPage') || '12', 10);

    const result = await getProducts({ category, search }, sort, page, perPage);
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.name || body.price === undefined) {
      return NextResponse.json({ error: 'Product name and price are required' }, { status: 400 });
    }

    const newProduct = await createProduct(body);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create product' }, { status: 500 });
  }
}
