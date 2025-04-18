'use client';

import Link from 'next/link';
import { FiFacebook, FiInstagram, FiTwitter, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-medium text-emerald-400 mb-5 tracking-wide">Annapurna Tours</h3>
            <p className="text-gray-300 mb-6 font-light leading-relaxed">
              Experience the beauty and majesty of the Himalayas with our expertly crafted tour packages.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-gray-400 hover:text-emerald-400 transition-colors">
                <FiFacebook className="h-5 w-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-400 hover:text-emerald-400 transition-colors">
                <FiInstagram className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-gray-400 hover:text-emerald-400 transition-colors">
                <FiTwitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-medium text-emerald-400 mb-5 tracking-wide">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-300 hover:text-emerald-400 transition-colors font-light">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/tours" className="text-gray-300 hover:text-emerald-400 transition-colors font-light">
                  Tours
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-emerald-400 transition-colors font-light">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-gray-300 hover:text-emerald-400 transition-colors font-light">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/signup" className="text-gray-300 hover:text-emerald-400 transition-colors font-light">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Popular Tours */}
          <div>
            <h3 className="text-xl font-medium text-emerald-400 mb-5 tracking-wide">Popular Tours</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/tours" className="text-gray-300 hover:text-emerald-400 transition-colors font-light">
                  Annapurna Base Camp
                </Link>
              </li>
              <li>
                <Link href="/tours" className="text-gray-300 hover:text-emerald-400 transition-colors font-light">
                  Everest Base Camp
                </Link>
              </li>
              <li>
                <Link href="/tours" className="text-gray-300 hover:text-emerald-400 transition-colors font-light">
                  Manaslu Circuit
                </Link>
              </li>
              <li>
                <Link href="/tours" className="text-gray-300 hover:text-emerald-400 transition-colors font-light">
                  Langtang Valley
                </Link>
              </li>
              <li>
                <Link href="/tours" className="text-gray-300 hover:text-emerald-400 transition-colors font-light">
                  Upper Mustang
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-xl font-medium text-emerald-400 mb-5 tracking-wide">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <FiMapPin className="h-5 w-5 mr-3 text-emerald-400 flex-shrink-0" />
                <span className="text-gray-300 font-light">
                  123 Thamel Street, Kathmandu, Nepal
                </span>
              </li>
              <li className="flex items-center">
                <FiPhone className="h-5 w-5 mr-3 text-emerald-400 flex-shrink-0" />
                <a href="tel:+9771234567890" className="text-gray-300 hover:text-emerald-400 transition-colors font-light">
                  +977 1234 567 890
                </a>
              </li>
              <li className="flex items-center">
                <FiMail className="h-5 w-5 mr-3 text-emerald-400 flex-shrink-0" />
                <a href="mailto:info@annapurnatours.com" className="text-gray-300 hover:text-emerald-400 transition-colors font-light">
                  info@annapurnatours.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-16 pt-10 text-center text-gray-400">
          <p className="font-light tracking-wide">© {currentYear} Annapurna Tours and Travels. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 