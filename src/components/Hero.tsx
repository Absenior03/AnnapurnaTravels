"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import { Button } from "../components/ui/Button";
import { FiChevronDown } from "react-icons/fi";
import SectionHeading from "../components/ui/SectionHeading";

interface HeroProps {
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  tag?: string;
}

const Hero: React.FC<HeroProps> = ({
  title = "Adventure Through South Asia",
  subtitle = "Discover breathtaking landscapes, ancient cultures, and unforgettable experiences",
  imageUrl = "/images/hero-bg.jpg",
  tag = "Explore Now"
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const heroInView = useInView(ref, { amount: 0.3 });
  const [isMounted, setIsMounted] = useState(false);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  
  // Smoother physics-based spring effect for parallax
  const parallaxY = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 400]),
    { stiffness: 100, damping: 30 }
  );
  
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Only render parallax effects on client side
  if (!isMounted) {
    return (
      <section
        ref={ref}
        id="hero"
        className="min-h-screen flex items-center justify-center relative"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/60 via-indigo-900/40 to-transparent" />
        <div className="container mx-auto px-4 relative z-10 mt-20 md:mt-0">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md p-8 rounded-xl shadow-2xl border border-white/20">
              <SectionHeading
                title={title}
                subtitle={subtitle}
                align="center"
                tag={tag}
                tagColor="emerald"
              />
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Button href="/tours" variant="primary" size="lg" rounded animate>
                  Explore Tours
                </Button>
                <Button href="/about" variant="outline" size="lg" rounded animate>
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section
      ref={ref}
      id="hero"
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
    >
      {/* Background image with parallax effect */}
      <motion.div 
        className="absolute inset-0 bg-blue-900"
        style={{ 
          y: parallaxY,
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: opacity
        }}
      />
      
      {/* Overlay */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-blue-900/80 via-indigo-900/50 to-transparent"
        style={{ opacity }}
      />
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white opacity-20"
            style={{
              width: Math.random() * 8 + 2 + 'px',
              height: Math.random() * 8 + 2 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
            }}
            animate={{
              y: [0, -Math.random() * 150 - 50],
              x: [0, (Math.random() - 0.5) * 50],
              opacity: [0.1, 0.3, 0]
            }}
            transition={{
              duration: Math.random() * 15 + 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 mt-20 md:mt-0">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div 
            className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md p-8 rounded-xl shadow-2xl border border-white/20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <SectionHeading
              title={title}
              subtitle={subtitle}
              align="center"
              tag={tag}
              tagColor="emerald"
            />
            <motion.div 
              className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <Button
                href="/tours"
                variant="primary"
                size="lg"
                rounded
                animate
                className="btn-hover-glow"
              >
                Explore Tours
              </Button>
              <Button
                href="/about"
                variant="outline"
                size="lg"
                rounded
                animate
              >
                Learn More
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* Scroll prompt */}
      {heroInView && (
        <motion.div 
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-white flex flex-col items-center cursor-pointer"
          initial={{ opacity: 0, y: -10 }}
          animate={{ 
            opacity: [0.3, 0.8, 0.3], 
            y: [0, 10, 0] 
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            repeatType: "loop"
          }}
          onClick={() => {
            document.getElementById('mountains')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <span className="text-sm font-medium mb-2">Scroll Down</span>
          <FiChevronDown className="h-5 w-5" />
        </motion.div>
      )}
    </section>
  );
};

export default Hero; 