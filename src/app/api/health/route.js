import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb/connect';

export async function GET() {
  try {
    // Check MongoDB connection
    const client = await clientPromise;
    await client.db('admin').command({ ping: 1 });

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        services: {
          database: 'disconnected',
        },
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 503 }
    );
  }
}

