"use client";

import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50">
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
          Welcome to Annapurna Tours and Travels
        </h1>
        <p className="text-xl mb-8 text-gray-600">
          Your journey to the Himalayas begins here.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/tours"
            className="px-6 py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors text-lg font-medium"
          >
            Explore Tours
          </Link>
          <Link
            href="/about"
            className="px-6 py-3 bg-white text-emerald-600 border border-emerald-600 rounded-md hover:bg-emerald-50 transition-colors text-lg font-medium"
          >
            About Us
          </Link>
        </div>
      </div>
    </main>
  );
}
