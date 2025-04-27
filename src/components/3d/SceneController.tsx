"use client";

import React, { useEffect, useState, useRef } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";

// Remove preloads that could cause errors if files don't exist
// useGLTF.preload("/models/mountain.glb");
// useGLTF.preload("/models/compass.glb");

// Define modern Three.js constants for color encoding
// These replace the deprecated LinearEncoding and sRGBEncoding
const LINEAR_ENCODING = THREE.LinearSRGBColorSpace || 3000;
const SRGB_ENCODING = THREE.SRGBColorSpace || 3001;

interface PerformanceSettings {
  pixelRatio: number;
  shadowMapEnabled: boolean;
  shadowMapType: THREE.ShadowMapType;
  maxAnisotropy: number;
  outputColorSpace?: THREE.ColorSpace; // Modern replacement for outputEncoding
  antialias: boolean;
  maxLights: number;
}

interface SceneControllerProps {
  onPerformanceSettingsChange?: (settings: any) => void;
  onLoadComplete?: () => void;
  forceQuality?: "low" | "medium" | "high";
}

// Performance profiles for different capability levels
const PERFORMANCE_PROFILES = {
  low: {
    pixelRatio: 1.0,
    shadowMapEnabled: false,
    shadowMapType: THREE.BasicShadowMap,
    maxAnisotropy: 1,
    outputColorSpace: LINEAR_ENCODING,
    antialias: false,
    maxLights: 2,
  },
  medium: {
    pixelRatio: 1.5,
    shadowMapEnabled: true,
    shadowMapType: THREE.PCFShadowMap,
    maxAnisotropy: 4,
    outputColorSpace: SRGB_ENCODING,
    antialias: true,
    maxLights: 4,
  },
  high: {
    pixelRatio: 2.0,
    shadowMapEnabled: true,
    shadowMapType: THREE.PCFSoftShadowMap,
    maxAnisotropy: 16,
    outputColorSpace: SRGB_ENCODING,
    antialias: true,
    maxLights: 8,
  },
};

export default function SceneController({
  onPerformanceSettingsChange,
  onLoadComplete,
  forceQuality,
}: SceneControllerProps) {
  const { gl } = useThree();
  const [performanceProfile, setPerformanceProfile] = useState<
    "low" | "medium" | "high"
  >("medium");
  const initialized = useRef(false);

  // Detect device capabilities to determine performance profile
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    try {
      // Function to detect device performance capabilities
      const detectPerformanceCapabilities = (): "low" | "medium" | "high" => {
        // If quality is forced through props, use that
        if (forceQuality) return forceQuality;

        // Safe check for browser environment
        if (typeof navigator === 'undefined') return "low";

        // Check if the browser is in a region with known connectivity limitations
        try {
          const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
          const limitedRegions = [
            "Asia/Kolkata", // India
            "Asia/Dhaka", // Bangladesh
            "Asia/Karachi", // Pakistan
            "Asia/Kathmandu", // Nepal
            "Asia/Colombo", // Sri Lanka
          ];

          if (limitedRegions.some((region) => userTimezone?.includes(region))) {
            console.log("Detected region with potential connectivity limitations");
            return "low";
          }
        } catch (e) {
          console.log("Timezone detection failed");
        }

        // Check for mobile devices
        const isMobile =
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
          );

        // Check hardware capabilities - safely
        const hasWeakHardware = navigator.hardwareConcurrency 
          ? navigator.hardwareConcurrency <= 4
          : true; // Assume weak hardware if we can't detect

        return isMobile || hasWeakHardware ? "low" : "medium";
      };

      // Set performance profile based on device capabilities
      const detectedProfile = detectPerformanceCapabilities();
      setPerformanceProfile(detectedProfile);
      console.log(`Scene controller using ${detectedProfile} performance profile`);

      // Apply performance settings to the renderer
      const settings = PERFORMANCE_PROFILES[detectedProfile];
      
      // Apply settings safely
      try {
        if (gl) {
          gl.setPixelRatio(Math.min(window.devicePixelRatio, settings.pixelRatio));
          if (gl.shadowMap) {
            gl.shadowMap.enabled = settings.shadowMapEnabled;
            gl.shadowMap.type = settings.shadowMapType;
          }
          
          // Use outputColorSpace (modern) instead of outputEncoding (deprecated)
          if ('outputColorSpace' in gl) {
            gl.outputColorSpace = settings.outputColorSpace;
          }
        }

        // Notify parent component of selected performance settings
        if (onPerformanceSettingsChange) {
          onPerformanceSettingsChange(settings);
        }

        // Notify that initial loading and setup is complete
        if (onLoadComplete) {
          // Wait a short time to ensure everything is initialized
          setTimeout(onLoadComplete, 100);
        }
      } catch (err) {
        console.error("Error applying performance settings:", err);
        
        // Still call onLoadComplete even if there's an error
        if (onLoadComplete) {
          setTimeout(onLoadComplete, 100);
        }
      }
    } catch (err) {
      console.error("Scene controller initialization failed:", err);
      
      // Call completion handlers even on error
      if (onLoadComplete) {
        setTimeout(onLoadComplete, 100);
      }
    }
  }, [gl, forceQuality, onPerformanceSettingsChange, onLoadComplete]);

  // Simplified component - removed FPS monitoring to reduce potential errors
  return null;
}

// Export performance profiles for use in other components
export { PERFORMANCE_PROFILES };
