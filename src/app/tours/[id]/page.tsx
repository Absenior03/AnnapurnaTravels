"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const tours = [
  {
    id: "everest-base-camp",
    title: "Everest Base Camp Trek",
    description:
      "Trek to the foot of the world's highest mountain on this iconic adventure.",
    fullDescription: `
      The Everest Base Camp trek is one of the most famous treks in the world, taking you through breathtaking mountain scenery and allowing you to experience the unique Sherpa culture. 
      
      Starting with a flight to Lukla, this 14-day journey will take you through picturesque Sherpa villages, rhododendron forests, and across suspension bridges over roaring rivers. As you gradually ascend, you'll be rewarded with unparalleled views of Mount Everest, Lhotse, Nuptse, and other Himalayan giants.
      
      At Everest Base Camp (5,364m), you'll stand at the foot of the world's tallest mountain, a truly humbling experience. You'll also climb Kala Patthar (5,545m) for the best views of Mount Everest's peak.
      
      Throughout the trek, you'll stay in comfortable teahouses, enjoy local Nepali cuisine, and learn about the rich Sherpa culture and Buddhist traditions of the region.
    `,
    days: 14,
    difficulty: "Challenging",
    price: 1800,
    image: "https://images.pexels.com/photos/2335126/pexels-photo-2335126.jpeg",
    gallery: [
      "https://images.pexels.com/photos/2335126/pexels-photo-2335126.jpeg",
      "https://images.pexels.com/photos/4215113/pexels-photo-4215113.jpeg",
      "https://images.pexels.com/photos/3389298/pexels-photo-3389298.jpeg",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Kathmandu",
        description: "Welcome meeting and trek briefing.",
      },
      {
        day: 2,
        title: "Fly to Lukla, Trek to Phakding",
        description: "Scenic mountain flight and begin trekking (2,651m).",
      },
      {
        day: 3,
        title: "Trek to Namche Bazaar",
        description: "Ascend to the Sherpa capital (3,440m).",
      },
      {
        day: 4,
        title: "Acclimatization Day",
        description: "Day hike to viewpoints around Namche.",
      },
      {
        day: 5,
        title: "Trek to Tengboche",
        description: "Visit the famous monastery (3,870m).",
      },
      {
        day: 6,
        title: "Trek to Dingboche",
        description: "Ascend into the high alpine (4,360m).",
      },
      {
        day: 7,
        title: "Acclimatization Day",
        description: "Day hike to Nangkartshang Peak.",
      },
      {
        day: 8,
        title: "Trek to Lobuche",
        description: "Trek along the Khumbu Glacier (4,940m).",
      },
      {
        day: 9,
        title: "Trek to Gorak Shep and EBC",
        description: "Reach Everest Base Camp (5,364m).",
      },
      {
        day: 10,
        title: "Kala Patthar and to Pheriche",
        description: "Early morning climb for sunrise views.",
      },
      {
        day: 11,
        title: "Trek to Namche Bazaar",
        description: "Begin descent (3,440m).",
      },
      {
        day: 12,
        title: "Trek to Lukla",
        description: "Final day of trekking (2,860m).",
      },
      {
        day: 13,
        title: "Fly to Kathmandu",
        description: "Return to Kathmandu, farewell dinner.",
      },
      {
        day: 14,
        title: "Departure Day",
        description: "Transfer to airport for departure.",
      },
    ],
    includes: [
      "All ground transportation",
      "Domestic flights (Kathmandu-Lukla-Kathmandu)",
      "3 nights accommodation in Kathmandu",
      "Teahouse accommodation during the trek",
      "All meals during the trek (breakfast, lunch, dinner)",
      "Experienced English-speaking guide and porters",
      "All necessary permits and entry fees",
      "First aid medical kit",
    ],
    excludes: [
      "International airfare",
      "Travel insurance",
      "Nepal visa fees",
      "Personal expenses",
      "Tips for guides and porters",
      "Alcoholic and bottled beverages",
    ],
  },
  {
    id: "annapurna-circuit",
    title: "Annapurna Circuit",
    description:
      "Experience diverse landscapes and cultures on this classic Himalayan trek.",
    fullDescription: `
      The Annapurna Circuit is one of the world's classic treks, offering incredible diversity in landscapes, cultures, and ecosystems. This 18-day journey takes you around the entire Annapurna massif, crossing the challenging Thorong La Pass (5,416m).
      
      Starting in lush subtropical forests, you'll gradually ascend through terraced farmland, traditional Hindu villages, and eventually reach the high-altitude desert landscapes of the Manang Valley. Along the way, you'll witness an incredible variety of cultures, from Hindu farming communities to Tibetan Buddhist settlements.
      
      The highlight of the trek is crossing the Thorong La Pass, where you'll be rewarded with panoramic views of the Annapurna range, Dhaulagiri, and the Kali Gandaki Valley - the deepest gorge in the world. After descending to the pilgrimage site of Muktinath, you'll continue through the fascinating village of Marpha, famous for its apple orchards and traditional architecture.
      
      This trek offers a perfect combination of natural beauty, cultural experiences, and physical challenge.
    `,
    days: 18,
    difficulty: "Moderate to Challenging",
    price: 1600,
    image: "https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg",
    gallery: [
      "https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg",
      "https://images.pexels.com/photos/1624438/pexels-photo-1624438.jpeg",
      "https://images.pexels.com/photos/2834219/pexels-photo-2834219.jpeg",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Kathmandu",
        description: "Welcome meeting and trek briefing.",
      },
      {
        day: 2,
        title: "Drive to Besisahar",
        description: "Begin journey to trek starting point.",
      },
      {
        day: 3,
        title: "Trek to Bahundanda",
        description: "First day on the trail (1,310m).",
      },
      // More itinerary items would go here
    ],
    includes: [
      "All ground transportation",
      "3 nights accommodation in Kathmandu",
      "Teahouse accommodation during the trek",
      "All meals during the trek (breakfast, lunch, dinner)",
      "Experienced English-speaking guide and porters",
      "All necessary permits and entry fees",
      "First aid medical kit",
    ],
    excludes: [
      "International airfare",
      "Travel insurance",
      "Nepal visa fees",
      "Personal expenses",
      "Tips for guides and porters",
      "Alcoholic and bottled beverages",
    ],
  },
];

export default function TourDetailPage() {
  const params = useParams();
  const tourId = params.id as string;

  const tour = tours.find((t) => t.id === tourId);

  if (!tour) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-6 py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Tour Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            Sorry, we couldn't find the tour you're looking for.
          </p>
          <Link
            href="/tours"
            className="px-6 py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
          >
            Browse All Tours
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="bg-gray-50">
        <div className="relative">
          <div className="absolute inset-0 bg-black opacity-60 z-0"></div>
          <div
            className="relative h-[50vh] flex items-center justify-center z-10 bg-cover bg-center"
            style={{
              backgroundImage: `url('${tour.image}')`,
            }}
          >
            <div className="text-center max-w-4xl mx-auto px-6">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {tour.title}
              </h1>
              <p className="text-xl text-white">{tour.description}</p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                  Overview
                </h2>
                <div className="prose prose-lg max-w-none">
                  {tour.fullDescription
                    .split("\n\n")
                    .map((paragraph, index) => (
                      <p key={index} className="mb-4">
                        {paragraph.trim()}
                      </p>
                    ))}
                </div>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                  Itinerary
                </h2>
                <div className="space-y-6">
                  {tour.itinerary.map((item) => (
                    <div
                      key={item.day}
                      className="border-l-4 border-emerald-500 pl-4"
                    >
                      <h3 className="text-xl font-bold text-gray-800 mb-1">
                        Day {item.day}: {item.title}
                      </h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                  Photo Gallery
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {tour.gallery.map((image, index) => (
                    <div
                      key={index}
                      className="rounded-lg overflow-hidden shadow-md"
                    >
                      <img
                        src={image}
                        alt={`${tour.title} - Gallery ${index + 1}`}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <div className="text-center mb-6">
                  <span className="text-3xl font-bold text-emerald-600">
                    ${tour.price}
                  </span>
                  <span className="text-gray-600"> / per person</span>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-semibold">{tour.days} days</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Difficulty:</span>
                    <span className="font-semibold">{tour.difficulty}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Group Size:</span>
                    <span className="font-semibold">2-12 people</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Max Altitude:</span>
                    <span className="font-semibold">5,545m</span>
                  </div>
                </div>

                <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-md transition-colors mb-4">
                  Book Now
                </button>

                <Link
                  href="/contact"
                  className="block w-full bg-white text-emerald-600 border border-emerald-600 text-center font-medium py-3 rounded-md hover:bg-emerald-50 transition-colors"
                >
                  Inquire
                </Link>

                <div className="mt-8 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      What's Included
                    </h3>
                    <ul className="space-y-2">
                      {tour.includes.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <svg
                            className="h-5 w-5 text-emerald-500 mr-2 mt-0.5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-gray-600">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      What's Excluded
                    </h3>
                    <ul className="space-y-2">
                      {tour.excludes.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <svg
                            className="h-5 w-5 text-red-500 mr-2 mt-0.5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-gray-600">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
