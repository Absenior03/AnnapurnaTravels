"use client";

import React, { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ParallaxBackgroundProps {
  imageUrl: string;
  children?: React.ReactNode;
  overlayOpacity?: number;
  speed?: number;
  className?: string;
}

export default function ParallaxBackground({
  imageUrl,
  children,
  overlayOpacity = 0.5,
  speed = 0.4,
  className = "",
}: ParallaxBackgroundProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", `${speed * 150}%`]);

  // Calculate the overlay background color with the specified opacity
  const overlayBg = `rgba(0, 0, 0, ${overlayOpacity})`;

  return (
    <div ref={ref} className={`parallax-container ${className}`}>
      <motion.div
        className="parallax-layer"
        style={{
          y,
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "120%",
          width: "100%",
          scale: 1.1,
        }}
      />
      <div
        className="absolute inset-0"
        style={{ backgroundColor: overlayBg }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
