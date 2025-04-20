"use client";

import React, { useState, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import SectionHeading from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import {
  FiMap,
  FiCamera,
  FiHeart,
  FiCpu,
  FiBluetooth,
  FiWifi,
} from "react-icons/fi";
import ErrorBoundary from "@/components/ErrorBoundary";
import { shouldOptimizeForRegion } from "./region-optimization";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Fallback component while loading
const LoadingFallback = () => (
  <div className="h-[80vh] min-h-[600px] bg-gradient-to-b from-blue-900 to-black flex items-center justify-center">
    <div className="text-white text-center">
      <h2 className="text-3xl md:text-5xl font-bold mb-4">
        Loading 3D Experience...
      </h2>
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <p className="text-lg opacity-80">
        Please wait while we prepare your adventure
      </p>
    </div>
  </div>
);

// Error fallback component
const ErrorFallback = () => (
  <div className="h-[80vh] min-h-[600px] bg-gradient-to-b from-indigo-900 to-blue-900 flex items-center justify-center">
    <div className="text-white text-center max-w-md mx-auto p-8">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        Experience the Mountains
      </h2>
      <p className="text-lg opacity-80 mb-6">
        Discover breathtaking mountain landscapes across South Asia
      </p>
      <Button href="/tours" variant="primary" size="lg" rounded>
        Explore Tours
      </Button>
    </div>
  </div>
);

// Static mountain showcase that works everywhere
const StaticMountainShowcase = () => (
  <div className="h-[80vh] min-h-[600px] overflow-hidden relative">
    <div className="absolute inset-0 bg-gradient-to-b from-indigo-900 to-blue-900 z-0"></div>
    <div className="absolute inset-0 z-10 flex items-center justify-center">
      <div className="text-white text-center max-w-xl p-8">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">
          South Asian Mountains
        </h2>
        <p className="text-xl mb-6">
          Explore the majestic peaks of the Himalayas and Karakoram with our
          expert guides
        </p>
        <Button href="/tours" variant="primary" size="lg" rounded>
          Find Your Adventure
        </Button>
      </div>
    </div>
    {/* Mountain silhouette overlay */}
    <div
      className="absolute bottom-0 left-0 right-0 h-[40%] z-5 bg-black opacity-70"
      style={{
        clipPath:
          "polygon(0% 100%, 15% 65%, 33% 78%, 45% 56%, 63% 72%, 78% 60%, 100% 75%, 100% 100%)",
      }}
    ></div>
  </div>
);

// Dynamically import the 3D component with no SSR
const MountainShowcase = dynamic(
  () => import("@/components/3d/MountainShowcase"),
  {
    ssr: false,
    loading: () => <LoadingFallback />,
  }
);

// Performance stats card component
const PerformanceCard = ({
  icon,
  title,
  value,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  color: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: Math.random() * 0.3 }}
    className={`bg-white rounded-lg shadow-lg p-6 flex flex-col items-center ${color}`}
  >
    <div
      className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${color}`}
    >
      {icon}
    </div>
    <h3 className="text-lg font-semibold mb-1">{title}</h3>
    <p className="text-gray-600">{value}</p>
  </motion.div>
);

export default function ShowcasePage() {
  const [allowFancy3D, setAllowFancy3D] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState({
    hardware: "Checking...",
    connectivity: "Checking...",
    browser: "Checking...",
    region: "Checking...",
  });

  // Determine if we should show the 3D view based on device performance
  useEffect(() => {
    setIsClient(true);

    // Check if we're in a region that needs optimization
    const isOptimizedRegion = shouldOptimizeForRegion();

    // Check if device can likely handle 3D content
    const checkDeviceCapability = () => {
      // Skip 3D on lower-end devices
      const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
      const hasStrongCPU = navigator.hardwareConcurrency > 4;
      const hasMemory = navigator.deviceMemory
        ? navigator.deviceMemory >= 4
        : true;

      // Collect device information for display
      const browserInfo = navigator.userAgent.match(
        /(chrome|safari|firefox|edge|opera|trident)\/?\s*(\d+)/i
      );
      const browserName = browserInfo ? browserInfo[1] : "Unknown";

      let regionInfo = "Unknown";
      try {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const region = timezone.split("/")[0];
        const city = timezone.split("/")[1];
        regionInfo = city ? `${city}, ${region}` : region;
      } catch (e) {
        console.error("Error getting timezone:", e);
      }

      // Check network connection if available
      let connectionInfo = "Unknown";
      try {
        // @ts-ignore
        if (navigator.connection) {
          // @ts-ignore
          const effectiveType = navigator.connection.effectiveType;
          // @ts-ignore
          const downlink = navigator.connection.downlink;
          connectionInfo = `${effectiveType.toUpperCase()} (${downlink} Mbps)`;
        }
      } catch (e) {
        console.error("Error getting connection info:", e);
      }

      setDeviceInfo({
        hardware: `${navigator.hardwareConcurrency || "Unknown"} Cores${
          hasMemory ? `, ${navigator.deviceMemory}GB RAM` : ""
        }`,
        connectivity: connectionInfo,
        browser: `${browserName} ${browserInfo ? browserInfo[2] : ""}`,
        region: regionInfo,
      });

      return !isOptimizedRegion && (!isMobile || hasStrongCPU);
    };

    setAllowFancy3D(checkDeviceCapability());
  }, []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Mountain Showcase with Error Boundary */}
        <ErrorBoundary fallback={<StaticMountainShowcase />}>
          {isClient && allowFancy3D ? (
            <MountainShowcase />
          ) : (
            <StaticMountainShowcase />
          )}
        </ErrorBoundary>

        {/* Performance Information Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <SectionHeading
              title="Adaptive 3D Experience"
              subtitle="Our 3D showcase automatically adjusts to your device and location for optimal performance"
              align="center"
              divider={true}
              titleSize="lg"
            />

            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <PerformanceCard
                icon={<FiCpu className="text-blue-500 text-2xl" />}
                title="Hardware"
                value={deviceInfo.hardware}
                color="bg-blue-50"
              />
              <PerformanceCard
                icon={<FiWifi className="text-purple-500 text-2xl" />}
                title="Connection"
                value={deviceInfo.connectivity}
                color="bg-purple-50"
              />
              <PerformanceCard
                icon={<FiBluetooth className="text-green-500 text-2xl" />}
                title="Browser"
                value={deviceInfo.browser}
                color="bg-green-50"
              />
              <PerformanceCard
                icon={<FiMap className="text-orange-500 text-2xl" />}
                title="Region"
                value={deviceInfo.region}
                color="bg-orange-50"
              />
            </div>

            <div className="mt-12 text-center bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
              <p className="text-gray-700 mb-4">
                {allowFancy3D
                  ? "Your device is using the high-quality 3D experience with dynamic lighting and detailed models."
                  : "We've provided an optimized experience for your device and location to ensure smooth performance."}
              </p>
              <Button href="/tours" variant="secondary" size="lg">
                View Adventure Tours
              </Button>
            </div>
          </div>
        </section>

        {/* Why Trek With Us Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <SectionHeading
              title="Why Trek With Us"
              subtitle="Experience the world's most breathtaking mountains with expert guides"
              align="center"
              divider={true}
              titleSize="lg"
            />

            <div className="grid md:grid-cols-3 gap-8 mt-16">
              <div className="bg-gray-50 p-8 rounded-lg shadow-md transition-transform hover:scale-105 duration-300">
                <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center mb-6">
                  <FiMap className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-bold mb-3">Expert Local Guides</h3>
                <p className="text-gray-600">
                  Our guides have decades of experience navigating the South
                  Asian mountain ranges and provide cultural insights you won't
                  find elsewhere.
                </p>
              </div>

              <div className="bg-gray-50 p-8 rounded-lg shadow-md transition-transform hover:scale-105 duration-300">
                <div className="w-16 h-16 rounded-full bg-purple-500 flex items-center justify-center mb-6">
                  <FiCamera className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-bold mb-3">Unforgettable Views</h3>
                <p className="text-gray-600">
                  Trek through diverse landscapes from lush forests to
                  snow-capped peaks, capturing moments that will last a
                  lifetime.
                </p>
              </div>

              <div className="bg-gray-50 p-8 rounded-lg shadow-md transition-transform hover:scale-105 duration-300">
                <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center mb-6">
                  <FiHeart className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-bold mb-3">Sustainable Tourism</h3>
                <p className="text-gray-600">
                  We're committed to preserving the natural beauty and
                  supporting local communities throughout South Asia's mountain
                  regions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6">
              Ready for Your Next Adventure?
            </h2>
            <p className="text-xl mb-10 max-w-3xl mx-auto">
              Start planning your journey to the magnificent mountains of South
              Asia today.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Button href="/tours" variant="white" size="lg">
                Browse All Treks
              </Button>
              <Button href="/contact" variant="outline" size="lg">
                Contact Us
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

// Sample data for popular treks
const popularTreks = [
  {
    name: "Everest Base Camp",
    duration: "14 Days",
    price: 1899,
    description:
      "Trek to the base of the world's highest mountain through stunning Himalayan landscapes.",
    image:
      "https://images.unsplash.com/photo-1533130061792-64b345e4a833?ixlib=rb-4.0.3&auto=format&fit=crop",
  },
  {
    name: "Annapurna Circuit",
    duration: "18 Days",
    price: 1699,
    description:
      "Experience diverse terrain from subtropical forests to high alpine environments.",
    image:
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&auto=format&fit=crop",
  },
  {
    name: "Langtang Valley",
    duration: "10 Days",
    price: 1299,
    description:
      "A peaceful trek through rhododendron forests and traditional villages with mountain views.",
    image:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop",
  },
  {
    name: "K2 Base Camp",
    duration: "21 Days",
    price: 2499,
    description:
      "The ultimate expedition trek to the base of the world's second-highest mountain.",
    image:
      "https://images.unsplash.com/photo-1522028202127-b9d89807c151?ixlib=rb-4.0.3&auto=format&fit=crop",
  },
  {
    name: "Manaslu Circuit",
    duration: "16 Days",
    price: 1899,
    description:
      "A remote trek around the world's eighth highest mountain with incredible biodiversity.",
    image:
      "https://images.unsplash.com/photo-1593097751929-5640b93a2497?ixlib=rb-4.0.3&auto=format&fit=crop",
  },
  {
    name: "Markha Valley",
    duration: "12 Days",
    price: 1599,
    description:
      "Explore the stark beauty of Ladakh's mountains and traditional Buddhist villages.",
    image:
      "https://images.unsplash.com/photo-1544735176-7c1ae84397e6?ixlib=rb-4.0.3&auto=format&fit=crop",
  },
];
