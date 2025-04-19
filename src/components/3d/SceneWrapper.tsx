"use client";

import React, { ReactNode, Suspense, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  PerspectiveCamera,
} from "@react-three/drei";
import { motion } from "framer-motion";

interface SceneWrapperProps {
  children: ReactNode;
  cameraPosition?: [number, number, number];
  controls?: boolean;
  enableZoom?: boolean;
  environment?: boolean | string;
  className?: string;
  background?: string | boolean;
  fov?: number;
  height?: string;
}

const CameraSetup = ({
  position = [0, 2, 6],
  fov = 45,
}: {
  position?: [number, number, number];
  fov?: number;
}) => {
  const { camera } = useThree();
  return <PerspectiveCamera makeDefault position={position} fov={fov} />;
};

function SceneWrapper({
  children,
  cameraPosition = [0, 2, 5],
  controls = true,
  enableZoom = false,
  environment = "sunset",
  className = "h-[500px]",
  background = "#080b14",
  fov = 45,
  height,
}: SceneWrapperProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`w-full ${className}`}
      style={{ height: height || undefined }}
    >
      <Canvas
        ref={canvasRef}
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <color
          attach="background"
          args={[typeof background === "string" ? background : "#080b14"]}
        />
        <fog
          attach="fog"
          args={[
            typeof background === "string" ? background : "#080b14",
            5,
            25,
          ]}
        />

        <CameraSetup position={cameraPosition} fov={fov} />

        <ambientLight intensity={0.2} />
        <directionalLight
          position={[5, 8, 5]}
          intensity={0.5}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        <Suspense fallback={null}>
          {environment && (
            <Environment
              preset={
                typeof environment === "string"
                  ? (environment as any)
                  : "sunset"
              }
            />
          )}
          {children}
        </Suspense>

        {controls && (
          <OrbitControls
            enableZoom={enableZoom}
            enablePan={false}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2}
            rotateSpeed={0.5}
          />
        )}
      </Canvas>
    </motion.div>
  );
}

export default SceneWrapper;
