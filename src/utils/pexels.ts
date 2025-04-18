import * as PexelsAPI from "pexels";
import { PexelsImage } from "@/types";

// Hardcoded API key as fallback if environment variable is not set
const FALLBACK_API_KEY =
  "HoAeHZmKw7dVWxZY0KrvYJb3D598dG5rjcXnPI94htumjdJKV6H4gK6d";

// Safely get API key from multiple sources
const getApiKey = () => {
  // Try environment variable from runtime config
  const envKey = process.env.NEXT_PUBLIC_PEXELS_API_KEY;

  // Check if key is available and not empty
  if (envKey && envKey.trim() !== "" && envKey !== "undefined") {
    return envKey;
  }

  // Fallback to hardcoded key
  console.warn(
    "Using fallback Pexels API key - environment variable not found"
  );
  return FALLBACK_API_KEY;
};

// Create a fallback client if API key is not available
const createSafeClient = () => {
  try {
    // Get API key with fallback
    const apiKey = getApiKey();

    // For version 1.4.0 of pexels package
    if (!apiKey) {
      throw new Error("No API key available");
    }

    const client = PexelsAPI.createClient(apiKey);
    return client;
  } catch (error) {
    console.error("Failed to initialize Pexels client:", error);
    // Return a mock client to prevent runtime errors
    return {
      photos: {
        search: async () => ({ photos: [] }),
        curated: async () => ({ photos: [] }),
      },
    };
  }
};

// Initialize client on load
const pexelsClient = createSafeClient();

// Default image to use when API fails
const DEFAULT_IMAGES = [
  {
    id: 2387873,
    width: 5472,
    height: 3648,
    url: "https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg",
    photographer: "Asad Photo Maldives",
    photographer_url: "https://www.pexels.com/@asadphotography",
    photographer_id: 1144696,
    alt: "Mountain landscape",
    src: {
      original:
        "https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg",
      large2x:
        "https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      large:
        "https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      medium:
        "https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&h=350",
      small:
        "https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&h=130",
      portrait:
        "https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
      landscape:
        "https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      tiny: "https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280",
    },
    liked: false,
    avg_color: "#908772",
  },
] as unknown as PexelsImage[];

export async function searchImages(
  query: string,
  perPage: number = 10
): Promise<PexelsImage[]> {
  try {
    // Skip API call if client is likely to be a mock
    if (!getApiKey()) {
      console.warn("Pexels API key not provided - returning default images");
      return DEFAULT_IMAGES;
    }

    const response = await pexelsClient.photos.search({
      query,
      per_page: perPage,
      orientation: "landscape",
    });

    if (response && "photos" in response && response.photos.length > 0) {
      return response.photos as unknown as PexelsImage[];
    }
    return DEFAULT_IMAGES;
  } catch (error) {
    console.error("Error fetching images from Pexels:", error);
    return DEFAULT_IMAGES;
  }
}

export async function getTravelImages(
  perPage: number = 10
): Promise<PexelsImage[]> {
  return searchImages("travel landscape mountains nature adventure", perPage);
}

export async function getLocationImages(
  location: string,
  perPage: number = 5
): Promise<PexelsImage[]> {
  return searchImages(`${location} travel landscape`, perPage);
}
