"use client";

import React, { Suspense, useRef } from "react";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
  Stars,
} from "@react-three/drei";
import { Vector3 } from "three";
import { useScrollContext } from "@/context/ScrollContext";
import dynamic from "next/dynamic";

// Dynamically import components that require client-side rendering
const Mountain = dynamic(() => import("./Mountain"), { ssr: false });
const Cloud = dynamic(() => import("./Cloud"), { ssr: false });

// Scene content
const SceneContent = () => {
  const { scrollYProgress } = useScrollContext();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  // Camera animation based on scroll
  useFrame(() => {
    if (cameraRef.current) {
      // Animate camera position based on scroll
      const targetY = 2 + scrollYProgress.current * 3;
      const targetZ = 10 - scrollYProgress.current * 3;

      // Smooth camera movement
      cameraRef.current.position.y =
        cameraRef.current.position.y +
        (targetY - cameraRef.current.position.y) * 0.05;
      cameraRef.current.position.z =
        cameraRef.current.position.z +
        (targetZ - cameraRef.current.position.z) * 0.05;
    }
  });

  return (
    <>
      {/* Camera */}
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={[0, 2, 10]}
        fov={45}
      />

      {/* Environment lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />

      {/* Mountains */}
      <Mountain
        position={new Vector3(0, -2, 0)}
        scrollMultiplier={0.5}
        color="#2d3748"
        size={10}
        detail={80}
      />
      <Mountain
        position={new Vector3(-7, -2.5, -5)}
        scrollMultiplier={0.3}
        color="#1a202c"
        size={8}
        detail={60}
      />
      <Mountain
        position={new Vector3(8, -2.5, -7)}
        scrollMultiplier={0.4}
        color="#4a5568"
        size={9}
        detail={70}
      />

      {/* Clouds */}
      <Cloud
        position={new Vector3(3, 3, -5)}
        scale={1.5}
        color="#ffffff"
        opacity={0.8}
        scrollMultiplier={0.2}
      />
      <Cloud
        position={new Vector3(-4, 4, -10)}
        scale={2}
        color="#f7fafc"
        opacity={0.7}
        scrollMultiplier={0.3}
      />
      <Cloud
        position={new Vector3(0, 2, -3)}
        scale={1}
        color="#ffffff"
        opacity={0.9}
        scrollMultiplier={0.1}
      />

      {/* Stars in background */}
      <Stars radius={100} depth={50} count={1000} factor={4} fade />

      {/* Sun/light source */}
      <mesh position={[20, 10, -30]}>
        <sphereGeometry args={[5, 32, 32]} />
        <meshBasicMaterial color="#FDB813" />
      </mesh>

      {/* Controls - limit to rotation only for user experience */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.5}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.8}
      />
    </>
  );
};

// Fallback component for when the 3D scene is loading
const Fallback = () => (
  <div className="w-full h-full flex items-center justify-center">
    <div className="bg-gray-800 bg-opacity-70 p-4 rounded-lg text-white">
      <p className="text-center">Loading 3D experience...</p>
    </div>
  </div>
);

interface MountainSceneProps {
  className?: string;
}

const MountainScene = ({
  className = "w-full h-[500px]",
}: MountainSceneProps) => {
  return (
    <div className={className}>
      <Canvas shadows dpr={[1, 2]}>
        <Suspense fallback={null}>
          <SceneContent />
          <Environment preset="sunset" />
        </Suspense>
      </Canvas>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-40" />
    </div>
  );
};

export default MountainScene;
