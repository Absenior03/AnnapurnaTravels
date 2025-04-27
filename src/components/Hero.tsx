"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import { Button } from "../components/ui/Button";
import { FiChevronDown, FiArrowRight } from "react-icons/fi";
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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  
  // Smoother physics-based spring effect for parallax
  const parallaxY = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 300]),
    { stiffness: 75, damping: 25, mass: 1.8 }
  );
  
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);
  
  // Mouse parallax effect - Apple style
  useEffect(() => {
    if (!isMounted) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
      const y = (e.clientY / window.innerHeight - 0.5) * 2; // -1 to 1
      setMousePosition({ x, y });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMounted]);
  
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
          <div className="max-w-3xl mx-auto text-center">
            <div className="apple-blur p-8 rounded-3xl shadow-2xl border border-white/20">
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
      className="min-h-screen flex items-center justify-center relative overflow-hidden cursor-glowy"
    >
      {/* Background image with parallax effect */}
      <motion.div 
        className="absolute inset-0 bg-blue-900"
        style={{ 
          y: parallaxY,
          scale,
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: opacity,
          filter: 'brightness(0.9) contrast(1.1)'
        }}
      />
      
      {/* Overlay */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-blue-900/80 via-indigo-900/60 to-transparent"
        style={{ 
          opacity,
          backgroundPosition: `${50 + mousePosition.x * 5}% ${50 + mousePosition.y * 5}%`
        }}
      />
      
      {/* Floating particles - Apple style with depth effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => {
          const depth = Math.random();
          const size = Math.random() * 6 + 2;
          
          return (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: size + 'px',
                height: size + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                opacity: depth * 0.3,
                x: mousePosition.x * 20 * depth,
                y: mousePosition.y * 20 * depth,
              }}
              animate={{
                y: [0, -Math.random() * 150 - 50],
                x: [0, (Math.random() - 0.5) * 50],
                opacity: [depth * 0.2, depth * 0.3, 0]
              }}
              transition={{
                duration: Math.random() * 15 + 20,
                repeat: Infinity,
                ease: [0.23, 1, 0.32, 1]
              }}
            />
          );
        })}
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div 
            className="rounded-3xl overflow-hidden backdrop-blur-lg bg-white/10 dark:bg-black/30 p-12 border border-white/20 shadow-2xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 1, 
              ease: [0.23, 1, 0.32, 1],
            }}
            style={{
              x: mousePosition.x * -15,
              y: mousePosition.y * -15,
              transition: "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)"
            }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 1 }}
            >
              <span className="inline-block py-1 px-3 rounded-full bg-emerald-500/10 text-emerald-500 text-sm font-medium mb-6">
                {tag}
              </span>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold text-white mb-6 tracking-tight">
                {title.split(' ').map((word, i) => (
                  <motion.span 
                    key={i} 
                    className="inline-block mr-4"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      delay: 0.4 + i * 0.1, 
                      duration: 0.9,
                      ease: [0.23, 1, 0.32, 1]
                    }}
                  >
                    {word}
                  </motion.span>
                ))}
              </h1>
              
              <motion.p 
                className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.9 }}
              >
                {subtitle}
              </motion.p>
              
              <motion.div 
                className="mt-12 flex flex-col sm:flex-row gap-6 justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.9 }}
              >
                <Button
                  href="/tours"
                  variant="primary"
                  size="xl"
                  rounded
                  animate
                  className="button-glint px-8 py-4 text-lg shadow-lg"
                  icon={<FiArrowRight className="ml-2" />}
                >
                  Explore Tours
                </Button>
                <Button
                  href="/about"
                  variant="outline"
                  size="xl"
                  rounded
                  animate
                  className="px-8 py-4 text-lg bg-white/10 backdrop-blur-sm hover:bg-white/20"
                >
                  Learn More
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* Scroll prompt - Apple style */}
      {heroInView && (
        <motion.div 
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-white flex flex-col items-center cursor-pointer group"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{ 
            duration: 2.5, 
            repeat: Infinity,
            repeatType: "loop",
            ease: [0.23, 1, 0.32, 1]
          }}
          onClick={() => {
            document.getElementById('mountains')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <span className="text-sm font-medium mb-2 tracking-wide uppercase opacity-80 group-hover:opacity-100 transition-opacity duration-300">
            Scroll Down
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: [0.23, 1, 0.32, 1]
            }}
            className="bg-white/20 backdrop-blur-sm h-10 w-10 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300"
          >
            <FiChevronDown className="h-5 w-5" />
          </motion.div>
        </motion.div>
      )}
    </section>
  );
};

export default Hero; 