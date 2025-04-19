import React from "react";
import TourDetailClient from "./TourDetailClient";
import { getTour } from "@/lib/tours";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const tour = await getTour(params.id);

  if (!tour) {
    return {
      title: "Tour Not Found",
      description: "The requested tour could not be found.",
    };
  }

  return {
    title: `${tour.title} | Annapurna Tours`,
    description: tour.description.substring(0, 160),
    openGraph: {
      title: `${tour.title} | Annapurna Tours`,
      description: tour.description.substring(0, 160),
    },
  };
}

export default async function TourDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const tour = await getTour(params.id);

  if (!tour) {
    notFound();
  }

  return <TourDetailClient tour={tour} />;
}
