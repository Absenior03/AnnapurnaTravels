"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiMapPin, FiCalendar, FiClock } from "react-icons/fi";
import { AnimatedCard } from "@/components/ui/AnimatedCard";
import { getFeaturedTours } from "@/lib/tours";
import { Tour } from "@/types";

const ToursShowcase: React.FC = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTours = async () => {
      try {
        setLoading(true);
        const fetchedTours = await getFeaturedTours(3);
        setTours(fetchedTours);
      } catch (err) {
        console.error("Failed to load tours:", err);
        setError("Failed to load tours. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadTours();
  }, []);

  // Staggered animation for cards
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white/10 backdrop-blur-sm rounded-xl h-96 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-lg mt-8">
        <p className="font-medium">{error}</p>
        <p className="mt-2">Please check your connection and try again.</p>
      </div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {tours.map((tour) => (
        <motion.div key={tour.id} variants={item}>
          <AnimatedCard
            title={tour.title}
            description={tour.description.substring(0, 120) + "..."}
            imageUrl={tour.imageUrl}
            href={`/tours/${tour.id}`}
            category={tour.location}
            hoverEffect="3d"
            stats={[
              {
                icon: <FiMapPin className="w-4 h-4" />,
                label: "Days",
                value: tour.duration.toString(),
              },
              {
                icon: <FiCalendar className="w-4 h-4" />,
                label: "Level",
                value: tour.difficulty,
              },
              {
                icon: <FiClock className="w-4 h-4" />,
                label:
                  tour.price.includes === "per person"
                    ? "Per Person"
                    : "Group Price",
                value: `$${tour.price.amount}`,
              },
            ]}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ToursShowcase;
