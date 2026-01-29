import { NextResponse } from 'next/server';
import * as ReportModel from '@/lib/mongodb/models/CommunityReport';
import { requireAuth } from '@/lib/auth/verify';

// PUT /api/admin/community/reports/[id] - Update report status
export async function PUT(request, { params }) {
  try {
    const token = await requireAuth(); // Admin only
    const { id } = params;
    const body = await request.json();
    const { status, action } = body;

    if (!status || !['pending', 'reviewed', 'resolved', 'dismissed'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Valid status is required' },
        { status: 400 }
      );
    }

    const updateData = {
      status,
      reviewedBy: token.userId || token._id,
    };

    const result = await ReportModel.updateReport(id, updateData);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Report updated successfully',
    });
  } catch (error) {
    console.error('Error updating report:', error);
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Failed to update report' },
      { status: 500 }
    );
  }
}

