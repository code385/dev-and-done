import { NextResponse } from 'next/server';
import * as BlogReviewModel from '@/lib/mongodb/models/BlogReview';
import * as BlogModel from '@/lib/mongodb/models/Blog';

// GET /api/blogs/[slug]/reviews - Get reviews for a blog
export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const sort = searchParams.get('sort') || 'recent'; // recent, helpful, rating

    // Get blog by slug to get its ID
    const blog = await BlogModel.getBlogBySlug(slug);
    if (!blog) {
      return NextResponse.json(
        { success: false, error: 'Blog not found' },
        { status: 404 }
      );
    }

    let sortQuery = { createdAt: -1 };
    if (sort === 'helpful') {
      sortQuery = { helpful: -1, createdAt: -1 };
    } else if (sort === 'rating') {
      sortQuery = { rating: -1, createdAt: -1 };
    }

    const result = await BlogReviewModel.getBlogReviews(
      { blogId: blog._id.toString(), isApproved: true },
      { page, limit, sort: sortQuery }
    );

    return NextResponse.json({
      success: true,
      reviews: result.reviews,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// POST /api/blogs/[slug]/reviews - Create a new review
export async function POST(request, { params }) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { userName, userEmail, rating, review } = body;

    // Validation
    if (!userName || !userEmail || !rating || !review) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Get blog by slug to get its ID
    const blog = await BlogModel.getBlogBySlug(slug);
    if (!blog) {
      return NextResponse.json(
        { success: false, error: 'Blog not found' },
        { status: 404 }
      );
    }

    // Check for existing review from same user
    const existingReview = await BlogReviewModel.checkExistingReview(blog._id.toString(), userEmail);

    if (existingReview) {
      return NextResponse.json(
        { success: false, error: 'You have already reviewed this blog' },
        { status: 400 }
      );
    }

    // Create review
    const result = await BlogReviewModel.createBlogReview({
      blogId: blog._id.toString(),
      userId: userEmail.toLowerCase(),
      userName,
      userEmail: userEmail.toLowerCase(),
      rating,
      review,
    });

    // Update blog's average rating and review count
    const allReviews = await BlogReviewModel.getAllApprovedReviews(blog._id.toString());
    const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / allReviews.length;

    await BlogModel.updateBlogRating(blog._id.toString(), averageRating, allReviews.length);

    return NextResponse.json(
      { success: true, review: result.review },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating review:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'You have already reviewed this blog' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create review' },
      { status: 500 }
    );
  }
}

