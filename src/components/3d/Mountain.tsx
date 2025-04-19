import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { Mesh, Vector3 } from "three";
import { useScroll } from "@/context/ScrollContext";

interface MountainProps {
  position?: [number, number, number];
  scrollMultiplier?: number;
  color?: string;
  wireframe?: boolean;
  size?: number;
  detail?: number;
}

export const Mountain: React.FC<MountainProps> = ({
  position = [0, 0, 0],
  scrollMultiplier = 1,
  color = "#2a3a50",
  wireframe = false,
  size = 10,
  detail = 16,
}) => {
  const meshRef = useRef<Mesh>(null);
  const { scrollYProgress, mouseX, mouseY } = useScroll();

  // Optional: Add a heightmap texture for more realistic mountains
  // const heightMap = useTexture('/images/heightmap.png');

  useFrame(() => {
    if (!meshRef.current) return;

    // Rotate based on mouse position (subtle effect)
    meshRef.current.rotation.y = mouseX * 0.1;
    meshRef.current.rotation.x = mouseY * 0.1;

    // Move slightly based on scroll
    const targetY = position[1] - scrollYProgress * scrollMultiplier;
    meshRef.current.position.y = targetY;

    // Optional: Scale slightly based on scroll
    const baseScale = 1 - scrollYProgress * 0.1;
    meshRef.current.scale.setScalar(baseScale);
  });

  // Function to generate mountain vertices with noise
  const generateMountainGeometry = () => {
    const vertices = [];
    const size2 = size / 2;

    // Simple algorithm to generate mountain-like mesh
    for (let i = 0; i <= detail; i++) {
      const x = (i / detail) * size - size2;

      for (let j = 0; j <= detail; j++) {
        const z = (j / detail) * size - size2;

        // Generate height using a simple noise approximation
        // In a real app, you'd use a proper noise function like simplex noise
        const dist = Math.sqrt(x * x + z * z) / size;
        let y = Math.cos(dist * Math.PI) * 2;

        // Add some variation
        y += Math.cos(x) * Math.sin(z) * 0.5;
        y = Math.max(0, y); // Keep it above zero

        vertices.push(new Vector3(x, y, z));
      }
    }

    return vertices;
  };

  return (
    <mesh ref={meshRef} position={position}>
      {/* You can replace this with a more complex geometry */}
      <meshStandardMaterial
        color={color}
        wireframe={wireframe}
        roughness={0.8}
        metalness={0.2}
      />
      <meshPhysicalMaterial
        color={color}
        wireframe={wireframe}
        roughness={0.8}
        metalness={0.2}
        clearcoat={0.3}
        clearcoatRoughness={0.2}
      />
      <coneGeometry args={[size / 2, size, 32]} />
    </mesh>
  );
};

export default Mountain;
