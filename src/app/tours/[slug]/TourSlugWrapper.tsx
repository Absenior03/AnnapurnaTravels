"use client";

import React, { memo, useCallback } from "react";
import TourDetailClient from "./client";

interface TourSlugWrapperProps {
  slug: string;
}

// Use React.memo to prevent unnecessary re-renders
const TourSlugWrapper = memo(function TourSlugWrapper({
  slug,
}: TourSlugWrapperProps) {
  // Using a stable callback to ensure we don't trigger unnecessary re-renders
  const stableSlug = useCallback(() => slug, [slug]);

  console.log("TourSlugWrapper rendering with slug:", slug);

  // Pass key to ensure proper component lifecycle and prevent unintended state resets
  return <TourDetailClient key={`tour-${slug}`} slug={stableSlug()} />;
});

export default TourSlugWrapper;
