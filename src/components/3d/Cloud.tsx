"use client";

import React, { useMemo, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";
import { useScrollContext } from "@/context/ScrollContext";
import { useSpring as useMotionSpring } from "framer-motion";
import { useSpring as useDreiSpring } from "@react-three/drei";

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

  // Use natural spring physics for the cloud's movement
  const springX = useMotionSpring(0, { stiffness: 100, damping: 30 });
  const springY = useMotionSpring(0, { stiffness: 80, damping: 20 });

  let scrollContext;
  try {
    scrollContext = useScrollContext();
  } catch (error) {
    // Handle case when not in ScrollContext
  }

  // Generate random spheres to form a cloud
  const cloudParticles = useMemo(() => {
    const particles = [];
    // Number of spheres depends on segments parameter
    const count = segments * 2;

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
  }, [segments, noiseScale, opacity]);

  // Update spring values on scroll
  useEffect(() => {
    if (!scrollContext?.scrollYProgress) return;

    const unsubscribe = scrollContext.scrollYProgress.onChange(
      (latest: number) => {
        springX.set(latest * scrollMultiplier * -5);
        springY.set(latest * scrollMultiplier * 2);
      }
    );

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [scrollContext, scrollMultiplier, springX, springY]);

  // Animation
  useFrame(({ clock }) => {
    if (!meshRef.current) return;

    // Get the current position (Vector3 or array)
    const pos =
      position instanceof Vector3 ? position : new Vector3(...position);

    // Time-based animation
    const time = clock.getElapsedTime();

    // Subtle floating animation with multiple frequencies
    const floatY =
      Math.sin(time * speed * 0.5) * 0.2 + Math.sin(time * speed * 0.3) * 0.1;

    // Subtle rotation for more natural movement
    meshRef.current.rotation.y = Math.sin(time * speed) * 0.1;
    meshRef.current.rotation.z = Math.cos(time * speed * 0.7) * 0.05;

    // Update position with spring physics values
    meshRef.current.position.set(pos.x + springX.get(), pos.y + floatY, pos.z);
  });

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
          <sphereGeometry args={[particle.size, 12, 12]} />
          <meshStandardMaterial
            color={color}
            transparent
            opacity={particle.opacity}
            roughness={0.8}
            metalness={0.1}
            envMapIntensity={1.5}
          />
        </mesh>
      ))}
    </group>
  );
}

export default Cloud;
