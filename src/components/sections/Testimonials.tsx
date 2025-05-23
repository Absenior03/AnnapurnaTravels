"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronLeft, FiChevronRight, FiStar } from "react-icons/fi";
import { getTestimonials, Testimonial } from "@/lib/testimonials";

// Load testimonials from the library
const testimonialsList = getTestimonials().slice(0, 6);

const Testimonials: React.FC = () => {
  const [active, setActive] = useState(0);
  const [testimonials, setTestimonials] =
    useState<Testimonial[]>(testimonialsList);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const next = () => {
    setActive((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Render stars based on rating
  const Stars = ({ rating }: { rating: number }) => (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <FiStar
          key={i}
          className={`${
            i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
          } w-5 h-5`}
        />
      ))}
    </div>
  );

  return (
    <div className="relative">
      <div className="relative overflow-hidden bg-gradient-to-b from-emerald-900/20 to-emerald-700/20 backdrop-blur-sm rounded-2xl px-4 py-10 sm:px-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex flex-col items-center text-center">
              <div className="relative h-24 w-24 rounded-full overflow-hidden border-4 border-emerald-500 mb-6">
                <Image
                  src={testimonials[active].image}
                  alt={testimonials[active].name}
                  fill
                  className="object-cover"
                />
              </div>

              <Stars rating={testimonials[active].rating} />

              <blockquote className="mt-6 mb-4 text-xl md:text-2xl font-light italic text-white">
                "{testimonials[active].text}"
              </blockquote>

              <div className="text-white font-bold text-lg">
                {testimonials[active].name}
              </div>

              <div className="text-gray-300 text-sm">
                {testimonials[active].location}
              </div>

              {testimonials[active].tourName && (
                <div className="mt-1 text-emerald-300 text-sm">
                  {testimonials[active].tourName}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        <button
          onClick={prev}
          className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 rounded-full z-10"
          aria-label="Previous testimonial"
        >
          <FiChevronLeft className="h-6 w-6" />
        </button>

        <button
          onClick={next}
          className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 rounded-full z-10"
          aria-label="Next testimonial"
        >
          <FiChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Indicator dots */}
      <div className="flex justify-center mt-6 space-x-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setActive(index)}
            className={`h-3 w-3 rounded-full ${
              index === active ? "bg-emerald-500" : "bg-gray-400 bg-opacity-30"
            } transition-all duration-300`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
