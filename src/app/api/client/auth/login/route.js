import { NextResponse } from 'next/server';
import * as ClientModel from '@/lib/mongodb/models/Client';
import { createClientToken } from '@/lib/auth/client-auth';
import bcrypt from 'bcryptjs';

/**
 * POST /api/client/auth/login
 * Client login endpoint
 * Note: This assumes clients have a password field. If using a different auth method,
 * adjust accordingly.
 */
export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find client by email
    const client = await ClientModel.getClientByEmail(email.toLowerCase());

    if (!client) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // If client has a password field, verify it
    // Otherwise, you might use a different auth method (e.g., magic link, OAuth)
    if (client.password) {
      const isValidPassword = await bcrypt.compare(password, client.password);
      if (!isValidPassword) {
        return NextResponse.json(
          { success: false, error: 'Invalid credentials' },
          { status: 401 }
        );
      }
    } else {
      // For now, if no password, we'll allow login (you may want to implement
      // a different auth method like magic links)
      // In production, implement proper authentication
    }

    // Create JWT token
    const token = await createClientToken(client);

    // Create response with token in httpOnly cookie
    const response = NextResponse.json({
      success: true,
      client: {
        id: client._id.toString(),
        email: client.email,
        name: client.name,
        companyName: client.companyName,
      },
    });

    response.cookies.set('client_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error during client login:', error);
    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    );
  }
}

