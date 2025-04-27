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
import ErrorBoundary from "@/components/ErrorBoundary";
import FeaturedTourCard from "@/components/tours/FeaturedTourCard";
import { getTours } from "@/lib/tours";
import { getTestimonials } from "@/lib/testimonials";

// Import the ScrollScene component with dynamic loading
// This is necessary because it uses client-side only features like Three.js
const ScrollScene = dynamic(
  () => import("@/components/3d/ScrollScene").then((mod) => mod.ScrollScene),
  { ssr: false }
);

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

// Fixed, reliable mountain showcase without 3D
const MountainShowcase = () => (
  <section id="mountains" className="py-20 md:py-32 relative">
    <div className="container mx-auto px-4">
      <SectionHeading
        title="Discover South Asia"
        subtitle="Our tours take you through breathtaking landscapes"
        align="center"
        divider
      />
      <div className="mt-12 bg-gradient-to-b from-indigo-800 to-blue-900 rounded-lg min-h-[400px] flex items-center justify-center">
        <div className="text-white text-center max-w-lg p-8">
          <h3 className="text-2xl font-bold mb-3">
            Spectacular Mountain Ranges
          </h3>
          <p className="mb-6">
            Explore the majesty of the Himalayas and other magnificent mountain
            ranges across South Asia
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/tours" variant="primary" size="lg" rounded>
              View Tours
            </Button>
            <Button href="/about" variant="outline" size="lg" rounded>
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  </section>
);

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
      setActiveTestimonial((prev) => (prev + 1) % 3);
    }, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Parallax scrolling effect reference
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);

  // Define sections for the scroll scene
  const sections = [
    {
      id: "hero",
      title: "Adventure Through South Asia",
      description:
        "Discover breathtaking landscapes, ancient cultures, and unforgettable experiences across South Asia's most beautiful regions.",
    },
    {
      id: "mountains",
      title: "Discover Our Destinations",
      description:
        "Explore majestic mountain landscapes across South Asia with our interactive showcase.",
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

  const tours = getTours().slice(0, 3);
  const testimonials = getTestimonials().slice(0, 3);

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

          {/* Mountain Showcase Section - Safe static version */}
          <ErrorBoundary fallback={<div>Something went wrong with the mountain display</div>}>
            <MountainShowcase />
          </ErrorBoundary>

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
