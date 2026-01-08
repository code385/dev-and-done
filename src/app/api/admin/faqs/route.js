import { NextResponse } from 'next/server';
import * as FAQModel from '@/lib/mongodb/models/FAQ';
import { requireAuth } from '@/lib/auth/verify';

// GET /api/admin/faqs - Get all FAQs (admin only, includes unpublished)
export async function GET() {
  try {
    await requireAuth();

    const filter = {}; // Get all FAQs, including unpublished
    const options = {
      page: 1,
      limit: 1000,
      sort: { order: 1, createdAt: -1 },
    };

    const result = await FAQModel.getFAQs(filter, options);

    return NextResponse.json({
      success: true,
      faqs: result.faqs,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to fetch FAQs' },
      { status: 500 }
    );
  }
}

