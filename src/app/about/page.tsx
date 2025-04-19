"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AboutPage() {
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
                "url('https://images.pexels.com/photos/2581922/pexels-photo-2581922.jpeg')",
            }}
          >
            <div className="text-center max-w-4xl mx-auto px-6">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                About Us
              </h1>
              <p className="text-xl text-white">
                Learn about our passion for the Himalayas and commitment to
                sustainable tourism
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Our Story</h2>
            <div className="prose prose-lg max-w-none">
              <p className="mb-6">
                Founded in 2010, Annapurna Tours and Travels was born from our
                founder's passion for the Himalayan mountains and desire to
                share the beauty of Nepal with the world. What started as a
                small trekking operation has grown into a full-service tour
                agency with a reputation for excellence and authentic
                experiences.
              </p>
              <p className="mb-6">
                Our team consists of experienced guides who are not only experts
                in mountain trekking but also deeply knowledgeable about local
                cultures, flora, and fauna. Many of our guides are natives of
                the regions we explore, giving you a truly authentic perspective
                on your journey.
              </p>
              <p className="mb-6">
                Over the years, we've helped thousands of travelers from around
                the world experience the majesty of the Himalayas and the warmth
                of Nepali hospitality. Whether you're a seasoned trekker looking
                to conquer challenging routes or a first-time visitor seeking a
                cultural immersion, our personalized approach ensures that your
                experience will be unforgettable.
              </p>

              <h3 className="text-2xl font-bold text-gray-800 mt-12 mb-6">
                Our Mission
              </h3>
              <p className="mb-6">
                At Annapurna Tours and Travels, our mission is to provide
                exceptional travel experiences that connect people with the
                natural beauty and cultural richness of Nepal while promoting
                sustainable tourism practices that benefit local communities.
              </p>
              <p className="mb-6">
                We believe that travel should be transformative not only for our
                guests but also for the places we visit. That's why we're
                committed to:
              </p>
              <ul className="list-disc pl-8 mb-6">
                <li>
                  Supporting local economies by employing local guides and staff
                </li>
                <li>
                  Minimizing our environmental footprint through responsible
                  waste management and conservation initiatives
                </li>
                <li>
                  Preserving cultural heritage by promoting respectful
                  engagement with local traditions
                </li>
                <li>
                  Providing fair wages and excellent working conditions for all
                  our team members
                </li>
                <li>
                  Giving back to communities through educational and development
                  projects
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
