import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb/connect';

const DB_NAME = 'devanddone';
const COLLECTION_NAME = 'shares';

// POST /api/share - Track share events
export async function POST(request) {
  try {
    const body = await request.json();
    const { platform, contentType, contentId, url } = body;

    if (!platform || !contentType || !url) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Get client IP and user agent for analytics
    const headers = request.headers;
    const ip = headers.get('x-forwarded-for') || headers.get('x-real-ip') || 'unknown';
    const userAgent = headers.get('user-agent') || 'unknown';

    const shareEvent = {
      platform,
      contentType,
      contentId: contentId || null,
      url,
      ip,
      userAgent,
      createdAt: new Date(),
    };

    await collection.insertOne(shareEvent);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('Error tracking share:', error);
    // Don't fail the request if tracking fails
    return NextResponse.json({
      success: true,
    });
  }
}
