import { NextResponse } from 'next/server';

/**
 * POST /api/client/auth/logout
 * Client logout endpoint
 */
export async function POST() {
  const response = NextResponse.json({ success: true });
  
  // Delete client token cookie
  response.cookies.set('client_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
  
  return response;
}

