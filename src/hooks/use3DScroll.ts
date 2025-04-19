import { useState, useEffect } from "react";
import { useSpring, useTransform, useScroll } from "framer-motion";

interface ScrollAnimation {
  camera: {
    position: [number, number, number];
    rotation: [number, number, number];
  };
  models: {
    [key: string]: {
      position: [number, number, number];
      rotation: [number, number, number];
      scale: [number, number, number];
      opacity: number;
    };
  };
  lights: {
    ambient: {
      intensity: number;
      color: string;
    };
    directional: {
      position: [number, number, number];
      intensity: number;
      color: string;
    };
  };
}

interface UseScrollAnimationOptions {
  target: React.RefObject<HTMLElement>;
}

export function use3DScroll({ target }: UseScrollAnimationOptions) {
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile devices on mount
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Get scroll progress
  const { scrollYProgress } = useScroll({
    target,
    offset: ["start start", "end end"],
  });

  // Smoother scroll progress with spring physics
  const smoothScroll = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Define keyframes for camera position based on scroll progress
  const cameraPositionX = useTransform(
    smoothScroll,
    [0, 0.25, 0.5, 0.75, 1],
    isMobile ? [0, 0, 0, 0, 0] : [0, -2, 0, 2, 0]
  );

  const cameraPositionY = useTransform(
    smoothScroll,
    [0, 0.2, 0.4, 0.6, 0.8, 1],
    [0, 1, 0, 1, 0, -1]
  );

  const cameraPositionZ = useTransform(
    smoothScroll,
    [0, 0.2, 0.4, 0.6, 0.8, 1],
    [10, 8, 9, 7, 8, 10]
  );

  // Define model animations for the mountains
  const mountainPositionY = useTransform(
    smoothScroll,
    [0, 0.5, 1],
    [0, -1, -3]
  );

  const mountainScale = useTransform(smoothScroll, [0, 0.5, 1], [1, 1.2, 0.8]);

  // Define model animations for the compass
  const compassRotationY = useTransform(
    smoothScroll,
    [0, 0.3, 0.6, 1],
    [0, Math.PI * 2, Math.PI * 4, Math.PI * 6]
  );

  const compassOpacity = useTransform(
    smoothScroll,
    [0, 0.1, 0.4, 0.5, 0.9, 1],
    [0, 1, 1, 0, 0, 0]
  );

  // Define model animations for the backpack
  const backpackPositionX = useTransform(
    smoothScroll,
    [0, 0.3, 0.6, 1],
    [-5, -3, 0, 3]
  );

  const backpackOpacity = useTransform(
    smoothScroll,
    [0, 0.3, 0.4, 0.6, 0.7, 1],
    [0, 0, 1, 1, 0, 0]
  );

  // Define model animations for the tent
  const tentPositionY = useTransform(
    smoothScroll,
    [0, 0.5, 0.7, 1],
    [-5, -5, 0, 0]
  );

  const tentOpacity = useTransform(
    smoothScroll,
    [0, 0.5, 0.6, 0.9, 1],
    [0, 0, 1, 1, 0]
  );

  // Define light animations
  const ambientLightIntensity = useTransform(
    smoothScroll,
    [0, 0.5, 1],
    [0.5, 0.8, 0.4]
  );

  const directionalLightIntensity = useTransform(
    smoothScroll,
    [0, 0.5, 1],
    [1, 1.5, 0.8]
  );

  // Get current values
  const getCurrentAnimation = (): ScrollAnimation => {
    return {
      camera: {
        position: [
          cameraPositionX.get(),
          cameraPositionY.get(),
          cameraPositionZ.get(),
        ],
        rotation: [0, 0, 0],
      },
      models: {
        mountain: {
          position: [0, mountainPositionY.get(), 0],
          rotation: [0, 0, 0],
          scale: [
            mountainScale.get(),
            mountainScale.get(),
            mountainScale.get(),
          ],
          opacity: 1,
        },
        compass: {
          position: [2, 0, 0],
          rotation: [0, compassRotationY.get(), 0],
          scale: [1, 1, 1],
          opacity: compassOpacity.get(),
        },
        backpack: {
          position: [backpackPositionX.get(), 0, 0],
          rotation: [0, 0, 0],
          scale: [1, 1, 1],
          opacity: backpackOpacity.get(),
        },
        tent: {
          position: [0, tentPositionY.get(), 0],
          rotation: [0, 0, 0],
          scale: [1, 1, 1],
          opacity: tentOpacity.get(),
        },
      },
      lights: {
        ambient: {
          intensity: ambientLightIntensity.get(),
          color: "#ffffff",
        },
        directional: {
          position: [10, 10, 10],
          intensity: directionalLightIntensity.get(),
          color: "#ffffff",
        },
      },
    };
  };

  return {
    scrollYProgress: smoothScroll,
    getCurrentAnimation,
    isMobile,
  };
}
