import { NextResponse } from 'next/server';
import * as FAQModel from '@/lib/mongodb/models/FAQ';
import { requireAuth } from '@/lib/auth/verify';

// GET /api/faqs/[id] - Get single FAQ (public)
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const faq = await FAQModel.getFAQById(id);

    if (!faq) {
      return NextResponse.json(
        { success: false, error: 'FAQ not found' },
        { status: 404 }
      );
    }

    // Only return published FAQs for public access
    if (!faq.isPublished) {
      return NextResponse.json(
        { success: false, error: 'FAQ not found' },
        { status: 404 }
      );
    }

    // Increment views
    await FAQModel.incrementFAQViews(id);

    return NextResponse.json({
      success: true,
      faq,
    });
  } catch (error) {
    console.error('Error fetching FAQ:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch FAQ' },
      { status: 500 }
    );
  }
}

// PUT /api/faqs/[id] - Update FAQ (admin only)
export async function PUT(request, { params }) {
  try {
    await requireAuth();

    const { id } = await params;
    const body = await request.json();

    const result = await FAQModel.updateFAQ(id, body);

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
    console.error('Error updating FAQ:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update FAQ' },
      { status: 500 }
    );
  }
}

// DELETE /api/faqs/[id] - Delete FAQ (admin only)
export async function DELETE(request, { params }) {
  try {
    await requireAuth();

    const { id } = await params;
    const result = await FAQModel.deleteFAQ(id);

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
    console.error('Error deleting FAQ:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete FAQ' },
      { status: 500 }
    );
  }
}
