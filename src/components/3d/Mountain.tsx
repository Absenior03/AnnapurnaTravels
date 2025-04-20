"use client";

import React, { useRef, useMemo, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { InstancedMesh, Color, Vector3 } from "three";
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

  // Generate optimized geometry using useMemo
  const geometry = useMemo(() => {
    return generateMountainGeometry(detail, size, noiseScale, noiseAmplitude);
  }, [detail, size, noiseScale, noiseAmplitude]);

  // Load texture if provided
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

  // Set up animation frame
  useFrame(({ clock, scroll }) => {
    if (!meshRef.current) return;

    // Only perform these calculations if the mesh is visible on screen
    // to save processing power
    if (meshRef.current.visible) {
      // Apply rotation animation
      meshRef.current.rotation.y += rotationSpeed;

      // Apply scroll-based position change
      const scrollY = scroll?.offset.y || 0;
      meshRef.current.position.y = initialY - scrollY * scrollMultiplier * 2;

      // Apply hover scale effect
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
    if (meshRef.current) {
      const timer = setTimeout(() => {
        // Reduce update frequency to save performance
        meshRef.current!.matrixAutoUpdate = false;
        meshRef.current!.updateMatrix();
      }, 5000); // After 5 seconds, reduce update frequency

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={() => setIsHovered(true)}
      onPointerOut={() => setIsHovered(false)}
      castShadow
      receiveShadow
    >
      {geometry}

      {materialType === "wobble" ? (
        <MeshWobbleMaterial
          color={color}
          wireframe={wireframe}
          factor={wobbleStrength} // Wobble strength
          speed={wobbleSpeed} // Wobble speed
          roughness={0.4}
          metalness={0.1}
          map={textureMap}
        />
      ) : materialType === "physical" ? (
        <meshPhysicalMaterial
          color={color}
          wireframe={wireframe}
          roughness={0.5}
          metalness={0.2}
          clearcoat={0.3}
          clearcoatRoughness={0.25}
          map={textureMap}
        />
      ) : materialType === "toon" ? (
        <meshToonMaterial
          color={color}
          wireframe={wireframe}
          map={textureMap}
        />
      ) : (
        <meshStandardMaterial
          color={color}
          wireframe={wireframe}
          roughness={0.7}
          metalness={0.1}
          map={textureMap}
        />
      )}
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
  const safeDetail = Math.min(Math.max(detail, 0.5), 2);
  const segments = Math.floor(16 * safeDetail);

  // Create cone geometry with specified segments
  const geometry = <coneGeometry args={[size, size * 2, segments, 1, false]} />;

  return geometry;
}
