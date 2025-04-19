"use client";

import React, { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useSpring, animated, config } from "@react-spring/three";
import {
  OrbitControls,
  PerspectiveCamera,
  useTexture,
  Text,
  Environment,
  MeshDistortMaterial,
  Float,
  Sparkles,
} from "@react-three/drei";
import * as THREE from "three";

// Animated Mountain component that reacts to mouse movement
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

  useFrame(() => {
    if (!ref.current) return;
    const t = clock.getElapsedTime() * 0.1 + index * 0.5;
    ref.current.position.y = position[1] + Math.sin(t) * 0.1;
    ref.current.rotation.z = Math.sin(t * 0.5) * 0.05;
  });

  return (
    <mesh ref={ref} position={position}>
      <coneGeometry args={[1.5 * scale, 2 * scale, 4, 1]} />
      <MeshDistortMaterial color={color} speed={2} distort={0.2} radius={1} />
    </mesh>
  );
}

// Cloud component - simplified particle system
function Cloud({ position }: { position: [number, number, number] }) {
  return (
    <Float
      speed={1.5}
      rotationIntensity={0.2}
      floatIntensity={0.5}
      position={position}
    >
      <mesh>
        <sphereGeometry args={[0.7, 16, 16]} />
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
      <sphereGeometry args={[1, 36, 36]} />
      <animated.meshStandardMaterial
        color={props.color}
        emissive={props.color}
        emissiveIntensity={1}
      />
    </animated.mesh>
  );
}

// Main scene component
function Scene() {
  const [isNight, setIsNight] = useState(false);

  // Change between day and night every 10 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setIsNight((prev) => !prev);
    }, 10000);

    return () => clearInterval(timer);
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

      {/* Camera Controls */}
      <PerspectiveCamera makeDefault position={[0, 1, 10]} fov={35} />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 2.2}
        rotateSpeed={0.2}
      />

      {/* Environment */}
      <Environment preset={isNight ? "night" : "sunset"} />

      {/* Sun/Moon */}
      <SunMoon isNight={isNight} />

      {/* Mountains */}
      <Mountain position={[-4, -2, -6]} color="#4ca58f" scale={1.8} index={0} />
      <Mountain position={[-1, -2, -4]} color="#2d6a4f" scale={2.2} index={1} />
      <Mountain position={[3, -2, -5]} color="#1b4332" scale={1.6} index={2} />
      <Mountain position={[6, -2, -7]} color="#081c15" scale={2.0} index={3} />

      {/* Clouds */}
      <Cloud position={[-6, 4, -8]} />
      <Cloud position={[-3, 5, -10]} />
      <Cloud position={[2, 6, -12]} />
      <Cloud position={[7, 4, -9]} />

      {/* Stars - only visible at night thanks to opacity animation */}
      <Sparkles
        count={100}
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
      <Float
        speed={1.5}
        rotationIntensity={0.2}
        floatIntensity={0.5}
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
    </>
  );
}

export default function Hero3D() {
  return (
    <div className="w-full h-[95vh] relative">
      <Canvas shadows>
        <Scene />
      </Canvas>
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
}
