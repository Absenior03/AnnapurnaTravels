"use client";

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useMemoryManagement } from '@/hooks/useMemoryManagement';

// Simplex noise approximation function
const simplex = (x: number, y: number): number => {
  const n = x * x + y * y;
  return (Math.sin(x * 1.5) * Math.cos(y * 2.5) + Math.sin(x * 2.9 + y * 0.8) * 0.2) * (1 / (1 + n * 0.1));
};

export interface MountainProps {
  position?: [number, number, number];
  scrollMultiplier?: number;
  color?: string;
  wireframe?: boolean;
  size?: number;
  detail?: number;
  materialType?: 'standard' | 'physical' | 'toon' | 'wobble';
  hoverEffect?: boolean;
  snowCoverage?: number;
  texture?: string;
}

export function Mountain({
  position = [0, 0, 0],
  scrollMultiplier = 1,
  color = '#3b82f6',
  wireframe = false,
  size = 5,
  detail = 32,
  materialType = 'standard',
  hoverEffect = true,
  snowCoverage = 0.7,
  texture,
}: MountainProps) {
  const mesh = useRef<THREE.Mesh>(null);
  const geometry = useRef<THREE.BufferGeometry>(null);
  const [hovered, setHovered] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const { isLowMemoryDevice, shouldReduceQuality } = useMemoryManagement();
  
  // Optimize detail level based on device capabilities
  const optimizedDetail = useMemo(() => {
    if (isLowMemoryDevice || shouldReduceQuality) {
      // Reduce detail significantly for low-memory devices
      return Math.max(8, Math.floor(detail / 3));
    }
    return detail;
  }, [detail, isLowMemoryDevice, shouldReduceQuality]);
  
  // Optimize texture loading based on device capabilities
  const textureProps = useMemo(() => {
    return {
      // Minimize memory usage for textures on low-end devices
      anisotropy: isLowMemoryDevice ? 1 : 4,
      generateMipmaps: !isLowMemoryDevice
    };
  }, [isLowMemoryDevice]);
  
  // Load texture conditionally
  const [diffuseMap] = useTexture(
    texture ? [texture] : [''], 
    (loadedTextures) => {
      if (texture && loadedTextures.length > 0) {
        const tex = loadedTextures[0];
        tex.anisotropy = textureProps.anisotropy;
        tex.generateMipmaps = textureProps.generateMipmaps;
        tex.minFilter = THREE.LinearFilter;
        tex.needsUpdate = true;
      }
    },
    (error) => {
      console.error('Error loading texture:', error);
      setLoadError(true);
    }
  );

  // Generate optimized mountain geometry
  const generateMountainGeometry = (detailLevel: number, mountainSize: number) => {
    // Create a plane geometry as a base
    const geo = new THREE.PlaneGeometry(mountainSize, mountainSize, detailLevel, detailLevel);
    
    // Add height to vertices to create mountain shape
    const basePositions = geo.attributes.position as THREE.BufferAttribute;
    const vertices = basePositions.array;
    
    for (let i = 0; i < vertices.length; i += 3) {
      const x = vertices[i];
      const z = vertices[i + 1];
      
      // Generate height using simplified noise function for better performance
      let height = simplex(x * 0.1, z * 0.1) * 0.5 + 0.5;
      
      // Apply height to vertices
      vertices[i + 2] = height * mountainSize * 0.5;
      
      // Apply snow based on height and snow coverage
      if (height > snowCoverage) {
        // Will be used for vertex color in the material
      }
    }
    
    // Update geometry
    basePositions.needsUpdate = true;
    geo.computeVertexNormals();
    
    // Generate optimized buffer for performance
    return geo;
  };

  // Animate the mountain position and rotation
  useFrame((state) => {
    if (!mesh.current) return;
    
    // Stop animation when not in view to save resources
    const isInView = Math.abs(position[1] - state.camera.position.y) < 15;
    
    if (isInView || hovered) {
      // Get scroll progress
      const scrollY = state.camera.position.y;
      
      // Apply rotation
      mesh.current.rotation.y = state.clock.getElapsedTime() * 0.05;
      
      // Apply parallax effect if enabled
      if (scrollMultiplier !== 0) {
        const parallaxOffset = scrollY * scrollMultiplier * 0.1;
        mesh.current.position.y = position[1] + parallaxOffset;
      }
      
      // Apply hover effect if enabled
      if (hoverEffect && hovered) {
        mesh.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 2) * 0.05;
      } else {
        mesh.current.rotation.z = 0;
      }
    }
  });

  // Memory optimization - dispose resources when component unmounts
  useEffect(() => {
    return () => {
      if (geometry.current) {
        geometry.current.dispose();
      }
      
      if (diffuseMap && !loadError) {
        diffuseMap.dispose();
      }
    };
  }, [diffuseMap, loadError]);

  // Determine which material to use based on props and memory constraints
  const material = useMemo(() => {
    switch (materialType) {
      case 'physical':
        return (
          <meshPhysicalMaterial
            color={color}
            wireframe={wireframe}
            roughness={0.8}
            metalness={0.1}
            map={texture && !loadError ? diffuseMap : undefined}
          />
        );
      case 'toon':
        // Only use toon material on high-performance devices
        if (!isLowMemoryDevice) {
          return (
            <meshToonMaterial
              color={color}
              wireframe={wireframe}
            />
          );
        }
        // Fallback to standard for low-memory
        return (
          <meshStandardMaterial
            color={color}
            wireframe={wireframe}
            roughness={0.8}
          />
        );
      case 'wobble':
        // Only use custom shaders on high-performance devices
        if (!isLowMemoryDevice) {
          return (
            <meshStandardMaterial
              color={color}
              wireframe={wireframe}
              roughness={0.8}
            />
          );
        }
        // Fallback for low-memory
        return (
          <meshBasicMaterial
            color={color}
            wireframe={wireframe}
          />
        );
      default:
        // Standard is the default, most optimized material
        return (
          <meshStandardMaterial
            color={color}
            wireframe={wireframe}
            roughness={0.8}
            map={texture && !loadError ? diffuseMap : undefined}
          />
        );
    }
  }, [color, wireframe, materialType, texture, diffuseMap, loadError, isLowMemoryDevice]);

  // Create mountain geometry
  const mountainGeometry = useMemo(() => {
    return generateMountainGeometry(optimizedDetail, size);
  }, [optimizedDetail, size]);

  // Save reference to geometry for cleanup
  useEffect(() => {
    geometry.current = mountainGeometry;
  }, [mountainGeometry]);

  return (
    <mesh
      ref={mesh}
      position={[position[0], position[1], position[2]]}
      onPointerOver={() => hoverEffect && setHovered(true)}
      onPointerOut={() => setHovered(false)}
      geometry={mountainGeometry}
    >
      {material}
    </mesh>
  );
}

export default Mountain;
