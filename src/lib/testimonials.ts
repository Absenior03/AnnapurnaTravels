// Testimonial type definition
export interface Testimonial {
  id: number;
  name: string;
  location: string;
  image: string;
  rating: number;
  text: string;
  tourName?: string;
  date?: string;
  verified?: boolean;
}

// Testimonials data
const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    location: "United Kingdom",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    rating: 5,
    text: "The South Asian adventure with ATAT was truly life-changing. Our guide was knowledgeable and passionate, making the experience unforgettable.",
    tourName: "Everest Base Camp Trek",
    date: "March 2023",
    verified: true,
  },
  {
    id: 2,
    name: "Michael Chen",
    location: "United States",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    rating: 5,
    text: "Trekking through the Himalayas with ATAT exceeded all my expectations. The attention to detail and safety measures were impressive.",
    tourName: "Annapurna Circuit",
    date: "October 2022",
    verified: true,
  },
  {
    id: 3,
    name: "Elena Petrova",
    location: "Russia",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    rating: 5,
    text: "The cultural immersion across South Asia was unparalleled. ATAT provided authentic experiences while respecting local traditions.",
    tourName: "Langtang Valley Trek",
    date: "April 2023",
    verified: true,
  },
  {
    id: 4,
    name: "Raj Patel",
    location: "India",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    rating: 4,
    text: "Amazing experience exploring the Himalayan mountains. The guides were excellent and the views breathtaking. Highly recommend!",
    tourName: "Manaslu Circuit",
    date: "September 2022",
    verified: true,
  },
  {
    id: 5,
    name: "Emma Wilson",
    location: "Australia",
    image: "https://randomuser.me/api/portraits/women/5.jpg",
    rating: 5,
    text: "One of the best trekking experiences of my life. The team took care of everything from accommodations to meals, allowing us to fully enjoy the journey.",
    tourName: "K2 Base Camp",
    date: "July 2023",
    verified: true,
  },
  {
    id: 6,
    name: "David Kim",
    location: "South Korea",
    image: "https://randomuser.me/api/portraits/men/6.jpg",
    rating: 5,
    text: "The South Asian cultural tour was perfectly balanced between adventure and relaxation. I appreciated the small group size and personalized attention.",
    tourName: "Cultural Heritage Tour",
    date: "May 2023",
    verified: true,
  },
  {
    id: 7,
    name: "Sophie Dubois",
    location: "France",
    image: "https://randomuser.me/api/portraits/women/7.jpg",
    rating: 4,
    text: "The mountain landscapes were even more beautiful than I imagined. Our guide shared fascinating stories about local history and customs.",
    tourName: "Everest Base Camp Trek",
    date: "April 2022",
    verified: true,
  },
  {
    id: 8,
    name: "Carlos Rodriguez",
    location: "Spain",
    image: "https://randomuser.me/api/portraits/men/8.jpg",
    rating: 5,
    text: "Everything from booking to the actual trek was handled professionally. The guides were supportive during challenging parts of the climb.",
    tourName: "Annapurna Circuit",
    date: "November 2022",
    verified: true,
  },
  {
    id: 9,
    name: "Yuki Tanaka",
    location: "Japan",
    image: "https://randomuser.me/api/portraits/women/9.jpg",
    rating: 5,
    text: "The wildlife safari combined with mountain trekking created a perfect adventure. We saw rare animals and experienced incredible natural beauty.",
    tourName: "Chitwan Safari Trek",
    date: "February 2023",
    verified: true,
  },
];

/**
 * Get all testimonials
 */
export function getTestimonials(): Testimonial[] {
  return testimonials;
}

/**
 * Get testimonials filtered by rating
 */
export function getTestimonialsByRating(minRating: number): Testimonial[] {
  return testimonials.filter((testimonial) => testimonial.rating >= minRating);
}

/**
 * Get a specific number of featured testimonials
 */
export function getFeaturedTestimonials(count: number = 3): Testimonial[] {
  // Sort by rating (highest first) and then take the specified count
  return [...testimonials].sort((a, b) => b.rating - a.rating).slice(0, count);
}

/**
 * Get a testimonial by ID
 */
export function getTestimonialById(id: number): Testimonial | undefined {
  return testimonials.find((testimonial) => testimonial.id === id);
}

/**
 * Get testimonials for a specific tour
 */
export function getTestimonialsByTour(tourName: string): Testimonial[] {
  return testimonials.filter(
    (testimonial) =>
      testimonial.tourName?.toLowerCase() === tourName.toLowerCase()
  );
}
