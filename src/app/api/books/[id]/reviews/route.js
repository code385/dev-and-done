import { NextResponse } from 'next/server';
import * as BookReviewModel from '@/lib/mongodb/models/BookReview';
import * as BookModel from '@/lib/mongodb/models/Book';

// GET /api/books/[id]/reviews - Get reviews for a book
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const sort = searchParams.get('sort') || 'recent'; // recent, helpful, rating

    let sortQuery = { createdAt: -1 };
    if (sort === 'helpful') {
      sortQuery = { helpful: -1, createdAt: -1 };
    } else if (sort === 'rating') {
      sortQuery = { rating: -1, createdAt: -1 };
    }

    const result = await BookReviewModel.getBookReviews(
      { bookId: id, isApproved: true },
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

// POST /api/books/[id]/reviews - Create a new review
export async function POST(request, { params }) {
  try {
    const { id } = await params;
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

    // Check if book exists
    const book = await BookModel.getBookById(id);
    if (!book) {
      return NextResponse.json(
        { success: false, error: 'Book not found' },
        { status: 404 }
      );
    }

    // Check for existing review from same user
    const existingReview = await BookReviewModel.checkExistingReview(id, userEmail);

    if (existingReview) {
      return NextResponse.json(
        { success: false, error: 'You have already reviewed this book' },
        { status: 400 }
      );
    }

    // Create review
    const result = await BookReviewModel.createBookReview({
      bookId: id,
      userId: userEmail.toLowerCase(),
      userName,
      userEmail: userEmail.toLowerCase(),
      rating,
      review,
    });

    // Update book's average rating and review count
    const allReviews = await BookReviewModel.getAllApprovedReviews(id);
    const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / allReviews.length;

    await BookModel.updateBookRating(id, averageRating, allReviews.length);

    return NextResponse.json(
      { success: true, review: result.review },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating review:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'You have already reviewed this book' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create review' },
      { status: 500 }
    );
  }
}

