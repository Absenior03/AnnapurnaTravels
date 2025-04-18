import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAuthRoute, isProtectedRoute } from "@/app/routes";

// Middleware to manage routes and authentication
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for assets and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Mark auth routes to be client-side only
  if (isAuthRoute(pathname)) {
    const response = NextResponse.next();
    response.headers.set("x-middleware-cache", "no-cache");
    response.headers.set("Cache-Control", "no-store");
    return response;
  }

  return NextResponse.next();
}

// Configure middleware settings
export const config = {
  matcher: [
    // Match all paths except for:
    // - API routes
    // - Static files (images, fonts, etc.)
    // - Static _next files
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
