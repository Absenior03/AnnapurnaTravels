"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiCalendar, FiMapPin, FiClock, FiUser } from 'react-icons/fi';
import { Tour } from '@/types';

interface FeaturedTourCardProps {
  tour: Tour;
  priority?: boolean;
  className?: string;
}

export default function FeaturedTourCard({ 
  tour, 
  priority = false, 
  className = '' 
}: FeaturedTourCardProps) {
  return (
    <div className={`group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}>
      <div className="relative h-64 w-full overflow-hidden">
        <Image 
          src={tour.image} 
          alt={tour.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          priority={priority}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>
      
      <div className="absolute bottom-0 w-full p-4 text-white">
        <h3 className="mb-2 text-xl font-bold">{tour.title}</h3>
        
        <div className="mb-3 flex flex-wrap gap-3 text-sm">
          <div className="flex items-center">
            <FiMapPin className="mr-1" />
            {tour.location}
          </div>
          <div className="flex items-center">
            <FiCalendar className="mr-1" />
            {tour.duration} days
          </div>
          <div className="flex items-center">
            <FiClock className="mr-1" />
            {tour.season}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-lg font-bold">
            <span>${tour.price}</span>
            <span className="ml-1 text-sm opacity-80">/ person</span>
          </div>
          
          <Link href={`/tours/${tour.id}`}>
            <span className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium transition-colors hover:bg-blue-700">
              View Details
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
} 