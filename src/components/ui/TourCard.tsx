'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MdLocationOn, MdTimer, MdCalendarMonth } from 'react-icons/md';
import { FaHiking } from 'react-icons/fa';
import React, { useState } from 'react';
import { Tour } from '@/types';

interface TourCardProps {
  tour: Tour;
}

export default function TourCard({ tour }: TourCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Format date to readable format
  const formattedDate = new Date(tour.departureDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === tour.imageUrls.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? tour.imageUrls.length - 1 : prev - 1
    );
  };

  // Extract carousel controls into a separate client component
  const ImageControls = () => {
    if (tour.imageUrls.length <= 1) return null;
    
    return (
      <>
        <button
          onClick={prevImage}
          className="absolute left-2 top-1/2 -mt-4 bg-black/30 hover:bg-black/50 text-white rounded-full p-1 z-10"
        >
          &#10094;
        </button>
        <button
          onClick={nextImage}
          className="absolute right-2 top-1/2 -mt-4 bg-black/30 hover:bg-black/50 text-white rounded-full p-1 z-10"
        >
          &#10095;
        </button>
      </>
    );
  };

  return (
    <motion.div
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
    >
      <div className="relative h-48 w-full">
        <div className="absolute inset-0">
          <Image
            src={tour.imageUrls[currentImageIndex]}
            alt={tour.title}
            fill
            className="object-cover"
          />
        </div>
        
        <ImageControls />
      </div>
      
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{tour.title}</h3>
        
        <div className="flex items-center text-gray-600 mb-2">
          <MdLocationOn className="mr-1" />
          <span>{tour.location}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex items-center text-gray-600">
            <MdTimer className="mr-1" />
            <span>{tour.duration} days</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <MdCalendarMonth className="mr-1" />
            <span>{formattedDate}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <FaHiking className="mr-1" />
            <span>{tour.difficulty}</span>
          </div>
          
          <div className="flex items-center font-semibold text-emerald-600">
            ₹{tour.price.toLocaleString('en-IN')}
          </div>
        </div>
        
        <Link href={`/tours/${tour.id}`} className="block">
          <motion.div 
            className="bg-emerald-600 text-white py-2 px-4 rounded text-center hover:bg-emerald-700 transition-colors duration-300"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            View Details
          </motion.div>
        </Link>
      </div>
    </motion.div>
  );
} 