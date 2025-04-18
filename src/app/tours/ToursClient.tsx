"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { FiFilter, FiMapPin, FiCalendar, FiDollarSign } from "react-icons/fi";
import TourCard from "@/components/ui/TourCard";
import ParallaxBackground from "@/components/ui/ParallaxBackground";
import { useTours } from "@/hooks/useTours";
import { Tour } from "@/types";

export default function ToursClient() {
  const { tours, loading } = useTours();
  const [filteredTours, setFilteredTours] = useState<Tour[]>([]);
  const searchParams = useSearchParams();

  // Filter states
  const [difficulty, setDifficulty] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [durationRange, setDurationRange] = useState<[number, number]>([1, 30]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // Apply filters
  useEffect(() => {
    if (!tours || !tours.length) return;

    let result = [...tours];

    // Search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (tour) =>
          tour.title.toLowerCase().includes(term) ||
          tour.location.toLowerCase().includes(term) ||
          tour.description.toLowerCase().includes(term)
      );
    }

    // Difficulty filter
    if (difficulty !== "all") {
      result = result.filter((tour) => tour.difficulty === difficulty);
    }

    // Price range filter
    result = result.filter(
      (tour) => tour.price >= priceRange[0] && tour.price <= priceRange[1]
    );

    // Duration range filter
    result = result.filter(
      (tour) =>
        tour.duration >= durationRange[0] && tour.duration <= durationRange[1]
    );

    setFilteredTours(result);
  }, [tours, searchTerm, difficulty, priceRange, durationRange]);

  // Initialize filters from URL params
  useEffect(() => {
    const difficultyParam = searchParams.get("difficulty");
    if (difficultyParam) {
      setDifficulty(difficultyParam);
    }

    const searchParam = searchParams.get("search");
    if (searchParam) {
      setSearchTerm(searchParam);
    }
  }, [searchParams]);

  // Extract filter button component to avoid event handler issues
  const FilterButton = () => (
    <button
      onClick={() => setShowFilters(!showFilters)}
      className="md:w-auto w-full flex items-center justify-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-3 rounded-md font-medium text-sm hover:bg-emerald-200 transition-colors"
    >
      <FiFilter />
      Filters
    </button>
  );

  // Extract reset filters button component
  const ResetFiltersButton = () => (
    <button
      onClick={() => {
        setDifficulty("all");
        setPriceRange([0, 10000]);
        setDurationRange([1, 30]);
        setSearchTerm("");
      }}
      className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors mr-2"
    >
      Reset Filters
    </button>
  );

  // Extract apply filters button component
  const ApplyFiltersButton = () => (
    <button
      onClick={() => setShowFilters(false)}
      className="bg-emerald-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-emerald-700 transition-colors"
    >
      Apply Filters
    </button>
  );

  return (
    <>
      {/* Hero Banner with Parallax */}
      <ParallaxBackground
        imageUrl="https://images.pexels.com/photos/361104/pexels-photo-361104.jpeg"
        overlayOpacity={0.6}
        speed={0.15}
        className="h-[40vh] flex items-center justify-center"
      >
        <div className="text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Explore Our Tours
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-white max-w-3xl mx-auto"
          >
            Discover our expertly crafted tour packages that offer unforgettable
            experiences in the heart of the Himalayas.
          </motion.p>
        </div>
      </ParallaxBackground>

      <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="w-full">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search tours by name, location, or description..."
                  className="block w-full border border-gray-300 rounded-md shadow-sm pl-4 pr-10 py-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <FilterButton />
          </div>

          {/* Expandable filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white p-6 rounded-lg shadow-md mb-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="all">All Difficulties</option>
                    <option value="easy">Easy</option>
                    <option value="moderate">Moderate</option>
                    <option value="challenging">Challenging</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range (INR)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max={priceRange[1]}
                      value={priceRange[0]}
                      onChange={(e) =>
                        setPriceRange([parseInt(e.target.value), priceRange[1]])
                      }
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    <span>to</span>
                    <input
                      type="number"
                      min={priceRange[0]}
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], parseInt(e.target.value)])
                      }
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (Days)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      max={durationRange[1]}
                      value={durationRange[0]}
                      onChange={(e) =>
                        setDurationRange([
                          parseInt(e.target.value),
                          durationRange[1],
                        ])
                      }
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    <span>to</span>
                    <input
                      type="number"
                      min={durationRange[0]}
                      value={durationRange[1]}
                      onChange={(e) =>
                        setDurationRange([
                          durationRange[0],
                          parseInt(e.target.value),
                        ])
                      }
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <ResetFiltersButton />
                <ApplyFiltersButton />
              </div>
            </motion.div>
          )}
        </div>

        {/* Results count */}
        <div className="mb-8">
          <p className="text-gray-600">
            {loading
              ? "Loading tours..."
              : `Showing ${filteredTours.length} ${
                  filteredTours.length === 1 ? "tour" : "tours"
                }`}
          </p>
        </div>

        {/* Tours Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-md h-96 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <>
            {filteredTours.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredTours.map((tour) => (
                  <TourCard key={tour.id} tour={tour} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">
                  No tours found
                </h3>
                <p className="mt-1 text-gray-500">
                  Try adjusting your filters or search criteria.
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => {
                      setDifficulty("all");
                      setPriceRange([0, 10000]);
                      setDurationRange([1, 30]);
                      setSearchTerm("");
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
