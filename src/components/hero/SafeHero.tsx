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

// Custom loading component with progress indicator
const Loading = () => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    // Simulate loading progress
    const timer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 5;
        return newProgress > 100 ? 100 : newProgress;
      });
    }, 150);
    
    return () => clearInterval(timer);
  }, []);
  
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
      // Check for WebGL support
      try {
        const canvas = document.createElement('canvas');
        const hasWebGL = !!(window.WebGLRenderingContext && 
          (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
        
        if (!hasWebGL) {
          setShouldShow3D(false);
          return;
        }
      } catch (e) {
        setShouldShow3D(false);
        return;
      }
      
      // Check device memory if available
      if ('deviceMemory' in navigator) {
        const lowMemory = (navigator as any).deviceMemory < 4;
        if (lowMemory) {
          setShouldShow3D(false);
          return;
        }
      }
      
      // Check for mobile/touch device (likely lower performance)
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
      
      // On mobile, check for hardware concurrency if available
      if (isMobileDevice && 'hardwareConcurrency' in navigator) {
        const lowCores = navigator.hardwareConcurrency < 4;
        if (lowCores) {
          setShouldShow3D(false);
          return;
        }
      }
      
      // Check for reduced motion preference
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        setShouldShow3D(false);
        return;
      }
      
      // Consider battery status on mobile if available
      if ('getBattery' in navigator) {
        (navigator as any).getBattery().then(battery => {
          if (battery.level < 0.2 && !battery.charging) {
            setShouldShow3D(false);
          }
        }).catch(() => {
          // Ignore errors with battery API
        });
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
  loading: () => <Loading />
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
