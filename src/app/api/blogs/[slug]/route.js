import { NextResponse } from 'next/server';
import * as BlogModel from '@/lib/mongodb/models/Blog';

// GET /api/blogs/[slug] - Get a single blog by slug (public)
export async function GET(request, { params }) {
  try {
    const { slug } = await params;

    const blog = await BlogModel.getBlogBySlug(slug);

    if (!blog) {
      return NextResponse.json(
        { success: false, error: 'Blog not found' },
        { status: 404 }
      );
    }

    // Only return published blogs to public
    if (!blog.isPublished) {
      return NextResponse.json(
        { success: false, error: 'Blog not found' },
        { status: 404 }
      );
    }

    // Increment views
    await BlogModel.incrementBlogViews(slug);

    return NextResponse.json({
      success: true,
      blog,
    });
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog' },
      { status: 500 }
    );
  }
}

