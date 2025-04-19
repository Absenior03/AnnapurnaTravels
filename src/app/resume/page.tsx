"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeading from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

// Import 3D components with dynamic loading
const Scene3D = dynamic(() => import("@/components/3d/Scene3D"), {
  ssr: false,
  loading: () => <LoadingScreen />,
});

// Loading screen
function LoadingScreen() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gradient-to-b from-emerald-800 to-emerald-600 text-white">
      <div className="w-24 h-24 border-8 border-t-white border-b-white/70 border-l-transparent border-r-transparent rounded-full animate-spin mb-8"></div>
      <h2 className="text-2xl font-bold mb-2">Loading 3D Experience</h2>
      <p className="text-gray-200">
        Preparing your visual journey through South Asia...
      </p>
    </div>
  );
}

export default function ResumePage() {
  return (
    <>
      <Navbar />
      <main className="relative overflow-hidden">
        {/* Hero Section with 3D Scene */}
        <section id="hero" className="h-screen relative">
          <Suspense fallback={<LoadingScreen />}>
            <Scene3D />
          </Suspense>

          {/* Overlay with content */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className="max-w-2xl mx-auto text-center px-4">
              <div className="bg-black/30 backdrop-blur-md p-8 rounded-xl shadow-2xl pointer-events-auto">
                <SectionHeading
                  title="South Asia Adventures"
                  subtitle="Immersive 3D Visualization"
                  align="center"
                  tag="Interactive"
                  tagColor="emerald"
                  titleSize="xl"
                />
                <p className="text-white mt-4">
                  Experience our cutting-edge 3D visualization technology that
                  brings South Asian landscapes to life. Scroll to explore our
                  interactive scene.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                  <Button href="/" variant="primary" size="lg" rounded animate>
                    Return Home
                  </Button>
                  <Button
                    href="/tours"
                    variant="outline"
                    size="lg"
                    rounded
                    animate
                  >
                    Browse Tours
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Technology Details Section */}
        <section className="py-20 bg-gradient-to-b from-slate-900 to-emerald-900">
          <div className="container mx-auto px-4">
            <SectionHeading
              title="3D Technology Stack"
              subtitle="Powering our immersive experience"
              align="center"
              divider
              titleSize="lg"
            />

            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                <h3 className="text-xl font-bold text-white mb-3">
                  Interactive Terrain
                </h3>
                <p className="text-gray-200">
                  Dynamically generated 3D terrain with multi-layered simplex
                  noise and real-time response to user interaction.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                <h3 className="text-xl font-bold text-white mb-3">
                  Dynamic Clouds
                </h3>
                <p className="text-gray-200">
                  Physics-based cloud animations that respond to scroll position
                  and mouse movements for a truly immersive experience.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                <h3 className="text-xl font-bold text-white mb-3">
                  Day/Night Cycle
                </h3>
                <p className="text-gray-200">
                  Atmospheric sky component with seamless transitions between
                  day and night, complete with sun, moon, and stars.
                </p>
              </div>
            </div>

            <div className="mt-12 text-center">
              <Button href="/contact" variant="white" size="lg" rounded animate>
                Contact Our Team
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
