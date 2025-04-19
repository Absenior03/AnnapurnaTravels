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
  FiAward,
  FiCheckCircle,
  FiArrowLeft,
  FiShoppingCart,
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
import { useRouter } from "next/navigation";
import { useBookings } from "@/hooks/useBookings";
import ImageCarousel from "@/components/ui/ImageCarousel";

interface TourDetailClientProps {
  tour: Tour;
}

export default function TourDetailClient({ tour }: TourDetailClientProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { createBooking } = useBookings();
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [pexelsImages, setPexelsImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [bookingSuccess, setBookingSuccess] = useState(false);

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
      router.push("/login");
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
      const totalAmount = tour.price * numberOfPeople;

      // Create Razorpay order
      let orderId;
      try {
        orderId = await createRazorpayOrder(totalAmount, tour.id, user.uid);
      } catch (error) {
        console.error("Error creating Razorpay order:", error);
        toast.error("Failed to initialize payment");
        setIsSubmitting(false);
        return;
      }

      // Initialize Razorpay payment
      initializeRazorpayPayment(
        orderId,
        totalAmount,
        tour,
        user.email || "",
        user.displayName || user.email?.split("@")[0] || "Customer",
        async () => {
          // On successful payment
          try {
            // Create a booking in Firestore
            await createBooking({
              tourId: tour.id,
              departureDate: new Date(tour.departureDate),
              numberOfPeople,
              totalAmount,
            });

            toast.success(
              "Booking confirmed! Thank you for choosing Annapurna Tours."
            );
            setBookingSuccess(true);

            // Close modal after success message
            setTimeout(() => {
              setBookingModalOpen(false);
              setBookingSuccess(false);
              // Redirect to bookings page
              router.push("/bookings");
            }, 3000);
          } catch (error) {
            console.error("Error creating booking:", error);
            toast.error(
              "Payment successful but booking failed. Please contact support."
            );
          } finally {
            setIsSubmitting(false);
          }
        },
        (error) => {
          // On payment error
          console.error("Payment error:", error);
          toast.error("Payment failed. Please try again.");
          setIsSubmitting(false);
        }
      );
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error("Failed to process payment");
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

  // Format date
  const formattedDate = new Date(tour.departureDate).toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  // Booking Modal Component
  const BookingModal = () => {
    if (!bookingModalOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full"
        >
          {bookingSuccess ? (
            <div className="text-center py-8">
              <div className="mb-4 flex justify-center">
                <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                  <FiCheckCircle className="h-10 w-10 text-green-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Booking Successful!
              </h2>
              <p className="text-gray-600 mb-2">
                Your booking has been confirmed.
              </p>
              <p className="text-gray-600">Redirecting to your bookings...</p>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Complete Your Booking
              </h2>

              <div className="mb-6">
                <h3 className="font-medium text-gray-800 mb-2">{tour.title}</h3>
                <div className="flex justify-between text-gray-600 mb-1">
                  <span>Departure Date:</span>
                  <span>{formattedDate}</span>
                </div>
                <div className="flex justify-between text-gray-600 mb-1">
                  <span>Number of People:</span>
                  <span>{numberOfPeople}</span>
                </div>
                <div className="flex justify-between text-gray-600 mb-1">
                  <span>Tour Duration:</span>
                  <span>{tour.duration} days</span>
                </div>
                <div className="flex justify-between font-medium text-gray-800 mt-2">
                  <span>Total Amount:</span>
                  <span>{formatRupees(tour.price * numberOfPeople)}</span>
                </div>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="numberOfPeople"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Number of People
                </label>
                <div className="flex items-center">
                  <button
                    onClick={() =>
                      setNumberOfPeople(Math.max(1, numberOfPeople - 1))
                    }
                    className="p-2 border border-gray-300 rounded-l-md text-gray-600 hover:bg-gray-100"
                    disabled={numberOfPeople <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    id="numberOfPeople"
                    value={numberOfPeople}
                    onChange={(e) => setNumberOfPeople(Number(e.target.value))}
                    min="1"
                    max="10"
                    className="p-2 border-t border-b border-gray-300 text-center w-16 text-gray-700"
                  />
                  <button
                    onClick={() =>
                      setNumberOfPeople(Math.min(10, numberOfPeople + 1))
                    }
                    className="p-2 border border-gray-300 rounded-r-md text-gray-600 hover:bg-gray-100"
                    disabled={numberOfPeople >= 10}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex justify-between space-x-4">
                <button
                  onClick={() => setBookingModalOpen(false)}
                  className="flex-1 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePayment}
                  disabled={isSubmitting}
                  className="flex-1 py-2 bg-emerald-600 rounded-md text-white hover:bg-emerald-700 font-medium flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <FiShoppingCart className="mr-2" />
                      Confirm & Pay
                    </span>
                  )}
                </button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    );
  };

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

      {/* Render the booking modal */}
      <BookingModal />

      <Footer />
    </>
  );
}
