import { NextResponse } from 'next/server';
import * as BlogModel from '@/lib/mongodb/models/Blog';

// GET /api/blogs - Get published blogs (public)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const category = searchParams.get('category');
    const featured = searchParams.get('featured') === 'true';

    const filter = { isPublished: true };
    if (category) filter.category = category;
    if (featured) filter.featured = true;

    const options = {
      page,
      limit,
      sort: { createdAt: -1 },
    };

    const result = await BlogModel.getBlogs(filter, options);

    return NextResponse.json({
      success: true,
      blogs: result.blogs,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}

