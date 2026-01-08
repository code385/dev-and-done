import { NextResponse } from 'next/server';
import * as FAQModel from '@/lib/mongodb/models/FAQ';
import { requireAuth } from '@/lib/auth/verify';

// GET /api/faqs - Get all published FAQs (public)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    const filter = {
      isPublished: true,
    };

    if (category) {
      filter.category = category;
    }

    const options = {
      page,
      limit,
      sort: { order: 1, createdAt: -1 },
    };

    const result = await FAQModel.getFAQs(filter, options);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch FAQs' },
      { status: 500 }
    );
  }
}

// POST /api/faqs - Create FAQ (admin only)
export async function POST(request) {
  try {
    await requireAuth();

    const body = await request.json();
    const { question, answer, category, order, isPublished } = body;

    // Validation
    if (!question || !answer) {
      return NextResponse.json(
        { success: false, error: 'Question and answer are required' },
        { status: 400 }
      );
    }

    const result = await FAQModel.createFAQ({
      question,
      answer,
      category: category || 'general',
      order: order || 0,
      isPublished: isPublished !== undefined ? isPublished : false,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    console.error('Error creating FAQ:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create FAQ' },
      { status: 500 }
    );
  }
}
