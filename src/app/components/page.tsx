"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Button } from "../../components/ui/Button";

// Loading component
const LoadingState = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-t-emerald-500 border-emerald-200 rounded-full animate-spin mx-auto mb-4"></div>
      <h2 className="text-xl font-semibold text-gray-700">Loading Components</h2>
      <p className="text-gray-500 mt-2">Our beautiful UI components are on their way...</p>
    </div>
  </div>
);

export default function ComponentsPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <LoadingState />;
  }

  // Redirect to UI showcase
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center">
        <div className="max-w-md p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Components Page</h1>
          <p className="mb-6 text-gray-600">
            Our UI components have moved to a dedicated showcase page.
          </p>
          <Button href="/ui-showcase" variant="primary">
            View UI Showcase
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
} 