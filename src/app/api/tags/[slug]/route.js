import { NextResponse } from 'next/server';
import * as TagModel from '@/lib/mongodb/models/Tag';

// GET /api/tags/[slug] - Get tag by slug (public)
export async function GET(request, { params }) {
  try {
    const { slug } = params;
    
    if (!slug) {
      return NextResponse.json(
        { success: false, error: 'Tag slug is required' },
        { status: 400 }
      );
    }

    const tag = await TagModel.getTagBySlug(slug);

    if (!tag) {
      return NextResponse.json(
        { success: false, error: 'Tag not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      tag,
    });
  } catch (error) {
    console.error('Error fetching tag:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tag' },
      { status: 500 }
    );
  }
}


