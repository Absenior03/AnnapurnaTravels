"use client";

import React, { useEffect, useState, useRef, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  FiMapPin,
  FiCalendar,
  FiClock,
  FiChevronRight,
  FiStar,
  FiArrowRight,
  FiUsers,
  FiAward,
} from "react-icons/fi";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TourCard from "@/components/ui/TourCard";
import { getFeaturedTours } from "@/lib/tours";
import { Tour } from "@/types";
import PexelsNotice from "@/components/PexelsNotice";
import StatCard from "@/components/common/StatCard";
import TestimonialCard from "@/components/common/TestimonialCard";
import AnimatedSection from "@/components/animations/AnimatedSection";
import SafeHero from "@/components/hero/SafeHero";
import dynamic from "next/dynamic";
import SectionHeading from "@/components/ui/SectionHeading";
import StatCounter from "@/components/sections/StatCounter";
import Testimonials from "@/components/sections/Testimonials";
import CTA from "@/components/sections/CTA";
import ToursShowcase from "@/components/sections/ToursShowcase";
import { Button } from "@/components/ui/Button";

// Import the ScrollScene component with dynamic loading
// This is necessary because it uses client-side only features like Three.js
const ScrollScene = dynamic(
  () => import("@/components/3d/ScrollScene").then((mod) => mod.ScrollScene),
  { ssr: false }
);

// Loading screen shown while the 3D scene is loading
function LoadingScreen() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-900 to-indigo-900 text-white">
      <div className="w-24 h-24 border-8 border-t-emerald-500 border-b-emerald-700 border-l-transparent border-r-transparent rounded-full animate-spin mb-8"></div>
      <h2 className="text-2xl font-bold mb-2">Loading 3D Experience</h2>
      <p className="text-gray-300">
        Preparing your journey through South Asia...
      </p>
    </div>
  );
}

// Testimonial data
const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    location: "United Kingdom",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    rating: 5,
    text: "The South Asian adventure with ATAT was truly life-changing. Our guide was knowledgeable and passionate, making the experience unforgettable.",
  },
  {
    id: 2,
    name: "Michael Chen",
    location: "United States",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    rating: 5,
    text: "Trekking through the Himalayas with ATAT exceeded all my expectations. The attention to detail and safety measures were impressive.",
  },
  {
    id: 3,
    name: "Elena Petrova",
    location: "Russia",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    rating: 5,
    text: "The cultural immersion across South Asia was unparalleled. ATAT provided authentic experiences while respecting local traditions.",
  },
];

// Stats information
const stats = [
  { id: 1, value: "5000+", label: "Happy Travelers" },
  { id: 2, value: "25+", label: "Destinations" },
  { id: 3, value: "10+", label: "Years Experience" },
  { id: 4, value: "4.9/5", label: "Traveler Rating" },
];

// Main Home page component
export default function Home() {
  const [featuredTours, setFeaturedTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        // Load featured tours
        const tours = await getFeaturedTours(3);
        setFeaturedTours(tours);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Parallax scrolling effect reference
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Rating stars component
  const Stars = ({ rating }: { rating: number }) => (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <FiStar
          key={i}
          className={`${
            i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
          } w-3 h-3`}
        />
      ))}
    </div>
  );

  // Define sections for the scroll scene
  const sections = [
    {
      id: "hero",
      title: "Adventure Through South Asia",
      description:
        "Discover breathtaking landscapes, ancient cultures, and unforgettable experiences across South Asia's most beautiful regions.",
    },
    {
      id: "tours",
      title: "Featured Tours",
      description:
        "Explore our handpicked selection of immersive adventures through the most stunning locations in South Asia.",
    },
    {
      id: "stats",
      title: "Why Choose Us",
      description:
        "Join thousands of satisfied adventurers who have explored South Asia with our expert guides.",
    },
    {
      id: "testimonials",
      title: "Traveler Stories",
      description:
        "Hear what our adventurers have to say about their life-changing experiences.",
    },
  ];

  return (
    <>
      <Navbar />
      <main className="relative overflow-x-hidden">
        <noscript>
          <LoadingScreen />
        </noscript>
        <ScrollScene sections={sections}>
          {/* Hero Section */}
          <section
            id="hero"
            className="min-h-screen flex items-center justify-center relative"
          >
            <div className="container mx-auto px-4 relative z-10 mt-20 md:mt-0">
              <div className="max-w-2xl mx-auto text-center">
                <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-md p-8 rounded-xl shadow-2xl">
                  <SectionHeading
                    title="Adventure Through South Asia"
                    subtitle="Discover breathtaking landscapes, ancient cultures, and unforgettable experiences"
                    align="center"
                    tag="Explore Now"
                    tagColor="emerald"
                  />
                  <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      href="/tours"
                      variant="primary"
                      size="lg"
                      rounded
                      animate
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
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Tours Section */}
          <section id="tours" className="py-20 md:py-32 relative">
            <div className="container mx-auto px-4 relative z-10">
              <SectionHeading
                title="Featured Tours"
                subtitle="Explore our handpicked selection of immersive adventures"
                align="center"
                divider
              />
              <Suspense
                fallback={
                  <div className="h-96 flex items-center justify-center">
                    Loading tours...
                  </div>
                }
              >
                <ToursShowcase />
              </Suspense>
              <div className="mt-12 text-center">
                <Button
                  href="/tours"
                  variant="secondary"
                  size="lg"
                  rounded
                  animate
                >
                  View All Tours
                </Button>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section id="stats" className="py-20 md:py-32 relative">
            <div className="container mx-auto px-4 relative z-10">
              <SectionHeading
                title="Why Choose Us"
                subtitle="Join thousands of satisfied adventurers who have explored South Asia with our expert guides"
                align="center"
                divider
              />
              <StatCounter />
            </div>
          </section>

          {/* Testimonials Section */}
          <section id="testimonials" className="py-20 md:py-32 relative">
            <div className="container mx-auto px-4 relative z-10">
              <SectionHeading
                title="Traveler Stories"
                subtitle="Hear what our adventurers have to say about their life-changing experiences"
                align="center"
                divider
              />
              <Testimonials />
            </div>
          </section>

          {/* Call to Action */}
          <section id="cta" className="py-20 md:py-32 relative">
            <CTA />
          </section>
        </ScrollScene>

        <PexelsNotice className="bg-gray-100 py-5 text-center text-gray-500 text-xs" />
      </main>
      <Footer />
    </>
  );
}
