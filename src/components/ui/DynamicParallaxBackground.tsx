'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// Maximum number of parallax layers we support
const MAX_PARALLAX_LAYERS = 5;

// Create transform functions outside component
function createLayerTransforms(scrollYProgress: any, index: number, speed: number) {
  return {
    y: useTransform(
      scrollYProgress, 
      [0, 1], 
      [0, speed * 100]
    ),
    scale: useTransform(
      scrollYProgress,
      [0, 0.5, 1],
      [1 + (index * 0.05), 1 + (index * 0.08), 1 + (index * 0.05)]
    ),
    opacity: useTransform(
      scrollYProgress,
      [0, 0.5, 1],
      [1, 0.95 - (index * 0.05), 0.9 - (index * 0.1)]
    ),
    blurValue: index > 0 ? `blur(${index * 1.5}px)` : 'none'
  };
}

interface DynamicParallaxBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  colorFrom?: string;
  colorTo?: string;
  animationDuration?: number;
  overlayOpacity?: number;
  parallaxImages?: {
    url: string;
    speed: number;
  }[];
  heightClass?: string;
}

export default function DynamicParallaxBackground({
  children,
  className = '',
  colorFrom = '#134e4a',
  colorTo = '#065f46',
  animationDuration = 15,
  overlayOpacity = 0.6,
  parallaxImages = [],
  heightClass = 'h-[80vh]'
}: DynamicParallaxBackgroundProps) {
  // Dynamic pattern size
  const [width, setWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // For parallax effect
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Content transform effects
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.6]);
  
  // Pre-calculate transforms for the maximum number of layers we support
  const layerTransforms = Array.from({ length: MAX_PARALLAX_LAYERS }).map((_, index) => {
    const speed = parallaxImages[index]?.speed || 0.2 + (index * 0.1);
    return createLayerTransforms(scrollYProgress, index, speed);
  });

  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setWidth(containerRef.current.offsetWidth);
        setContainerHeight(containerRef.current.offsetHeight);
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden ${className} ${heightClass}`}
    >
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            `linear-gradient(135deg, ${colorFrom} 0%, ${colorTo} 100%)`,
            `linear-gradient(225deg, ${colorFrom} 0%, ${colorTo} 100%)`,
            `linear-gradient(315deg, ${colorFrom} 0%, ${colorTo} 100%)`,
            `linear-gradient(45deg, ${colorFrom} 0%, ${colorTo} 100%)`
          ]
        }}
        transition={{
          duration: animationDuration,
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear"
        }}
      />

      {/* Parallax Images - only render the images we actually have */}
      {parallaxImages.slice(0, MAX_PARALLAX_LAYERS).map((image, index) => {
        // Use the pre-calculated transforms
        const transforms = layerTransforms[index];
        
        return (
          <motion.div
            key={index}
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${image.url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              y: transforms.y,
              scale: transforms.scale,
              opacity: transforms.opacity,
              filter: transforms.blurValue,
              height: '120%', // Slightly larger to prevent edge visibility during parallax
              width: '100%',
              zIndex: 10 - index,
            }}
          />
        );
      })}

      {/* Animated patterns */}
      <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path 
              d="M 20 0 L 0 0 0 20" 
              fill="none" 
              stroke="white" 
              strokeWidth="0.5"
            />
          </pattern>
          <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
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
            cy: ["30%", "35%", "30%"]
          }}
          transition={{ 
            duration: animationDuration * 0.6, 
            repeat: Infinity, 
            repeatType: "reverse" 
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
            cy: ["60%", "65%", "60%"]
          }}
          transition={{ 
            duration: animationDuration * 0.8, 
            repeat: Infinity, 
            repeatType: "reverse",
            delay: 2
          }}
        />
      </svg>

      {/* Additional overlay */}
      <div 
        className="absolute inset-0 bg-black z-20"
        style={{ opacity: overlayOpacity }}
      />

      {/* Content */}
      <motion.div 
        className="relative z-30 h-full flex items-center justify-center"
        style={{
          y: contentY,
          opacity: contentOpacity
        }}
      >
        {children}
      </motion.div>
    </div>
  );
} 