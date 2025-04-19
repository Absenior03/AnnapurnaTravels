// Replace the problematic Pexels library with hardcoded data
// This file completely bypasses the Pexels library to avoid build issues
import { PexelsImage } from "@/types";

// Default images that will be used for all requests
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
  {
    id: 1287145,
    width: 5184,
    height: 3456,
    url: "https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg",
    photographer: "Eberhard Grossgasteiger",
    photographer_url: "https://www.pexels.com/@eberhardgross",
    photographer_id: 121938,
    alt: "Mountain landscape with snow",
    src: {
      original:
        "https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg",
      large2x:
        "https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      large:
        "https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      medium:
        "https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&h=350",
      small:
        "https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&h=130",
      portrait:
        "https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
      landscape:
        "https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      tiny: "https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280",
    },
    liked: false,
    avg_color: "#CACBCF",
  },
  {
    id: 1624438,
    width: 3840,
    height: 2160,
    url: "https://images.pexels.com/photos/1624438/pexels-photo-1624438.jpeg",
    photographer: "James Wheeler",
    photographer_url: "https://www.pexels.com/@souvenirpixels",
    photographer_id: 558609,
    alt: "Mountain landscape with lake",
    src: {
      original:
        "https://images.pexels.com/photos/1624438/pexels-photo-1624438.jpeg",
      large2x:
        "https://images.pexels.com/photos/1624438/pexels-photo-1624438.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      large:
        "https://images.pexels.com/photos/1624438/pexels-photo-1624438.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      medium:
        "https://images.pexels.com/photos/1624438/pexels-photo-1624438.jpeg?auto=compress&cs=tinysrgb&h=350",
      small:
        "https://images.pexels.com/photos/1624438/pexels-photo-1624438.jpeg?auto=compress&cs=tinysrgb&h=130",
      portrait:
        "https://images.pexels.com/photos/1624438/pexels-photo-1624438.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
      landscape:
        "https://images.pexels.com/photos/1624438/pexels-photo-1624438.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      tiny: "https://images.pexels.com/photos/1624438/pexels-photo-1624438.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280",
    },
    liked: false,
    avg_color: "#8191A5",
  },
] as PexelsImage[];

// Get a random subset of images of the specified size
const getRandomImages = (count: number): PexelsImage[] => {
  // Always return at least one image
  const imagesToReturn = Math.max(1, Math.min(count, DEFAULT_IMAGES.length));
  return DEFAULT_IMAGES.slice(0, imagesToReturn);
};

// Exported functions maintain the same interface as before
export async function searchImages(
  query: string,
  perPage: number = 10
): Promise<PexelsImage[]> {
  console.log(`Searching images for query: ${query} (using hardcoded images)`);
  return getRandomImages(perPage);
}

export async function getTravelImages(
  perPage: number = 10
): Promise<PexelsImage[]> {
  console.log("Getting travel images (using hardcoded images)");
  return getRandomImages(perPage);
}

export async function getLocationImages(
  location: string,
  perPage: number = 5
): Promise<PexelsImage[]> {
  console.log(
    `Getting images for location: ${location} (using hardcoded images)`
  );
  return getRandomImages(perPage);
}
