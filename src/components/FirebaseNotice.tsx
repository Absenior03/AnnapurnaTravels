"use client";

import React, { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";

export default function FirebaseNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check if Firebase auth is not available and we're in development
    const isDevEnvironment = process.env.NODE_ENV === "development";
    const isFirebaseUnavailable = auth === null;

    setVisible(isDevEnvironment && isFirebaseUnavailable);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-yellow-100 text-yellow-800 p-4 z-50 shadow-lg">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Firebase Configuration Missing</p>
            <p className="text-sm mt-1">
              Add your Firebase credentials to{" "}
              <code className="bg-yellow-200 px-1 rounded">.env.local</code> to
              enable authentication features.
              <br />
              Check the{" "}
              <code className="bg-yellow-200 px-1 rounded">
                .env.local
              </code>{" "}
              file for required variables.
            </p>
          </div>
          <button
            onClick={() => setVisible(false)}
            className="text-yellow-800 hover:text-yellow-900"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
