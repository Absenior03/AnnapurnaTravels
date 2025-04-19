"use client";

import React, { useRef, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useSpring, animated, config } from "@react-spring/three";
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
  MeshDistortMaterial,
  Float,
  Sparkles,
  Text,
} from "@react-three/drei";
import * as THREE from "three";

// Simplified Mountain component
function Mountain({
  position,
  color,
  scale = 1,
  index = 0,
}: {
  position: [number, number, number];
  color: string;
  scale?: number;
  index?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const { clock } = useThree();

  // Optimize animation with fewer calculations
  useFrame(() => {
    if (!ref.current) return;
    const t = clock.getElapsedTime() * 0.1 + index * 0.2;
    ref.current.position.y = position[1] + Math.sin(t) * 0.1;
    ref.current.rotation.z = Math.sin(t * 0.3) * 0.05;
  });

  return (
    <mesh ref={ref} position={position}>
      <coneGeometry args={[1.5 * scale, 2 * scale, 4, 1]} />
      <MeshDistortMaterial color={color} speed={1} distort={0.2} radius={1} />
    </mesh>
  );
}

// Cloud component
function Cloud({ position }: { position: [number, number, number] }) {
  return (
    <Float
      speed={1}
      rotationIntensity={0.1}
      floatIntensity={0.3}
      position={position}
    >
      <mesh>
        <sphereGeometry args={[0.7, 8, 8]} />
        <meshStandardMaterial color="white" transparent opacity={0.8} />
      </mesh>
    </Float>
  );
}

// Sun/Moon component
function SunMoon({ isNight }: { isNight: boolean }) {
  const props = useSpring({
    position: isNight
      ? ([8, 8, -10] as [number, number, number])
      : ([8, 20, -20] as [number, number, number]),
    color: isNight ? "#e1e1e1" : "#FDB813",
    scale: isNight ? 2 : 3,
    config: config.molasses,
  });

  return (
    <animated.mesh position={props.position} scale={props.scale}>
      <sphereGeometry args={[1, 16, 16]} />
      <animated.meshStandardMaterial
        color={props.color}
        emissive={props.color}
        emissiveIntensity={1}
      />
    </animated.mesh>
  );
}

// Title component separated for better performance
function SceneTitle() {
  return (
    <Float
      speed={1}
      rotationIntensity={0.1}
      floatIntensity={0.2}
      position={[0, 2, 0]}
    >
      <Text
        font="/fonts/Inter-Bold.woff"
        fontSize={1.5}
        position={[0, 0, 0]}
        color="#ffffff"
        textAlign="center"
        material-toneMapped={false}
        castShadow
        fallback={false}
      >
        South Asia
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0.5}
        />
      </Text>
      <Text
        font="/fonts/Inter-Light.woff"
        fontSize={0.7}
        position={[0, -1, 0]}
        color="#ffffff"
        textAlign="center"
        material-toneMapped={false}
        fallback={false}
      >
        Discover Extraordinary Adventures
      </Text>
    </Float>
  );
}

// Main scene component
function Scene() {
  const [isNight, setIsNight] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Change between day and night every 10 seconds
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setIsNight((prev) => !prev);
    }, 10000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Spring animation for ambient light
  const lightProps = useSpring({
    intensity: isNight ? 0.1 : 0.8,
    color: isNight ? "#0c1445" : "#ffffff",
    config: { duration: 3000 },
  });

  // Spring animation for sky color
  const skyProps = useSpring({
    color: isNight ? "#0c1445" : "#64b5f6",
    config: { duration: 3000 },
  });

  return (
    <>
      {/* Background color that changes with day/night */}
      <color attach="background" args={[skyProps.color]} />

      {/* Lighting */}
      <animated.ambientLight
        intensity={lightProps.intensity}
        color={lightProps.color}
      />
      <directionalLight position={[0, 10, -5]} intensity={1} castShadow />

      {/* Camera Controls - reduced control range for better performance */}
      <PerspectiveCamera makeDefault position={[0, 1, 10]} fov={35} />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 2.2}
        rotateSpeed={0.1}
        // Limit rotation to improve performance
        maxAzimuthAngle={Math.PI / 8}
        minAzimuthAngle={-Math.PI / 8}
      />

      {/* Environment - simplified */}
      <Environment preset={isNight ? "night" : "sunset"} />

      {/* Sun/Moon */}
      <SunMoon isNight={isNight} />

      {/* Mountains - reduced quantity for better performance */}
      <Mountain position={[-4, -2, -6]} color="#4ca58f" scale={1.8} index={0} />
      <Mountain position={[-1, -2, -4]} color="#2d6a4f" scale={2.2} index={1} />
      <Mountain position={[3, -2, -5]} color="#1b4332" scale={1.6} index={2} />
      <Mountain position={[6, -2, -7]} color="#081c15" scale={2.0} index={3} />

      {/* Reduced number of clouds */}
      <Cloud position={[-6, 4, -8]} />
      <Cloud position={[2, 6, -12]} />

      {/* Stars - only visible at night, reduced count */}
      <Sparkles
        count={50}
        scale={20}
        size={2}
        speed={0.2}
        opacity={isNight ? 0.8 : 0}
      />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color={isNight ? "#0a2236" : "#a8dadc"} />
      </mesh>

      {/* 3D Title */}
      <SceneTitle />
    </>
  );
}

export default function Hero3D() {
  // Error state
  const [hasError, setHasError] = useState(false);

  // Handle errors in the Canvas
  const handleError = (error: Error) => {
    console.error("Three.js rendering error:", error);
    setHasError(true);
  };

  // Use try-catch to handle errors during component rendering
  try {
    return (
      <div className="w-full h-[95vh] relative">
        {hasError ? (
          // Fallback UI if Canvas fails to render
          <div className="w-full h-full bg-gradient-to-b from-emerald-800 to-emerald-600 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-6">
                Discover South Asia
              </h1>
              <p className="text-xl text-white mb-10 max-w-3xl mx-auto">
                Experience the breathtaking beauty of South Asia with our
                immersive tours.
              </p>
            </div>
          </div>
        ) : (
          // The 3D Canvas with error handling and Suspense fallback
          <Suspense
            fallback={
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-emerald-800 to-emerald-600">
                <div className="text-white text-2xl">
                  Loading 3D Experience...
                </div>
              </div>
            }
          >
            <Canvas
              shadows
              dpr={[1, 2]} // Limit pixel ratio for better performance
              gl={{
                antialias: false, // Disable antialias for performance
                powerPreference: "high-performance",
                alpha: false,
              }}
              onError={handleError}
            >
              <Scene />
            </Canvas>
          </Suspense>
        )}
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex gap-4 z-10">
          <a
            href="#tours"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3.5 rounded-md font-semibold text-base transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 inline-flex items-center"
          >
            Explore Tours
          </a>
          <a
            href="/about"
            className="bg-transparent border-2 border-white text-white hover:bg-white/20 transition-colors px-8 py-3 rounded-md font-semibold text-base inline-flex items-center"
          >
            Learn More
          </a>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error rendering Hero3D component:", error);
    // Return simplified fallback if rendering fails
    return (
      <div className="w-full h-[95vh] relative bg-emerald-700 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-6">
            Discover South Asia
          </h1>
          <p className="text-white mb-8">
            Experience the most spectacular landscapes in the world
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#tours"
              className="bg-white text-emerald-700 hover:bg-gray-100 px-6 py-3 rounded-md font-semibold text-base"
            >
              Explore Tours
            </a>
            <a
              href="/about"
              className="bg-transparent border-2 border-white text-white hover:bg-white/20 px-6 py-3 rounded-md font-semibold text-base"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    );
  }
}
