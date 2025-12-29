import { NextResponse } from 'next/server';
import * as BookModel from '@/lib/mongodb/models/Book';
import * as BookReviewModel from '@/lib/mongodb/models/BookReview';
import { requireAuth } from '@/lib/auth/verify';

// GET /api/books/[id] - Get a single book with reviews
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const book = await BookModel.getBookById(id);

    if (!book) {
      return NextResponse.json(
        { success: false, error: 'Book not found' },
        { status: 404 }
      );
    }

    // Increment views
    await BookModel.incrementBookViews(id);

    // Get reviews
    const { reviews } = await BookReviewModel.getBookReviews(
      { bookId: id, isApproved: true },
      { limit: 50, sort: { createdAt: -1 } }
    );

    return NextResponse.json({
      success: true,
      book: {
        ...book,
        views: (book.views || 0) + 1, // Return updated view count
      },
      reviews,
    });
  } catch (error) {
    console.error('Error fetching book:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch book' },
      { status: 500 }
    );
  }
}

// PUT /api/books/[id] - Update a book (admin/founder only)
export async function PUT(request, { params }) {
  try {
    const payload = await requireAuth(); // Require authentication and get founder info

    const { id } = await params;
    
    // Check if book exists and belongs to this founder
    const book = await BookModel.getBookById(id);
    if (!book) {
      return NextResponse.json(
        { success: false, error: 'Book not found' },
        { status: 404 }
      );
    }

    // Only allow founder to update their own books
    if (book.createdBy) {
      const createdById = typeof book.createdBy === 'object' 
        ? book.createdBy.toString() 
        : book.createdBy;
      if (createdById !== payload.id) {
        return NextResponse.json(
          { success: false, error: 'You can only edit your own books' },
          { status: 403 }
        );
      }
    }

    const body = await request.json();
    const result = await BookModel.updateBook(id, body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'Book not found or update failed' },
        { status: 404 }
      );
    }

    const updatedBook = await BookModel.getBookById(id);

    return NextResponse.json({
      success: true,
      book: updatedBook,
    });
  } catch (error) {
    console.error('Error updating book:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update book' },
      { status: 500 }
    );
  }
}

// DELETE /api/books/[id] - Delete a book (admin/founder only)
export async function DELETE(request, { params }) {
  try {
    const payload = await requireAuth(); // Require authentication and get founder info

    const { id } = await params;

    // Check if book exists and belongs to this founder
    const book = await BookModel.getBookById(id);
    if (!book) {
      return NextResponse.json(
        { success: false, error: 'Book not found' },
        { status: 404 }
      );
    }

    // Only allow founder to delete their own books
    if (book.createdBy) {
      const { ObjectId } = await import('mongodb');
      const createdById = book.createdBy instanceof ObjectId 
        ? book.createdBy.toString() 
        : (typeof book.createdBy === 'object' ? String(book.createdBy) : String(book.createdBy));
      if (createdById !== payload.id) {
        return NextResponse.json(
          { success: false, error: 'You can only delete your own books' },
          { status: 403 }
        );
      }
    }

    const result = await BookModel.deleteBook(id);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'Book not found' },
        { status: 404 }
      );
    }

    // Also delete associated reviews
    const client = await (await import('@/lib/mongodb/connect')).default;
    const db = client.db('devanddone');
    const collection = db.collection('bookreviews');
    const { ObjectId } = await import('mongodb');
    await collection.deleteMany({ bookId: new ObjectId(id) });

    return NextResponse.json({
      success: true,
      message: 'Book deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting book:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete book' },
      { status: 500 }
    );
  }
}

