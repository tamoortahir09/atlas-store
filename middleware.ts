import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { shouldRedirectToMaintenance } from './lib/maintenance-config';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Check if this path should be redirected to maintenance
  if (shouldRedirectToMaintenance(pathname)) {
    // Create the maintenance URL
    const maintenanceUrl = new URL('/maintenance', request.url);
    
    // Add a query parameter to indicate this was a maintenance redirect
    // This can be useful for analytics or debugging
    maintenanceUrl.searchParams.set('from', encodeURIComponent(pathname));
    
    // Redirect to maintenance page
    return NextResponse.redirect(maintenanceUrl);
  }
  
  // Continue with the request if no maintenance redirect is needed
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  // Match all paths except:
  // - api routes
  // - _next static files
  // - favicon.ico
  // - public files (images, etc.)
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
}; 