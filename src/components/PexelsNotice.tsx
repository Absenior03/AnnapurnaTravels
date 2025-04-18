"use client";

import React, { useState, useEffect } from "react";

export default function PexelsNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check if Pexels API key is missing
    const isPexelsKeyMissing = !process.env.NEXT_PUBLIC_PEXELS_API_KEY;
    setVisible(isPexelsKeyMissing);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-16 left-0 right-0 bg-blue-100 text-blue-800 p-4 z-50 shadow-lg">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Pexels API Integration Issue</p>
            <p className="text-sm mt-1">
              There was a problem initializing the Pexels API client. Images
              from Pexels may not load properly.
              <br />
              Check your API key in{" "}
              <code className="bg-blue-200 px-1 rounded">.env.local</code> file.
            </p>
          </div>
          <button
            onClick={() => setVisible(false)}
            className="text-blue-800 hover:text-blue-900"
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
