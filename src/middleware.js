import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

// Create the i18n middleware
const intlMiddleware = createMiddleware(routing);

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Admin routes should NOT have locale prefix - exclude from i18n routing
  const isAdminRoute = pathname === '/admin/login' || 
                       pathname.startsWith('/admin/') ||
                       (pathname.split('/').length >= 2 && pathname.split('/')[2] === 'admin');

  // Client routes should NOT have locale prefix - exclude from i18n routing
  const isClientRoute = pathname === '/client/login' || 
                        pathname.startsWith('/client/');

  // If accessing admin route with locale prefix (e.g., /en/admin/login), redirect to root admin route
  if (pathname.match(/^\/(en|es|fr|ar)\/admin/)) {
    const adminPath = pathname.replace(/^\/(en|es|fr|ar)/, '');
    return NextResponse.redirect(new URL(adminPath, request.url));
  }

  // If accessing client route with locale prefix (e.g., /en/client/login), redirect to root client route
  if (pathname.match(/^\/(en|es|fr|ar)\/client/)) {
    const clientPath = pathname.replace(/^\/(en|es|fr|ar)/, '');
    return NextResponse.redirect(new URL(clientPath, request.url));
  }

  // Handle admin routes (without locale prefix)
  if (isAdminRoute) {
    // Allow access to login page without authentication
    if (pathname === '/admin/login' || pathname.startsWith('/admin/login/')) {
      const token = request.cookies.get('admin_token')?.value;

      // If user has a valid token, redirect to dashboard
      if (token) {
        try {
          await jwtVerify(token, secret);
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
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      await jwtVerify(token, secret);
      // Allow admin route without i18n middleware
      return NextResponse.next();
    } catch (error) {
      // Invalid token, redirect to login
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.delete('admin_token');
      return response;
    }
  }

  // Handle client routes (without locale prefix)
  if (isClientRoute) {
    // Allow access to login page without authentication
    if (pathname === '/client/login' || pathname.startsWith('/client/login/')) {
      const token = request.cookies.get('client_token')?.value;

      // If user has a valid token, redirect to dashboard
      if (token) {
        try {
          await jwtVerify(token, secret);
          return NextResponse.redirect(new URL('/client/dashboard', request.url));
        } catch (error) {
          // Invalid token, delete it and allow access to login
          const response = NextResponse.next();
          response.cookies.delete('client_token');
          return response;
        }
      }

      // No token, allow access to login page
      return NextResponse.next();
    }

    // Protect all other client routes
    const token = request.cookies.get('client_token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/client/login', request.url));
    }

    try {
      await jwtVerify(token, secret);
      // Verify it's a client token
      const { payload } = await jwtVerify(token, secret);
      if (payload.role !== 'client') {
        const response = NextResponse.redirect(new URL('/client/login', request.url));
        response.cookies.delete('client_token');
        return response;
      }
      // Allow client route without i18n middleware
      return NextResponse.next();
    } catch (error) {
      // Invalid token, redirect to login
      const response = NextResponse.redirect(new URL('/client/login', request.url));
      response.cookies.delete('client_token');
      return response;
    }
  }

  // Apply i18n middleware for all other routes
  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
