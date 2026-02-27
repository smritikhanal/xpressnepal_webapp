import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Since we're using localStorage for auth (client-side), 
  // we can't reliably check auth state in middleware (server-side)
  // Let the client-side layouts handle authentication redirects
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
