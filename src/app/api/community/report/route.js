import { NextResponse } from 'next/server';
import * as ReportModel from '@/lib/mongodb/models/CommunityReport';
import { verifyToken } from '@/lib/auth/verify';
import { sanitizeText } from '@/lib/utils/sanitize';
import { checkRateLimit } from '@/lib/utils/sanitize';

// POST /api/community/report - Create a report
export async function POST(request) {
  try {
    const body = await request.json();
    let { targetType, targetId, reason, description, reporterEmail } = body;

    // Validation
    if (!targetType || !targetId || !reason) {
      return NextResponse.json(
        { success: false, error: 'Target type, target ID, and reason are required' },
        { status: 400 }
      );
    }

    const validReasons = ['spam', 'harassment', 'inappropriate', 'off-topic', 'other'];
    if (!validReasons.includes(reason)) {
      return NextResponse.json(
        { success: false, error: 'Invalid reason' },
        { status: 400 }
      );
    }

    // Rate limiting
    const identifier = reporterEmail || request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(identifier, 5, 3600000)) { // 5 reports per hour
      return NextResponse.json(
        { success: false, error: 'Too many reports. Please try again later.' },
        { status: 429 }
      );
    }

    // Sanitize input
    description = sanitizeText(description || '', 500);

    // Get reporter info
    const token = await verifyToken();
    let reporterId = null;
    if (token && token.userId) {
      reporterId = token.userId;
    }
    if (!reporterEmail && token && token.email) {
      reporterEmail = token.email;
    }

    const reportData = {
      reporterId,
      reporterEmail: reporterEmail || '',
      targetType,
      targetId,
      reason,
      description,
    };

    const result = await ReportModel.createReport(reportData);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to create report' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Report submitted successfully. Thank you for helping keep the community safe.',
    });
  } catch (error) {
    console.error('Error creating report:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create report' },
      { status: 500 }
    );
  }
}

