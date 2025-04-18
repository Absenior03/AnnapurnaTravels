import * as PexelsAPI from "pexels";
import { PexelsImage } from "@/types";

// Create a fallback client if API key is not available
const createSafeClient = () => {
  try {
    // For version 1.4.0 of pexels package
    const client = PexelsAPI.createClient(
      process.env.NEXT_PUBLIC_PEXELS_API_KEY || ""
    );
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

const pexelsClient = createSafeClient();

export async function searchImages(
  query: string,
  perPage: number = 10
): Promise<PexelsImage[]> {
  try {
    if (!process.env.NEXT_PUBLIC_PEXELS_API_KEY) {
      console.warn("Pexels API key not provided - returning empty results");
      return [];
    }

    const response = await pexelsClient.photos.search({
      query,
      per_page: perPage,
      orientation: "landscape",
    });

    if (response && "photos" in response) {
      return response.photos as unknown as PexelsImage[];
    }
    return [];
  } catch (error) {
    console.error("Error fetching images from Pexels:", error);
    return [];
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
