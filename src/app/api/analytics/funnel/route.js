import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb/connect';
import { requireAuth } from '@/lib/auth/verify';

const DB_NAME = 'devanddone';
const COLLECTION_NAME = 'analytics';

// GET /api/analytics/funnel - Calculate conversion funnel (admin only)
export async function GET(request) {
  try {
    await requireAuth();

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const steps = searchParams.get('steps')?.split(',') || [
      'page_view',
      'form_start',
      'form_submit',
      'newsletter_subscribe',
    ];

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
    filter.type = { $in: steps };

    // Get all events for the funnel steps
    const events = await collection
      .find(filter)
      .sort({ createdAt: 1 })
      .toArray();

    // Group by sessionId to track user journeys
    const sessions = {};
    events.forEach((event) => {
      const sessionId = event.sessionId || 'unknown';
      if (!sessions[sessionId]) {
        sessions[sessionId] = [];
      }
      sessions[sessionId].push({
        type: event.type,
        timestamp: event.createdAt,
        data: event.data || {},
      });
    });

    // Calculate funnel steps
    const funnelData = steps.map((step, index) => {
      let count = 0;
      let previousCount = index > 0 ? funnelData[index - 1].count : Infinity;

      // Count sessions that reached this step
      Object.values(sessions).forEach((sessionEvents) => {
        const stepEvents = sessionEvents.filter((e) => e.type === step);
        if (stepEvents.length > 0) {
          // Check if previous steps were completed
          if (index === 0 || sessionEvents.some((e) => e.type === steps[index - 1])) {
            count++;
          }
        }
      });

      const conversionRate = previousCount > 0 ? (count / previousCount) * 100 : 0;
      const dropOffRate = previousCount > 0 ? ((previousCount - count) / previousCount) * 100 : 0;

      return {
        step,
        count,
        conversionRate: Math.round(conversionRate * 100) / 100,
        dropOffRate: Math.round(dropOffRate * 100) / 100,
      };
    });

    // Calculate overall conversion rate
    const firstStepCount = funnelData[0]?.count || 0;
    const lastStepCount = funnelData[funnelData.length - 1]?.count || 0;
    const overallConversionRate =
      firstStepCount > 0 ? (lastStepCount / firstStepCount) * 100 : 0;

    return NextResponse.json({
      success: true,
      funnel: funnelData,
      summary: {
        totalSessions: Object.keys(sessions).length,
        overallConversionRate: Math.round(overallConversionRate * 100) / 100,
        dateRange: {
          start: startDate || null,
          end: endDate || null,
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
    console.error('Funnel API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to calculate funnel' },
      { status: 500 }
    );
  }
}


