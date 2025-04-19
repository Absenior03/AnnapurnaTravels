import React, { Suspense, useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
  Text,
  Html,
  Float,
} from "@react-three/drei";
import * as THREE from "three";
import { ScrollProvider, useScroll } from "@/context/ScrollContext";
import Mountain from "./Mountain";
import Cloud from "./Cloud";
import Terrain from "./Terrain";
import Sky from "./Sky";

// Loading fallback component
const Loader = () => (
  <Html center>
    <div className="flex flex-col items-center justify-center">
      <div className="w-16 h-16 border-4 border-t-emerald-500 border-b-emerald-700 border-r-transparent border-l-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-white text-sm font-medium">Loading 3D scene...</p>
    </div>
  </Html>
);

// Error boundary fallback
const ErrorFallback = () => (
  <Html center>
    <div className="bg-red-600 text-white p-6 rounded-lg max-w-sm">
      <h3 className="text-xl font-bold mb-2">3D Rendering Error</h3>
      <p>
        We encountered an issue rendering the 3D scene. Please try refreshing
        your browser.
      </p>
    </div>
  </Html>
);

// Main scene content
const SceneContent = ({ mountainCount = 5, cloudCount = 7 }) => {
  const { scrollYProgress, mouseX, mouseY } = useScroll();

  // Create mountain positions
  const mountainPositions = useRef<[number, number, number][]>([]);

  // Initialize mountain positions if not already set
  if (mountainPositions.current.length === 0) {
    for (let i = 0; i < mountainCount; i++) {
      // Distribute mountains in a semicircle in the background
      const angle = (Math.PI / (mountainCount - 1)) * i;
      const distance = 15 + Math.random() * 10; // Vary the distance
      const x = Math.sin(angle) * distance;
      const z = -Math.cos(angle) * distance - 5; // Push back
      const y = -2 - Math.random() * 1; // Vary height slightly

      mountainPositions.current.push([x, y, z]);
    }
  }

  // Create cloud positions
  const cloudPositions = useRef<[number, number, number][]>([]);

  // Initialize cloud positions if not already set
  if (cloudPositions.current.length === 0) {
    for (let i = 0; i < cloudCount; i++) {
      // Randomly distribute clouds
      const x = Math.random() * 40 - 20;
      const y = 5 + Math.random() * 10;
      const z = -10 - Math.random() * 20;

      cloudPositions.current.push([x, y, z]);
    }
  }

  return (
    <>
      {/* Camera setup */}
      <PerspectiveCamera
        makeDefault
        position={[0, 2, 10]}
        fov={60}
        near={0.1}
        far={1000}
      />

      {/* User controls - limited to make it more natural */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 2.2}
        rotateSpeed={0.1}
        maxAzimuthAngle={Math.PI / 8}
        minAzimuthAngle={-Math.PI / 8}
      />

      {/* Sky with day/night cycle */}
      <Sky scrollEffect={true} />

      {/* Terrain */}
      <Terrain
        position={[0, -5, 0]}
        width={100}
        height={100}
        scrollMultiplier={0.3}
      />

      {/* Mountains */}
      {mountainPositions.current.map((position, index) => (
        <Mountain
          key={`mountain-${index}`}
          position={position}
          color={`hsl(155, ${20 + index * 5}%, ${15 + index * 3}%)`}
          size={6 + Math.random() * 4}
          scrollMultiplier={1 + index * 0.2}
          detail={12}
        />
      ))}

      {/* Clouds */}
      {cloudPositions.current.map((position, index) => (
        <Cloud
          key={`cloud-${index}`}
          position={position}
          scale={[
            1 + Math.random(),
            1 + Math.random() * 0.5,
            1 + Math.random(),
          ]}
          speed={0.05 + Math.random() * 0.1}
          opacity={0.6 + Math.random() * 0.3}
        />
      ))}

      {/* Floating title */}
      <Float
        speed={1.5}
        rotationIntensity={0.2}
        floatIntensity={0.5}
        position={[0, 3, 0]}
      >
        <Text
          font="/fonts/Inter-Bold.woff"
          fontSize={1.5}
          position={[0, 0, 0]}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          material-toneMapped={false}
          castShadow
        >
          South Asia Adventures
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.5}
          />
        </Text>
      </Float>
    </>
  );
};

interface Scene3DProps {
  className?: string;
}

const Scene3D: React.FC<Scene3DProps> = ({ className = "" }) => {
  const [hasError, setHasError] = useState(false);

  const handleError = (error: Error) => {
    console.error("Three.js rendering error:", error);
    setHasError(true);
  };

  return (
    <div className={`w-full h-screen ${className}`}>
      <ScrollProvider>
        <Canvas
          shadows
          dpr={[1, 2]} // Limit pixel ratio for better performance
          gl={{
            antialias: false, // Disable for performance
            powerPreference: "high-performance",
            alpha: false,
          }}
          onError={handleError}
        >
          {hasError ? (
            <ErrorFallback />
          ) : (
            <Suspense fallback={<Loader />}>
              <SceneContent />
            </Suspense>
          )}
        </Canvas>
      </ScrollProvider>
    </div>
  );
};

export default Scene3D;
