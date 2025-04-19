import { useState, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import * as THREE from "three";

// Type for the GLTF result
type GLTFResult = GLTF & {
  nodes: Record<string, THREE.Mesh>;
  materials: Record<string, THREE.Material>;
};

/**
 * Custom hook to preload GLTF models and handle loading state
 * @param path Path to the GLTF model
 * @param draco Optional parameter to enable Draco compression
 * @returns An object containing the loaded GLTF model, loading state, and any error
 */
export function usePreloadedGLTF(path: string, draco: boolean = false) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Preload the model
  useEffect(() => {
    // Register model for preloading
    useGLTF.preload(path, draco);
  }, [path, draco]);

  // Load the model
  const gltf = useGLTF(path, draco) as GLTFResult;

  // Update loading state when model is loaded
  useEffect(() => {
    if (gltf) {
      setLoading(false);
    }
  }, [gltf]);

  // Handle errors
  useEffect(() => {
    const handleError = (e: ErrorEvent) => {
      if (e.message.includes(path)) {
        setError(new Error(`Failed to load model: ${path}`));
        setLoading(false);
      }
    };

    window.addEventListener("error", handleError);

    return () => {
      window.removeEventListener("error", handleError);
    };
  }, [path]);

  return { gltf, loading, error };
}

/**
 * Custom hook to handle camera animations based on scroll position
 * @param basePosition Initial camera position
 * @param scrollProgress Scroll progress value from 0 to 1
 * @returns Calculated camera position
 */
export function useCameraPosition(
  basePosition: [number, number, number],
  scrollProgress: number
): [number, number, number] {
  // Example: Move camera along a path based on scroll
  const x = basePosition[0] + Math.sin(scrollProgress * Math.PI * 2) * 5;
  const y = basePosition[1] + scrollProgress * 3;
  const z = basePosition[2] - scrollProgress * 10;

  return [x, y, z];
}

/**
 * Calculate model visibility based on scroll range
 * @param scrollProgress Current scroll progress (0-1)
 * @param visibleRange Range where model should be visible [start, end]
 * @returns Opacity value (0-1)
 */
export function calculateVisibility(
  scrollProgress: number,
  visibleRange: [number, number]
): number {
  const [start, end] = visibleRange;

  if (scrollProgress < start) {
    return 0;
  }

  if (scrollProgress > end) {
    return 0;
  }

  // Fade in
  if (scrollProgress < start + 0.1) {
    return (scrollProgress - start) * 10;
  }

  // Fade out
  if (scrollProgress > end - 0.1) {
    return (end - scrollProgress) * 10;
  }

  return 1;
}

/**
 * Calculate rotation based on scroll progress
 * @param scrollProgress Current scroll progress (0-1)
 * @param baseRotation Base rotation in radians
 * @param multiplier How much to rotate based on scroll
 * @returns Calculated rotation in radians
 */
export function calculateRotation(
  scrollProgress: number,
  baseRotation: number = 0,
  multiplier: number = 1
): number {
  return baseRotation + scrollProgress * Math.PI * 2 * multiplier;
}

export default {
  usePreloadedGLTF,
  useCameraPosition,
  calculateVisibility,
  calculateRotation,
};
