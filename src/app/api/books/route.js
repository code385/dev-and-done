import { NextResponse } from 'next/server';
import * as BookModel from '@/lib/mongodb/models/Book';
import { requireAuth } from '@/lib/auth/verify';

// GET /api/books - Get all published books with optional filters
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured') === 'true';

    const filter = { isPublished: true };

    if (category) {
      filter.category = category;
    }

    if (featured) {
      filter.featured = true;
    }

    // For text search, we'll use MongoDB text search if index exists
    // Otherwise, we'll do a simple regex search
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
      ];
    }

    const options = {
      page,
      limit,
      sort: { publishedAt: -1 },
      projection: { content: 0, pdfUrl: 0 }, // Don't send full content/PDF in listing
    };

    const result = await BookModel.getBooks(filter, options);

    return NextResponse.json({
      success: true,
      books: result.books,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error('Error fetching books:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch books' },
      { status: 500 }
    );
  }
}

// POST /api/books - Create a new book (admin/founder only)
export async function POST(request) {
  try {
    const payload = await requireAuth(); // Require authentication and get founder info

    const body = await request.json();
    const {
      title,
      author,
      description,
      content,
      pdfUrl,
      fileType,
      coverImage,
      category,
      tags,
      featured,
    } = body;

    // Basic validation
    if (!title || !description) {
      return NextResponse.json(
        { success: false, error: 'Title and description are required' },
        { status: 400 }
      );
    }

    // Validate that either content (for text) or pdfUrl (for PDF) is provided
    if (fileType === 'pdf' && !pdfUrl) {
      return NextResponse.json(
        { success: false, error: 'PDF URL is required for PDF books' },
        { status: 400 }
      );
    }

    if (fileType === 'text' && !content) {
      return NextResponse.json(
        { success: false, error: 'Content is required for text books' },
        { status: 400 }
      );
    }

    // Ensure createdBy is stored as ObjectId for consistent querying
    const { ObjectId } = await import('mongodb');
    let createdById = payload.id;
    if (ObjectId.isValid(payload.id)) {
      createdById = new ObjectId(payload.id);
    }

    const result = await BookModel.createBook({
      title,
      author: author || 'DevAndDone Founder',
      description,
      content: content || '',
      pdfUrl: pdfUrl || '',
      fileType: fileType || (pdfUrl ? 'pdf' : 'text'),
      coverImage: coverImage || '',
      category: category || 'General',
      tags: tags || [],
      featured: featured || false,
      isPublished: true,
      createdBy: createdById, // Associate book with the founder who created it (as ObjectId)
    });

    return NextResponse.json(
      { success: true, book: result.book },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating book:', error);
    
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create book' },
      { status: 500 }
    );
  }
}
