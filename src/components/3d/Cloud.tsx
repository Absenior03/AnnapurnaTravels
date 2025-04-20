"use client";

import React, { useMemo, useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";
import { useSpring as useMotionSpring } from "framer-motion";

interface CloudProps {
  position: Vector3 | [number, number, number];
  scale?: number | [number, number, number];
  color?: string;
  opacity?: number;
  scrollMultiplier?: number;
  speed?: number;
  segments?: number;
  noiseScale?: number;
}

function Cloud({
  position,
  scale = 1,
  color = "#ffffff",
  opacity = 0.8,
  scrollMultiplier = 0.5,
  speed = 0.01,
  segments = 8,
  noiseScale = 0.5,
}: CloudProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [hasError, setHasError] = useState(false);
  const [optimizeForRegion, setOptimizeForRegion] = useState(false);

  // Check if we need special optimization for this region
  useEffect(() => {
    if (typeof window === "undefined") return;

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
        setOptimizeForRegion(true);
      }
    } catch (e) {
      // If we can't detect region, assume we should optimize
      setOptimizeForRegion(true);
    }
  }, []);

  // Use natural spring physics for the cloud's movement
  const springX = useMotionSpring(0, {
    stiffness: optimizeForRegion ? 50 : 100,
    damping: optimizeForRegion ? 20 : 30,
  });
  const springY = useMotionSpring(0, {
    stiffness: optimizeForRegion ? 40 : 80,
    damping: optimizeForRegion ? 15 : 20,
  });

  // Try to use scroll context but don't require it
  let scrollContext;
  try {
    // Dynamic import to prevent SSR issues
    const { useScrollContext } = require("@/context/ScrollContext");
    scrollContext = useScrollContext();
  } catch (error) {
    // Silent fail - scroll effects won't be used
  }

  // Generate random spheres to form a cloud with error handling
  const cloudParticles = useMemo(() => {
    try {
      const particles = [];
      // Number of spheres depends on segments parameter
      // Reduce particles in optimized regions
      const count = optimizeForRegion
        ? Math.min(segments, 4) * 2
        : segments * 2;

      for (let i = 0; i < count; i++) {
        // Random positions for spheres with a more natural cloud shape
        const theta = Math.random() * Math.PI * 2;
        const radius = 0.2 + Math.random() * 0.8;

        const x = Math.cos(theta) * radius * (0.8 + Math.random() * 0.4);
        const y = (Math.random() * 0.5 - 0.25) * radius;
        const z = Math.sin(theta) * radius * (0.8 + Math.random() * 0.4);

        // Random sizes for variety
        const size = (0.4 + Math.random() * 0.6) * noiseScale;

        // Add some opacity variation for more natural look
        const particleOpacity = opacity * (0.7 + Math.random() * 0.3);

        particles.push({ position: [x, y, z], size, opacity: particleOpacity });
      }

      return particles;
    } catch (error) {
      console.error("Error generating cloud particles:", error);
      setHasError(true);
      // Return simplified particles as fallback
      return [
        { position: [0, 0, 0], size: 1, opacity: opacity },
        { position: [0.5, 0.2, 0.5], size: 0.8, opacity: opacity * 0.8 },
        { position: [-0.5, 0.1, -0.5], size: 0.9, opacity: opacity * 0.9 },
      ];
    }
  }, [segments, noiseScale, opacity, optimizeForRegion]);

  // Update spring values on scroll with error handling
  useEffect(() => {
    try {
      if (!scrollContext?.scrollYProgress) return;

      const unsubscribe = scrollContext.scrollYProgress.onChange(
        (latest: number) => {
          // Reduce effects in optimized regions
          const multiplier = optimizeForRegion
            ? scrollMultiplier * 0.5
            : scrollMultiplier;
          springX.set(latest * multiplier * -5);
          springY.set(latest * multiplier * 2);
        }
      );

      return () => {
        if (unsubscribe) unsubscribe();
      };
    } catch (error) {
      console.error("Error in cloud scroll effect:", error);
      setHasError(true);
    }
  }, [scrollContext, scrollMultiplier, springX, springY, optimizeForRegion]);

  // Animation with error handling
  useFrame(({ clock }) => {
    if (!meshRef.current || hasError) return;

    try {
      // Get the current position (Vector3 or array)
      const pos =
        position instanceof Vector3 ? position : new Vector3(...position);

      // Time-based animation
      const time = clock.getElapsedTime();

      // Reduce animation frequency in optimized regions
      const animSpeed = optimizeForRegion ? speed * 0.5 : speed;

      // Subtle floating animation with multiple frequencies
      const floatY =
        Math.sin(time * animSpeed * 0.5) * 0.2 +
        Math.sin(time * animSpeed * 0.3) * 0.1;

      // Apply animations only every other frame for optimized regions to improve performance
      if (!optimizeForRegion || Math.floor(time * 10) % 2 === 0) {
        // Subtle rotation for more natural movement
        meshRef.current.rotation.y = Math.sin(time * animSpeed) * 0.1;
        meshRef.current.rotation.z = Math.cos(time * animSpeed * 0.7) * 0.05;
      }

      // Update position with spring physics values
      meshRef.current.position.set(
        pos.x + springX.get(),
        pos.y + floatY,
        pos.z
      );
    } catch (error) {
      console.error("Error in cloud animation:", error);
      setHasError(true);
    }
  });

  // Simplified cloud if there's an error
  if (hasError) {
    return (
      <group
        position={
          position instanceof Vector3 ? position : new Vector3(...position)
        }
        scale={typeof scale === "number" ? [scale, scale, scale] : scale}
      >
        <mesh>
          <sphereGeometry args={[1, 8, 8]} />
          <meshStandardMaterial
            color={color}
            transparent
            opacity={opacity}
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>
      </group>
    );
  }

  return (
    <group
      ref={meshRef}
      position={
        position instanceof Vector3 ? position : new Vector3(...position)
      }
      scale={typeof scale === "number" ? [scale, scale, scale] : scale}
    >
      {cloudParticles.map((particle, index) => (
        <mesh
          key={index}
          position={particle.position as [number, number, number]}
        >
          {/* Use simpler geometry in optimized regions */}
          <sphereGeometry
            args={[
              particle.size,
              optimizeForRegion ? 6 : 12,
              optimizeForRegion ? 6 : 12,
            ]}
          />
          <meshStandardMaterial
            color={color}
            transparent
            opacity={particle.opacity}
            roughness={0.8}
            metalness={0.1}
            envMapIntensity={optimizeForRegion ? 1.0 : 1.5}
          />
        </mesh>
      ))}
    </group>
  );
}

export default Cloud;
