import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb/connect';

const DB_NAME = 'devanddone';
const COLLECTION_NAME = 'reading_progress';

// POST /api/reading-progress - Save reading progress (optional server sync)
export async function POST(request) {
  try {
    const body = await request.json();
    const { contentId, contentType, percentage } = body;

    if (!contentId || !contentType || percentage === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Optional: Store in database for analytics
    // For now, we'll just acknowledge the request
    // In the future, this could be used for cross-device sync with user accounts

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('Error saving reading progress:', error);
    // Don't fail the request if tracking fails
    return NextResponse.json({
      success: true,
    });
  }
}

