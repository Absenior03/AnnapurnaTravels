"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

interface ParallaxBackgroundProps {
  imageUrl: string;
  children: React.ReactNode;
  overlayOpacity?: number;
  className?: string;
  speed?: number;
  fallbackColor?: string;
}

export default function ParallaxBackground({
  imageUrl,
  children,
  overlayOpacity = 0.4,
  className = "",
  speed = 0.1,
  fallbackColor = "from-emerald-800 to-emerald-600",
}: ParallaxBackgroundProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Parallax effect
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, speed * 400]);

  // Preload image
  useEffect(() => {
    if (!imageUrl) return;

    const img = new Image();
    img.src = imageUrl;
    img.onload = () => setImageLoaded(true);

    return () => {
      img.onload = null;
    };
  }, [imageUrl]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {/* Render image with parallax effect if loaded */}
      {imageLoaded && imageUrl ? (
        <motion.div
          className="absolute inset-0 w-full h-full"
          style={{ y, scale: 1.1 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Image
            src={imageUrl}
            alt="Background"
            fill
            quality={85}
            priority
            sizes="100vw"
            className="object-cover"
          />
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black"
            style={{ opacity: overlayOpacity }}
          />
        </motion.div>
      ) : (
        // Fallback gradient background
        <div className={`absolute inset-0 bg-gradient-to-b ${fallbackColor}`} />
      )}

      {/* Content */}
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
}
