"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCalendar,
  FiMapPin,
  FiDollarSign,
  FiClock,
  FiUsers,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { Tour } from "@/types";
import { useAuth } from "@/context/AuthContext";
import {
  formatRupees,
  initializeRazorpayPayment,
  createRazorpayOrder,
} from "@/utils/razorpay";
import { fetchPexelsImages } from "@/utils/pexels";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PexelsNotice from "@/components/PexelsNotice";
import { toast } from "react-toastify";

interface TourDetailClientProps {
  tour: Tour;
}

export default function TourDetailClient({ tour }: TourDetailClientProps) {
  const { user } = useAuth();
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [pexelsImages, setPexelsImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Pexels images on component mount
  useEffect(() => {
    async function loadImages() {
      try {
        setIsLoading(true);
        const images = await fetchPexelsImages(tour.title, 6);
        setPexelsImages(images.length > 0 ? images : [tour.image]);
      } catch (error) {
        console.error("Error fetching Pexels images:", error);
        setPexelsImages([tour.image]);
      } finally {
        setIsLoading(false);
      }
    }

    loadImages();
  }, [tour.title, tour.image]);

  // Handle booking
  const handleBookNow = () => {
    if (!user) {
      toast.info("Please log in to book this tour");
      return;
    }
    setBookingModalOpen(true);
  };

  // Handle payment
  const handlePayment = async () => {
    if (!user) {
      toast.error("You must be logged in to book a tour");
      return;
    }

    setIsSubmitting(true);
    try {
      // Create Razorpay order
      const orderId = await createRazorpayOrder(tour.price, tour.id, user.uid);

      // Initialize payment
      await initializeRazorpayPayment(
        orderId,
        tour.price,
        tour,
        user.email,
        user.displayName || "Customer",
        () => {
          // On successful payment
          toast.success("Booking confirmed! Thank you for your purchase.");
          setBookingModalOpen(false);

          // In a real application, you would save the booking to the database here
        },
        (error) => {
          // On payment error
          toast.error(`Payment failed: ${error.message}`);
        }
      );
    } catch (error: any) {
      toast.error(`Error processing payment: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Image carousel navigation
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % pexelsImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + pexelsImages.length) % pexelsImages.length
    );
  };

  // Auto advance carousel
  useEffect(() => {
    if (pexelsImages.length <= 1) return;

    const intervalId = setInterval(() => {
      nextImage();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [pexelsImages]);

  return (
    <>
      <Navbar />
      <main className="bg-gray-50">
        {/* Hero Banner with Image Carousel */}
        <div className="relative h-[60vh] overflow-hidden">
          {isLoading ? (
            <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
              <p className="text-gray-500">Loading images...</p>
            </div>
          ) : (
            <>
              <div className="absolute inset-0 bg-black opacity-30 z-10"></div>
              <AnimatePresence initial={false}>
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                  className="absolute inset-0 bg-cover bg-center z-0"
                  style={{
                    backgroundImage: `url('${pexelsImages[currentImageIndex]}')`,
                  }}
                />
              </AnimatePresence>

              {/* Navigation arrows */}
              {pexelsImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 text-white p-3 rounded-full hover:bg-black/50 transition-colors"
                  >
                    <FiChevronLeft size={24} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 text-white p-3 rounded-full hover:bg-black/50 transition-colors"
                  >
                    <FiChevronRight size={24} />
                  </button>
                </>
              )}

              {/* Carousel indicators */}
              {pexelsImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
                  {pexelsImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`h-2 w-2 rounded-full ${
                        currentImageIndex === index ? "bg-white" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          <div className="relative z-20 h-full flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center max-w-4xl mx-auto px-6"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {tour.title}
              </h1>
              <p className="text-xl text-white">{tour.description}</p>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              {/* Tour Overview */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-12"
              >
                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                  Overview
                </h2>
                <div className="prose prose-lg max-w-none">
                  {tour.fullDescription
                    .split("\n\n")
                    .map((paragraph, index) => (
                      <p key={index} className="mb-4">
                        {paragraph.trim()}
                      </p>
                    ))}
                </div>
              </motion.section>

              {/* Tour Itinerary */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-12"
              >
                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                  Itinerary
                </h2>
                <div className="space-y-6">
                  {tour.itinerary.map((item) => (
                    <motion.div
                      key={item.day}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: item.day * 0.1 }}
                      className="border-l-4 border-emerald-500 pl-4"
                    >
                      <h3 className="text-xl font-bold text-gray-800 mb-1">
                        Day {item.day}: {item.title}
                      </h3>
                      <p className="text-gray-600">{item.description}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.section>

              {/* Photo Gallery */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mb-12"
              >
                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                  Photo Gallery
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {pexelsImages.map((image, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="rounded-lg overflow-hidden shadow-md"
                    >
                      <div className="relative h-48 w-full">
                        <Image
                          src={image}
                          alt={`${tour.title} - Gallery ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
                <PexelsNotice className="mt-4" />
              </motion.section>
            </div>

            {/* Booking sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-white rounded-lg shadow-md p-6 sticky top-24"
              >
                <div className="text-center mb-6">
                  <span className="text-3xl font-bold text-emerald-600">
                    {formatRupees(tour.price)}
                  </span>
                  <span className="text-gray-600"> / per person</span>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center py-2 border-b border-gray-200">
                    <FiCalendar className="text-emerald-500 mr-3" />
                    <span className="text-gray-600 mr-2">Duration:</span>
                    <span className="font-semibold ml-auto">
                      {tour.duration} days
                    </span>
                  </div>
                  <div className="flex items-center py-2 border-b border-gray-200">
                    <FiMapPin className="text-emerald-500 mr-3" />
                    <span className="text-gray-600 mr-2">Location:</span>
                    <span className="font-semibold ml-auto">
                      {tour.location}
                    </span>
                  </div>
                  <div className="flex items-center py-2 border-b border-gray-200">
                    <FiClock className="text-emerald-500 mr-3" />
                    <span className="text-gray-600 mr-2">Difficulty:</span>
                    <span className="font-semibold ml-auto">
                      {tour.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center py-2 border-b border-gray-200">
                    <FiUsers className="text-emerald-500 mr-3" />
                    <span className="text-gray-600 mr-2">Group Size:</span>
                    <span className="font-semibold ml-auto">2-12 people</span>
                  </div>
                </div>

                <button
                  onClick={handleBookNow}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-md transition-colors mb-4 flex items-center justify-center"
                >
                  <FiDollarSign className="mr-2" />
                  Book Now
                </button>

                <Link
                  href="/contact"
                  className="block w-full bg-white text-emerald-600 border border-emerald-600 text-center font-medium py-3 rounded-md hover:bg-emerald-50 transition-colors"
                >
                  Inquire
                </Link>

                <div className="mt-8 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      What's Included
                    </h3>
                    <ul className="space-y-2">
                      {tour.includes.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <svg
                            className="h-5 w-5 text-emerald-500 mr-2 mt-0.5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-gray-600">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      What's Excluded
                    </h3>
                    <ul className="space-y-2">
                      {tour.excludes.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <svg
                            className="h-5 w-5 text-red-500 mr-2 mt-0.5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-gray-600">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      {/* Booking confirmation modal */}
      {bookingModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Confirm Your Booking
            </h2>

            <div className="mb-6">
              <h3 className="font-semibold text-lg text-gray-800 mb-2">
                {tour.title}
              </h3>
              <div className="flex justify-between mb-1">
                <span className="text-gray-600">Price:</span>
                <span className="font-medium">{formatRupees(tour.price)}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">{tour.duration} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Location:</span>
                <span className="font-medium">{tour.location}</span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mb-6">
              <p className="text-gray-600 mb-2">
                By proceeding, you agree to our booking terms and conditions.
              </p>
              <p className="text-gray-500 text-sm">
                Note: This is a test payment. No actual charges will be made.
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setBookingModalOpen(false)}
                className="flex-1 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                disabled={isSubmitting}
                className="flex-1 bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Processing..." : "Proceed to Payment"}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <Footer />
    </>
  );
}
