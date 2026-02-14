import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Add paths that require authentication
    const protectedPaths = ['/projects', '/dashboard', '/profile'];
    const isProtectedPath = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path));

    // We can't access Firebase Auth directly in middleware easily without session cookies
    // For this implementation, we will rely on client-side redirects in AuthContext
    // or use a more advanced approach with firebase-admin if needed later.

    // However, simple path checking is good practice.

    // For now, we will just pass through, as the valid check is on the client side AuthContext.
    // Real valid middleware protection requires setting up session cookies.

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - login
         * - register
         */
        '/((?!api|_next/static|_next/image|favicon.ico|login|register).*)',
    ],
};
