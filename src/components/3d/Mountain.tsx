"use client";

import React, { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Vector3, ConeGeometry } from "three";
import { createNoise2D } from "simplex-noise";

interface MountainProps {
  position: Vector3 | [number, number, number];
  color?: string;
  wireframe?: boolean;
  size?: number | [number, number, number];
  detail?: number;
  scrollMultiplier?: number;
  mouseX?: number;
  mouseY?: number;
}

function Mountain({
  position,
  color = "#3b82f6",
  wireframe = false,
  size = 10,
  detail = 48,
  scrollMultiplier = 0.5,
  mouseX = 0.5,
  mouseY = 0.5,
}: MountainProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hasError, setHasError] = useState(false);

  // Create noise function with error handling
  const noise2D = useMemo(() => {
    try {
      return createNoise2D();
    } catch (error) {
      console.error("Error creating noise function:", error);
      setHasError(true);
      // Return a simple function that just returns 0 as fallback
      return () => 0;
    }
  }, []);

  // Try to use scroll context, but don't require it
  let scrollContext;
  try {
    // Dynamically import to prevent SSR issues
    const { useScrollContext } = require("@/context/ScrollContext");
    scrollContext = useScrollContext();
  } catch (error) {
    // Silent fail - just don't use scroll effects if not available
  }

  // Generate mountain geometry with noise and error handling
  const geometry = useMemo(() => {
    try {
      const sizeX = Array.isArray(size) ? size[0] : size;
      const sizeY = Array.isArray(size) ? size[1] : size;
      const sizeZ = Array.isArray(size) ? size[2] : size;

      return generateMountainGeometry(detail, sizeX, sizeY, sizeZ, noise2D);
    } catch (error) {
      console.error("Error generating mountain geometry:", error);
      setHasError(true);
      // Return a simple cone geometry as fallback
      return new ConeGeometry(5, 10, 16);
    }
  }, [size, detail, noise2D]);

  // Animation with error handling
  useFrame(({ clock }) => {
    if (!meshRef.current || hasError) return;

    try {
      // Apply mouse movement for parallax effect
      const rotationX = (mouseY - 0.5) * 0.1;
      const rotationY = (mouseX - 0.5) * 0.1;

      meshRef.current.rotation.x =
        meshRef.current.rotation.x * 0.92 + rotationX * 0.08;
      meshRef.current.rotation.y =
        meshRef.current.rotation.y * 0.92 + rotationY * 0.08;

      // Apply subtle animation
      meshRef.current.position.y =
        (position instanceof Vector3 ? position.y : position[1]) +
        Math.sin(clock.getElapsedTime() * 0.2) * 0.05;

      // Apply scroll effect if scroll context is available
      if (scrollContext && scrollContext.scrollYProgress) {
        const scrollOffset =
          scrollContext.scrollYProgress.current * scrollMultiplier;
        meshRef.current.position.z =
          (position instanceof Vector3 ? position.z : position[2]) -
          scrollOffset * 5;
        meshRef.current.rotation.x += scrollOffset * 0.1;
      }
    } catch (error) {
      console.error("Error in mountain animation:", error);
      setHasError(true);
    }
  });

  // If there's an error, render a simplified mountain
  if (hasError) {
    return (
      <mesh
        position={
          position instanceof Vector3 ? position : new Vector3(...position)
        }
      >
        <coneGeometry args={[5, 10, 16]} />
        <meshStandardMaterial
          color={color}
          wireframe={wireframe}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
    );
  }

  return (
    <mesh
      ref={meshRef}
      position={
        position instanceof Vector3 ? position : new Vector3(...position)
      }
      receiveShadow
      castShadow
    >
      <bufferGeometry attach="geometry" {...geometry} />
      <meshStandardMaterial
        color={color}
        wireframe={wireframe}
        roughness={0.7}
        metalness={0.1}
      />
    </mesh>
  );
}

// Helper function to generate mountain geometry with noise
function generateMountainGeometry(
  detail: number,
  sizeX: number,
  sizeY: number,
  sizeZ: number,
  noise2D: (x: number, y: number) => number
) {
  // Create a cone geometry as base
  const geometry = new ConeGeometry(sizeX / 2, sizeY, detail, 1, true);

  // Get vertices
  const positionAttribute = geometry.getAttribute("position");
  const positions = positionAttribute.array;

  // Apply noise to vertices
  for (let i = 0; i < positions.length; i += 3) {
    const x = positions[i];
    const y = positions[i + 1];
    const z = positions[i + 2];

    // Skip the top vertex of the cone
    if (y !== sizeY / 2) {
      const distance = Math.sqrt(x * x + z * z);
      const noise =
        noise2D(x * 0.1, z * 0.1) * 0.2 + noise2D(x * 0.01, z * 0.01) * 0.8;

      // Apply noise based on distance from center and height
      const noiseAmount = (1 - y / sizeY) * noise * sizeY * 0.2;

      // Update position with noise
      positions[i] += x * noiseAmount * 0.2;
      positions[i + 1] += noiseAmount;
      positions[i + 2] += z * noiseAmount * 0.2;
    }
  }

  // Update geometry
  positionAttribute.needsUpdate = true;
  geometry.computeVertexNormals();

  return geometry;
}

export default Mountain;
