"use client";

import React, { useEffect, useState, useRef } from "react";
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
import ParallaxBackground from "@/components/ui/ParallaxBackground";
import TourCard from "@/components/ui/TourCard";
import { getHeroImage } from "@/utils/pexels";
import { getFeaturedTours } from "@/lib/tours";
import { Tour } from "@/types";
import PexelsNotice from "@/components/PexelsNotice";
import StatCard from "@/components/common/StatCard";
import TestimonialCard from "@/components/common/TestimonialCard";
import AnimatedSection from "@/components/animations/AnimatedSection";

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

export default function Home() {
  const [heroImage, setHeroImage] = useState<string>(
    "/images/hero-fallback.jpg"
  );
  const [featuredTours, setFeaturedTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        // Load hero image
        const heroImg = await getHeroImage();
        setHeroImage(heroImg.url);

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

  return (
    <>
      <Navbar />
      <main className="text-sm">
        {/* Hero Section with Parallax */}
        <ParallaxBackground
          imageUrl={heroImage}
          overlayOpacity={0.5}
          speed={0.15}
          className="h-[95vh] flex items-center justify-center"
        >
          <div className="text-center px-6 w-full max-w-5xl mx-auto">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.2 } },
              }}
              className="max-w-4xl mx-auto"
            >
              <motion.h1
                variants={fadeIn}
                transition={{ duration: 0.8 }}
                className="text-3xl md:text-5xl font-bold text-white mb-8 [text-shadow:_0_2px_10px_rgba(0,0,0,0.3)]"
              >
                Discover South Asia
              </motion.h1>
              <motion.p
                variants={fadeIn}
                transition={{ duration: 0.8 }}
                className="text-lg md:text-xl text-white max-w-3xl mx-auto mb-10 [text-shadow:_0_2px_5px_rgba(0,0,0,0.2)]"
              >
                Experience the breathtaking beauty of South Asia with our
                immersive tours. From the majestic Himalayas to ancient temples,
                lush valleys and vibrant cultures.
              </motion.p>
              <motion.div
                variants={fadeIn}
                transition={{ duration: 0.8 }}
                className="flex flex-col sm:flex-row gap-6 justify-center"
              >
                <Link
                  href="/tours"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3.5 rounded-md font-semibold text-base transition-colors inline-flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
                >
                  Explore Tours
                  <FiChevronRight className="ml-2" />
                </Link>
                <Link
                  href="/about"
                  className="bg-transparent border-2 border-white text-white hover:bg-white/20 transition-colors px-8 py-3 rounded-md font-semibold text-base inline-flex items-center"
                >
                  Learn More
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </ParallaxBackground>

        {/* Stats Section */}
        <AnimatedSection className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <StatCard
                icon={<FiUsers className="text-4xl text-primary" />}
                value="5000+"
                label="Happy Travelers"
              />
              <StatCard
                icon={<FiMapPin className="text-4xl text-primary" />}
                value="25+"
                label="Destinations"
              />
              <StatCard
                icon={<FiAward className="text-4xl text-primary" />}
                value="10+"
                label="Years Experience"
              />
              <StatCard
                icon={<FiStar className="text-4xl text-primary" />}
                value="4.9/5"
                label="Traveler Rating"
              />
            </div>
          </div>
        </AnimatedSection>

        {/* Featured Tours Section */}
        <AnimatedSection className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-4">
              Featured Tours
            </h2>
            <p className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto">
              Explore our most popular South Asian adventures, from challenging
              Himalayan treks to cultural journeys through ancient
              civilizations.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {loading
                ? // Loading skeletons
                  Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-gray-100 rounded-lg h-[450px] animate-pulse"
                    />
                  ))
                : featuredTours.map((tour, index) => (
                    <motion.div
                      key={tour.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <TourCard tour={tour} />
                    </motion.div>
                  ))}
            </div>
            <div className="mt-12 text-center">
              <Link
                href="/tours"
                className="inline-flex items-center space-x-2 text-primary hover:text-primary-dark font-semibold transition duration-300"
              >
                <span>View All Tours</span>
                <FiArrowRight />
              </Link>
            </div>
          </div>
        </AnimatedSection>

        {/* Testimonials Section */}
        <AnimatedSection className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-4">
              What Our Travelers Say
            </h2>
            <p className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto">
              Hear from adventurers who have experienced our South Asian
              journeys and discovered the wonders of this magnificent region.
            </p>
            <div className="max-w-4xl mx-auto relative min-h-[300px]">
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className={`transition-all duration-500 absolute w-full ${
                    activeTestimonial === index
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 translate-x-20 pointer-events-none"
                  }`}
                >
                  <TestimonialCard testimonial={testimonial} />
                </div>
              ))}
              <div className="flex justify-center mt-8 space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      activeTestimonial === index
                        ? "bg-primary w-6"
                        : "bg-gray-300"
                    }`}
                    aria-label={`View testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* CTA Section */}
        <AnimatedSection className="py-20 bg-primary text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-4">
              Ready for Your South Asian Adventure?
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Join us on an unforgettable journey through the most spectacular
              landscapes and vibrant cultures of South Asia.
            </p>
            <Link
              href="/contact"
              className="bg-white text-primary hover:bg-gray-100 font-bold py-3 px-8 rounded-full inline-flex items-center space-x-2 transition duration-300"
            >
              <span>Contact Us Today</span>
              <FiArrowRight />
            </Link>
          </div>
        </AnimatedSection>

        <PexelsNotice className="bg-gray-100 py-5 text-center text-gray-500 text-xs" />
      </main>
      <Footer />
    </>
  );
}
