"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900 to-teal-900 opacity-90 z-0"></div>
        <div
          className="relative h-[80vh] flex items-center justify-center z-10 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.pexels.com/photos/1586298/pexels-photo-1586298.jpeg')",
          }}
        >
          <div className="text-center max-w-4xl mx-auto px-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Experience the Majesty of the Himalayas
            </h1>
            <p className="text-xl text-white mb-8">
              Discover breathtaking landscapes, ancient cultures, and
              unforgettable adventures with our expert-guided tours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/tours"
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-medium text-lg transition-colors"
              >
                Explore Tours
              </Link>
              <Link
                href="/about"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-md font-medium text-lg transition-colors"
              >
                About Us
              </Link>
            </div>
          </div>
        </div>
      </div>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Discover Nepal's Wonders
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From the towering peaks of the Himalayas to ancient temples and
              vibrant cultures, our expert-led tours offer unforgettable
              experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-lg overflow-hidden shadow-md">
              <img
                src="https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg"
                alt="Mountain Trekking"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Mountain Trekking
                </h3>
                <p className="text-gray-600">
                  Experience world-famous treks including Everest Base Camp and
                  Annapurna Circuit.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg overflow-hidden shadow-md">
              <img
                src="https://images.pexels.com/photos/3617500/pexels-photo-3617500.jpeg"
                alt="Cultural Experiences"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Cultural Experiences
                </h3>
                <p className="text-gray-600">
                  Immerse yourself in the rich history and traditions of Nepal's
                  diverse ethnic groups.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg overflow-hidden shadow-md">
              <img
                src="https://images.pexels.com/photos/3551538/pexels-photo-3551538.jpeg"
                alt="Wildlife Adventures"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Wildlife Adventures
                </h3>
                <p className="text-gray-600">
                  Explore jungle safaris in Chitwan and Bardia National Parks to
                  spot Bengal tigers and rhinos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
