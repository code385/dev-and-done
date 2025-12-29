import { NextResponse } from 'next/server';
import * as FounderModel from '@/lib/mongodb/models/Founder';
import { SignJWT } from 'jose';

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find founder
    const founder = await FounderModel.findFounderByEmail(email);

    if (!founder) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    if (!founder.isActive) {
      return NextResponse.json(
        { success: false, error: 'Account is deactivated' },
        { status: 403 }
      );
    }

    // Verify password
    const isValidPassword = await FounderModel.verifyFounderPassword(founder, password);

    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = await new SignJWT({
      id: founder._id.toString(),
      email: founder.email,
      name: founder.name,
      role: founder.role,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(secret);

    // Create response with token in httpOnly cookie
    const response = NextResponse.json({
      success: true,
      founder: {
        id: founder._id.toString(),
        email: founder.email,
        name: founder.name,
        role: founder.role,
      },
    });

    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    );
  }
}

