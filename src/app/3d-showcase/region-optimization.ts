"use client";

/**
 * Utility to check if the current deployment region might have issues with 3D/WebGL content
 * This helps us provide alternative content in regions where 3D performance might be poor
 */

export function shouldOptimizeForRegion(): boolean {
  if (typeof window === "undefined") return true; // When running on server, assume we need to optimize

  try {
    // Check if the user's region might have connectivity or performance issues
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // List of regions where we've observed issues with 3D content
    const regionsToOptimize = [
      "Asia/Kolkata", // India
      "Asia/Colombo", // Sri Lanka
      "Asia/Karachi", // Pakistan
      "Asia/Dhaka", // Bangladesh
      "Asia/Kathmandu", // Nepal
    ];

    // Check if user is in one of these regions
    if (regionsToOptimize.some((region) => userTimezone.includes(region))) {
      return true;
    }

    // Check for low memory/CPU devices
    if (navigator.deviceMemory && navigator.deviceMemory < 4) {
      return true;
    }

    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
      return true;
    }

    // Check for network speed if Network Information API is available
    // @ts-ignore - Network Information API is not in all TypeScript definitions
    if (
      navigator.connection &&
      // @ts-ignore
      (navigator.connection.effectiveType === "2g" ||
        // @ts-ignore
        navigator.connection.effectiveType === "3g" ||
        // @ts-ignore
        navigator.connection.downlink < 1.5)
    ) {
      return true;
    }

    // Check WebGL support
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) {
        return true; // WebGL not supported
      }
    } catch (e) {
      return true; // Error checking WebGL support
    }

    // Default to not optimizing if all checks pass
    return false;
  } catch (error) {
    console.error("Error checking region optimization:", error);
    return true; // Optimize by default if there's an error
  }
}
