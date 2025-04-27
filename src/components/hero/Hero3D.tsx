"use client";

import React, { useRef, useEffect, useState, Suspense, useMemo, useCallback } from "react";
import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import { useSpring, animated, config } from "@react-spring/three";
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
  MeshDistortMaterial,
  Float,
  Sparkles,
  Text,
  useGLTF,
  Stats,
} from "@react-three/drei";
import * as THREE from "three";

// Create shared geometry instances to reuse across components
const createSharedGeometries = () => {
  const coneGeo = new THREE.ConeGeometry(1.5, 2, 4, 1);
  const sphereGeo = new THREE.SphereGeometry(1, 8, 8);
  
  // Enable dispose reference counting to automatically dispose when not used
  coneGeo.userData.isShared = true;
  sphereGeo.userData.isShared = true;
  
  return { coneGeo, sphereGeo };
};

// Create a performance monitor component
const PerformanceMonitor = () => {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    // Show stats only in development environment
    if (process.env.NODE_ENV === 'development') {
      setVisible(true);
    }
    
    // Create a key listener to toggle stats with 'p' key
    const handleKeyDown = (e) => {
      if (e.key === 'p') {
        setVisible(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  return visible ? <Stats showPanel={0} className="stats" /> : null;
};

// Cache materials to avoid recreating them
const materials: {
  mountain: Record<string, THREE.Material> | null;
  cloud: THREE.Material | null;
  sun: THREE.Material | null;
  moon: THREE.Material | null;
} = {
  mountain: {},
  cloud: null,
  sun: null,
  moon: null,
};

// Ground component with shared material
const groundMaterials: {
  day: THREE.Material | null;
  night: THREE.Material | null;
} = {
  day: null,
  night: null
};

// Export Mountain component for reuse in ScrollScene
export function Mountain({
  position,
  color,
  scale = 1,
  index = 0,
  sharedGeometry,
}: {
  position: [number, number, number];
  color: string;
  scale?: number;
  index?: number;
  sharedGeometry?: THREE.ConeGeometry;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const { clock } = useThree();
  
  // Create a reusable material if not already created for this color
  const material = useMemo(() => {
    // Use existing material for the color if available
    if (materials.mountain && materials.mountain[color]) {
      return materials.mountain[color];
    }
    
    // Create new material for this color
    const newMaterial = new THREE.MeshStandardMaterial({ 
      color, 
      roughness: 0.7, 
      metalness: 0.1 
    });
    
    // Store for reuse
    if (materials.mountain) {
      materials.mountain[color] = newMaterial;
    }
    
    return newMaterial;
  }, [color]);

  // Optimize animation with less frequent calculations by using step value
  useFrame((state) => {
    if (!ref.current) return;
    
    // Only update animation every other frame
    if (state.clock.elapsedTime % 0.2 < 0.1) return;
    
    const t = clock.getElapsedTime() * 0.1 + index * 0.2;
    ref.current.position.y = position[1] + Math.sin(t) * 0.1;
    ref.current.rotation.z = Math.sin(t * 0.3) * 0.05;
  });
  
  // Use the shared geometry for better memory performance
  return (
    <mesh 
      ref={ref} 
      position={position} 
      scale={[scale, scale, scale]}
      material={material}
      geometry={sharedGeometry}
    />
  );
}

// Cloud component
function Cloud({ 
  position, 
  sharedGeometry 
}: { 
  position: [number, number, number];
  sharedGeometry?: THREE.SphereGeometry;
}) {
  // Create reusable cloud material if not already created
  const material = useMemo(() => {
    if (materials.cloud) {
      return materials.cloud;
    }
    
    const newMaterial = new THREE.MeshStandardMaterial({ 
      color: "white", 
      transparent: true, 
      opacity: 0.8 
    });
    
    materials.cloud = newMaterial;
    return newMaterial;
  }, []);
  
  return (
    <Float
      speed={1}
      rotationIntensity={0.1}
      floatIntensity={0.3}
      position={position}
    >
      <mesh 
        geometry={sharedGeometry}
        material={material}
      />
    </Float>
  );
}

// Sun/Moon component
function SunMoon({ 
  isNight,
  sharedGeometry
}: { 
  isNight: boolean;
  sharedGeometry?: THREE.SphereGeometry;
}) {
  // Reuse sunlight material
  const sunMaterial = useMemo(() => {
    if (materials.sun) {
      return materials.sun;
    }
    
    const newMaterial = new THREE.MeshStandardMaterial({
      color: "#FDB813",
      emissive: "#FDB813",
      emissiveIntensity: 1
    });
    
    materials.sun = newMaterial;
    return newMaterial;
  }, []);
  
  // Reuse moonlight material
  const moonMaterial = useMemo(() => {
    if (materials.moon) {
      return materials.moon;
    }
    
    const newMaterial = new THREE.MeshStandardMaterial({
      color: "#e1e1e1",
      emissive: "#e1e1e1",
      emissiveIntensity: 1
    });
    
    materials.moon = newMaterial;
    return newMaterial;
  }, []);

  const props = useSpring({
    position: isNight
      ? ([8, 8, -10] as [number, number, number])
      : ([8, 20, -20] as [number, number, number]),
    scale: isNight ? 2 : 3,
    config: config.molasses,
  });

  return (
    <animated.mesh 
      position={props.position} 
      scale={props.scale}
      geometry={sharedGeometry}
      material={isNight ? moonMaterial : sunMaterial}
    />
  );
}

function Ground({ isNight }: { isNight: boolean }) {
  // Reuse materials based on time of day
  const material = useMemo(() => {
    if (isNight) {
      if (groundMaterials.night) {
        return groundMaterials.night;
      }
      
      const newMaterial = new THREE.MeshStandardMaterial({ color: "#0a2236" });
      groundMaterials.night = newMaterial;
      return newMaterial;
    } else {
      if (groundMaterials.day) {
        return groundMaterials.day;
      }
      
      const newMaterial = new THREE.MeshStandardMaterial({ color: "#a8dadc" });
      groundMaterials.day = newMaterial;
      return newMaterial;
    }
  }, [isNight]);

  return (
    <mesh 
      rotation={[-Math.PI / 2, 0, 0]} 
      position={[0, -2, 0]} 
      receiveShadow
      material={material}
    >
      <planeGeometry args={[50, 50]} />
    </mesh>
  );
}

// Main scene component with mouse movement
function Scene() {
  const [isNight, setIsNight] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const groupRef = useRef<THREE.Group>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const { gl } = useThree();
  
  // Create shared geometries for memory efficiency
  const sharedGeometries = useMemo(() => createSharedGeometries(), []);

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Convert mouse position to normalized coordinates (-1 to 1)
      mouseRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Apply mouse movement to scene with throttling for better performance
  useFrame(() => {
    if (!groupRef.current) return;

    // Smooth follow of mouse with fewer calculations
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      mouseRef.current.x * 0.1,
      0.02 // Reduced lerp factor for better performance
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      mouseRef.current.y * 0.05,
      0.02
    );
  });

  // Change between day and night every 10 seconds
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setIsNight((prev) => !prev);
    }, 10000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);
  
  // Clean up WebGL resources on unmount
  useEffect(() => {
    return () => {
      // Dispose of shared geometries
      if (sharedGeometries.coneGeo) {
        sharedGeometries.coneGeo.dispose();
      }
      if (sharedGeometries.sphereGeo) {
        sharedGeometries.sphereGeo.dispose();
      }
      
      // Dispose of materials
      if (materials.mountain) {
        Object.values(materials.mountain).forEach(material => {
          if (material && 'dispose' in material) {
            material.dispose();
          }
        });
      }
      
      if (materials.cloud && 'dispose' in materials.cloud) {
        materials.cloud.dispose();
      }
      
      if (materials.sun && 'dispose' in materials.sun) {
        materials.sun.dispose();
      }
      
      if (materials.moon && 'dispose' in materials.moon) {
        materials.moon.dispose();
      }
      
      // Force garbage collection
      gl.renderLists.dispose();
    };
  }, [gl, sharedGeometries]);

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

  // Extract string color values from spring objects
  const skyColor = skyProps.color.to(val => val);
  const lightColor = lightProps.color.to(val => val);

  return (
    <>
      {/* Background color that changes with day/night */}
      <color attach="background" args={[skyColor.get()]} />

      {/* Lighting */}
      <animated.ambientLight
        intensity={lightProps.intensity}
        color={lightColor.get()}
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

      {/* Use lower quality environment for better performance */}
      <Environment preset={isNight ? "night" : "sunset"} blur={1} />

      {/* Sun/Moon */}
      <SunMoon isNight={isNight} sharedGeometry={sharedGeometries.sphereGeo} />

      {/* Group that responds to mouse movement */}
      <group ref={groupRef}>
        {/* Mountains - reduced quantity for better performance with shared geometry */}
        <Mountain
          position={[-4, -2, -6]}
          color="#4ca58f"
          scale={1.8}
          index={0}
          sharedGeometry={sharedGeometries.coneGeo}
        />
        <Mountain
          position={[-1, -2, -4]}
          color="#2d6a4f"
          scale={2.2}
          index={1}
          sharedGeometry={sharedGeometries.coneGeo}
        />
        <Mountain
          position={[3, -2, -5]}
          color="#1b4332"
          scale={1.6}
          index={2}
          sharedGeometry={sharedGeometries.coneGeo}
        />
        <Mountain
          position={[6, -2, -7]}
          color="#081c15"
          scale={2.0}
          index={3}
          sharedGeometry={sharedGeometries.coneGeo}
        />

        {/* Reduced number of clouds with shared geometry */}
        <Cloud position={[-6, 4, -8]} sharedGeometry={sharedGeometries.sphereGeo} />
        <Cloud position={[2, 6, -12]} sharedGeometry={sharedGeometries.sphereGeo} />

        {/* 3D Title - using Float for lightweight animation */}
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
          >
            Discover Extraordinary Adventures
          </Text>
        </Float>
      </group>

      {/* Stars - only visible at night with reduced count for performance */}
      {isNight && (
        <Sparkles
          count={50} // Reduced from higher values
          scale={20}
          size={2}
          speed={0.2}
          opacity={0.8}
        />
      )}

      {/* Ground with reused material */}
      <Ground isNight={isNight} />
      
      {/* Performance monitoring - only in dev mode */}
      <PerformanceMonitor />
    </>
  );
}

export default function Hero3D() {
  // Error state
  const [hasError, setHasError] = useState(false);
  const [lowPerfMode, setLowPerfMode] = useState(false);
  
  useEffect(() => {
    // Check if device is low-powered (like mobile)
    const checkPerformance = () => {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const hasLowMemory = 'memory' in navigator && (navigator as any).deviceMemory < 4;
      const hasLowCores = 'hardwareConcurrency' in navigator && navigator.hardwareConcurrency < 4;
      
      setLowPerfMode(isMobile || hasLowMemory || hasLowCores);
    };
    
    checkPerformance();
  }, []);

  // Handle errors in the Canvas with proper typing
  const handleError = useCallback((error: any) => {
    console.error("Three.js rendering error:", error);
    setHasError(true);
  }, []);

  // Use try-catch to handle errors during component rendering
  try {
    return (
      <div className="w-full h-[95vh] relative">
        {hasError || lowPerfMode ? (
          // Fallback UI if Canvas fails to render or device is low-powered
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
              shadows={false} // Disable shadows for better performance
              dpr={[0.8, 1.5]} // Limit pixel ratio for better performance
              gl={{
                antialias: false, // Disable antialias for performance
                powerPreference: "high-performance",
                alpha: false,
                precision: "lowp", // Lower precision for better performance
                depth: true,
                stencil: false, // Disable stencil buffer if not needed
              }}
              onError={handleError}
              frameloop="demand" // Only render when needed
              performance={{ min: 0.5 }} // Allow quality reduction for performance
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
