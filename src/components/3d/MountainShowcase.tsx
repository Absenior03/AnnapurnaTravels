"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import { SceneWrapper } from "./SceneWrapper";
import { Mountain } from "./Mountain";
import { Cloud } from "./Cloud";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { FiMapPin, FiArrowRight } from "react-icons/fi";

interface MountainShowcaseProps {
  className?: string;
}

export function MountainShowcase({ className = "" }: MountainShowcaseProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);
  const [activeMountain, setActiveMountain] = useState(0);

  // South Asian mountain destinations
  const destinations = [
    {
      name: "Everest Region",
      location: "Nepal",
      description: "Home to the world's tallest peak, the majestic Mt. Everest",
      color: "#3b82f6",
    },
    {
      name: "Annapurna Circuit",
      location: "Nepal",
      description:
        "One of the most diverse and spectacular trekking routes in the world",
      color: "#8b5cf6",
    },
    {
      name: "Karakoram Range",
      location: "Pakistan",
      description: "Home to K2, the second-highest mountain on Earth",
      color: "#10b981",
    },
  ];

  // Handle mouse movement for parallax effect
  useEffect(() => {
    setIsClient(true);

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      setMousePosition({ x, y });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
    }

    // Auto-rotation for the featured mountains
    const interval = setInterval(() => {
      setActiveMountain((prev) => (prev + 1) % destinations.length);
    }, 8000);

    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
      }
      clearInterval(interval);
    };
  }, [destinations.length]);

  // Don't render anything on server-side
  if (!isClient) {
    return (
      <div
        className={`relative min-h-[80vh] flex items-center justify-center bg-gradient-to-b from-indigo-900 to-gray-900 ${className}`}
      >
        <div className="w-12 h-12 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative min-h-[80vh] ${className} overflow-hidden`}
    >
      <SceneWrapper
        className="min-h-[80vh]"
        background="#070B34"
        cameraPosition={[0, 2, 12]}
        controls={true}
        enableZoom={false}
        environment="night"
      >
        <hemisphereLight args={["#8cb2ff", "#070B34", 0.7]} />
        <ambientLight intensity={0.1} />
        <directionalLight
          position={[5, 8, 10]}
          intensity={0.7}
          castShadow
          color="#fff"
        />

        {/* Featured mountains - positioned for a layered look */}
        <Suspense fallback={null}>
          <Mountain
            position={[0, -3, 0]}
            scrollMultiplier={0.6}
            color={destinations[activeMountain].color}
            wireframe={false}
            size={[11, 6, 11]}
            detail={80}
            mouseX={mousePosition.x}
            mouseY={mousePosition.y}
          />
          <Mountain
            position={[-8, -4, -5]}
            scrollMultiplier={0.3}
            color="#1F2A40"
            wireframe={false}
            size={[8, 4, 8]}
            detail={48}
            mouseX={mousePosition.x}
            mouseY={mousePosition.y}
          />
          <Mountain
            position={[7, -5, -8]}
            scrollMultiplier={0.2}
            color="#12172F"
            wireframe={false}
            size={[9, 5, 9]}
            detail={32}
            mouseX={mousePosition.x}
            mouseY={mousePosition.y}
          />

          {/* Add clouds for atmosphere */}
          <Cloud
            position={[-3, 2, -2]}
            scale={2.5}
            opacity={0.8}
            scrollMultiplier={0.7}
            speed={0.02}
            noiseScale={0.6}
            segments={6}
          />
          <Cloud
            position={[4, 3, -4]}
            scale={2}
            opacity={0.6}
            scrollMultiplier={0.4}
            speed={0.015}
            noiseScale={0.4}
            segments={5}
          />
          <Cloud
            position={[0, 4, -6]}
            scale={3}
            opacity={0.5}
            scrollMultiplier={0.2}
            speed={0.01}
            noiseScale={0.5}
            segments={7}
          />
        </Suspense>
      </SceneWrapper>

      {/* Gradient overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-900 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 1 }}
      />

      {/* Content overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto bg-black/30 backdrop-blur-sm p-8 rounded-xl pointer-events-auto">
            <motion.div
              key={activeMountain}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center mb-3">
                <FiMapPin className="text-pink-500 mr-2" />
                <span className="text-pink-400 text-sm font-medium">
                  {destinations[activeMountain].location}
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">
                {destinations[activeMountain].name}
              </h2>

              <p className="text-gray-200 text-lg mb-6">
                {destinations[activeMountain].description}
              </p>

              <Button
                href={`/tours?region=${encodeURIComponent(
                  destinations[activeMountain].name
                )}`}
                variant="primary"
                rounded
                animate
                icon={<FiArrowRight />}
                iconPosition="right"
              >
                Explore Tours
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mountain selection indicators */}
      <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-3">
        {destinations.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveMountain(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === activeMountain
                ? "bg-white w-10"
                : "bg-gray-400/50 hover:bg-gray-300/70"
            }`}
            aria-label={`View ${destinations[index].name}`}
          />
        ))}
      </div>
    </div>
  );
}

export default MountainShowcase;
