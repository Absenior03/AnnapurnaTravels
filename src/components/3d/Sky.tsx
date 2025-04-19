import React, { useRef, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Sphere, Stars } from "@react-three/drei";
import * as THREE from "three";
import { useScroll } from "@/context/ScrollContext";

interface SkyProps {
  isDayTime?: boolean;
  transitionDuration?: number;
  starsCount?: number;
  sunPosition?: [number, number, number];
  moonPosition?: [number, number, number];
  scrollEffect?: boolean;
}

export const Sky: React.FC<SkyProps> = ({
  isDayTime = true,
  transitionDuration = 2,
  starsCount = 1000,
  sunPosition = [0, 10, -50],
  moonPosition = [0, 10, -50],
  scrollEffect = true,
}) => {
  const { scene } = useThree();
  const { scrollYProgress } = useScroll();
  const skyRef = useRef<THREE.Mesh>(null);
  const sunRef = useRef<THREE.Mesh>(null);
  const moonRef = useRef<THREE.Mesh>(null);

  // State to track current colors for smooth transitions
  const [currentSkyColor, setCurrentSkyColor] = useState(
    isDayTime ? "#87CEEB" : "#0c1445"
  );
  const [currentSunColor, setCurrentSunColor] = useState(
    isDayTime ? "#FDB813" : "#e1e1e1"
  );
  const [currentSunIntensity, setCurrentSunIntensity] = useState(
    isDayTime ? 1.0 : 0.3
  );
  const [currentFogDensity, setCurrentFogDensity] = useState(
    isDayTime ? 0.005 : 0.02
  );

  // Define day and night colors
  const dayColors = {
    sky: "#87CEEB",
    sun: "#FDB813",
    ambientLight: 0.8,
    fogDensity: 0.005,
  };

  const nightColors = {
    sky: "#0c1445",
    moon: "#e1e1e1",
    ambientLight: 0.3,
    fogDensity: 0.02,
  };

  // Set up fog
  useEffect(() => {
    scene.fog = new THREE.FogExp2(currentSkyColor, currentFogDensity);

    return () => {
      scene.fog = null;
    };
  }, [scene]);

  // Handle transition between day and night
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    // If scrollEffect is enabled, use scroll position to determine time of day
    const targetIsDayTime = scrollEffect ? scrollYProgress < 0.5 : isDayTime;

    // Determine target colors based on time of day
    const targetSkyColor = targetIsDayTime ? dayColors.sky : nightColors.sky;
    const targetSunColor = targetIsDayTime ? dayColors.sun : nightColors.moon;
    const targetLightIntensity = targetIsDayTime
      ? dayColors.ambientLight
      : nightColors.ambientLight;
    const targetFogDensity = targetIsDayTime
      ? dayColors.fogDensity
      : nightColors.fogDensity;

    // Smoothly interpolate colors
    const lerpFactor = 0.01 * (60 / (1000 / 16)); // Adjust based on frame rate
    const currentColor = new THREE.Color(currentSkyColor);
    const targetColor = new THREE.Color(targetSkyColor);
    currentColor.lerp(targetColor, lerpFactor);

    // Apply the colors
    setCurrentSkyColor(currentColor.getStyle());
    setCurrentSunColor(
      THREE.Color.NAMES[currentSunColor]
        .lerp(THREE.Color.NAMES[targetSunColor], lerpFactor)
        .getStyle()
    );
    setCurrentSunIntensity(
      THREE.MathUtils.lerp(
        currentSunIntensity,
        targetLightIntensity,
        lerpFactor
      )
    );
    setCurrentFogDensity(
      THREE.MathUtils.lerp(currentFogDensity, targetFogDensity, lerpFactor)
    );

    // Update the fog
    if (scene.fog) {
      (scene.fog as THREE.FogExp2).color = currentColor;
      (scene.fog as THREE.FogExp2).density = currentFogDensity;
    }

    // Update sun and moon positions based on scroll
    if (scrollEffect && sunRef.current && moonRef.current) {
      // Move sun from east to west
      const sunAngle = scrollYProgress * Math.PI;
      sunRef.current.position.x = Math.cos(sunAngle) * 50;
      sunRef.current.position.y = Math.sin(sunAngle) * 30 + 10;

      // Moon goes opposite to sun
      const moonAngle = scrollYProgress * Math.PI + Math.PI;
      moonRef.current.position.x = Math.cos(moonAngle) * 50;
      moonRef.current.position.y = Math.sin(moonAngle) * 30 + 10;

      // Set visibility based on position (above/below horizon)
      sunRef.current.visible = sunRef.current.position.y > 0;
      moonRef.current.visible = moonRef.current.position.y > 0;
    }
  });

  return (
    <>
      {/* Sky dome */}
      <Sphere args={[300, 32, 32]} ref={skyRef}>
        <meshBasicMaterial
          color={currentSkyColor}
          side={THREE.BackSide}
          fog={false}
        />
      </Sphere>

      {/* Sun */}
      <mesh ref={sunRef} position={sunPosition} visible={isDayTime}>
        <sphereGeometry args={[5, 16, 16]} />
        <meshBasicMaterial
          color={dayColors.sun}
          emissive={dayColors.sun}
          emissiveIntensity={1.5}
        />
      </mesh>

      {/* Moon */}
      <mesh ref={moonRef} position={moonPosition} visible={!isDayTime}>
        <sphereGeometry args={[4, 16, 16]} />
        <meshStandardMaterial
          color={nightColors.moon}
          emissive={nightColors.moon}
          emissiveIntensity={0.8}
          roughness={0.5}
          metalness={0.2}
        />
      </mesh>

      {/* Ambient light that changes with day/night */}
      <ambientLight intensity={currentSunIntensity} />

      {/* Stars - only visible at night */}
      <Stars
        radius={250}
        depth={50}
        count={starsCount}
        factor={4}
        saturation={0}
        fade
        speed={0.5}
      />
    </>
  );
};

export default Sky;
