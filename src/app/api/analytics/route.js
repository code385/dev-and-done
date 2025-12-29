import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb/connect';

const DB_NAME = 'devanddone';
const COLLECTION_NAME = 'analytics';

export async function POST(request) {
  try {
    const event = await request.json();

    if (!event.type) {
      return NextResponse.json(
        { error: 'Event type is required' },
        { status: 400 }
      );
    }

    // Store in MongoDB
    try {
      const client = await clientPromise;
      const db = client.db(DB_NAME);
      const collection = db.collection(COLLECTION_NAME);

      const analyticsEvent = {
        ...event,
        ip: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        createdAt: new Date(),
      };

      await collection.insertOne(analyticsEvent);
    } catch (dbError) {
      console.error('Analytics database error:', dbError);
      // Don't fail the request if DB fails
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

