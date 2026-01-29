import { NextResponse } from 'next/server';
import * as TagModel from '@/lib/mongodb/models/Tag';
import { requireAuth } from '@/lib/auth/verify';

// GET /api/tags - Get all tags (public)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '100');

    const options = {
      page,
      limit,
      sort: { count: -1, name: 1 },
    };

    const result = await TagModel.getTags({}, options);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tags' },
      { status: 500 }
    );
  }
}

// POST /api/tags - Create tag (admin only)
export async function POST(request) {
  try {
    await requireAuth();

    const body = await request.json();
    const { name, slug, description } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Tag name is required' },
        { status: 400 }
      );
    }

    const result = await TagModel.createTag({
      name,
      slug,
      description,
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
    console.error('Error creating tag:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create tag' },
      { status: 500 }
    );
  }
}

// DELETE /api/tags - Delete tag (admin only)
export async function DELETE(request) {
  try {
    await requireAuth();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Tag ID is required' },
        { status: 400 }
      );
    }

    // Check if tag is being used by any blogs or books
    const client = await (await import('@/lib/mongodb/connect')).default;
    const db = client.db('devanddone');
    const { ObjectId } = await import('mongodb');
    
    const blogsUsingTag = await db.collection('blogs').countDocuments({
      tags: new ObjectId(id)
    });
    const booksUsingTag = await db.collection('books').countDocuments({
      tags: new ObjectId(id)
    });

    if (blogsUsingTag > 0 || booksUsingTag > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Cannot delete tag. It is being used by ${blogsUsingTag + booksUsingTag} item(s).` 
        },
        { status: 400 }
      );
    }

    const result = await TagModel.deleteTag(id);

    if (!result.success) {
      return NextResponse.json(result, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    console.error('Error deleting tag:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete tag' },
      { status: 500 }
    );
  }
}

