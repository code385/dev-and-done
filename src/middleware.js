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

  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/f7f805b1-2d83-4c5a-9a7e-6e88a0d65fc7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'middleware.js:13',message:'Middleware entry',data:{pathname,url:request.url},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion

  // Admin routes should NOT have locale prefix - exclude from i18n routing
  // Check if pathname starts with /admin or has /admin/ in it (but not at locale level)
  const isAdminRoute = pathname === '/admin/login' || 
                       pathname.startsWith('/admin/') ||
                       (pathname.split('/').length >= 2 && pathname.split('/')[2] === 'admin');

  // If accessing admin route with locale prefix (e.g., /en/admin/login), redirect to root admin route
  if (pathname.match(/^\/(en|es|fr|ar)\/admin/)) {
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/f7f805b1-2d83-4c5a-9a7e-6e88a0d65fc7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'middleware.js:22',message:'Admin route with locale prefix detected, redirecting',data:{pathname},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    // Remove locale prefix from admin routes
    const adminPath = pathname.replace(/^\/(en|es|fr|ar)/, '');
    return NextResponse.redirect(new URL(adminPath, request.url));
  }

  // Handle admin routes (without locale prefix)
  if (isAdminRoute) {
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/f7f805b1-2d83-4c5a-9a7e-6e88a0d65fc7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'middleware.js:30',message:'Processing admin route',data:{pathname,isLogin:pathname === '/admin/login' || pathname.startsWith('/admin/login/')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion

    // Allow access to login page without authentication
    if (pathname === '/admin/login' || pathname.startsWith('/admin/login/')) {
      const token = request.cookies.get('admin_token')?.value;

      // If user has a valid token, redirect to dashboard
      if (token) {
        try {
          await jwtVerify(token, secret);
          // #region agent log
          fetch('http://127.0.0.1:7243/ingest/f7f805b1-2d83-4c5a-9a7e-6e88a0d65fc7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'middleware.js:40',message:'Valid admin token found, redirecting to dashboard',data:{pathname},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
          // #endregion
          return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        } catch (error) {
          // Invalid token, delete it and allow access to login
          // #region agent log
          fetch('http://127.0.0.1:7243/ingest/f7f805b1-2d83-4c5a-9a7e-6e88a0d65fc7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'middleware.js:45',message:'Invalid admin token, allowing login',data:{pathname},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
          // #endregion
          const response = NextResponse.next();
          response.cookies.delete('admin_token');
          return response;
        }
      }

      // No token, allow access to login page
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/f7f805b1-2d83-4c5a-9a7e-6e88a0d65fc7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'middleware.js:53',message:'No admin token, allowing login access',data:{pathname},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      return NextResponse.next();
    }

    // Protect all other admin routes
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/f7f805b1-2d83-4c5a-9a7e-6e88a0d65fc7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'middleware.js:62',message:'No admin token for protected route, redirecting to login',data:{pathname},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      await jwtVerify(token, secret);
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/f7f805b1-2d83-4c5a-9a7e-6e88a0d65fc7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'middleware.js:68',message:'Valid admin token, allowing admin route access',data:{pathname},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      // Allow admin route without i18n middleware
      return NextResponse.next();
    } catch (error) {
      // Invalid token, redirect to login
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/f7f805b1-2d83-4c5a-9a7e-6e88a0d65fc7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'middleware.js:75',message:'Invalid admin token, redirecting to login',data:{pathname},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.delete('admin_token');
      return response;
    }
  }

  // Apply i18n middleware for all other routes
  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/f7f805b1-2d83-4c5a-9a7e-6e88a0d65fc7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'middleware.js:84',message:'Applying i18n middleware',data:{pathname},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
  // #endregion
  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
