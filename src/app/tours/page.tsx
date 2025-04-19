"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const tours = [
  {
    id: "everest-base-camp",
    title: "Everest Base Camp Trek",
    description:
      "Trek to the foot of the world's highest mountain on this iconic adventure.",
    days: 14,
    difficulty: "Challenging",
    price: 1800,
    image: "https://images.pexels.com/photos/2335126/pexels-photo-2335126.jpeg",
  },
  {
    id: "annapurna-circuit",
    title: "Annapurna Circuit",
    description:
      "Experience diverse landscapes and cultures on this classic Himalayan trek.",
    days: 18,
    difficulty: "Moderate to Challenging",
    price: 1600,
    image: "https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg",
  },
  {
    id: "langtang-valley",
    title: "Langtang Valley Trek",
    description:
      "Discover stunning mountain vistas and Tamang culture in this hidden gem.",
    days: 10,
    difficulty: "Moderate",
    price: 1200,
    image: "https://images.pexels.com/photos/4356144/pexels-photo-4356144.jpeg",
  },
  {
    id: "manaslu-circuit",
    title: "Manaslu Circuit Trek",
    description:
      "Off-the-beaten-path adventure around the world's eighth highest mountain.",
    days: 16,
    difficulty: "Challenging",
    price: 1900,
    image: "https://images.pexels.com/photos/7602068/pexels-photo-7602068.jpeg",
  },
  {
    id: "ghorepani-poon-hill",
    title: "Ghorepani Poon Hill Trek",
    description:
      "Short trek with spectacular sunrise views over the Annapurna range.",
    days: 6,
    difficulty: "Easy to Moderate",
    price: 800,
    image: "https://images.pexels.com/photos/7019490/pexels-photo-7019490.jpeg",
  },
  {
    id: "upper-mustang",
    title: "Upper Mustang Trek",
    description:
      "Journey to the forbidden kingdom with its unique landscape and culture.",
    days: 14,
    difficulty: "Moderate",
    price: 2200,
    image: "https://images.pexels.com/photos/7061661/pexels-photo-7061661.jpeg",
  },
];

export default function ToursPage() {
  return (
    <>
      <Navbar />
      <main className="bg-gray-50">
        <div className="relative">
          <div className="absolute inset-0 bg-black opacity-60 z-0"></div>
          <div
            className="relative h-[40vh] md:h-[50vh] flex items-center justify-center z-10 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg')",
            }}
          >
            <div className="text-center max-w-4xl mx-auto px-6">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Our Tours
              </h1>
              <p className="text-xl text-white">
                Unforgettable journeys through the Himalayan mountains
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tours.map((tour) => (
              <div
                key={tour.id}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <img
                  src={tour.image}
                  alt={tour.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-2">
                    {tour.title}
                  </h2>
                  <p className="text-gray-600 mb-4">{tour.description}</p>
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-sm text-gray-500">
                      <span className="block">Duration: {tour.days} days</span>
                      <span className="block">
                        Difficulty: {tour.difficulty}
                      </span>
                    </div>
                    <span className="text-lg font-bold text-emerald-600">
                      ${tour.price}
                    </span>
                  </div>
                  <Link
                    href={`/tours/${tour.id}`}
                    className="block w-full bg-emerald-600 hover:bg-emerald-700 text-white text-center py-2 rounded-md transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
