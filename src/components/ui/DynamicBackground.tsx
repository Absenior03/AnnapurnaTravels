"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface DynamicBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  colorFrom?: string;
  colorTo?: string;
  animationDuration?: number;
  overlayOpacity?: number;
}

export default function DynamicBackground({
  children,
  className = "",
  colorFrom = "#134e4a",
  colorTo = "#065f46",
  animationDuration = 15,
  overlayOpacity = 0.6,
}: DynamicBackgroundProps) {
  // Dynamic pattern size
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setWidth(containerRef.current.offsetWidth);
        setHeight(containerRef.current.offsetHeight);
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            `linear-gradient(135deg, ${colorFrom} 0%, ${colorTo} 100%)`,
            `linear-gradient(225deg, ${colorFrom} 0%, ${colorTo} 100%)`,
            `linear-gradient(315deg, ${colorFrom} 0%, ${colorTo} 100%)`,
            `linear-gradient(45deg, ${colorFrom} 0%, ${colorTo} 100%)`,
          ],
        }}
        transition={{
          duration: animationDuration,
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear",
        }}
      />

      {/* Animated patterns */}
      <svg
        className="absolute inset-0 w-full h-full opacity-10"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="smallGrid"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke="white"
              strokeWidth="0.5"
            />
          </pattern>
          <pattern
            id="grid"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            <rect width="80" height="80" fill="url(#smallGrid)" />
            <path
              d="M 80 0 L 0 0 0 80"
              fill="none"
              stroke="white"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Animated circles */}
        <motion.circle
          cx="20%"
          cy="30%"
          r={width * 0.2}
          fill="white"
          animate={{
            opacity: [0.05, 0.08, 0.05],
            cx: ["20%", "25%", "20%"],
            cy: ["30%", "35%", "30%"],
          }}
          transition={{
            duration: animationDuration * 0.6,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.circle
          cx="70%"
          cy="60%"
          r={width * 0.15}
          fill="white"
          animate={{
            opacity: [0.07, 0.03, 0.07],
            cx: ["70%", "65%", "70%"],
            cy: ["60%", "65%", "60%"],
          }}
          transition={{
            duration: animationDuration * 0.8,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 2,
          }}
        />
      </svg>

      {/* Additional overlay */}
      <div
        className="absolute inset-0 bg-black"
        style={{ opacity: overlayOpacity }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
