"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ErrorBoundary } from "react-error-boundary";
import { isFirebaseInitialized } from "@/lib/firebase";

// Fallback component when auth fails
const AuthErrorFallback = () => (
  <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4">
    <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg text-center">
      <h2 className="text-2xl font-bold text-red-600 mb-4">
        Authentication Service Unavailable
      </h2>
      <p className="text-gray-600 mb-6">
        We're having trouble connecting to our authentication service. This
        could be due to:
      </p>
      <ul className="text-left text-gray-600 mb-6 list-disc pl-6">
        <li>Network connectivity issues</li>
        <li>Temporary service disruption</li>
        <li>Configuration issues</li>
      </ul>
      <p className="text-gray-600 mb-6">
        Please try again later or contact support if the problem persists.
      </p>
      <a
        href="/"
        className="inline-block bg-emerald-600 text-white px-6 py-2 rounded-md hover:bg-emerald-700 transition-colors"
      >
        Return to Homepage
      </a>
    </div>
  </div>
);

// Dynamically import LoginForm with SSR disabled
const LoginForm = dynamic(() => import("@/components/auth/LoginForm"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  ),
});

export default function LoginPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Only render on client-side
  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <ErrorBoundary FallbackComponent={AuthErrorFallback}>
      <LoginForm />
    </ErrorBoundary>
  );
}
