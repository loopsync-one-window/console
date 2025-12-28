import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Function to detect mobile devices based on user agent
function isMobileDevice(userAgent: string): boolean {
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return mobileRegex.test(userAgent);
}

// Function to detect tablets (which we might want to treat differently)
function isTablet(userAgent: string): boolean {
  const tabletRegex = /iPad|Android(?!.*Mobile)/i;
  return tabletRegex.test(userAgent);
}

export function proxy(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || '';
  const isMobile = isMobileDevice(userAgent);
  const isTabletDevice = isTablet(userAgent);

  // If it's a mobile device (but not a tablet), redirect to screening page
  if (isMobile && !isTabletDevice) {
    // Check if we're already on the screening page to avoid infinite redirect
    if (!request.nextUrl.pathname.startsWith('/screening')) {
      const screeningUrl = new URL('/screening', request.url);
      return NextResponse.redirect(screeningUrl);
    }
  }

  // For desktop or tablet devices, continue normally
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};