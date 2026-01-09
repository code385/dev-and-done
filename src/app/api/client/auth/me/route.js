import { NextResponse } from 'next/server';
import { verifyClientToken, getCurrentClient } from '@/lib/auth/client-auth';

/**
 * GET /api/client/auth/me
 * Get current authenticated client info
 */
export async function GET() {
  try {
    const payload = await verifyClientToken();

    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const client = await getCurrentClient();

    if (!client) {
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      client: {
        id: client._id.toString(),
        email: client.email,
        name: client.name,
        companyName: client.companyName,
      },
    });
  } catch (error) {
    console.error('Error getting client info:', error);
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }
}

