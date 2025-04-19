export interface Tour {
  id: string;
  title: string;
  description: string;
  itinerary: string[];
  price: number;
  duration: number;
  departureDate: string;
  highlights: string[];
  featured: boolean;
  location: string;
  maxGroupSize: number;
  difficulty: 'easy' | 'moderate' | 'challenging';
  imageUrls: string[];
  createdAt: any;
  updatedAt: any;
}

export interface User {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  role: 'user' | 'admin';
}

export interface Booking {
  id: string;
  userId: string;
  tourId: string;
  tour: Tour;
  numberOfPeople: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentId: string;
  createdAt: any;
}

export interface Review {
  id: string;
  userId: string;
  tourId: string;
  rating: number;
  comment: string;
  userName: string;
  userPhoto?: string;
  createdAt: any;
}

export interface PexelsImage {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  photographer_id: string;
  alt: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  liked: boolean;
  avg_color: string;
}

export type NavigationItem = {
  name: string;
  href: string;
  current: boolean;
}; 