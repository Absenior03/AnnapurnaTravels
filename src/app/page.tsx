'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowRight, FiMapPin, FiCalendar } from 'react-icons/fi';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TourCard from '@/components/ui/TourCard';
import ImageCarousel from '@/components/ui/ImageCarousel';
import DynamicBackground from '@/components/ui/DynamicBackground';
import DynamicParallaxBackground from '@/components/ui/DynamicParallaxBackground';
import { useTours } from '@/hooks/useTours';
import { getTravelImages } from '@/utils/pexels';
import { PexelsImage } from '@/types';

export default function Home() {
  const { featuredTours, upcomingTours, loading } = useTours();
  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [isHeroLoading, setIsHeroLoading] = useState(true);

  // Fetch hero images from Pexels
  useEffect(() => {
    const fetchHeroImages = async () => {
      try {
        setIsHeroLoading(true);
        const images = await getTravelImages(5);
        setHeroImages(images.map(img => img.src.large));
      } catch (error) {
        console.error('Error fetching hero images:', error);
        // Set default images if Pexels fails
        setHeroImages([
          'https://images.pexels.com/photos/1586298/pexels-photo-1586298.jpeg',
          'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg',
        ]);
      } finally {
        setIsHeroLoading(false);
      }
    };

    fetchHeroImages();
  }, []);

  // Placeholder reviews for the reviews section
  const reviews = [
    {
      id: '1',
      name: 'Sarah Johnson',
      rating: 5,
      comment: 'Absolutely amazing experience! The guides were knowledgeable and the views were breathtaking. Can\'t wait to book another tour with Annapurna.',
      tour: 'Annapurna Base Camp',
      image: 'https://randomuser.me/api/portraits/women/1.jpg',
    },
    {
      id: '2',
      name: 'Michael Chen',
      rating: 5,
      comment: 'The Everest Base Camp trek was challenging but incredibly rewarding. Our guide was excellent and made sure everyone was safe and enjoying the journey.',
      tour: 'Everest Base Camp',
      image: 'https://randomuser.me/api/portraits/men/2.jpg',
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      rating: 4,
      comment: 'Beautiful scenery and well-organized itinerary. The accommodation was better than I expected for such remote locations.',
      tour: 'Langtang Valley',
      image: 'https://randomuser.me/api/portraits/women/3.jpg',
    },
  ];

  // Convert hero images to the format needed for ParallaxHero
  const parallaxImages = !isHeroLoading && heroImages.length > 0
    ? heroImages.map((url, index) => ({
        url,
        speed: 0.2 + (index * 0.15) // Increased speed values for more dramatic effect
      }))
    : [
        {
          url: 'https://images.pexels.com/photos/1586298/pexels-photo-1586298.jpeg',
          speed: 0.3
        }
      ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section with Dynamic Parallax Background */}
      <DynamicParallaxBackground
        className="h-[80vh] flex items-center justify-center"
        colorFrom="#065f46"
        colorTo="#115e59"
        overlayOpacity={0.5}
        parallaxImages={parallaxImages}
      >
        <div className="h-full flex items-center">
          <div className="container mx-auto px-6 md:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="max-w-3xl"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
                Experience the Majesty of the&nbsp;Himalayas
              </h1>
              <p className="text-xl text-white mb-8">
                Discover breathtaking landscapes, ancient cultures, and unforgettable adventures with our expert-guided tours.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/tours"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-md font-medium text-lg transition-colors inline-flex items-center justify-center"
                >
                  Explore Tours <FiArrowRight className="ml-2" />
                </Link>
                <Link
                  href="/about"
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/30 px-6 py-3 rounded-md font-medium text-lg transition-colors inline-flex items-center justify-center"
                >
                  About Us
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Custom animated scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block">
          <motion.div
            animate={{
              y: [0, 12, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: 'loop',
            }}
            className="w-6 h-10 rounded-full border-2 border-white/50 flex justify-center pt-2"
          >
            <motion.div className="w-1.5 h-1.5 rounded-full bg-white" />
          </motion.div>
        </div>
      </DynamicParallaxBackground>

      {/* Featured Tours Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 tracking-tight">Featured Tours</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our most popular and highly-rated tours that showcase the best of the Himalayas.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md h-64 animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              {featuredTours.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {featuredTours.slice(0, 3).map((tour) => (
                    <TourCard key={tour.id} tour={tour} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No featured tours available at the moment.</p>
                </div>
              )}

              <div className="text-center mt-10">
                <Link 
                  href="/tours" 
                  className="inline-flex items-center bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
                >
                  View All Tours <FiArrowRight className="ml-2" />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Upcoming Tours Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Upcoming Tours</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Don't miss your chance to join these adventures departing soon.
            </p>
          </div>

          {loading ? (
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-100 rounded-lg p-4 h-24" />
              ))}
            </div>
          ) : (
            <>
              {upcomingTours.length > 0 ? (
                <div className="space-y-4">
                  {upcomingTours.slice(0, 3).map((tour) => (
                    <Link 
                      key={tour.id} 
                      href={`/tours/${tour.id}`}
                      className="block bg-gray-50 hover:bg-gray-100 rounded-lg p-4 transition-colors"
                    >
                      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                        <div className="w-full md:w-24 h-24 rounded-lg overflow-hidden">
                          <img 
                            src={tour.imageUrls[0]} 
                            alt={tour.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-bold text-lg text-gray-800">{tour.title}</h3>
                          <div className="flex flex-wrap gap-4 mt-2">
                            <div className="flex items-center text-gray-600">
                              <FiMapPin className="h-4 w-4 mr-1 text-emerald-500" />
                              <span className="text-sm">{tour.location}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <FiCalendar className="h-4 w-4 mr-1 text-emerald-500" />
                              <span className="text-sm">
                                {new Date(tour.departureDate).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 md:mt-0">
                          <span className="font-bold text-emerald-600 text-xl">₹{tour.price.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No upcoming tours available at the moment.</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16 bg-emerald-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">What Our Travelers Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hear from those who have experienced our tours firsthand.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={review.image}
                    alt={review.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-800">{review.name}</h3>
                    <p className="text-sm text-gray-500">{review.tour}</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`h-5 w-5 ${
                        i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 italic">"{review.comment}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-emerald-700 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready for Your Next Adventure?</h2>
          <p className="text-lg text-emerald-100 mb-8 max-w-2xl mx-auto">
            Join us on a journey through the magnificent Himalayas. Book your tour today and create memories that will last a lifetime.
          </p>
          <Link
            href="/tours"
            className="bg-white text-emerald-700 hover:bg-emerald-50 px-8 py-3 rounded-md font-medium text-lg transition-colors inline-flex items-center"
          >
            Browse Tours <FiArrowRight className="ml-2" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
