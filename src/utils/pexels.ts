import { createClient, Photos, Photo } from 'pexels';
import { PexelsImage } from '@/types';

const pexelsClient = createClient(process.env.NEXT_PUBLIC_PEXELS_API_KEY || '');

export async function searchImages(query: string, perPage: number = 10): Promise<PexelsImage[]> {
  try {
    const response = await pexelsClient.photos.search({ 
      query, 
      per_page: perPage,
      orientation: 'landscape'
    });
    
    if ('photos' in response) {
      return response.photos as unknown as PexelsImage[];
    }
    return [];
  } catch (error) {
    console.error('Error fetching images from Pexels:', error);
    return [];
  }
}

export async function getTravelImages(perPage: number = 10): Promise<PexelsImage[]> {
  return searchImages('travel landscape mountains nature adventure', perPage);
}

export async function getLocationImages(location: string, perPage: number = 5): Promise<PexelsImage[]> {
  return searchImages(`${location} travel landscape`, perPage);
} 