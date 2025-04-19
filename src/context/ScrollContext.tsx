"use client";

import React, { createContext, useContext, useRef, useEffect } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";

interface ScrollContextProps {
  scrollY: React.MutableRefObject<number>;
  scrollYProgress: React.MutableRefObject<number>;
  isScrolling: React.MutableRefObject<boolean>;
  scrollDirection: React.MutableRefObject<"up" | "down" | null>;
  registerScrollElement: (element: HTMLElement) => void;
}

const ScrollContext = createContext<ScrollContextProps | null>(null);

export const useScrollContext = () => {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error("useScrollContext must be used within a ScrollProvider");
  }
  return context;
};

export const ScrollProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Create refs to store values
  const scrollY = useRef<number>(0);
  const scrollYProgress = useRef<number>(0);
  const isScrolling = useRef<boolean>(false);
  const scrollDirection = useRef<"up" | "down" | null>(null);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const prevScrollY = useRef<number>(0);

  // Motion values from framer-motion
  const { scrollY: motionScrollY, scrollYProgress: motionScrollYProgress } =
    useScroll();

  // Update refs with current scroll values
  useMotionValueEvent(motionScrollY, "change", (latest) => {
    // Determine scroll direction
    if (latest > prevScrollY.current) {
      scrollDirection.current = "down";
    } else if (latest < prevScrollY.current) {
      scrollDirection.current = "up";
    }

    // Update values
    scrollY.current = latest;
    prevScrollY.current = latest;

    // Set scrolling state
    isScrolling.current = true;

    // Clear previous timeout
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    // Set timeout to detect when scrolling stops
    scrollTimeout.current = setTimeout(() => {
      isScrolling.current = false;
    }, 150);
  });

  useMotionValueEvent(motionScrollYProgress, "change", (latest) => {
    scrollYProgress.current = latest;
  });

  // Function to register custom scroll elements
  const registerScrollElement = (element: HTMLElement) => {
    // Implementation for custom scroll elements if needed
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, []);

  const contextValue: ScrollContextProps = {
    scrollY,
    scrollYProgress,
    isScrolling,
    scrollDirection,
    registerScrollElement,
  };

  return (
    <ScrollContext.Provider value={contextValue}>
      <div ref={containerRef} style={{ position: "relative" }}>
        {children}
      </div>
    </ScrollContext.Provider>
  );
};

export default ScrollContext;
