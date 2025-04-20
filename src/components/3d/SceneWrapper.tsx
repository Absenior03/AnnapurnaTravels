"use client";

import React, {
  Suspense,
  useCallback,
  useEffect,
  useState,
  useRef,
  ReactNode,
} from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Stats,
  Environment,
  useProgress,
  Preload,
  PerspectiveCamera,
} from "@react-three/drei";
import { ErrorBoundary } from "react-error-boundary";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import { SpinnerCircular } from "../ui/Loader";
import { Vector3 } from "three";
import SceneController from "./SceneController";

// Define modern Three.js constants for color encoding
// These replace the deprecated LinearEncoding and sRGBEncoding
const LINEAR_ENCODING = THREE.LinearSRGBColorSpace || 3000;

// Options for environments that can be used with lower resource usage
const LIGHTWEIGHT_ENVIRONMENTS = [
  "sunset",
  "dawn",
  "night",
  "warehouse",
  "forest",
  "apartment",
  "studio",
  "city",
  "park",
  "lobby",
];

interface SceneWrapperProps {
  children: ReactNode;
  showOrbitControls?: boolean;
  enableZoom?: boolean;
  showEnvironment?: boolean;
  height?: string;
  className?: string;
  shadows?: boolean;
  background?: string | THREE.Color;
  mousePosition?: { x: number; y: number };
  cameraPosition?: [number, number, number];
  fov?: number;
  pixelRatio?: number;
  fallback?: ReactNode;
  lookAt?: [number, number, number];
  controls?: boolean;
  enablePan?: boolean;
  enableRotate?: boolean;
  environment?: string | null;
  onLoaded?: () => void;
  onError?: (error: Error) => void;
}

// Simple loading component
function Loader() {
  const { progress } = useProgress();
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <div className="h-2 w-64 rounded-full bg-gray-200 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 50, damping: 20 }}
          />
        </div>
        <p className="text-sm text-gray-600">{Math.round(progress)}% loaded</p>
      </div>
    </div>
  );
}

// Fallback when 3D rendering fails
function Fallback() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center rounded-lg bg-gray-100 p-6 text-center">
      <h3 className="mb-2 text-lg font-medium text-gray-900">
        3D Experience Unavailable
      </h3>
      <p className="text-sm text-gray-600">
        We're unable to load the 3D experience on this device.
      </p>
    </div>
  );
}

// Scene optimizations controller
function CameraController({
  onLoaded,
  mousePosition,
  lookAt = [0, 0, 0],
}: {
  onLoaded?: () => void;
  mousePosition?: { x: number; y: number };
  lookAt?: [number, number, number];
}) {
  const { gl, camera } = useThree();
  const isLoadedRef = useRef(false);

  // Apply device performance optimizations
  useEffect(() => {
    if (!isLoadedRef.current) {
      // Check for low performance devices
      const isLowPerformance =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        ) || window.innerWidth < 768;

      // Apply optimizations for low performance devices
      if (isLowPerformance) {
        gl.setPixelRatio(Math.min(1.5, window.devicePixelRatio));
        gl.shadowMap.enabled = false;
        gl.shadowMap.type = THREE.BasicShadowMap; // less demanding
        gl.outputEncoding = LINEAR_ENCODING; // less demanding than sRGB
      } else {
        gl.setPixelRatio(Math.min(2, window.devicePixelRatio));
      }

      // Set timeout to ensure we don't have an overly long loading time
      const timeoutId = setTimeout(() => {
        if (!isLoadedRef.current && onLoaded) {
          isLoadedRef.current = true;
          onLoaded();
        }
      }, 4000);

      return () => clearTimeout(timeoutId);
    }
  }, [gl, onLoaded]);

  // Notify when the scene is actually rendered
  useEffect(() => {
    const handleRendered = () => {
      if (!isLoadedRef.current && onLoaded) {
        isLoadedRef.current = true;
        onLoaded();
      }
    };

    // After first successful render
    const timeout = setTimeout(handleRendered, 100);
    return () => clearTimeout(timeout);
  }, [onLoaded]);

  // Apply subtle camera movement based on mouse position
  useFrame(() => {
    if (mousePosition && camera instanceof THREE.PerspectiveCamera) {
      // Subtle camera rotation based on mouse position
      const targetRotationX = THREE.MathUtils.lerp(
        camera.rotation.y,
        lookAt[0] + mousePosition.x * 0.05,
        0.05
      );

      const targetRotationY = THREE.MathUtils.lerp(
        camera.rotation.x,
        lookAt[1] + mousePosition.y * 0.05,
        0.05
      );

      camera.rotation.y = targetRotationX;
      camera.rotation.x = targetRotationY;
    }
  });

  return null;
}

function SceneContent({
  children,
  showOrbitControls = false,
  enableZoom = false,
  showEnvironment = true,
  shadows = true,
  background = "transparent",
  mousePosition,
  cameraPosition = [0, 0, 5],
  fov = 75,
  pixelRatio = window.devicePixelRatio > 1 ? 1.5 : 1,
}) {
  return (
    <Canvas
      shadows={shadows}
      camera={{ position: cameraPosition, fov: fov }}
      style={{ background }}
      dpr={pixelRatio}
      performance={{ min: 0.2 }}
      frameloop="demand"
      gl={{
        powerPreference: "high-performance",
        antialias: true,
        alpha: true,
        stencil: false,
        depth: true,
      }}
    >
      {showOrbitControls && <OrbitControls enableZoom={enableZoom} />}
      {showEnvironment && <Environment preset="city" />}
      <Suspense fallback={null}>
        {children}
        <Preload all />
      </Suspense>
    </Canvas>
  );
}

// Fallback component when Canvas fails to load
function CanvasErrorFallback({
  fallback,
  error,
}: {
  fallback?: React.ReactNode;
  error: Error;
}) {
  useEffect(() => {
    console.error("3D rendering error:", error);
  }, [error]);

  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-900">
      {fallback || (
        <div className="text-white text-center p-6">
          <h3 className="text-xl mb-2">Unable to load 3D experience</h3>
          <p className="text-sm opacity-70">Please try again later</p>
        </div>
      )}
    </div>
  );
}

// Loading component shown during scene initialization
function SceneLoading() {
  return (
    <mesh>
      <sphereGeometry args={[0.2, 16, 16]} />
      <meshStandardMaterial color="#ffffff" />
    </mesh>
  );
}

export default function SceneWrapper({
  children,
  showOrbitControls = false,
  enableZoom = false,
  showEnvironment = true,
  height = "600px",
  className = "",
  shadows = true,
  background = "transparent",
  mousePosition,
  cameraPosition = [0, 0, 5],
  fov = 75,
  pixelRatio,
  fallback,
  lookAt = [0, 0, 0],
  controls = false,
  enablePan = false,
  enableRotate = true,
  environment = null,
  onLoaded,
  onError,
}: SceneWrapperProps) {
  const [hasError, setHasError] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [performanceSettings, setPerformanceSettings] = useState(null);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const initTimeRef = useRef<number>(Date.now());
  const loadTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsClient(true);

    // Set a timeout to report an error if the scene doesn't load
    loadTimeoutRef.current = setTimeout(() => {
      if (!isLoaded) {
        const timeoutError = new Error("Scene load timeout");
        console.error(
          "Scene failed to load within timeout period:",
          timeoutError
        );
        onError?.(timeoutError);
      }
    }, 10000); // 10 second timeout

    return () => {
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
    };
  }, [isLoaded, onError]);

  // Update camera lookAt target
  useEffect(() => {
    if (isClient && cameraRef.current) {
      cameraRef.current.lookAt(new Vector3(...lookAt));
    }
  }, [isClient, lookAt]);

  // Handle scene loaded event
  const handleCreated = () => {
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
    }

    const loadTime = Date.now() - initTimeRef.current;
    console.log(`Scene loaded in ${loadTime}ms`);
    setIsLoaded(true);

    // Delay onLoaded callback to ensure scene is fully rendered
    setTimeout(() => {
      onLoaded?.();
    }, 100);
  };

  const handlePerformanceSettingsChange = (settings: any) => {
    setPerformanceSettings(settings);
    console.log("Applied performance settings:", settings);
  };

  if (!isClient) {
    return <div className={`${className} bg-gray-900`}>{fallback}</div>;
  }

  // Use a more lightweight environment if available
  const safeEnvironment = LIGHTWEIGHT_ENVIRONMENTS.includes(
    environment as string
  )
    ? (environment as string)
    : "sunset";

  return (
    <ErrorBoundary
      fallbackRender={({ error }) => (
        <CanvasErrorFallback fallback={fallback} error={error} />
      )}
      onError={onError}
    >
      <div className={`${className} relative`}>
        <Canvas
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
            failIfMajorPerformanceCaveat: false,
          }}
          shadows={shadows}
          dpr={[1, Math.min(window.devicePixelRatio, 2)]} // Limit DPR for performance
          legacy={false} // Use modern WebGL features when available
          onCreated={handleCreated}
          style={{ background }}
        >
          <Suspense fallback={<SceneLoading />}>
            <PerspectiveCamera
              ref={cameraRef}
              makeDefault
              position={cameraPosition}
              fov={fov}
              near={0.1}
              far={1000}
            />

            {controls && (
              <OrbitControls
                makeDefault
                enablePan={enablePan}
                enableZoom={enableZoom}
              />
            )}

            {/* Add performance optimization controller */}
            <SceneController
              onPerformanceSettingsChange={handlePerformanceSettingsChange}
              onLoadComplete={() => {
                console.log("Scene controller initialization complete");
                if (!isLoaded) setIsLoaded(true);
              }}
            />

            {/* Add camera controller for mouse interaction */}
            <CameraController
              onLoaded={onLoaded}
              mousePosition={mousePosition}
              lookAt={lookAt}
            />

            {children}

            {environment && (
              <Environment
                preset={safeEnvironment as any}
                // Reduce environment quality based on performance settings
                resolution={performanceSettings?.pixelRatio < 1.5 ? 256 : 512}
              />
            )}
          </Suspense>
        </Canvas>
      </div>
    </ErrorBoundary>
  );
}
