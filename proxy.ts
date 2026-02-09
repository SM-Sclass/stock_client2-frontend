import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server'


export function proxy(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const { pathname } = request.nextUrl;

  // Public routes that don't need authentication
  const publicRoutes = ['/login', '/signup', '/api/v1/auth/login', '/api/v1/auth/signup'];

  // Allow public routes without token
  if (publicRoutes.includes(pathname)) {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
  }

  // Redirect to dashboard if the user is already logged in and tries to visit the root '/'
  if (pathname === '/' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Check authentication for protected pages
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public/).*)'],
};