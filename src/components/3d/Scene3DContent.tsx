"use client";

import React, { useRef, useEffect, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {
  PerspectiveCamera,
  OrbitControls,
  Environment,
  useScroll,
} from "@react-three/drei";
import { Vector3 } from "three";
import { useScrollContext } from "@/context/ScrollContext";
import Mountain from "./Mountain";
import Cloud from "./Cloud";

interface Scene3DContentProps {
  mountainCount?: number;
  cloudCount?: number;
}

export default function Scene3DContent({
  mountainCount = 5,
  cloudCount = 8,
}: Scene3DContentProps) {
  return (
    <Canvas
      className="w-full h-full"
      shadows
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      <color attach="background" args={["#000428"]} />
      <fog attach="fog" args={["#000428", 5, 30]} />
      <Environment preset="sunset" />

      <PerspectiveCamera makeDefault position={[0, 2, 10]} fov={45} />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={false}
        maxPolarAngle={Math.PI / 2.2}
        minPolarAngle={Math.PI / 3}
      />

      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Scene elements */}
      <SceneElements mountainCount={mountainCount} cloudCount={cloudCount} />
    </Canvas>
  );
}

interface SceneElementsProps {
  mountainCount: number;
  cloudCount: number;
}

function SceneElements({ mountainCount, cloudCount }: SceneElementsProps) {
  const { scrollY } = useScrollContext();
  const sceneRef = useRef<THREE.Group>(null);
  const mountains = useRef<
    Array<{ position: Vector3; height: number; color: string }>
  >([]);
  const clouds = useRef<
    Array<{ position: Vector3; scale: number; speed: number }>
  >([]);

  // Generate mountains
  useEffect(() => {
    mountains.current = [];

    // Create varied mountains
    for (let i = 0; i < mountainCount; i++) {
      const distance = Math.random() * 15 - 5; // -5 to 10
      const sideOffset = Math.random() * 20 - 10; // -10 to 10
      const height = 1.5 + Math.random() * 3; // 1.5 to 4.5

      // Generate color from blue to purple gradient
      const hue = 220 + Math.random() * 60; // 220 to 280 (blue to purple)
      const saturation = 60 + Math.random() * 40; // 60 to 100
      const lightness = 15 + Math.random() * 25; // 15 to 40

      mountains.current.push({
        position: new Vector3(sideOffset, -2, -distance - 5),
        height,
        color: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
      });
    }
  }, [mountainCount]);

  // Generate clouds
  useEffect(() => {
    clouds.current = [];

    // Create varied clouds
    for (let i = 0; i < cloudCount; i++) {
      const distance = Math.random() * 25 - 5; // -5 to 20
      const height = 3 + Math.random() * 6; // 3 to 9
      const sideOffset = Math.random() * 30 - 15; // -15 to 15
      const scale = 0.5 + Math.random() * 1.5; // 0.5 to 2
      const speed = 0.01 + Math.random() * 0.04; // 0.01 to 0.05

      clouds.current.push({
        position: new Vector3(sideOffset, height, -distance - 5),
        scale,
        speed,
      });
    }
  }, [cloudCount]);

  return (
    <group ref={sceneRef}>
      {/* Mountains */}
      {mountains.current.map((mountain, index) => (
        <Mountain
          key={`mountain-${index}`}
          position={mountain.position}
          size={[mountain.height * 4, mountain.height, mountain.height * 4]}
          color={mountain.color}
          detail={6 + Math.floor(Math.random() * 4)}
          scrollMultiplier={0.05 + Math.random() * 0.1}
          wireframe={Math.random() > 0.8}
        />
      ))}

      {/* Clouds */}
      {clouds.current.map((cloud, index) => (
        <Cloud
          key={`cloud-${index}`}
          position={cloud.position}
          scale={[cloud.scale, cloud.scale, cloud.scale]}
          color="#ffffff"
          opacity={0.7 + Math.random() * 0.3}
          speed={cloud.speed}
          segments={3 + Math.floor(Math.random() * 3)}
          scrollMultiplier={0.02 + Math.random() * 0.08}
        />
      ))}
    </group>
  );
}
