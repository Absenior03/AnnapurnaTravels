"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ParallaxBackgroundProps {
  imageUrl: string;
  children?: React.ReactNode;
  overlayOpacity?: number;
  className?: string;
  speed?: number;
}

export default function ParallaxBackground({
  imageUrl,
  children,
  overlayOpacity = 0.3,
  className = "",
  speed = 0.15,
}: ParallaxBackgroundProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [elementTop, setElementTop] = useState(0);
  const [clientHeight, setClientHeight] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Get scroll progress and viewport height for parallax calculation
  const { scrollY } = useScroll();

  // Update element position when mounted/resized
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const updatePosition = () => {
      const rect = element.getBoundingClientRect();
      setElementTop(rect.top + window.scrollY);
      setClientHeight(window.innerHeight);
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);

    // Pre-load the image
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => setImageLoaded(true);

    return () => window.removeEventListener("resize", updatePosition);
  }, [imageUrl]);

  // Calculate parallax transform value
  const transformY = useTransform(
    scrollY,
    [elementTop - clientHeight, elementTop + clientHeight],
    [`${-speed * 100}%`, `${speed * 100}%`]
  );

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      style={{ willChange: "transform" }}
    >
      {/* Background image with parallax effect */}
      <motion.div
        style={{ y: transformY }}
        className="absolute inset-0 z-0 h-[120%] top-[-10%]"
      >
        <div
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat h-full w-full transition-opacity duration-500 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: `url('${imageUrl}')` }}
        />

        {/* Loading placeholder */}
        <div
          className={`absolute inset-0 bg-gray-300 animate-pulse transition-opacity duration-500 ${
            imageLoaded ? "opacity-0" : "opacity-100"
          }`}
        />
      </motion.div>

      {/* Optional overlay */}
      <div
        className="absolute inset-0 bg-black z-10"
        style={{ opacity: overlayOpacity }}
      />

      {/* Content */}
      <div className="relative z-20 h-full">{children}</div>
    </div>
  );
}
