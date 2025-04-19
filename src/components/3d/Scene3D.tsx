"use client";

import React, { Suspense, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { ScrollProvider } from "@/context/ScrollContext";

// Dynamically import the 3D content to avoid SSR issues with Three.js
const Scene3DContent = dynamic(() => import("./Scene3DContent"), {
  ssr: false,
  loading: () => <SceneLoader />,
});

interface Scene3DProps {
  mountainCount?: number;
  cloudCount?: number;
  className?: string;
}

export default function Scene3D({
  mountainCount = 5,
  cloudCount = 8,
  className = "",
}: Scene3DProps) {
  const [isMounted, setIsMounted] = useState(false);

  // Only render on client-side to avoid hydration errors
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <SceneLoader />;
  }

  return (
    <div className={`relative w-full h-screen ${className}`}>
      <ScrollProvider>
        <Suspense fallback={<SceneLoader />}>
          <Scene3DContent
            mountainCount={mountainCount}
            cloudCount={cloudCount}
          />
        </Suspense>
      </ScrollProvider>
    </div>
  );
}

// Simple loading component for when the 3D scene is loading
function SceneLoader() {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-black/90">
      <div className="text-center">
        <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="mt-4 text-gray-200 font-medium">
          Loading 3D Experience...
        </p>
      </div>
    </div>
  );
}
