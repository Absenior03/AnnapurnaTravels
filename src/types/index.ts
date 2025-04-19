export interface Tour {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  duration: number;
  difficulty: "easy" | "moderate" | "challenging";
  price: number;
  location: string;
  image: string;
  gallery: string[];
  itinerary: ItineraryDay[];
  includes: string[];
  excludes: string[];
  featured?: boolean;
  createdAt?: string;
}

export interface User {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL?: string | null;
  role: "admin" | "user";
}

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  tourId: string;
  tourTitle: string;
  bookingDate: string;
  amount: number;
  paymentId?: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  tourId: string;
  rating: number;
  comment: string;
  createdAt: string;
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

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
}
