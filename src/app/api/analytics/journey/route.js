import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb/connect';
import { requireAuth } from '@/lib/auth/verify';

const DB_NAME = 'devanddone';
const COLLECTION_NAME = 'analytics';

// GET /api/analytics/journey - Map user navigation paths (admin only)
export async function GET(request) {
  try {
    await requireAuth();

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = parseInt(searchParams.get('limit') || '20');

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Build filter
    const filter = { type: 'page_view' };
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    // Get page views grouped by session
    const pipeline = [
      { $match: filter },
      {
        $group: {
          _id: '$sessionId',
          paths: {
            $push: {
              path: '$data.path',
              timestamp: '$createdAt',
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          sessionId: '$_id',
          paths: {
            $map: {
              input: { $sortArray: { input: '$paths', sortBy: { timestamp: 1 } } },
              as: 'p',
              in: '$$p.path',
            },
          },
          pathCount: { $size: '$paths' },
        },
      },
      { $sort: { pathCount: -1 } },
      { $limit: limit * 10 }, // Get more to find common paths
    ];

    const sessions = await collection.aggregate(pipeline).toArray();

    // Find common paths
    const pathFrequencies = {};
    sessions.forEach((session) => {
      const pathString = session.paths.join(' → ');
      if (!pathFrequencies[pathString]) {
        pathFrequencies[pathString] = {
          path: session.paths,
          frequency: 0,
          sessions: [],
        };
      }
      pathFrequencies[pathString].frequency++;
      pathFrequencies[pathString].sessions.push(session.sessionId);
    });

    // Convert to array and sort by frequency
    const commonPaths = Object.values(pathFrequencies)
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, limit)
      .map((item) => ({
        path: item.path,
        frequency: item.frequency,
        percentage: Math.round((item.frequency / sessions.length) * 100 * 100) / 100,
      }));

    // Calculate drop-off points
    const dropOffPoints = {};
    sessions.forEach((session) => {
      if (session.paths.length > 1) {
        const lastPath = session.paths[session.paths.length - 1];
        if (!dropOffPoints[lastPath]) {
          dropOffPoints[lastPath] = 0;
        }
        dropOffPoints[lastPath]++;
      }
    });

    const dropOffs = Object.entries(dropOffPoints)
      .map(([path, count]) => ({
        path,
        count,
        percentage: Math.round((count / sessions.length) * 100 * 100) / 100,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return NextResponse.json({
      success: true,
      data: {
        commonPaths,
        dropOffPoints: dropOffs,
        summary: {
          totalSessions: sessions.length,
          averagePathLength:
            sessions.length > 0
              ? Math.round(
                  (sessions.reduce((sum, s) => sum + s.pathCount, 0) / sessions.length) * 100
                ) / 100
              : 0,
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
    console.error('Journey API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to map user journeys' },
      { status: 500 }
    );
  }
}


