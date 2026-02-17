import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const pathname = request.nextUrl.pathname;

  // Auth routes that should only be accessible to logged-out users
  const authRoutes = ['/auth/login', '/auth/register', '/auth/forgot-password', '/auth/reset-password'];
  
  // Protected routes that require authentication
  const protectedRoutes = ['/admin', '/seller', '/user/profile'];

  // If user is logged in and trying to access auth pages, redirect to dashboard
  if (token && authRoutes.some(route => pathname.startsWith(route))) {
    // Decode token to get user role (simplified - in production, verify the token)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const role = payload.role;

      if (role === 'superadmin') {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      } else if (role === 'seller') {
        return NextResponse.redirect(new URL('/seller/dashboard', request.url));
      } else {
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (error) {
      // If token is invalid, clear it and allow access to auth pages
      const response = NextResponse.next();
      response.cookies.delete('token');
      return response;
    }
  }

  // If user is not logged in and trying to access protected routes, redirect to login
  if (!token && protectedRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/auth/:path*',
    '/admin/:path*',
    '/seller/:path*',
    '/user/profile/:path*',
  ],
};
