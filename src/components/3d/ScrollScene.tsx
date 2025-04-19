"use client";

import React, { useRef, useState, useEffect, Suspense } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  useScroll,
  ScrollControls,
  Environment,
  Html,
  Line,
  QuadraticBezierLine,
  PerspectiveCamera,
  OrbitControls,
  useGLTF,
} from "@react-three/drei";
import { Mountain } from "../hero/Hero3D";
import { ErrorBoundary } from "react-error-boundary";
import { motion, useTransform, useSpring } from "framer-motion";

// Create a simple InteractiveScene component if the import is failing
// In production, you might want to implement a proper component or conditionally import it
// This is a fallback to prevent build errors
const InteractiveScene = ({
  scrollY,
  mouseX,
  mouseY,
}: {
  scrollY: number;
  mouseX: number;
  mouseY: number;
}) => {
  return (
    <div className="fixed top-0 left-0 w-full h-screen bg-gradient-to-b from-emerald-700 to-emerald-900 -z-10">
      {/* Fallback gradient background when 3D scene can't be loaded */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-white/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-3/4 right-1/4 w-1/3 h-1/3 bg-white/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

// Create a curved path for the camera to follow
function createCameraPath() {
  return new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 10, 20),
    new THREE.Vector3(10, 15, 10),
    new THREE.Vector3(20, 5, 0),
    new THREE.Vector3(10, -5, -10),
    new THREE.Vector3(0, 0, -20),
    new THREE.Vector3(-10, 5, -10),
    new THREE.Vector3(-20, 10, 0),
    new THREE.Vector3(-10, 15, 10),
    new THREE.Vector3(0, 20, 20),
  ]);
}

const path = createCameraPath();

// Mouse position context for global access to mouse coordinates
interface MouseContextProps {
  mouseX: number;
  mouseY: number;
}

// Component that controls the camera position based on scroll offset and mouse position
function CameraController({
  scrollProgress,
  mousePosition,
}: {
  scrollProgress: number;
  mousePosition: MouseContextProps;
}) {
  const { camera } = useThree();
  const { mouseX, mouseY } = mousePosition;
  const targetPosition = new THREE.Vector3();
  const lookAtPosition = new THREE.Vector3();

  // Mouse influence factors
  const mouseInfluenceX = 0.05;
  const mouseInfluenceY = 0.03;

  useFrame(() => {
    // Get position on the curve according to scroll progress
    path.getPointAt(scrollProgress, targetPosition);

    // Add mouse influence (subtle parallax effect)
    targetPosition.x += (mouseX - 0.5) * mouseInfluenceX * 10;
    targetPosition.y += (mouseY - 0.5) * mouseInfluenceY * 5;

    // Get a point slightly ahead on the curve to look at
    const lookAtProgress = Math.min(scrollProgress + 0.1, 1);
    path.getPointAt(lookAtProgress, lookAtPosition);

    // Apply mouse influence to look-at target as well
    lookAtPosition.x += (mouseX - 0.5) * mouseInfluenceX * 15;
    lookAtPosition.y += (mouseY - 0.5) * mouseInfluenceY * 10;

    // Smoothly interpolate camera position
    camera.position.lerp(targetPosition, 0.05);

    // Make camera look at the target
    camera.lookAt(lookAtPosition);
  });

  return null;
}

// Visualize the path with points (useful for debugging)
function PathVisualization() {
  return (
    <>
      {Array.from({ length: 100 }).map((_, i) => {
        const point = new THREE.Vector3();
        path.getPointAt(i / 99, point);
        return (
          <mesh key={i} position={point}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial color="red" />
          </mesh>
        );
      })}
    </>
  );
}

// Interactive object that responds to mouse hover
function InteractiveObject({
  position,
  color = "white",
  mousePosition,
  hoverColor = "#00ff00",
  scale = 1,
}: {
  position: [number, number, number];
  color?: string;
  mousePosition: MouseContextProps;
  hoverColor?: string;
  scale?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (!meshRef.current) return;

    // Gentle floating animation
    meshRef.current.rotation.x += 0.001;
    meshRef.current.rotation.y += 0.002;

    // Scale based on hover state
    const targetScale = hovered ? scale * 1.2 : scale;
    meshRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.1
    );
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <icosahedronGeometry args={[1, 1]} />
      <meshStandardMaterial
        color={hovered ? hoverColor : color}
        metalness={0.5}
        roughness={0.2}
      />
    </mesh>
  );
}

// Section component for HTML content in 3D space
function Section({
  children,
  position,
  rotation = [0, 0, 0],
  mousePosition,
}: {
  children: React.ReactNode;
  position: [number, number, number];
  rotation?: [number, number, number];
  mousePosition: MouseContextProps;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { mouseX, mouseY } = mousePosition;

  useFrame(() => {
    if (!groupRef.current) return;

    // Add subtle rotation based on mouse position
    const targetRotationY = rotation[1] + (mouseX - 0.5) * 0.2;
    const targetRotationX = rotation[0] + (mouseY - 0.5) * 0.1;

    // Smooth interpolation
    groupRef.current.rotation.y +=
      (targetRotationY - groupRef.current.rotation.y) * 0.05;
    groupRef.current.rotation.x +=
      (targetRotationX - groupRef.current.rotation.x) * 0.05;
  });

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={[rotation[0], rotation[1], rotation[2]]}
    >
      <Html
        transform
        distanceFactor={10}
        position={[0, 0, 0]}
        style={{
          width: "30vw",
          height: "auto",
          transition: "all 0.5s",
        }}
      >
        <motion.div
          className="bg-white bg-opacity-90 backdrop-blur-sm p-6 rounded-xl shadow-xl"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {children}
        </motion.div>
      </Html>
    </group>
  );
}

// Set up the 3D environment
function SceneEnvironment() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} />
      <fog attach="fog" args={["#17025F", 40, 100]} />
    </>
  );
}

// Handle errors during rendering
function ErrorFallback() {
  return (
    <Html center>
      <div className="bg-red-600 text-white p-8 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-2">3D Rendering Error</h2>
        <p>
          We encountered an issue with the 3D scene. Please try refreshing your
          browser.
        </p>
      </div>
    </Html>
  );
}

interface Section {
  id: string;
  title: string;
  description?: string;
}

interface ScrollSceneProps {
  sections: Section[];
  children: React.ReactNode;
}

export function ScrollScene({ sections, children }: ScrollSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [windowDimensions, setWindowDimensions] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  // Track scroll progress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Use spring for smoother scroll progress
  const smoothProgress = useSpring(scrollYProgress, {
    damping: 15,
    stiffness: 30,
  });

  // Mouse position normalized from -1 to 1
  const normalizedMouseX = useTransform(
    () => (mousePosition.x / windowDimensions.width) * 2 - 1
  );

  const normalizedMouseY = useTransform(
    () => (mousePosition.y / windowDimensions.height) * 2 - 1
  );

  // Handle mouse move events
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Calculate section heights
  const sectionHeight = 100; // Each section is 100vh tall
  const totalHeight = sections.length * sectionHeight;

  return (
    <div
      ref={containerRef}
      style={{ height: `${totalHeight}vh` }}
      className="relative"
    >
      {/* Fixed 3D scene that responds to scroll */}
      <div className="fixed top-0 left-0 w-full h-screen z-10 pointer-events-none">
        <InteractiveScene
          scrollY={smoothProgress.get()}
          mouseX={normalizedMouseX.get()}
          mouseY={normalizedMouseY.get()}
        />
      </div>

      {/* Content sections that appear as we scroll */}
      <div className="relative z-20">
        {sections.map((section, index) => (
          <div
            key={section.id}
            id={section.id}
            className="min-h-screen flex items-center justify-center"
          >
            <motion.div
              className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: false, amount: 0.3 }}
            >
              {children}
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}
