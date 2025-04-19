"use client";

import React from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-4">Something went wrong</h1>
      <p className="text-xl mb-8">We apologize for the inconvenience.</p>
      <div className="flex space-x-4">
        <button
          onClick={reset}
          className="px-6 py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
        >
          Try again
        </button>
        <Link
          href="/"
          className="px-6 py-3 bg-white text-emerald-600 border border-emerald-600 rounded-md hover:bg-emerald-50 transition-colors"
        >
          Return home
        </Link>
      </div>
    </div>
  );
}
