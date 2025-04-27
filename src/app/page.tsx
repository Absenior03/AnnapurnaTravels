"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useScroll, useInView, useAnimation } from "framer-motion";
import {
  FiMapPin,
  FiCalendar,
  FiClock,
  FiChevronRight,
  FiStar,
  FiArrowRight,
  FiUsers,
  FiAward,
  FiArrowDown,
  FiChevronDown,
} from "react-icons/fi";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getFeaturedTours } from "@/lib/tours";
import { Tour } from "@/types";
import PexelsNotice from "@/components/PexelsNotice";
import SectionHeading from "@/components/ui/SectionHeading";
import StatCounter from "@/components/sections/StatCounter";
import Testimonials from "@/components/sections/Testimonials";
import CTA from "@/components/sections/CTA";
import ToursShowcase from "@/components/sections/ToursShowcase";
import { Button } from "@/components/ui/Button";
import ErrorBoundary from "@/components/ErrorBoundary";
import { getTours } from "@/lib/tours";
import { getTestimonials } from "@/lib/testimonials";
import Hero from "@/components/Hero";
import SafeHero from "@/components/hero/SafeHero";

// ScrollPrompt component to guide users to scroll down
const ScrollPrompt = () => (
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
);

// Custom section component with fade-in animations
const AnimatedSection = ({ id, className, children }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  const controls = useAnimation();
  
  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);
  
  return (
    <section 
      id={id} 
      ref={ref}
      className={className}
    >
      <motion.div
        initial="hidden"
        animate={controls}
        variants={{
          hidden: { opacity: 0, y: 30 },
          visible: { 
            opacity: 1, 
            y: 0,
            transition: { 
              duration: 0.6,
              ease: "easeOut"
            }
          }
        }}
      >
        {children}
      </motion.div>
    </section>
  );
};

// Loading screen shown while dynamic content is loading
function LoadingScreen() {
  return (
    <div className="relative flex h-[500px] w-full items-center justify-center bg-gradient-to-b from-blue-900 to-indigo-900 text-white">
      <div className="flex flex-col items-center">
        <div className="mb-4 h-16 w-16 animate-spin rounded-full border-t-4 border-blue-500 border-opacity-50"></div>
        <p className="text-xl font-light">Loading Experience...</p>
      </div>
    </div>
  );
}

// Enhanced mountain showcase with better visuals
const MountainShowcase = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  
  return (
    <section id="mountains" ref={ref} className="py-20 md:py-32 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <SectionHeading
          title="Discover South Asia"
          subtitle="Our tours take you through breathtaking landscapes"
          align="center"
          divider
        />
        
        <motion.div 
          className="mt-12 bg-gradient-to-b from-indigo-800 to-blue-900 rounded-lg min-h-[400px] relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={isInView ? 
            { opacity: 1, scale: 1, transition: { duration: 0.8 }} : 
            { opacity: 0, scale: 0.97 }
          }
        >
          {/* Background particles effect */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white opacity-20"
                style={{
                  width: Math.random() * 10 + 2 + 'px',
                  height: Math.random() * 10 + 2 + 'px',
                  left: Math.random() * 100 + '%',
                  top: Math.random() * 100 + '%',
                }}
                animate={{
                  y: [0, -Math.random() * 100 - 50],
                  opacity: [0.1, 0.3, 0]
                }}
                transition={{
                  duration: Math.random() * 10 + 10,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            ))}
          </div>
          
          <motion.div 
            className="text-white text-center max-w-lg p-8 relative z-10 mx-auto flex flex-col items-center justify-center h-full"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? 
              { opacity: 1, y: 0, transition: { delay: 0.3, duration: 0.6 }} : 
              { opacity: 0, y: 20 }
            }
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Spectacular Mountain Ranges
            </h3>
            <p className="mb-8 text-white/90 text-lg">
              Explore the majesty of the Himalayas and other magnificent mountain
              ranges across South Asia
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">
              <Button href="/tours" variant="primary" size="lg" rounded animate>
                View Tours
              </Button>
              <Button href="/about" variant="outline" size="lg" rounded animate>
                Learn More
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// Feature card for the homepage
const FeatureCard = ({ icon, title, description }) => (
  <motion.div 
    className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
  >
    <div className="mb-4 text-emerald-600 bg-emerald-100 p-3 rounded-full inline-block">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300">{description}</p>
  </motion.div>
);

// Main Home page component
export default function Home() {
  const [loading, setLoading] = useState(true);
  const [tours, setTours] = useState<Tour[]>([]);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    async function loadData() {
      try {
        // Load featured tours
        const toursData = await getFeaturedTours(3);
        setTours(toursData);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <>
      <Navbar />
      <main className="relative">
        {/* Progress bar */}
        <motion.div 
          className="fixed top-0 left-0 right-0 h-1 bg-emerald-500 origin-left z-50"
          style={{ scaleX: scrollYProgress }}
        />
        
        {/* Enhanced Hero Section with 3D content and memory optimization */}
        <ErrorBoundary fallback={
          <Hero 
            title="Adventure Through South Asia"
            subtitle="Discover breathtaking landscapes, ancient cultures, and unforgettable experiences"
            imageUrl="/images/hero-bg.jpg"
            tag="Explore Now"
          />
        }>
          <SafeHero />
        </ErrorBoundary>

        {/* Mountain Showcase Section with animations */}
        <ErrorBoundary fallback={<div className="py-20 text-center">Unable to display mountain showcase</div>}>
          <MountainShowcase />
        </ErrorBoundary>
        
        {/* Features Section */}
        <AnimatedSection id="features" className="py-20 md:py-32 relative bg-gray-50 dark:bg-gray-900/50">
          <div className="container mx-auto px-4">
            <SectionHeading
              title="Why Travel With Us"
              subtitle="Experience the difference with our premium services"
              align="center"
              divider
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <FeatureCard 
                icon={<FiUsers className="w-6 h-6" />}
                title="Expert Local Guides"
                description="Our guides are local experts with deep knowledge of the region, culture, and hidden gems."
              />
              <FeatureCard 
                icon={<FiStar className="w-6 h-6" />}
                title="Premium Experience" 
                description="Every aspect of your journey is crafted for comfort, safety, and unforgettable memories."
              />
              <FeatureCard 
                icon={<FiMapPin className="w-6 h-6" />}
                title="Unique Destinations"
                description="Discover extraordinary places off the beaten path that most tourists never experience."
              />
            </div>
          </div>
        </AnimatedSection>

        {/* Tours Section */}
        <AnimatedSection id="tours" className="py-20 md:py-32 relative">
          <div className="container mx-auto px-4 relative z-10">
            <SectionHeading
              title="Featured Tours"
              subtitle="Explore our handpicked selection of immersive adventures"
              align="center"
              divider
            />
            {loading ? (
              <div className="h-96 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <ToursShowcase />
            )}
            <motion.div 
              className="mt-16 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, amount: 0.8 }}
            >
              <Button
                href="/tours"
                variant="secondary"
                size="lg"
                rounded
                animate
              >
                View All Tours <FiArrowRight className="ml-2" />
              </Button>
            </motion.div>
          </div>
        </AnimatedSection>

        {/* Stats Section */}
        <AnimatedSection id="stats" className="py-20 md:py-32 relative bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 relative z-10">
            <SectionHeading
              title="Why Choose Us"
              subtitle="Join thousands of satisfied adventurers who have explored South Asia with our expert guides"
              align="center"
              divider
            />
            <StatCounter />
          </div>
        </AnimatedSection>

        {/* Testimonials Section */}
        <AnimatedSection id="testimonials" className="py-20 md:py-32 relative">
          <div className="container mx-auto px-4 relative z-10">
            <SectionHeading
              title="Traveler Stories"
              subtitle="Hear what our adventurers have to say about their life-changing experiences"
              align="center"
              divider
            />
            <Testimonials />
          </div>
        </AnimatedSection>

        {/* Call to Action */}
        <AnimatedSection id="cta" className="py-20 md:py-32 relative">
          <CTA />
        </AnimatedSection>

        <PexelsNotice className="bg-gray-100 py-5 text-center text-gray-500 text-xs" />
      </main>
      <Footer />
    </>
  );
}
