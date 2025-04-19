"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

interface ParallaxBackgroundProps {
  imageUrl: string;
  overlayOpacity?: number;
  speed?: number;
  className?: string;
  children?: React.ReactNode;
}

const ParallaxBackground: React.FC<ParallaxBackgroundProps> = ({
  imageUrl,
  overlayOpacity = 0.3,
  speed = 0.2,
  className = "",
  children,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Create smoother parallax effect with spring physics
  const y = useSpring(
    useTransform(scrollYProgress, [0, 1], ["0%", `${speed * 100}%`]),
    { stiffness: 100, damping: 30, restDelta: 0.001 }
  );

  // Better image loading
  useEffect(() => {
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => setIsLoaded(true);
  }, [imageUrl]);

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      style={{ willChange: "transform" }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{
          opacity: isLoaded ? 1 : 0,
          scale: isLoaded ? 1 : 1.1,
          y,
        }}
        transition={{
          opacity: { duration: 0.8, ease: "easeOut" },
          scale: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
        }}
        style={{ y }}
        className="absolute inset-0 h-[110%] w-full"
      >
        <div
          className="h-full w-full bg-cover bg-center bg-no-repeat transform"
          style={{
            backgroundImage: `url(${imageUrl})`,
            willChange: "transform",
          }}
        />
      </motion.div>

      {/* Improved overlay with slight gradient */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50"
        style={{ opacity: overlayOpacity }}
      />

      {/* Content container */}
      <div className="relative z-10 h-full w-full">{children}</div>
    </div>
  );
};

export default ParallaxBackground;
