'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

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

  // Calculate the overlay background color with the specified opacity
  const overlayBg = `rgba(0, 0, 0, ${overlayOpacity})`;

  return (
    <div ref={ref} className={`relative ${height} overflow-hidden`}>
      {images.map((image, index) => {
        // Create different parallax effects for each layer
        const y = useTransform(
          scrollYProgress, 
          [0, 1], 
          [0, image.speed * 100]
        );
        
        // Add subtle scale and opacity effects based on scroll
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
        
        // Apply blur based on layer depth
        const blurValue = index > 0 ? `blur(${index * 1.5}px)` : 'none';
        
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
          opacity: useTransform(scrollYProgress, [0, 0.5], [1, 0.8])
        }}
      />
      
      {/* Content with subtle float effect */}
      <motion.div 
        className="relative z-30 h-full flex items-center justify-center"
        style={{
          y: useTransform(scrollYProgress, [0, 1], [0, 50]),
          opacity: useTransform(scrollYProgress, [0, 0.8], [1, 0.6])
        }}
      >
        {children}
      </motion.div>
    </div>
  );
} 