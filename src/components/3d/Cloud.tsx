import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, Vector3 } from "three";
import { useScroll } from "@/context/ScrollContext";

interface CloudProps {
  position?: [number, number, number];
  scale?: [number, number, number];
  speed?: number;
  color?: string;
  opacity?: number;
}

export const Cloud: React.FC<CloudProps> = ({
  position = [0, 0, 0],
  scale = [1, 1, 1],
  speed = 0.1,
  color = "#ffffff",
  opacity = 0.8,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const { scrollYProgress, mouseX } = useScroll();

  // Random offset for more natural movement
  const offset = useMemo(() => Math.random() * 100, []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    // Float side to side based on time
    const time = clock.getElapsedTime();
    groupRef.current.position.x =
      position[0] + Math.sin(time * speed + offset) * 2;

    // Move based on scroll position
    groupRef.current.position.y = position[1] + scrollYProgress * -5;

    // Subtle rotation and movement based on mouse position
    groupRef.current.rotation.y = mouseX * 0.2;
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Create a cluster of spheres to form a cloud */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color={color} transparent opacity={opacity} />
      </mesh>
      <mesh position={[1, 0.2, 0]}>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshStandardMaterial color={color} transparent opacity={opacity} />
      </mesh>
      <mesh position={[-0.8, 0.1, 0.4]}>
        <sphereGeometry args={[0.7, 16, 16]} />
        <meshStandardMaterial color={color} transparent opacity={opacity} />
      </mesh>
      <mesh position={[0.2, 0.6, -0.4]}>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshStandardMaterial color={color} transparent opacity={opacity} />
      </mesh>
      <mesh position={[-0.3, -0.2, 0.8]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color={color} transparent opacity={opacity} />
      </mesh>
    </group>
  );
};

export default Cloud;
