import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb/connect';
import { requireAuth } from '@/lib/auth/verify';

const DB_NAME = 'devanddone';
const COLLECTION_NAME = 'analytics';

// POST /api/analytics - Track analytics event (public)
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

      // Generate or use sessionId
      const sessionId = event.sessionId || event.data?.sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const analyticsEvent = {
        ...event,
        sessionId,
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

// GET /api/analytics - Get analytics data (admin only)
export async function GET(request) {
  try {
    await requireAuth();

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const eventType = searchParams.get('eventType');
    const groupBy = searchParams.get('groupBy') || 'day'; // day, hour, week, month

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Build filter
    const filter = {};
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }
    if (eventType) {
      filter.type = eventType;
    }

    // Get date grouping format
    let dateFormat;
    switch (groupBy) {
      case 'hour':
        dateFormat = { year: { $year: '$createdAt' }, month: { $month: '$createdAt' }, day: { $dayOfMonth: '$createdAt' }, hour: { $hour: '$createdAt' } };
        break;
      case 'week':
        dateFormat = { year: { $year: '$createdAt' }, week: { $week: '$createdAt' } };
        break;
      case 'month':
        dateFormat = { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } };
        break;
      default: // day
        dateFormat = { year: { $year: '$createdAt' }, month: { $month: '$createdAt' }, day: { $dayOfMonth: '$createdAt' } };
    }

    // Aggregation pipeline for page views over time
    const pageViewsPipeline = [
      { $match: { ...filter, type: 'page_view' } },
      {
        $group: {
          _id: dateFormat,
          count: { $sum: 1 },
          uniqueSessions: { $addToSet: '$sessionId' },
        },
      },
      {
        $project: {
          _id: 0,
          date: {
            $dateFromParts: {
              year: '$_id.year',
              month: { $ifNull: ['$_id.month', 1] },
              day: { $ifNull: ['$_id.day', 1] },
              hour: { $ifNull: ['$_id.hour', 0] },
            },
          },
          count: 1,
          uniqueSessions: { $size: '$uniqueSessions' },
        },
      },
      { $sort: { date: 1 } },
    ];

    // Event counts by type
    const eventCountsPipeline = [
      { $match: filter },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ];

    // User paths/sessions
    const userPathsPipeline = [
      { $match: { ...filter, type: 'page_view' } },
      {
        $group: {
          _id: '$sessionId',
          paths: { $push: '$data.path' },
          timestamps: { $push: '$createdAt' },
        },
      },
      {
        $project: {
          _id: 0,
          sessionId: '$_id',
          paths: 1,
          timestamps: 1,
          pathCount: { $size: '$paths' },
        },
      },
      { $sort: { pathCount: -1 } },
      { $limit: 100 },
    ];

    // Run aggregations
    const [pageViews, eventCounts, userPaths, totalEvents] = await Promise.all([
      collection.aggregate(pageViewsPipeline).toArray(),
      collection.aggregate(eventCountsPipeline).toArray(),
      collection.aggregate(userPathsPipeline).toArray(),
      collection.countDocuments(filter),
    ]);

    // Calculate unique sessions
    const uniqueSessions = await collection.distinct('sessionId', filter);

    return NextResponse.json({
      success: true,
      data: {
        pageViews,
        eventCounts,
        userPaths,
        summary: {
          totalEvents,
          uniqueSessions: uniqueSessions.length,
          dateRange: {
            start: startDate || null,
            end: endDate || null,
          },
        },
      },
    });
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

