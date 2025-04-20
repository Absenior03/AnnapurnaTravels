"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import SceneWrapper from "./SceneWrapper";
import Mountain from "./Mountain";
import { Spinner } from "../ui/Spinner";
import { FiInfo } from "react-icons/fi";
import SectionHeading from "../ui/SectionHeading";

// Define mountain colors for a consistent palette
const MOUNTAIN_COLORS = {
  primary: "#3b82f6", // Blue
  secondary: "#4f46e5", // Indigo
  accent: "#8b5cf6", // Purple
  dark: "#1f2937", // Dark gray
};

export default function MountainShowcase() {
  const [isClient, setIsClient] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [showFallback, setShowFallback] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [devicePerformance, setDevicePerformance] = useState<
    "low" | "medium" | "high"
  >("medium");
  const [loadProgress, setLoadProgress] = useState(0);
  const loadTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);
  const [hasWarnedUser, setHasWarnedUser] = useState(false);

  // Initialize client state and set up error handling
  useEffect(() => {
    // Only execute this in the browser
    if (typeof window === 'undefined') return;
    
    setIsClient(true);

    // Simulate load progress
    const loadInterval = setInterval(() => {
      if (mountedRef.current) {
        setLoadProgress((prev) => {
          const newProgress = Math.min(prev + Math.random() * 15, 90);
          return newProgress;
        });
      }
    }, 300);

    // Set a shorter timeout to show fallback if 3D scene takes too long to load
    loadTimeoutRef.current = setTimeout(() => {
      if (mountedRef.current) {
        console.warn("3D scene load timeout exceeded, showing fallback");
        clearInterval(loadInterval);
        setShowFallback(true);
        
        // Show a one-time warning to the user if this is their first timeout
        if (!hasWarnedUser) {
          setHasWarnedUser(true);
          setLoadError("The 3D scene is taking too long to load. Using a simplified view instead.");
        }
      }
    }, 5000); // Shortened timeout from 6000ms to 5000ms

    // Check for WebGL compatibility
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

      if (!gl) {
        setLoadError("WebGL not supported by your browser");
        setShowFallback(true);
        clearInterval(loadInterval);

        if (loadTimeoutRef.current) {
          clearTimeout(loadTimeoutRef.current);
        }
        return;
      }
      
      // Check if we can create a test texture to verify WebGL is working properly
      // Using proper type casting for WebGL context
      try {
        // Type cast to WebGLRenderingContext to access WebGL methods
        const webgl = gl as WebGLRenderingContext;
        const texture = webgl.createTexture();
        if (texture) {
          webgl.bindTexture(webgl.TEXTURE_2D, texture);
          // Create a simple 1x1 blue texture
          const pixel = new Uint8Array([0, 0, 255, 255]);
          webgl.texImage2D(
            webgl.TEXTURE_2D, 
            0, 
            webgl.RGBA, 
            1, 1, 0, 
            webgl.RGBA, 
            webgl.UNSIGNED_BYTE, 
            pixel
          );
          // Clean up
          webgl.deleteTexture(texture);
        }
      } catch (textureError) {
        console.error("WebGL texture creation failed:", textureError);
        setLoadError("Your browser supports WebGL but encountered an error. Using fallback view.");
        setShowFallback(true);
        clearInterval(loadInterval);
        if (loadTimeoutRef.current) {
          clearTimeout(loadTimeoutRef.current);
        }
        return;
      }

      // Detect device capabilities for optimal mountain detail
      const detectDevicePerformance = () => {
        // Check if user is in specific regions
        try {
          const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
          const southAsianRegions = [
            "Asia/Kolkata", // India
            "Asia/Colombo", // Sri Lanka
            "Asia/Dhaka", // Bangladesh
            "Asia/Kathmandu", // Nepal
            "Asia/Karachi", // Pakistan
          ];

          if (southAsianRegions.some((r) => userTimezone.includes(r))) {
            return "low";
          }
        } catch (e) {
          console.warn("Unable to detect region");
        }

        // Check for mobile devices
        const isMobile =
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
          );

        // Check hardware capabilities - safely check for optional browser APIs
        const hasWeakHardware =
          (navigator.hardwareConcurrency &&
            navigator.hardwareConcurrency <= 4) ||
          // Use optional chaining for deviceMemory which might not be available in all browsers
          (navigator as any)?.deviceMemory <= 4;

        if (isMobile || hasWeakHardware) {
          return "medium";
        }

        return "high";
      };

      setDevicePerformance(detectDevicePerformance());
    } catch (err) {
      console.error("Error initializing 3D experience:", err);
      setLoadError("Error initializing 3D experience");
      setShowFallback(true);

      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
    }

    return () => {
      mountedRef.current = false;
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
      clearInterval(loadInterval);
    };
  }, [hasWarnedUser]);

  // Handle mouse movement for parallax effect
  useEffect(() => {
    if (!isClient) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse position to -0.5 to 0.5 range
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isClient]);

  // Handle successful 3D scene load
  const handleSceneLoaded = () => {
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
    }

    setLoadProgress(100);

    // Short delay to smooth transition
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };
  
  // Handle scene errors more gracefully
  const handleSceneError = (error: Error) => {
    console.error("Mountain scene error:", error);
    setLoadError(`Error loading 3D scene: ${error.message}`);
    setShowFallback(true);
    
    // If we're still in loading state, clear it
    if (isLoading) {
      setIsLoading(false);
    }
  };

  // Performance optimization - adjust detail level based on device capability
  const getMountainDetail = (baseDetail: number) => {
    switch (devicePerformance) {
      case "low":
        return Math.max(baseDetail * 0.5, 8);
      case "medium":
        return Math.max(baseDetail * 0.75, 12);
      case "high":
        return baseDetail;
      default:
        return baseDetail;
    }
  };

  // Fallback image display when 3D is not supported or loading is slow
  const FallbackDisplay = () => (
    <div className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden rounded-xl">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950/70 to-indigo-900/80 z-10" />
      <Image
        src="/images/mountain-backdrop.jpg"
        alt="South Asian Mountain Range"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-20 p-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeading
            title="Discover South Asia's Majestic Mountains"
            subtitle="Experience the beauty of the Himalayas"
            align="center"
            titleSize="xl"
          />
          {loadError && (
            <div className="mt-4 flex items-center justify-center text-amber-300 bg-amber-900/40 py-2 px-4 rounded-md">
              <FiInfo className="mr-2" />
              <p>{loadError}</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );

  if (!isClient) {
    return (
      <div className="w-full h-[50vh] bg-gray-900 animate-pulse rounded-xl" />
    );
  }

  return (
    <div className="relative w-full overflow-hidden rounded-xl">
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            key="spinner"
            className="absolute inset-0 flex items-center justify-center bg-gray-900 z-20"
            exit={{ opacity: 0 }}
          >
            <div className="flex flex-col items-center">
              <Spinner size="lg" />
              <div className="mt-4 w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-blue-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${loadProgress}%` }}
                  transition={{ type: "spring", bounce: 0 }}
                />
              </div>
              <p className="text-white/70 text-sm mt-2">
                Loading mountains ({loadProgress.toFixed(0)}%)
              </p>
              {loadProgress > 70 && (
                <p className="text-amber-300 text-xs mt-2 max-w-xs text-center">
                  This may take longer on some devices. Please be patient...
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showFallback ? (
        <FallbackDisplay />
      ) : (
        <div className="w-full h-[50vh] md:h-[60vh] lg:h-[70vh]">
          <SceneWrapper
            onLoaded={handleSceneLoaded}
            onError={handleSceneError}
            cameraPosition={[0, 2, 7]}
            fallback={<FallbackDisplay />}
          >
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} castShadow />

            <Mountain
              position={[-1.5, -1, 0]}
              color={MOUNTAIN_COLORS.primary}
              size={3}
              detail={0.75} // Reduced detail for better performance
              materialType="standard" // Always use standard material for better compatibility
            />

            <Mountain
              position={[1.5, -1.2, -2]}
              color={MOUNTAIN_COLORS.secondary}
              size={2.5}
              detail={0.6} // Reduced detail for better performance
              materialType="standard"
            />

            <Mountain
              position={[0, -1.5, -4]}
              color={MOUNTAIN_COLORS.dark}
              size={4}
              detail={0.5} // Reduced detail for better performance
              materialType="standard"
            />
          </SceneWrapper>

          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent z-10" />
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? 20 : 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center px-4"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                Discover South Asia's Majestic Mountains
              </h2>
              <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto drop-shadow-md">
                Experience breathtaking vistas, ancient cultures, and
                unforgettable adventures
              </p>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
}
