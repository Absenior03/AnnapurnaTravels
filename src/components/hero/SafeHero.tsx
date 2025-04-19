"use client";

import React from "react";
import dynamic from "next/dynamic";
import ErrorBoundary from "@/components/error/ErrorBoundary";
import { FiChevronRight } from "react-icons/fi";
import Link from "next/link";

// Simplified fallback hero component
const FallbackHero = () => (
  <div className="w-full h-[95vh] relative bg-gradient-to-b from-emerald-800 to-emerald-600 flex items-center justify-center">
    <div className="text-center px-6">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
        Discover South Asia
      </h1>
      <p className="text-xl text-white mb-10 max-w-3xl mx-auto">
        Experience the breathtaking beauty of South Asia with our immersive
        tours.
      </p>
      <div className="flex flex-col sm:flex-row gap-6 justify-center">
        <Link
          href="#tours"
          className="bg-white text-emerald-700 hover:bg-gray-100 px-8 py-3.5 rounded-md font-semibold text-base transition-all shadow-lg hover:shadow-xl inline-flex items-center"
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
      </div>
    </div>
  </div>
);

// Dynamically import the 3D Hero with no SSR
const DynamicHero3D = dynamic(() => import("./Hero3D"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[95vh] flex items-center justify-center bg-gradient-to-b from-emerald-800 to-emerald-600">
      <div className="text-white text-2xl">Loading 3D Experience...</div>
    </div>
  ),
});

// Safe wrapper for the 3D hero that gracefully falls back if needed
export default function SafeHero() {
  return (
    <ErrorBoundary fallback={<FallbackHero />}>
      <DynamicHero3D />
    </ErrorBoundary>
  );
}
