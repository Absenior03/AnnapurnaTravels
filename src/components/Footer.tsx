"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Annapurna Tours</h3>
            <p className="text-gray-300 mb-4">
              Experience the majesty of the Himalayas with our expert-guided
              tours.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/tours"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Tours
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Tours */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Popular Tours</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/tours/everest-base-camp"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Everest Base Camp
                </Link>
              </li>
              <li>
                <Link
                  href="/tours/annapurna-circuit"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Annapurna Circuit
                </Link>
              </li>
              <li>
                <Link
                  href="/tours/langtang-valley"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Langtang Valley
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <address className="not-italic text-gray-300">
              <p>Thamel, Kathmandu</p>
              <p>Nepal</p>
              <p className="mt-3">info@annapurnatours.com</p>
              <p>+977 1234567890</p>
            </address>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            &copy; {currentYear} Annapurna Tours and Travels. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
