import { NextResponse } from 'next/server';
import * as BookModel from '@/lib/mongodb/models/Book';
import { requireAuth } from '@/lib/auth/verify';

// GET /api/admin/books - Get books created by the current founder
export async function GET() {
  try {
    const payload = await requireAuth(); // Get current founder info

    // Only get books created by this founder
    // Handle both ObjectId and string formats for comparison
    const { ObjectId } = await import('mongodb');
    
    // Convert founder ID to ObjectId for consistent comparison
    let founderId;
    if (ObjectId.isValid(payload.id)) {
      founderId = new ObjectId(payload.id);
    } else {
      founderId = payload.id;
    }

    // Filter by createdBy - MongoDB will handle ObjectId comparison automatically
    // But we need to try both formats since createdBy might be stored as string or ObjectId
    const filter = {
      $or: [
        { createdBy: founderId },
        { createdBy: payload.id },
      ]
    };
    
    // If founderId is an ObjectId, also try the string version
    if (founderId instanceof ObjectId) {
      filter.$or.push({ createdBy: founderId.toString() });
    }

    const options = {
      page: 1,
      limit: 100,
      sort: { createdAt: -1 }, // Sort by creation date, most recent first
    };

    const result = await BookModel.getBooks(filter, options);

    // Log for debugging (remove in production if needed)
    console.log('Fetching books for founder:', {
      founderId: payload.id,
      booksFound: result.books.length,
      total: result.pagination.total,
    });

    return NextResponse.json({
      success: true,
      books: result.books || [],
      pagination: result.pagination || { page: 1, limit: 100, total: 0, pages: 0 },
    });
  } catch (error) {
    console.error('Error fetching books:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
    });
    
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch books',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

