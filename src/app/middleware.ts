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

  // Handle direct access to /login or /signup by redirecting to the route group versions
  if (pathname === "/login") {
    return NextResponse.redirect(new URL("/(auth-routes)/login", request.url));
  }

  if (pathname === "/signup") {
    return NextResponse.redirect(new URL("/(auth-routes)/signup", request.url));
  }

  // For auth routes, we need to ensure they load without SSR
  if (isAuthRoute(pathname)) {
    const response = NextResponse.next();

    // These headers prevent the page from being cached by the CDN
    response.headers.set("x-middleware-cache", "no-cache");
    response.headers.set("Cache-Control", "no-store, must-revalidate");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");

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
