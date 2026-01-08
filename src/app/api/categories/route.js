import { NextResponse } from 'next/server';
import * as CategoryModel from '@/lib/mongodb/models/Category';
import { requireAuth } from '@/lib/auth/verify';

// GET /api/categories - Get all categories (public)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '100');

    const options = {
      page,
      limit,
      sort: { name: 1 },
    };

    const result = await CategoryModel.getCategories({}, options);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST /api/categories - Create category (admin only)
export async function POST(request) {
  try {
    await requireAuth();

    const body = await request.json();
    const { name, slug, description, color } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Category name is required' },
        { status: 400 }
      );
    }

    const result = await CategoryModel.createCategory({
      name,
      slug,
      description,
      color,
    });

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    console.error('Error creating category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create category' },
      { status: 500 }
    );
  }
}

