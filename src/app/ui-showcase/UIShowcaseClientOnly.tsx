"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Dynamically import the showcase page with SSR disabled
const UIShowcaseContent = dynamic(() => import("./UIShowcaseContent"), {
  ssr: false,
  loading: () => <LoadingScreen />,
});

// Loading screen component
function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-t-emerald-500 border-emerald-200 rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading UI Components</h2>
        <p className="text-gray-600 max-w-md mx-auto">
          We're preparing our beautiful components with fluid animations for you...
        </p>
      </div>
    </div>
  );
}

export default function UIShowcaseClientOnly() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <LoadingScreen />;
  }

  return <UIShowcaseContent />;
} 