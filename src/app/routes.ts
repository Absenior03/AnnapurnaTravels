/**
 * Routes configuration for the application
 * This helps with static & dynamic route handling for authentication
 */

// Define routes that require authentication
export const PROTECTED_ROUTES = ["/bookings", "/profile", "/admin"];

// Define routes that are publicly accessible
export const PUBLIC_ROUTES = [
  "/",
  "/about",
  "/tours",
  "/contact",
  "/login",
  "/signup",
];

// Define routes for authentication
export const AUTH_ROUTES = [
  "/(regular-routes)/login",
  "/(regular-routes)/signup",
  "/login",
  "/signup",
];

// Check if a route is protected
export const isProtectedRoute = (path: string): boolean => {
  return PROTECTED_ROUTES.some(
    (route) => path === route || path.startsWith(`${route}/`)
  );
};

// Check if a route is auth-related
export const isAuthRoute = (path: string): boolean => {
  return AUTH_ROUTES.some(
    (route) => path === route || path.startsWith(`${route}/`)
  );
};

// This will help with middleware or client-side auth redirects
