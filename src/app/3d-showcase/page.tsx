"use client";

import React from "react";
import dynamic from "next/dynamic";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { FiMap, FiCamera, FiHeart } from "react-icons/fi";

// Dynamically import the 3D component with no SSR
const MountainShowcase = dynamic(
  () =>
    import("@/components/3d/MountainShowcase").then((mod) => ({
      default: mod.MountainShowcase,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="h-[80vh] min-h-[600px] bg-gradient-to-b from-blue-900 to-black flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Loading 3D Experience...
          </h2>
          <p className="text-lg opacity-80">
            Please wait while we prepare your adventure
          </p>
        </div>
      </div>
    ),
  }
);

export default function ShowcasePage() {
  return (
    <main className="min-h-screen">
      {/* Mountain Showcase */}
      <MountainShowcase />

      {/* Why Trek With Us Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Why Trek With Us"
            subtitle="Experience the world's most breathtaking mountains with expert guides"
            align="center"
            divider={true}
            titleSize="xl"
          />

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-gray-50 p-8 rounded-lg shadow-md transition-transform hover:scale-105 duration-300">
              <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center mb-6">
                <FiMap className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">Expert Local Guides</h3>
              <p className="text-gray-600">
                Our guides have decades of experience navigating the South Asian
                mountain ranges and provide cultural insights you won't find
                elsewhere.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg shadow-md transition-transform hover:scale-105 duration-300">
              <div className="w-16 h-16 rounded-full bg-purple-500 flex items-center justify-center mb-6">
                <FiCamera className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">Unforgettable Views</h3>
              <p className="text-gray-600">
                Trek through diverse landscapes from lush forests to snow-capped
                peaks, capturing moments that will last a lifetime.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg shadow-md transition-transform hover:scale-105 duration-300">
              <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center mb-6">
                <FiHeart className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">Sustainable Tourism</h3>
              <p className="text-gray-600">
                We're committed to preserving the natural beauty and supporting
                local communities throughout South Asia's mountain regions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Treks Section */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Popular Mountain Treks"
            subtitle="From the Himalayas to the Karakoram, experience the majesty of South Asia"
            align="center"
            divider={true}
            titleSize="xl"
            tag="Explore"
            tagColor="blue"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            {popularTreks.map((trek, index) => (
              <div
                key={index}
                className="bg-white rounded-xl overflow-hidden shadow-lg"
              >
                <div
                  className="h-64 bg-cover bg-center"
                  style={{ backgroundImage: `url(${trek.image})` }}
                />
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold">{trek.name}</h3>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {trek.duration}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-6">{trek.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">${trek.price}</span>
                    <Button variant="primary" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
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
            <Button variant="white" size="lg">
              Browse All Treks
            </Button>
            <Button variant="outline" size="lg">
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </main>
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
