import { NextResponse } from 'next/server';
import * as FAQModel from '@/lib/mongodb/models/FAQ';

// GET /api/faqs/search - Search FAQs (public)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const category = searchParams.get('category');

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Search query is required' },
        { status: 400 }
      );
    }

    const filter = {};
    if (category) {
      filter.category = category;
    }

    const faqs = await FAQModel.searchFAQs(query.trim(), filter);

    return NextResponse.json({
      success: true,
      faqs,
    });
  } catch (error) {
    console.error('Error searching FAQs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to search FAQs' },
      { status: 500 }
    );
  }
}
