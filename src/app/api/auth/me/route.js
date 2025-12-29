import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/verify';
import * as FounderModel from '@/lib/mongodb/models/Founder';

export async function GET() {
  try {
    const payload = await verifyToken();

    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get founder details
    const founder = await FounderModel.findFounderByEmail(payload.email);

    if (!founder || !founder.isActive) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      founder: {
        id: founder._id.toString(),
        email: founder.email,
        name: founder.name,
        role: founder.role,
      },
    });
  } catch (error) {
    console.error('Error getting founder info:', error);
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }
}

