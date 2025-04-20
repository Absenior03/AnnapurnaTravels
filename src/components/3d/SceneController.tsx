"use client";

import React, { useEffect, useState, useRef } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";

// Preload common 3D models to avoid loading stutter
useGLTF.preload("/models/mountain.glb");
useGLTF.preload("/models/compass.glb");

// Define modern Three.js constants for color encoding
// These replace the deprecated LinearEncoding and sRGBEncoding
const LINEAR_ENCODING = THREE.LinearSRGBColorSpace || 3000;
const SRGB_ENCODING = THREE.SRGBColorSpace || 3001;

interface PerformanceSettings {
  pixelRatio: number;
  shadowMapEnabled: boolean;
  shadowMapType: THREE.ShadowMapType;
  maxAnisotropy: number;
  outputEncoding: number; // Changed from THREE.TextureEncoding to number
  antialias: boolean;
  maxLights: number;
}

interface SceneControllerProps {
  onPerformanceSettingsChange?: (settings: PerformanceSettings) => void;
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
    outputEncoding: LINEAR_ENCODING,
    antialias: false,
    maxLights: 2,
  },
  medium: {
    pixelRatio: 1.5,
    shadowMapEnabled: true,
    shadowMapType: THREE.PCFShadowMap,
    maxAnisotropy: 4,
    outputEncoding: SRGB_ENCODING,
    antialias: true,
    maxLights: 4,
  },
  high: {
    pixelRatio: 2.0,
    shadowMapEnabled: true,
    shadowMapType: THREE.PCFSoftShadowMap,
    maxAnisotropy: 16,
    outputEncoding: SRGB_ENCODING,
    antialias: true,
    maxLights: 8,
  },
};

export default function SceneController({
  onPerformanceSettingsChange,
  onLoadComplete,
  forceQuality,
}: SceneControllerProps) {
  const { gl, scene, camera } = useThree();
  const [performanceProfile, setPerformanceProfile] = useState<
    "low" | "medium" | "high"
  >("medium");
  const frameCount = useRef(0);
  const fpsMonitor = useRef({
    lastTime: performance.now(),
    frames: 0,
    fps: 60,
  });
  const initialized = useRef(false);

  // Detect device capabilities to determine performance profile
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Function to detect device performance capabilities
    const detectPerformanceCapabilities = (): "low" | "medium" | "high" => {
      // If quality is forced through props, use that
      if (forceQuality) return forceQuality;

      // Check if the browser is in a region with known connectivity/hardware limitations
      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const limitedRegions = [
        "Asia/Kolkata", // India
        "Asia/Dhaka", // Bangladesh
        "Asia/Karachi", // Pakistan
        "Asia/Kathmandu", // Nepal
        "Asia/Colombo", // Sri Lanka
      ];

      if (limitedRegions.some((region) => userTimezone.includes(region))) {
        console.log("Detected region with potential connectivity limitations");
        return "low";
      }

      // Check for mobile devices
      const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );

      // Check hardware capabilities
      const hasWeakHardware =
        (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
        (navigator.deviceMemory && navigator.deviceMemory <= 4);

      // Network connection quality check
      let hasSlowConnection = false;
      try {
        //@ts-ignore - Connection API not in all TS definitions
        if (navigator.connection) {
          //@ts-ignore
          hasSlowConnection =
            navigator.connection.downlink < 5 ||
            //@ts-ignore
            ["slow-2g", "2g", "3g"].includes(
              navigator.connection.effectiveType
            );
        }
      } catch (e) {
        console.log("NetworkInformation API not available");
      }

      // WebGL capabilities
      const glCapabilities = gl.capabilities;
      const maxTextures = glCapabilities.maxTextures || 8;
      const maxAttributes = glCapabilities.maxAttributes || 16;

      // Determine performance profile based on collected data
      if (
        (isMobile && hasWeakHardware) ||
        hasSlowConnection ||
        maxTextures < 8 ||
        maxAttributes < 16
      ) {
        return "low";
      } else if (
        (isMobile && !hasWeakHardware) ||
        (!isMobile && hasWeakHardware) ||
        maxTextures < 16 ||
        maxAttributes < 32
      ) {
        return "medium";
      } else {
        return "high";
      }
    };

    // Set performance profile based on device capabilities
    const detectedProfile = detectPerformanceCapabilities();
    setPerformanceProfile(detectedProfile);
    console.log(
      `Scene controller using ${detectedProfile} performance profile`
    );

    // Apply performance settings to the renderer
    const settings = PERFORMANCE_PROFILES[detectedProfile];
    gl.setPixelRatio(Math.min(window.devicePixelRatio, settings.pixelRatio));
    gl.shadowMap.enabled = settings.shadowMapEnabled;
    gl.shadowMap.type = settings.shadowMapType;
    gl.outputEncoding = settings.outputEncoding;

    // Set maximum anisotropy for better texture quality at angles
    const texture = new THREE.Texture();
    const maxAnisotropy = Math.min(
      gl.capabilities.getMaxAnisotropy(),
      settings.maxAnisotropy
    );
    texture.anisotropy = maxAnisotropy;

    // Notify parent component of selected performance settings
    if (onPerformanceSettingsChange) {
      onPerformanceSettingsChange(settings);
    }

    // Notify that initial loading and setup is complete
    if (onLoadComplete) {
      // Wait a short time to ensure everything is initialized
      setTimeout(onLoadComplete, 100);
    }
  }, [gl, forceQuality, onPerformanceSettingsChange, onLoadComplete]);

  // Monitor FPS and adjust quality if needed
  useEffect(() => {
    // Only apply adaptive quality if not forced
    if (forceQuality) return;

    const adaptiveQualityControl = () => {
      frameCount.current++;

      const now = performance.now();
      const elapsed = now - fpsMonitor.current.lastTime;

      // Update FPS calculation every second
      if (elapsed >= 1000) {
        fpsMonitor.current.fps = (frameCount.current * 1000) / elapsed;
        fpsMonitor.current.lastTime = now;
        frameCount.current = 0;

        // If FPS is consistently low, reduce quality
        if (fpsMonitor.current.fps < 30 && performanceProfile !== "low") {
          console.log(
            `FPS too low (${fpsMonitor.current.fps.toFixed(
              1
            )}), reducing quality`
          );
          const newProfile = performanceProfile === "high" ? "medium" : "low";
          setPerformanceProfile(newProfile);

          // Apply new settings
          const settings = PERFORMANCE_PROFILES[newProfile];
          gl.setPixelRatio(
            Math.min(window.devicePixelRatio, settings.pixelRatio)
          );
          gl.shadowMap.enabled = settings.shadowMapEnabled;
          gl.shadowMap.type = settings.shadowMapType;

          if (onPerformanceSettingsChange) {
            onPerformanceSettingsChange(settings);
          }
        }
      }
    };

    const id = setInterval(adaptiveQualityControl, 100);
    return () => clearInterval(id);
  }, [gl, performanceProfile, forceQuality, onPerformanceSettingsChange]);

  return null;
}

// Export performance profiles for use in other components
export { PERFORMANCE_PROFILES };
