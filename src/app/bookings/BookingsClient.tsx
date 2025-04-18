'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { FiCalendar, FiClock, FiMapPin, FiUsers, FiDollarSign, FiChevronDown, FiChevronUp, FiX } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import { useBookings, Booking } from '@/hooks/useBookings';
import { formatRupees } from '@/utils/razorpay';

export default function BookingsClient() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { bookings, loading, error, cancelBooking } = useBookings();
  const [expandedBooking, setExpandedBooking] = useState<string | null>(null);
  const [isConfirmingCancel, setIsConfirmingCancel] = useState<string | null>(null);
  
  // Handle login redirect if not authenticated
  React.useEffect(() => {
    if (!authLoading && !user) {
      toast.info('Please log in to view your bookings');
      router.push('/login');
    }
  }, [user, authLoading, router]);
  
  const toggleBookingDetails = (bookingId: string) => {
    setExpandedBooking(prevId => prevId === bookingId ? null : bookingId);
  };
  
  const handleCancelBooking = async (bookingId: string) => {
    try {
      await cancelBooking(bookingId);
      toast.success('Booking cancelled successfully');
      setIsConfirmingCancel(null);
    } catch (error) {
      toast.error('Failed to cancel booking');
      console.error('Error cancelling booking:', error);
    }
  };
  
  // Format date to readable string
  const formatDate = (date: Date | any) => {
    if (!date) return 'N/A';
    const dateObj = date instanceof Date ? date : date.toDate();
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Get status badge color
  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Render loading state
  if (authLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Bookings</h1>
        <div className="animate-pulse space-y-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-lg shadow p-6">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Bookings</h1>
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-700">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Bookings</h1>
      
      {bookings.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="flex justify-center mb-4">
            <FiCalendar className="h-12 w-12 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">No Bookings Found</h2>
          <p className="text-gray-600 mb-8">You haven't made any bookings yet. Explore our tours and book your next adventure!</p>
          <Link 
            href="/tours" 
            className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-md hover:bg-emerald-700 transition-colors"
          >
            Explore Tours
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map(booking => (
            <div key={booking.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Booking Header */}
              <div 
                className="p-6 cursor-pointer"
                onClick={() => toggleBookingDetails(booking.id)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2 sm:mb-0">
                    {booking.tourDetails?.title || 'Tour'}
                  </h2>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                    <button 
                      className="text-gray-400 hover:text-gray-600"
                      aria-label="Toggle details"
                    >
                      {expandedBooking === booking.id ? <FiChevronUp /> : <FiChevronDown />}
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-y-2">
                  <div className="w-full sm:w-1/2 md:w-1/3 flex items-center text-gray-600">
                    <FiCalendar className="mr-2 text-emerald-500" />
                    <span>Departure: {formatDate(booking.departureDate)}</span>
                  </div>
                  <div className="w-full sm:w-1/2 md:w-1/3 flex items-center text-gray-600">
                    <FiUsers className="mr-2 text-emerald-500" />
                    <span>{booking.numberOfPeople} {booking.numberOfPeople === 1 ? 'Person' : 'People'}</span>
                  </div>
                  <div className="w-full sm:w-1/2 md:w-1/3 flex items-center text-gray-600">
                    <FiDollarSign className="mr-2 text-emerald-500" />
                    <span>Total: {formatRupees(booking.totalAmount)}</span>
                  </div>
                </div>
              </div>
              
              {/* Expanded Details */}
              <AnimatePresence>
                {expandedBooking === booking.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-gray-200"
                  >
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row">
                        {/* Tour Image */}
                        {booking.tourDetails?.imageUrls && booking.tourDetails.imageUrls[0] && (
                          <div className="w-full md:w-1/3 mb-4 md:mb-0 md:mr-6">
                            <div className="relative h-48 rounded-lg overflow-hidden">
                              <Image
                                src={booking.tourDetails.imageUrls[0]}
                                alt={booking.tourDetails.title || 'Tour image'}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </div>
                        )}
                        
                        {/* Tour Details */}
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-800 mb-3">
                            Booking Details
                          </h3>
                          
                          <div className="space-y-2 mb-4">
                            <div className="flex items-start">
                              <FiCalendar className="mt-1 mr-2 text-emerald-500 flex-shrink-0" />
                              <div>
                                <p className="text-sm text-gray-500">Booking Date</p>
                                <p className="text-gray-700">{formatDate(booking.bookingDate)}</p>
                              </div>
                            </div>
                            
                            {booking.tourDetails?.location && (
                              <div className="flex items-start">
                                <FiMapPin className="mt-1 mr-2 text-emerald-500 flex-shrink-0" />
                                <div>
                                  <p className="text-sm text-gray-500">Location</p>
                                  <p className="text-gray-700">{booking.tourDetails.location}</p>
                                </div>
                              </div>
                            )}
                            
                            {booking.tourDetails?.duration && (
                              <div className="flex items-start">
                                <FiClock className="mt-1 mr-2 text-emerald-500 flex-shrink-0" />
                                <div>
                                  <p className="text-sm text-gray-500">Duration</p>
                                  <p className="text-gray-700">{booking.tourDetails.duration} days</p>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {/* Booking Actions */}
                          <div className="flex justify-end items-center mt-4 space-x-4">
                            <Link
                              href={`/tours/${booking.tourId}`}
                              className="px-4 py-2 border border-emerald-600 text-emerald-600 rounded hover:bg-emerald-50 transition-colors"
                            >
                              View Tour
                            </Link>
                            
                            {booking.status !== 'canceled' && booking.status !== 'completed' && (
                              <>
                                {isConfirmingCancel === booking.id ? (
                                  <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-600">Confirm cancellation?</span>
                                    <button
                                      onClick={() => handleCancelBooking(booking.id)}
                                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                                    >
                                      Yes, Cancel
                                    </button>
                                    <button
                                      onClick={() => setIsConfirmingCancel(null)}
                                      className="p-1 text-gray-400 hover:text-gray-600"
                                    >
                                      <FiX />
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => setIsConfirmingCancel(booking.id)}
                                    className="px-4 py-2 border border-red-600 text-red-600 rounded hover:bg-red-50 transition-colors"
                                  >
                                    Cancel Booking
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 