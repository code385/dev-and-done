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
    const founderId = ObjectId.isValid(payload.id) ? new ObjectId(payload.id) : payload.id;
    const filter = { createdBy: founderId };

    const options = {
      page: 1,
      limit: 100,
      sort: { publishedAt: -1 },
    };

    const result = await BookModel.getBooks(filter, options);

    return NextResponse.json({
      success: true,
      books: result.books,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error('Error fetching books:', error);
    
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to fetch books' },
      { status: 500 }
    );
  }
}

