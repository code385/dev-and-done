import { NextResponse } from 'next/server';
import * as ReportModel from '@/lib/mongodb/models/CommunityReport';
import { requireAuth } from '@/lib/auth/verify';

// GET /api/admin/community/reports - Get all reports
export async function GET(request) {
  try {
    await requireAuth(); // Admin only

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const filter = {};
    if (status) filter.status = status;

    const result = await ReportModel.getReports(filter, {
      page,
      limit,
      sort: { createdAt: -1 },
    });

    return NextResponse.json({
      success: true,
      reports: result.reports,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}

