/**
 * Environment variable management and security
 *
 * This file centralizes access to environment variables and ensures fallbacks
 * are provided for local development while also protecting sensitive values
 * from being exposed in the client.
 */

// Object to store fallback values for local development
// In production, these will be overridden by actual environment variables
const devFallbacks = {
  FIREBASE_API_KEY: "dev-api-key",
  FIREBASE_AUTH_DOMAIN: "dev-app.firebaseapp.com",
  FIREBASE_PROJECT_ID: "dev-project",
  FIREBASE_STORAGE_BUCKET: "dev-app.appspot.com",
  FIREBASE_MESSAGING_SENDER_ID: "123456789",
  FIREBASE_APP_ID: "1:123456789:web:abcdef",
  ADMIN_EMAIL: "admin@example.com",
  FIREBASE_MOCK_MODE: "true", // Enable mock mode by default in development
  SOUTH_ASIA_REGIONS: "India,Nepal,Bhutan,Tibet,Sri Lanka,Maldives,Bangladesh",
};

/**
 * Get an environment variable with fallback
 * - For client-side variables (NEXT_PUBLIC_), directly access process.env
 * - For server-only variables, use a dev fallback in development
 * - Returns undefined if a variable is missing in production
 */
export function getEnv(
  key: string,
  includeDevFallback = true
): string | undefined {
  // For Next.js public env vars, just return the value
  const fullKey = key.startsWith("NEXT_PUBLIC_") ? key : `NEXT_PUBLIC_${key}`;

  // Try to get the value from environment
  const value = process.env[fullKey];

  // In development, provide fallbacks to allow the app to work
  if (!value && process.env.NODE_ENV !== "production" && includeDevFallback) {
    // Remove NEXT_PUBLIC_ prefix for looking up in fallbacks
    const fallbackKey = key.replace(
      "NEXT_PUBLIC_",
      ""
    ) as keyof typeof devFallbacks;
    return devFallbacks[fallbackKey];
  }

  return value;
}

/**
 * Firebase config object with fallbacks for development
 */
export const firebaseConfig = {
  apiKey: getEnv("FIREBASE_API_KEY"),
  authDomain: getEnv("FIREBASE_AUTH_DOMAIN"),
  projectId: getEnv("FIREBASE_PROJECT_ID"),
  storageBucket: getEnv("FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: getEnv("FIREBASE_MESSAGING_SENDER_ID"),
  appId: getEnv("FIREBASE_APP_ID"),
};

/**
 * Check if all required Firebase config values are present
 */
export const isFirebaseConfigValid = (): boolean => {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
};

/**
 * Mask a string for output/logging (e.g., API keys)
 * Shows only the first and last 4 characters, masks the rest
 */
export function maskSensitiveValue(value: string | undefined): string {
  if (!value) return "undefined";
  if (value.length <= 8) return "********"; // Don't show any part if too short

  const firstFour = value.substring(0, 4);
  const lastFour = value.substring(value.length - 4);
  const maskedLength = value.length - 8;
  const maskedPart = "*".repeat(maskedLength);

  return `${firstFour}${maskedPart}${lastFour}`;
}

/**
 * Admin email from environment
 */
export const adminEmail = getEnv("ADMIN_EMAIL");

/**
 * Check if Firebase mock mode is enabled
 */
export const isFirebaseMockModeEnabled = (): boolean => {
  return getEnv("FIREBASE_MOCK_MODE") === "true";
};

/**
 * Get list of South Asian regions covered by the tour company
 */
export const southAsiaRegions = getEnv("SOUTH_ASIA_REGIONS")?.split(",") || [
  "India",
  "Nepal",
  "Bhutan",
  "Tibet",
  "Sri Lanka",
  "Maldives",
  "Bangladesh",
];
