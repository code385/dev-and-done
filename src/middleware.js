import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Allow access to login page without authentication
  if (pathname === '/admin/login') {
    const token = request.cookies.get('admin_token')?.value;

    // If user has a valid token, redirect to dashboard
    if (token) {
      try {
        await jwtVerify(token, secret);
        // Already authenticated, redirect to dashboard
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      } catch (error) {
        // Invalid token, delete it and allow access to login
        const response = NextResponse.next();
        response.cookies.delete('admin_token');
        return response;
      }
    }

    // No token, allow access to login page
    return NextResponse.next();
  }

  // Protect all other admin routes
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      await jwtVerify(token, secret);
      return NextResponse.next();
    } catch (error) {
      // Invalid token, redirect to login
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.delete('admin_token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};

