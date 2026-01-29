import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb/connect';
import { requireAuth } from '@/lib/auth/verify';

const DB_NAME = 'devanddone';
const COLLECTION_NAME = 'analytics';

// GET /api/analytics/export - Export analytics data as CSV (admin only)
export async function GET(request) {
  try {
    await requireAuth();

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const eventType = searchParams.get('eventType');

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

    // Fetch events
    const events = await collection.find(filter).sort({ createdAt: -1 }).limit(10000).toArray();

    // Convert to CSV
    const headers = ['Timestamp', 'Event Type', 'Session ID', 'Path', 'IP', 'User Agent', 'Data'];
    const rows = events.map((event) => {
      const timestamp = new Date(event.createdAt).toISOString();
      const path = event.data?.path || '';
      const data = JSON.stringify(event.data || {});
      
      // Escape CSV values
      const escapeCSV = (value) => {
        if (value === null || value === undefined) return '';
        const str = String(value);
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      };

      return [
        escapeCSV(timestamp),
        escapeCSV(event.type),
        escapeCSV(event.sessionId || ''),
        escapeCSV(path),
        escapeCSV(event.ip || ''),
        escapeCSV(event.userAgent || ''),
        escapeCSV(data),
      ].join(',');
    });

    const csv = [headers.join(','), ...rows].join('\n');

    // Return CSV file
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="analytics-export-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    console.error('Export API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to export analytics' },
      { status: 500 }
    );
  }
}


