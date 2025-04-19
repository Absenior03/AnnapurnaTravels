"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { FiMapPin, FiCalendar, FiClock, FiChevronRight } from "react-icons/fi";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ParallaxBackground from "@/components/ui/ParallaxBackground";
import TourCard from "@/components/ui/TourCard";
import { getHeroImage } from "@/utils/pexels";
import { getFeaturedTours } from "@/lib/tours";
import { Tour } from "@/types";
import PexelsNotice from "@/components/PexelsNotice";

export default function Home() {
  const [heroImage, setHeroImage] = useState<string>(
    "/images/hero-fallback.jpg"
  );
  const [featuredTours, setFeaturedTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // Load hero image
        const heroImg = await getHeroImage();
        setHeroImage(heroImg);

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

  // Parallax scrolling effect reference
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);

  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section with Parallax */}
        <ParallaxBackground
          imageUrl={heroImage}
          overlayOpacity={0.5}
          speed={0.15}
          className="h-[80vh] flex items-center justify-center"
        >
          <div className="text-center px-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-bold text-white mb-6"
            >
              Discover the Himalayas
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-white max-w-3xl mx-auto mb-8"
            >
              Experience breathtaking adventures in the world's most majestic
              mountain range
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Link
                href="/tours"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-md font-semibold text-lg transition-colors inline-flex items-center"
              >
                Explore Tours
                <FiChevronRight className="ml-2" />
              </Link>
            </motion.div>
          </div>
        </ParallaxBackground>

        {/* Featured Tours Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Featured Tours
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Discover our most popular Himalayan adventures, carefully
                curated to provide unforgettable experiences in the world's most
                breathtaking mountains.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {loading
                ? // Loading skeletons
                  Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse"
                    >
                      <div className="h-64 bg-gray-300"></div>
                      <div className="p-6">
                        <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
                        <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                        <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                      </div>
                    </div>
                  ))
                : featuredTours.map((tour) => (
                    <motion.div
                      key={tour.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                    >
                      <TourCard tour={tour} />
                    </motion.div>
                  ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mt-12"
            >
              <Link
                href="/tours"
                className="inline-flex items-center text-emerald-600 font-semibold hover:text-emerald-800 transition-colors"
              >
                View All Tours
                <FiChevronRight className="ml-1" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* About Us Section with Parallax */}
        <section className="relative py-20 overflow-hidden">
          <motion.div style={{ y }} className="absolute inset-0 z-0">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.pexels.com/photos/4534200/pexels-photo-4534200.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260')",
              }}
            />
            <div className="absolute inset-0 bg-emerald-900 opacity-80" />
          </motion.div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  About Annapurna Tours
                </h2>
                <p className="text-white opacity-90 mb-6">
                  For over 15 years, Annapurna Tours has been the premier
                  provider of authentic Himalayan adventures. Our expert guides,
                  all locals with deep knowledge of the mountains, ensure safe
                  and unforgettable journeys through Nepal, Bhutan, and Tibet.
                </p>
                <p className="text-white opacity-90 mb-8">
                  We're committed to sustainable tourism that benefits local
                  communities while preserving the natural beauty and cultural
                  heritage of the Himalayas. When you travel with us, you're not
                  just a tourist—you're a responsible traveler making a positive
                  impact.
                </p>
                <Link
                  href="/about"
                  className="inline-flex items-center bg-white text-emerald-700 px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors"
                >
                  Learn More
                  <FiChevronRight className="ml-2" />
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative h-[500px] rounded-lg overflow-hidden shadow-xl"
              >
                <Image
                  src="https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260"
                  alt="Himalayan guides"
                  fill
                  className="object-cover"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Why Choose Us
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                With decades of experience and a deep love for the Himalayas, we
                provide unforgettable adventures with a commitment to safety,
                authenticity, and sustainability.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Local Expertise",
                  description:
                    "Our guides are local experts with deep knowledge of the terrain, culture, and history of the Himalayas.",
                  icon: (
                    <svg
                      className="w-12 h-12 text-emerald-500 mb-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ),
                },
                {
                  title: "Sustainable Tourism",
                  description:
                    "We're committed to environmentally responsible practices and supporting local communities in all our operations.",
                  icon: (
                    <svg
                      className="w-12 h-12 text-emerald-500 mb-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.632 3.632A9 9 0 116.414 15.414l.707.707a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L6.414 10A7 7 0 104.632 5.512a1 1 0 011.73-1L8 7.732l2.732-2.732a1 1 0 011.414 0l3.535 3.536a1 1 0 010 1.414L13.95 12.68a1 1 0 01-1.414 0L10 10.148 6.364 13.78a1 1 0 01-1.414 0l-1.731-1.73a1 1 0 011.414-1.414L6 12.005l2.768-2.768-4.136-4.136z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ),
                },
                {
                  title: "Safety First",
                  description:
                    "With comprehensive safety protocols and highly trained guides, your wellbeing is our top priority on every adventure.",
                  icon: (
                    <svg
                      className="w-12 h-12 text-emerald-500 mb-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ),
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gray-50 p-8 rounded-lg shadow-md text-center"
                >
                  <div className="flex justify-center">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-emerald-700">
          <div className="container mx-auto px-4 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold text-white mb-6"
            >
              Ready for Your Himalayan Adventure?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-emerald-100 max-w-3xl mx-auto mb-8 text-lg"
            >
              Join us for the journey of a lifetime. Browse our tours or contact
              us to create a custom itinerary tailored to your preferences.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                href="/tours"
                className="bg-white text-emerald-700 hover:bg-gray-100 transition-colors px-8 py-3 rounded-md font-semibold"
              >
                Explore Tours
              </Link>
              <Link
                href="/contact"
                className="bg-transparent border-2 border-white text-white hover:bg-white/10 transition-colors px-8 py-3 rounded-md font-semibold"
              >
                Contact Us
              </Link>
            </motion.div>
          </div>
        </section>

        <PexelsNotice className="bg-gray-100 py-4 text-center text-gray-500 text-sm" />
      </main>
      <Footer />
    </>
  );
}
