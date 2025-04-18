'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// Helper function to create layer transforms outside the component render function
function createLayerTransforms(scrollYProgress: any, index: number, speed: number) {
  const y = useTransform(
    scrollYProgress, 
    [0, 1], 
    [0, speed * 100]
  );
  
  const scale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [1 + (index * 0.05), 1 + (index * 0.08), 1 + (index * 0.05)]
  );
  
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [1, 0.95 - (index * 0.05), 0.9 - (index * 0.1)]
  );
  
  return { y, scale, opacity, blurValue: index > 0 ? `blur(${index * 1.5}px)` : 'none' };
}

interface ParallaxHeroProps {
  images: {
    url: string;
    speed: number;
  }[];
  height?: string;
  children?: React.ReactNode;
  overlayOpacity?: number;
}

export default function ParallaxHero({
  images,
  height = 'h-[80vh]',
  children,
  overlayOpacity = 0.5,
}: ParallaxHeroProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  // Pre-calculate all layer transforms
  const layerTransforms = images.map((image, index) => 
    createLayerTransforms(scrollYProgress, index, image.speed)
  );

  // Content effects
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.6]);
  const overlayOpacityTransform = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  // Calculate the overlay background color with the specified opacity
  const overlayBg = `rgba(0, 0, 0, ${overlayOpacity})`;

  return (
    <div ref={ref} className={`relative ${height} overflow-hidden`}>
      {images.map((image, index) => {
        // Use pre-calculated transforms
        const { y, scale, opacity, blurValue } = layerTransforms[index];
        
        return (
          <motion.div
            key={index}
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${image.url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              y,
              scale,
              opacity,
              filter: blurValue,
              height: '120%', // Slightly larger to prevent edge visibility during parallax
              width: '100%',
              zIndex: 10 - index,
            }}
          />
        );
      })}
      
      {/* Overlay with fade effect */}
      <motion.div
        className="absolute inset-0 z-20"
        style={{ 
          backgroundColor: overlayBg,
          opacity: overlayOpacityTransform
        }}
      />
      
      {/* Content with subtle float effect */}
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