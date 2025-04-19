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
    pathname.includes(".") ||
    pathname.includes("favicon")
  ) {
    return NextResponse.next();
  }

  try {
    // For auth routes, we need to ensure they load without SSR
    if (isAuthRoute(pathname)) {
      const response = NextResponse.next();

      // These headers prevent the page from being cached by the CDN
      response.headers.set("x-middleware-cache", "no-cache");
      response.headers.set("Cache-Control", "no-store, must-revalidate");
      response.headers.set("Pragma", "no-cache");
      response.headers.set("Expires", "0");

      // This header tells the browser not to prerender this page
      response.headers.set("x-middleware-rewrite", "true");

      return response;
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    // Always return a response, even in case of errors
    // This prevents 500 errors from crashing the application
    return NextResponse.next();
  }
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
