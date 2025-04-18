import React from "react";
import TourSlugWrapper from "./TourSlugWrapper";
import { Metadata, ResolvingMetadata } from "next";

// Define types for route params
type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

// Generate metadata for the page
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = params.slug;

  return {
    title: `Tour Details - ${slug}`,
    description: `View detailed information about our ${slug} tour package.`,
  };
}

// The page component
export default function Page({ params }: Props) {
  // Extract the slug from params
  const slug = params.slug;

  // Ensure we have a slug
  if (!slug) {
    return <div>Tour not found</div>;
  }

  // Create a stable key derived from the slug to maintain component identity
  const tourKey = `tour-${slug}`;

  return <TourSlugWrapper key={tourKey} slug={slug} />;
}
