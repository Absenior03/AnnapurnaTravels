"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Tour } from "@/types";
import { getLocationImages } from "@/utils/pexels";

// Cache for tour data to prevent unnecessary fetches
const tourCache = new Map<string, Tour>();

export const useTours = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [featuredTours, setFeaturedTours] = useState<Tour[]>([]);
  const [upcomingTours, setUpcomingTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchInProgress = useRef(new Map<string, Promise<Tour | null>>());

  // Fetch all tours
  const fetchTours = useCallback(async () => {
    setLoading(true);
    try {
      const toursCollection = collection(db, "tours");
      const tourSnapshot = await getDocs(toursCollection);

      const toursList = tourSnapshot.docs.map((doc) => {
        const tourData = {
          id: doc.id,
          ...doc.data(),
        } as Tour;

        // Update cache
        tourCache.set(doc.id, tourData);

        return tourData;
      });

      setTours(toursList);

      // Set featured tours
      setFeaturedTours(toursList.filter((tour) => tour.featured));

      // Set upcoming tours (tours with departure date in the future)
      const currentDate = new Date();
      setUpcomingTours(
        toursList
          .filter((tour) => new Date(tour.departureDate) > currentDate)
          .sort(
            (a, b) =>
              new Date(a.departureDate).getTime() -
              new Date(b.departureDate).getTime()
          )
      );

      setError(null);
    } catch (err) {
      console.error("Error fetching tours:", err);
      setError("Failed to load tours.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch a single tour by ID with caching and deduplication
  const fetchTourById = useCallback(
    async (id: string): Promise<Tour | null> => {
      console.log(`Fetching tour with ID: ${id}`);

      // Check cache first
      if (tourCache.has(id)) {
        console.log(`Cache hit for tour ID: ${id}`);
        return tourCache.get(id) || null;
      }

      // Check if this fetch is already in progress
      if (fetchInProgress.current.has(id)) {
        console.log(`Reusing in-flight request for tour ID: ${id}`);
        return fetchInProgress.current.get(id) || null;
      }

      // Start a new fetch
      const fetchPromise = (async () => {
        try {
          const tourRef = doc(db, "tours", id);
          const tourSnap = await getDoc(tourRef);

          if (tourSnap.exists()) {
            const tourData = { id: tourSnap.id, ...tourSnap.data() } as Tour;
            // Update cache
            tourCache.set(id, tourData);
            return tourData;
          } else {
            setError("Tour not found");
            return null;
          }
        } catch (err) {
          console.error("Error fetching tour:", err);
          setError("Failed to load tour.");
          return null;
        } finally {
          // Remove from in-progress map
          fetchInProgress.current.delete(id);
        }
      })();

      // Store the promise in the in-progress map
      fetchInProgress.current.set(id, fetchPromise);

      return fetchPromise;
    },
    []
  );

  // Add a new tour
  const addTour = useCallback(
    async (
      tourData: Omit<Tour, "id" | "createdAt" | "updatedAt" | "imageUrls">
    ) => {
      try {
        // Fetch images based on the location
        let imageUrls: string[] = [];
        try {
          const images = await getLocationImages(tourData.location);
          if (images && images.length > 0) {
            imageUrls = images.map((img) => img.src?.large || "");
          } else {
            // If no images returned, use default
            imageUrls = [
              "https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg",
            ];
          }
        } catch (imgError) {
          console.error("Error fetching images:", imgError);
          // Use a default image if Pexels API fails
          imageUrls = [
            "https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg",
          ];
        }

        // Filter out any empty URLs
        imageUrls = imageUrls.filter((url) => url);

        // Ensure we have at least one image
        if (imageUrls.length === 0) {
          imageUrls = [
            "https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg",
          ];
        }

        const tourWithTimestamp = {
          ...tourData,
          imageUrls,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };

        const docRef = await addDoc(collection(db, "tours"), tourWithTimestamp);

        // Refetch tours to update the list
        fetchTours();

        return { id: docRef.id, ...tourWithTimestamp };
      } catch (err) {
        console.error("Error adding tour:", err);
        setError("Failed to add tour.");
        throw err;
      }
    },
    [fetchTours]
  );

  // Update a tour
  const updateTour = useCallback(
    async (id: string, tourData: Partial<Tour>) => {
      try {
        const tourRef = doc(db, "tours", id);

        // Add the updated timestamp
        await updateDoc(tourRef, {
          ...tourData,
          updatedAt: serverTimestamp(),
        });

        // Invalidate cache for this tour
        tourCache.delete(id);

        // Refetch tours to update the list
        fetchTours();

        return true;
      } catch (err) {
        console.error("Error updating tour:", err);
        setError("Failed to update tour.");
        throw err;
      }
    },
    [fetchTours]
  );

  // Delete a tour
  const deleteTour = useCallback(
    async (id: string) => {
      try {
        const tourRef = doc(db, "tours", id);
        await deleteDoc(tourRef);

        // Invalidate cache for this tour
        tourCache.delete(id);

        // Refetch tours to update the list
        fetchTours();

        return true;
      } catch (err) {
        console.error("Error deleting tour:", err);
        setError("Failed to delete tour.");
        throw err;
      }
    },
    [fetchTours]
  );

  // Fetch tours on component mount
  useEffect(() => {
    fetchTours();
  }, [fetchTours]);

  return {
    tours,
    featuredTours,
    upcomingTours,
    loading,
    error,
    fetchTours,
    fetchTourById,
    addTour,
    updateTour,
    deleteTour,
  };
};
