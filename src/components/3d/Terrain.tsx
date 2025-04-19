import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useScroll } from "@/context/ScrollContext";
import SimplexNoise from "simplex-noise";

interface TerrainProps {
  position?: [number, number, number];
  color?: string;
  secondaryColor?: string;
  width?: number;
  height?: number;
  segments?: number;
  amplitude?: number;
  scrollMultiplier?: number;
}

export const Terrain: React.FC<TerrainProps> = ({
  position = [0, -5, 0],
  color = "#4a7856",
  secondaryColor = "#2d6a4f",
  width = 60,
  height = 60,
  segments = 128,
  amplitude = 3.5,
  scrollMultiplier = 0.5,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { scrollYProgress, mouseX } = useScroll();

  // Generate terrain geometry with simplex noise
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(width, height, segments, segments);
    const simplex = new SimplexNoise();

    // Generate height map
    const vertices = geo.attributes.position.array;
    for (let i = 0; i < vertices.length; i += 3) {
      const x = vertices[i];
      const y = vertices[i + 1];

      // Multi-layered noise for more natural terrain
      const noise1 = simplex.noise2D(x * 0.01, y * 0.01) * amplitude;
      const noise2 = simplex.noise2D(x * 0.05, y * 0.05) * amplitude * 0.3;
      const noise3 = simplex.noise2D(x * 0.1, y * 0.1) * amplitude * 0.15;

      vertices[i + 2] = noise1 + noise2 + noise3;
    }

    // Update normals
    geo.computeVertexNormals();
    return geo;
  }, [width, height, segments, amplitude]);

  useFrame(() => {
    if (!meshRef.current) return;

    // Subtle rotation based on mouse position
    meshRef.current.rotation.z = THREE.MathUtils.lerp(
      meshRef.current.rotation.z,
      mouseX * 0.05,
      0.1
    );

    // Adjust position based on scroll
    meshRef.current.position.y =
      position[1] - scrollYProgress * scrollMultiplier * 10;
  });

  // Create color gradient based on elevation
  const vertexShader = `
    varying vec2 vUv;
    varying float vElevation;
    
    void main() {
      vUv = uv;
      vElevation = position.z;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform vec3 lowColor;
    uniform vec3 highColor;
    varying float vElevation;
    
    void main() {
      float normalizedElevation = (vElevation + ${amplitude}) / (${
    amplitude * 2.0
  });
      vec3 color = mix(lowColor, highColor, normalizedElevation);
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  const uniforms = useMemo(
    () => ({
      lowColor: { value: new THREE.Color(color) },
      highColor: { value: new THREE.Color(secondaryColor) },
    }),
    [color, secondaryColor]
  );

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
    >
      <primitive object={geometry} attach="geometry" />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

export default Terrain;
