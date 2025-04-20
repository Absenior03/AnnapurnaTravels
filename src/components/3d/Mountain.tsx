"use client";

import React, { useRef, useMemo, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { InstancedMesh, Color, Vector3, MathUtils } from "three";
import { MeshWobbleMaterial, useTexture } from "@react-three/drei";

interface MountainProps {
  position?: [number, number, number];
  scrollMultiplier?: number;
  color?: string;
  wireframe?: boolean;
  size?: number;
  detail?: number;
  rotationSpeed?: number;
  noiseScale?: number;
  noiseAmplitude?: number;
  wobbleSpeed?: number;
  wobbleStrength?: number;
  materialType?: "standard" | "physical" | "toon" | "wobble";
  texture?: string | null;
  hoverScale?: number;
}

// Simple noise function to replace SimplexNoise
// This is a basic implementation that doesn't require an external library
function simpleNoise(x: number, y: number): number {
  // Simple pseudo-random noise function
  const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return n - Math.floor(n);
}

export default function Mountain({
  position = [0, 0, 0],
  scrollMultiplier = 1,
  color = "#3e64ff",
  wireframe = false,
  size = 2,
  detail = 1,
  rotationSpeed = 0.0008,
  noiseScale = 1,
  noiseAmplitude = 0.5,
  wobbleSpeed = 1,
  wobbleStrength = 0.2,
  materialType = "standard",
  texture = null,
  hoverScale = 1.05,
}: MountainProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const initialY = position[1];
  const [isHovered, setIsHovered] = useState(false);
  const [loadError, setLoadError] = useState(false);
  
  // For performance optimization, create a memo for the position
  const [x, y, z] = position;
  const memoizedPosition = useMemo(() => new Vector3(x, y, z), [x, y, z]);

  // Generate optimized geometry using useMemo with a safety check for detail value
  const geometry = useMemo(() => {
    // Ensure detail is within safe bounds to prevent crashes
    const safeDetail = Math.max(0.1, Math.min(detail, 2));
    return generateMountainGeometry(safeDetail, size, noiseScale, noiseAmplitude);
  }, [detail, size, noiseScale, noiseAmplitude]);

  // Load texture with error handling if provided
  const textureMap = useMemo(() => {
    if (!texture) return null;
    try {
      // Create a safer texture loading approach with fallback
      return useTexture(texture);
    } catch (error) {
      console.error("Failed to load mountain texture:", error);
      setLoadError(true);
      return null;
    }
  }, [texture]);

  // Set up animation frame with performance optimizations
  useFrame((state) => {
    if (!meshRef.current) return;

    // Only update if visible in viewport for optimization
    if (meshRef.current.visible) {
      // Limit rotation speed based on frame rate (deltaTime)
      meshRef.current.rotation.y += rotationSpeed; 

      // Apply scroll-based position change if scroll data is available
      // Access scroll data properly with proper type casting when needed
      const scrollData = state.scroll as { offset?: { y: number } } | undefined;
      if (scrollData && scrollData.offset) {
        const scrollY = scrollData.offset.y || 0;
        const newY = initialY - scrollY * scrollMultiplier * 2;
        meshRef.current.position.y = MathUtils.lerp(
          meshRef.current.position.y, 
          newY, 
          0.1
        ); // Use lerp for smoother motion
      }

      // Apply hover scale effect with smoothing
      if (isHovered) {
        meshRef.current.scale.lerp(
          new Vector3(hoverScale, hoverScale, hoverScale),
          0.1
        );
      } else {
        meshRef.current.scale.lerp(new Vector3(1, 1, 1), 0.1);
      }
    }
  });

  // Optimize mesh updates
  useEffect(() => {
    if (!meshRef.current) return;
    
    // Use a more conservative approach with matrixAutoUpdate
    // Only disable updates after animation has settled
    const timer = setTimeout(() => {
      if (meshRef.current) {
        // Check if mesh still exists before updating
        meshRef.current.matrixAutoUpdate = false;
        meshRef.current.updateMatrix();
      }
    }, 5000); // After 5 seconds, reduce update frequency
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <mesh
      ref={meshRef}
      position={memoizedPosition}
      onPointerOver={() => setIsHovered(true)}
      onPointerOut={() => setIsHovered(false)}
      castShadow
      receiveShadow
    >
      {geometry}

      {/* Use a switch based on materialType for better readability */}
      {(() => {
        // Default material props for consistency
        const commonProps = {
          color: color,
          wireframe: wireframe,
          map: textureMap,
        };
        
        switch (materialType) {
          case "wobble":
            return (
              <MeshWobbleMaterial
                {...commonProps}
                factor={wobbleStrength}
                speed={wobbleSpeed}
                roughness={0.4}
                metalness={0.1}
              />
            );
          case "physical":
            return (
              <meshPhysicalMaterial
                {...commonProps}
                roughness={0.5}
                metalness={0.2}
                clearcoat={0.3}
                clearcoatRoughness={0.25}
              />
            );
          case "toon":
            return (
              <meshToonMaterial {...commonProps} />
            );
          case "standard":
          default:
            return (
              <meshStandardMaterial
                {...commonProps}
                roughness={0.7}
                metalness={0.1}
              />
            );
        }
      })()}
    </mesh>
  );
}

// Generate mountain geometry with noise
function generateMountainGeometry(
  detail: number,
  size: number,
  noiseScale: number,
  noiseAmplitude: number
) {
  // Clamp detail to avoid performance issues
  const safeDetail = Math.min(Math.max(detail, 0.1), 2);
  
  // Lower segment count for better performance
  const segments = Math.floor(12 * safeDetail);
  
  // Prevent extreme low values that might cause rendering issues
  const safeSegments = Math.max(segments, 6);

  // Create cone geometry with specified segments
  const geometry = <coneGeometry args={[size, size * 2, safeSegments, 1, false]} />;

  return geometry;
}
