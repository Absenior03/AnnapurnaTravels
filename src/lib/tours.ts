import { Tour } from "@/types";
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  limit,
} from "firebase/firestore";

// Sample tours data for testing when Firestore is not configured
const sampleTours: Tour[] = [
  {
    id: "everest-base-camp",
    title: "Everest Base Camp Trek",
    description:
      "Trek to the foot of the world's highest mountain on this iconic adventure.",
    fullDescription: `
      The Everest Base Camp trek is one of the most famous treks in the world, taking you through breathtaking mountain scenery and allowing you to experience the unique Sherpa culture. 
      
      Starting with a flight to Lukla, this 14-day journey will take you through picturesque Sherpa villages, rhododendron forests, and across suspension bridges over roaring rivers. As you gradually ascend, you'll be rewarded with unparalleled views of Mount Everest, Lhotse, Nuptse, and other Himalayan giants.
      
      At Everest Base Camp (5,364m), you'll stand at the foot of the world's tallest mountain, a truly humbling experience. You'll also climb Kala Patthar (5,545m) for the best views of Mount Everest's peak.
      
      Throughout the trek, you'll stay in comfortable teahouses, enjoy local cuisine, and learn about the rich Sherpa culture and Buddhist traditions of the region.
    `,
    duration: 14,
    difficulty: "challenging",
    price: 1800,
    location: "South Asia",
    image: "https://images.pexels.com/photos/2335126/pexels-photo-2335126.jpeg",
    gallery: [
      "https://images.pexels.com/photos/2335126/pexels-photo-2335126.jpeg",
      "https://images.pexels.com/photos/4215113/pexels-photo-4215113.jpeg",
      "https://images.pexels.com/photos/3389298/pexels-photo-3389298.jpeg",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Kathmandu",
        description: "Welcome meeting and trek briefing.",
      },
      {
        day: 2,
        title: "Fly to Lukla, Trek to Phakding",
        description: "Scenic mountain flight and begin trekking (2,651m).",
      },
      {
        day: 3,
        title: "Trek to Namche Bazaar",
        description: "Ascend to the Sherpa capital (3,440m).",
      },
      {
        day: 4,
        title: "Acclimatization Day",
        description: "Day hike to viewpoints around Namche.",
      },
      {
        day: 5,
        title: "Trek to Tengboche",
        description: "Visit the famous monastery (3,870m).",
      },
      {
        day: 6,
        title: "Trek to Dingboche",
        description: "Ascend into the high alpine (4,360m).",
      },
      {
        day: 7,
        title: "Acclimatization Day",
        description: "Day hike to Nangkartshang Peak.",
      },
      {
        day: 8,
        title: "Trek to Lobuche",
        description: "Trek along the Khumbu Glacier (4,940m).",
      },
      {
        day: 9,
        title: "Trek to Gorak Shep and EBC",
        description: "Reach Everest Base Camp (5,364m).",
      },
      {
        day: 10,
        title: "Kala Patthar and to Pheriche",
        description: "Early morning climb for sunrise views.",
      },
      {
        day: 11,
        title: "Trek to Namche Bazaar",
        description: "Begin descent (3,440m).",
      },
      {
        day: 12,
        title: "Trek to Lukla",
        description: "Final day of trekking (2,860m).",
      },
      {
        day: 13,
        title: "Fly to Kathmandu",
        description: "Return to Kathmandu, farewell dinner.",
      },
      {
        day: 14,
        title: "Departure Day",
        description: "Transfer to airport for departure.",
      },
    ],
    includes: [
      "All ground transportation",
      "Domestic flights (Kathmandu-Lukla-Kathmandu)",
      "3 nights accommodation in Kathmandu",
      "Teahouse accommodation during the trek",
      "All meals during the trek (breakfast, lunch, dinner)",
      "Experienced English-speaking guide and porters",
      "All necessary permits and entry fees",
      "First aid medical kit",
    ],
    excludes: [
      "International airfare",
      "Travel insurance",
      "Visa fees",
      "Personal expenses",
      "Tips for guides and porters",
      "Alcoholic and bottled beverages",
    ],
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "annapurna-circuit",
    title: "Annapurna Circuit",
    description:
      "Experience diverse landscapes and cultures on this classic Himalayan trek.",
    fullDescription: `
      The Annapurna Circuit is one of the world's classic treks, offering incredible diversity in landscapes, cultures, and ecosystems. This 18-day journey takes you around the entire Annapurna massif, crossing the challenging Thorong La Pass (5,416m).
      
      Starting in lush subtropical forests, you'll gradually ascend through terraced farmland, traditional Hindu villages, and eventually reach the high-altitude desert landscapes of the Manang Valley. Along the way, you'll witness an incredible variety of cultures, from Hindu farming communities to Tibetan Buddhist settlements.
      
      The highlight of the trek is crossing the Thorong La Pass, where you'll be rewarded with panoramic views of the Annapurna range, Dhaulagiri, and the Kali Gandaki Valley - the deepest gorge in the world. After descending to the pilgrimage site of Muktinath, you'll continue through the fascinating village of Marpha, famous for its apple orchards and traditional architecture.
      
      This trek offers a perfect combination of natural beauty, cultural experiences, and physical challenge.
    `,
    duration: 18,
    difficulty: "moderate",
    price: 1600,
    location: "South Asia",
    image: "https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg",
    gallery: [
      "https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg",
      "https://images.pexels.com/photos/1624438/pexels-photo-1624438.jpeg",
      "https://images.pexels.com/photos/2834219/pexels-photo-2834219.jpeg",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Kathmandu",
        description: "Welcome meeting and trek briefing.",
      },
      {
        day: 2,
        title: "Drive to Besisahar",
        description: "Begin journey to trek starting point.",
      },
      {
        day: 3,
        title: "Trek to Bahundanda",
        description: "First day on the trail (1,310m).",
      },
      {
        day: 4,
        title: "Trek to Chamje",
        description: "Through villages and waterfalls (1,410m).",
      },
      {
        day: 5,
        title: "Trek to Dharapani",
        description: "Enter the Manang district (1,960m).",
      },
    ],
    includes: [
      "All ground transportation",
      "3 nights accommodation in Kathmandu",
      "Teahouse accommodation during the trek",
      "All meals during the trek (breakfast, lunch, dinner)",
      "Experienced English-speaking guide and porters",
      "All necessary permits and entry fees",
      "First aid medical kit",
    ],
    excludes: [
      "International airfare",
      "Travel insurance",
      "Visa fees",
      "Personal expenses",
      "Tips for guides and porters",
      "Alcoholic and bottled beverages",
    ],
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "langtang-valley",
    title: "Langtang Valley Trek",
    description:
      "Discover the hidden gem of the Himalayan region in this picturesque valley.",
    fullDescription: `
      The Langtang Valley Trek takes you through the beautiful Langtang National Park, home to diverse flora and fauna, stunning mountain vistas, and authentic Tamang culture.
      
      This 7-day trek is perfect for those with limited time but who still want an authentic Himalayan trekking experience. The trail takes you through rhododendron and bamboo forests, across yak pastures, and past traditional Tamang and Sherpa villages.
      
      The highlight of the trek is reaching Kyanjin Gompa (3,870m), where you'll be surrounded by snow-capped peaks including Langtang Lirung (7,227m). An optional hike to Kyanjin Ri (4,773m) rewards you with incredible 360-degree mountain views.
      
      This trek is less crowded than others in South Asia, offering a more peaceful and authentic experience of the Himalayas.
    `,
    duration: 7,
    difficulty: "moderate",
    price: 950,
    location: "South Asia",
    image: "https://images.pexels.com/photos/1365425/pexels-photo-1365425.jpeg",
    gallery: [
      "https://images.pexels.com/photos/1365425/pexels-photo-1365425.jpeg",
      "https://images.pexels.com/photos/4344260/pexels-photo-4344260.jpeg",
      "https://images.pexels.com/photos/1659437/pexels-photo-1659437.jpeg",
    ],
    itinerary: [
      {
        day: 1,
        title: "Drive from Kathmandu to Syabrubesi",
        description: "Scenic drive through mountains (1,550m).",
      },
      {
        day: 2,
        title: "Trek to Lama Hotel",
        description: "Follow the Langtang River (2,380m).",
      },
      {
        day: 3,
        title: "Trek to Langtang Village",
        description: "Through forests and meadows (3,430m).",
      },
      {
        day: 4,
        title: "Trek to Kyanjin Gompa",
        description: "Visit the ancient monastery (3,870m).",
      },
      {
        day: 5,
        title: "Exploration Day",
        description: "Hike to Kyanjin Ri or Tsergo Ri viewpoint.",
      },
      {
        day: 6,
        title: "Trek to Lama Hotel",
        description: "Begin descent (2,380m).",
      },
      {
        day: 7,
        title: "Trek to Syabrubesi and drive to Kathmandu",
        description: "Final trek and return to Kathmandu.",
      },
    ],
    includes: [
      "All ground transportation",
      "2 nights accommodation in Kathmandu",
      "Teahouse accommodation during the trek",
      "All meals during the trek (breakfast, lunch, dinner)",
      "Experienced English-speaking guide and porters",
      "All necessary permits and entry fees",
      "First aid medical kit",
    ],
    excludes: [
      "International airfare",
      "Travel insurance",
      "Visa fees",
      "Personal expenses",
      "Tips for guides and porters",
      "Alcoholic and bottled beverages",
    ],
    featured: false,
    createdAt: new Date().toISOString(),
  },
];

/**
 * Retrieves all tours from Firestore, or returns sample data if Firestore is not available
 */
export async function getAllTours(): Promise<Tour[]> {
  try {
    // Check if Firestore is available (for SSR)
    if (
      typeof window === "undefined" &&
      (!db || process.env.NODE_ENV === "development")
    ) {
      console.log("Using sample tour data (server-side)");
      return sampleTours;
    }

    // Try to fetch from Firestore
    if (db) {
      const toursRef = collection(db, "tours");
      const snapshot = await getDocs(toursRef);

      if (snapshot.empty) {
        console.log("No tours found in Firestore, using sample data");
        return sampleTours;
      }

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Tour[];
    }

    // Fallback to sample data
    return sampleTours;
  } catch (error) {
    console.error("Error fetching tours:", error);
    return sampleTours;
  }
}

/**
 * Retrieves a specific tour by ID from Firestore or sample data
 */
export async function getTour(id: string): Promise<Tour | null> {
  try {
    // Check if Firestore is available (for SSR)
    if (
      typeof window === "undefined" &&
      (!db || process.env.NODE_ENV === "development")
    ) {
      const tour = sampleTours.find((tour) => tour.id === id);
      return tour || null;
    }

    // Try to fetch from Firestore
    if (db) {
      const tourDoc = await getDoc(doc(db, "tours", id));

      if (tourDoc.exists()) {
        return {
          id: tourDoc.id,
          ...tourDoc.data(),
        } as Tour;
      }

      // If not found in Firestore, try sample data
      const sampleTour = sampleTours.find((tour) => tour.id === id);
      return sampleTour || null;
    }

    // Fallback to sample data
    const tour = sampleTours.find((tour) => tour.id === id);
    return tour || null;
  } catch (error) {
    console.error(`Error fetching tour ${id}:`, error);

    // Try sample data as fallback
    const tour = sampleTours.find((tour) => tour.id === id);
    return tour || null;
  }
}

/**
 * Retrieves featured tours from Firestore or sample data
 */
export async function getFeaturedTours(count: number = 3): Promise<Tour[]> {
  try {
    // Check if Firestore is available (for SSR)
    if (
      typeof window === "undefined" &&
      (!db || process.env.NODE_ENV === "development")
    ) {
      return sampleTours.filter((tour) => tour.featured).slice(0, count);
    }

    // Try to fetch from Firestore
    if (db) {
      const toursRef = collection(db, "tours");
      const featuredQuery = query(
        toursRef,
        where("featured", "==", true),
        limit(count)
      );

      const snapshot = await getDocs(featuredQuery);

      if (snapshot.empty) {
        return sampleTours.filter((tour) => tour.featured).slice(0, count);
      }

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Tour[];
    }

    // Fallback to sample data
    return sampleTours.filter((tour) => tour.featured).slice(0, count);
  } catch (error) {
    console.error("Error fetching featured tours:", error);
    return sampleTours.filter((tour) => tour.featured).slice(0, count);
  }
}
