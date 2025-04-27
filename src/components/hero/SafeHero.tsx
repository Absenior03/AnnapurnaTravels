"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import ErrorBoundary from "../ErrorBoundary";
import { FiChevronRight } from "react-icons/fi";
import Link from "next/link";

// Simplified fallback hero component
const FallbackHero = () => (
  <div className="w-full h-[95vh] relative bg-gradient-to-b from-emerald-800 to-emerald-600 flex items-center justify-center">
    <div className="text-center px-6">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
        Discover South Asia
      </h1>
      <p className="text-xl text-white mb-10 max-w-3xl mx-auto">
        Experience the breathtaking beauty of South Asia with our immersive
        tours.
      </p>
      <div className="flex flex-col sm:flex-row gap-6 justify-center">
        <Link
          href="#tours"
          className="bg-white text-emerald-700 hover:bg-gray-100 px-8 py-3.5 rounded-md font-semibold text-base transition-all shadow-lg hover:shadow-xl inline-flex items-center"
        >
          Explore Tours
          <FiChevronRight className="ml-2" />
        </Link>
        <Link
          href="/about"
          className="bg-transparent border-2 border-white text-white hover:bg-white/20 transition-colors px-8 py-3 rounded-md font-semibold text-base inline-flex items-center"
        >
          Learn More
        </Link>
      </div>
    </div>
  </div>
);

// Custom loading component with progress indicator and timeout
const Loading = () => {
  const [progress, setProgress] = useState(0);
  const [timeoutReached, setTimeoutReached] = useState(false);
  
  useEffect(() => {
    // Simulate loading progress
    const timer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 5;
        return newProgress > 100 ? 100 : newProgress;
      });
    }, 150);
    
    // Set a timeout to show fallback if loading takes too long (15 seconds)
    const timeoutTimer = setTimeout(() => {
      setTimeoutReached(true);
    }, 15000);
    
    return () => {
      clearInterval(timer);
      clearTimeout(timeoutTimer);
    };
  }, []);
  
  if (timeoutReached) {
    return <FallbackHero />;
  }
  
  return (
    <div className="w-full h-[95vh] flex flex-col items-center justify-center bg-gradient-to-b from-emerald-800 to-emerald-600">
      <div className="text-white text-2xl mb-8">Loading 3D Experience...</div>
      <div className="w-64 h-2 bg-white/20 rounded-full overflow-hidden">
        <div 
          className="h-full bg-white transition-all duration-200 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="text-white/70 text-sm mt-2">{Math.floor(progress)}%</div>
      <p className="text-white/70 text-xs mt-6 max-w-md text-center">
        First load may take a moment. If 3D doesn't appear, your device might not support WebGL or 3D rendering.
      </p>
    </div>
  );
};

// Component to detect system capabilities and decide whether to show 3D
const SystemDetector = ({ children }) => {
  const [shouldShow3D, setShouldShow3D] = useState(true);
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    
    // Check for system memory and performance capabilities
    const checkCapabilities = () => {
      // Check for WebGL support - this is the only critical requirement
      try {
        const canvas = document.createElement('canvas');
        const hasWebGL = !!(window.WebGLRenderingContext && 
          (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
        
        if (!hasWebGL) {
          console.log("WebGL not supported, falling back to static hero");
          setShouldShow3D(false);
          return;
        }
      } catch (e) {
        console.log("Error checking WebGL support:", e);
        setShouldShow3D(false);
        return;
      }
      
      // Skip other checks to allow more devices to experience 3D visuals
      // Only disable for users who explicitly prefer reduced motion
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        console.log("User prefers reduced motion, using static hero");
        setShouldShow3D(false);
        return;
      }
    };
    
    // Apply checks with a slight delay to not block initial rendering
    const timer = setTimeout(checkCapabilities, 100);
    return () => clearTimeout(timer);
  }, []);
  
  // Show fallback while detecting on client
  if (!isClient) {
    return <FallbackHero />;
  }
  
  return shouldShow3D ? children : <FallbackHero />;
};

// Dynamically import the 3D Hero with no SSR to save memory
const DynamicHero3D = dynamic(() => import("./Hero3D"), {
  ssr: false,
  loading: () => <Loading />,
  // Force the Hero3D component to be properly loaded and initialize
  suspense: false
});

// Memory-efficient wrapper for the 3D hero that gracefully falls back if needed
export default function SafeHero() {
  // Use System Detector to determine if 3D should be shown
  return (
    <ErrorBoundary fallback={<FallbackHero />}>
      <SystemDetector>
        <DynamicHero3D />
      </SystemDetector>
    </ErrorBoundary>
  );
}
