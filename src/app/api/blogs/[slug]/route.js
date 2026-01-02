import { NextResponse } from 'next/server';
import * as BlogModel from '@/lib/mongodb/models/Blog';
import * as BlogReviewModel from '@/lib/mongodb/models/BlogReview';

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

    // Get reviews
    const { reviews } = await BlogReviewModel.getBlogReviews(
      { blogId: blog._id.toString(), isApproved: true },
      { page: 1, limit: 20, sort: { createdAt: -1 } }
    );

    // Increment views
    await BlogModel.incrementBlogViews(slug);

    return NextResponse.json({
      success: true,
      blog,
      reviews,
    });
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog' },
      { status: 500 }
    );
  }
}

