'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  getDoc, 
  addDoc, 
  doc, 
  deleteDoc, 
  updateDoc, 
  serverTimestamp, 
  Timestamp,
  orderBy
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { Tour } from '@/types';

export interface Booking {
  id: string;
  userId: string;
  tourId: string;
  tourDetails?: Tour;
  bookingDate: Timestamp | Date;
  departureDate: Timestamp | Date;
  numberOfPeople: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'canceled' | 'completed';
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

export const useBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all bookings for the current user
  const fetchUserBookings = useCallback(async () => {
    if (!user) {
      setBookings([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const bookingsCollection = collection(db, 'bookings');
      const bookingsQuery = query(
        bookingsCollection, 
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      
      const bookingsSnapshot = await getDocs(bookingsQuery);
      const bookingsList: Booking[] = [];

      // Process each booking document
      for (const bookingDoc of bookingsSnapshot.docs) {
        const bookingData = bookingDoc.data() as Omit<Booking, 'id'>;
        const booking: Booking = { id: bookingDoc.id, ...bookingData };

        // Fetch tour details for each booking
        try {
          const tourRef = doc(db, 'tours', booking.tourId);
          const tourSnap = await getDoc(tourRef);
          
          if (tourSnap.exists()) {
            booking.tourDetails = { id: tourSnap.id, ...tourSnap.data() } as Tour;
          }
        } catch (err) {
          console.error(`Error fetching tour details for booking ${booking.id}:`, err);
        }

        bookingsList.push(booking);
      }

      setBookings(bookingsList);
      setError(null);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to load your bookings.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Create a new booking
  const createBooking = useCallback(async (bookingData: {
    tourId: string;
    departureDate: Date;
    numberOfPeople: number;
    totalAmount: number;
  }) => {
    if (!user) {
      throw new Error('You must be logged in to make a booking');
    }

    try {
      const newBooking = {
        userId: user.uid,
        ...bookingData,
        bookingDate: new Date(),
        status: 'confirmed',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'bookings'), newBooking);
      
      // Refresh bookings list
      fetchUserBookings();
      
      return { id: docRef.id, ...newBooking };
    } catch (err) {
      console.error('Error creating booking:', err);
      throw new Error('Failed to create booking');
    }
  }, [user, fetchUserBookings]);

  // Cancel a booking
  const cancelBooking = useCallback(async (bookingId: string) => {
    if (!user) {
      throw new Error('You must be logged in to cancel a booking');
    }

    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      
      // Update the booking status to canceled
      await updateDoc(bookingRef, {
        status: 'canceled',
        updatedAt: serverTimestamp(),
      });
      
      // Refresh bookings list
      fetchUserBookings();
      
      return true;
    } catch (err) {
      console.error('Error canceling booking:', err);
      throw new Error('Failed to cancel booking');
    }
  }, [user, fetchUserBookings]);

  // Fetch bookings on component mount and when user changes
  useEffect(() => {
    fetchUserBookings();
  }, [fetchUserBookings]);

  return {
    bookings,
    loading,
    error,
    fetchUserBookings,
    createBooking,
    cancelBooking,
  };
}; 