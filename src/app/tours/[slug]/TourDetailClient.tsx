'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { 
  FiCalendar, 
  FiClock, 
  FiMapPin, 
  FiUsers, 
  FiDollarSign, 
  FiAward, 
  FiCheckCircle,
  FiArrowLeft,
  FiShoppingCart
} from 'react-icons/fi';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useTours } from '@/hooks/useTours';
import { useAuth } from '@/context/AuthContext';
import { Tour } from '@/types';
import ImageCarousel from '@/components/ui/ImageCarousel';
import { createPaymentIntent } from '@/utils/stripe';
import { formatRupees } from '@/utils/razorpay';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface TourDetailClientProps {
  slug: string;
}

export default function TourDetailClient({ slug }: TourDetailClientProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { fetchTourById, loading: tourLoading } = useTours();
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  useEffect(() => {
    async function loadTour() {
      setLoading(true);
      try {
        const tourData = await fetchTourById(slug);
        if (tourData) {
          setTour(tourData);
        } else {
          toast.error('Tour not found');
          router.push('/tours');
        }
      } catch (error) {
        console.error('Error loading tour:', error);
        toast.error('Failed to load tour details');
      } finally {
        setLoading(false);
      }
    }
    
    loadTour();
  }, [slug, fetchTourById, router]);
  
  const handleBookNow = () => {
    if (!user) {
      toast.info('Please log in to book a tour');
      router.push('/login');
      return;
    }
    
    setIsBookingModalOpen(true);
  };
  
  const handlePayment = async () => {
    if (!tour || !user) return;
    
    setIsProcessingPayment(true);
    try {
      const totalAmount = tour.price * numberOfPeople;
      
      // In a real app, we'd create a payment intent and process the payment
      // For demo purposes, we'll just simulate success
      toast.success('Booking confirmed! Thank you for choosing Annapurna Tours.');
      setIsBookingModalOpen(false);
      
      // This would be the real implementation:
      // const paymentIntent = await createPaymentIntent(totalAmount, tour.id, user.uid);
      // Then handle Stripe Elements & payment
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };
  
  if (loading || tourLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded-lg mb-8"></div>
          <div className="h-10 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
          <div className="h-40 bg-gray-200 rounded mb-8"></div>
          <div className="h-40 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }
  
  if (!tour) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Tour not found</h2>
        <p className="text-gray-600 mb-6">The tour you're looking for doesn't exist or has been removed.</p>
        <button
          onClick={() => router.push('/tours')}
          className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700"
        >
          <FiArrowLeft className="mr-2" /> Back to Tours
        </button>
      </div>
    );
  }
  
  // Format date
  const formattedDate = new Date(tour.departureDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <div className="container mx-auto px-4 py-12">
      <button
        onClick={() => router.push('/tours')}
        className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-8"
      >
        <FiArrowLeft className="mr-2" /> Back to Tours
      </button>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <div className="mb-8 rounded-lg overflow-hidden h-[400px]">
            <ImageCarousel images={tour.imageUrls} className="h-full" />
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">{tour.title}</h1>
            
            <div className="flex items-center text-gray-600 mb-6">
              <FiMapPin className="h-5 w-5 mr-2 text-emerald-500" />
              <span>{tour.location}</span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-emerald-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <FiCalendar className="h-5 w-5 mr-2 text-emerald-500" />
                  <span className="text-gray-700 font-medium">Departure</span>
                </div>
                <p className="text-gray-600">{formattedDate}</p>
              </div>
              
              <div className="bg-emerald-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <FiClock className="h-5 w-5 mr-2 text-emerald-500" />
                  <span className="text-gray-700 font-medium">Duration</span>
                </div>
                <p className="text-gray-600">{tour.duration} days</p>
              </div>
              
              <div className="bg-emerald-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <FiUsers className="h-5 w-5 mr-2 text-emerald-500" />
                  <span className="text-gray-700 font-medium">Group Size</span>
                </div>
                <p className="text-gray-600">Max {tour.maxGroupSize} people</p>
              </div>
              
              <div className="bg-emerald-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <FiAward className="h-5 w-5 mr-2 text-emerald-500" />
                  <span className="text-gray-700 font-medium">Difficulty</span>
                </div>
                <p className="text-gray-600 capitalize">{tour.difficulty}</p>
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Description</h2>
              <p className="text-gray-600">{tour.description}</p>
            </div>
            
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Tour Highlights</h2>
              <ul className="space-y-2">
                {tour.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start">
                    <FiCheckCircle className="h-5 w-5 mr-2 text-emerald-500 flex-shrink-0 mt-1" />
                    <span className="text-gray-600">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Itinerary</h2>
              <div className="space-y-6">
                {tour.itinerary.map((day, index) => (
                  <div key={index} className="border-l-2 border-emerald-500 pl-4 py-1">
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Day {index + 1}</h3>
                    <p className="text-gray-600">{day}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center mb-2">
                <FiDollarSign className="h-6 w-6 text-emerald-500" />
                <span className="text-3xl font-bold text-gray-800">{formatRupees(tour.price)}</span>
                <span className="text-gray-500 ml-1">per person</span>
              </div>
              <p className="text-gray-600">All-inclusive package</p>
            </div>
            
            <div className="mb-6">
              <label htmlFor="numberOfPeople" className="block text-sm font-medium text-gray-700 mb-1">
                Number of People
              </label>
              <select
                id="numberOfPeople"
                value={numberOfPeople}
                onChange={(e) => setNumberOfPeople(parseInt(e.target.value))}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              >
                {[...Array(tour.maxGroupSize)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1} {i === 0 ? 'person' : 'people'}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Price per person</span>
                <span className="text-gray-800">{formatRupees(tour.price)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Number of people</span>
                <span className="text-gray-800">{numberOfPeople}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total price</span>
                <span>{formatRupees(tour.price * numberOfPeople)}</span>
              </div>
            </div>
            
            <button
              onClick={handleBookNow}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              <FiShoppingCart className="mr-2" />
              Book Now
            </button>
            
            <div className="mt-4 text-center text-sm text-gray-500">
              No payment required today. Pay later.
            </div>
          </div>
        </div>
      </div>
      
      {/* Booking Modal */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Complete Your Booking</h2>
            
            <div className="mb-6">
              <h3 className="font-medium text-gray-800 mb-2">{tour.title}</h3>
              <div className="flex justify-between text-gray-600 mb-1">
                <span>Departure Date:</span>
                <span>{formattedDate}</span>
              </div>
              <div className="flex justify-between text-gray-600 mb-1">
                <span>Number of People:</span>
                <span>{numberOfPeople}</span>
              </div>
              <div className="flex justify-between text-gray-600 mb-1">
                <span>Tour Duration:</span>
                <span>{tour.duration} days</span>
              </div>
              <div className="flex justify-between font-bold text-lg mt-4">
                <span>Total Price:</span>
                <span>{formatRupees(tour.price * numberOfPeople)}</span>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600 text-sm mb-4">
                By clicking "Confirm Booking", you agree to our terms and conditions.
              </p>
              
              {/* In a real app, this would be the Stripe Elements form */}
              <div className="border border-gray-300 rounded-md p-4 mb-4">
                <p className="text-center text-gray-500">
                  Payment form would appear here in production
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setIsBookingModalOpen(false)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                disabled={isProcessingPayment}
                className="flex-1 flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
              >
                {isProcessingPayment ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Confirm Booking'
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
} 