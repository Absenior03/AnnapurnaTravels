import React from 'react';
import { Metadata } from 'next';
import BookingsClient from './BookingsClient';

export const metadata: Metadata = {
  title: 'My Bookings | Annapurna Tours',
  description: 'View and manage your tour bookings with Annapurna Tours.',
};

export default function BookingsPage() {
  return <BookingsClient />;
} 