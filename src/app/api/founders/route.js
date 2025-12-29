import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/verify';
import * as FounderModel from '@/lib/mongodb/models/Founder';

// GET /api/founders - Get all founders (admin only)
export async function GET() {
  try {
    await requireAuth(); // Only authenticated founders can access

    const founders = await FounderModel.getAllFounders();

    return NextResponse.json({
      success: true,
      founders,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }
}

// POST /api/founders - Create a new founder (admin only)
export async function POST(request) {
  try {
    await requireAuth(); // Only authenticated founders can create new founders

    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check if founder already exists
    const existingFounder = await FounderModel.findFounderByEmail(email);
    if (existingFounder) {
      return NextResponse.json(
        { success: false, error: 'Founder with this email already exists' },
        { status: 400 }
      );
    }

    const result = await FounderModel.createFounder({
      name,
      email,
      password,
    });

    return NextResponse.json(
      { success: true, founder: result.founder },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating founder:', error);
    
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create founder' },
      { status: 500 }
    );
  }
}

