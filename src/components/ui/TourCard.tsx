"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FiMapPin, FiCalendar, FiClock, FiChevronRight } from "react-icons/fi";
import { Tour } from "@/types";
import { formatRupees } from "@/utils/razorpay";

interface TourCardProps {
  tour: Tour;
}

export default function TourCard({ tour }: TourCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden h-full transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-64">
        <Image
          src={tour.image}
          alt={tour.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"></div>
        <div className="absolute bottom-0 left-0 p-4">
          <span className="inline-block bg-emerald-600 text-white text-xs font-semibold px-2 py-1 rounded-md">
            {tour.difficulty.charAt(0).toUpperCase() + tour.difficulty.slice(1)}
          </span>
        </div>
        <div className="absolute bottom-0 right-0 p-4">
          <span className="inline-block bg-white/90 backdrop-blur-sm text-emerald-700 text-sm font-bold px-3 py-1 rounded-md">
            {formatRupees(tour.price)}
          </span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
          {tour.title}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{tour.description}</p>

        <div className="flex flex-wrap text-sm text-gray-500 gap-y-2 mb-5">
          <div className="w-full sm:w-1/2 flex items-center">
            <FiMapPin className="text-emerald-500 mr-2" />
            <span>{tour.location}</span>
          </div>
          <div className="w-full sm:w-1/2 flex items-center">
            <FiCalendar className="text-emerald-500 mr-2" />
            <span>{tour.duration} days</span>
          </div>
        </div>

        <Link
          href={`/tours/${tour.id}`}
          className="block w-full bg-gray-50 hover:bg-gray-100 transition-colors text-center text-emerald-700 font-medium py-2 rounded-md border border-gray-200 mt-auto flex items-center justify-center"
        >
          View Details
          <FiChevronRight className="ml-1" />
        </Link>
      </div>
    </div>
  );
}
