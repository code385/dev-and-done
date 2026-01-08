import { NextResponse } from 'next/server';
import * as FAQModel from '@/lib/mongodb/models/FAQ';

// POST /api/faqs/[id]/helpful - Mark FAQ as helpful (public)
export async function POST(request, { params }) {
  try {
    const { id } = await params;
    await FAQModel.markFAQHelpful(id);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('Error marking FAQ as helpful:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to mark FAQ as helpful' },
      { status: 500 }
    );
  }
}
