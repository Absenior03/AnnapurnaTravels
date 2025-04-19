import React, { useRef, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  useTexture,
  Text,
  Float,
  Environment,
  useGLTF,
  Html,
  Text3D,
  Clouds,
  Cloud,
  MeshTransmissionMaterial,
  MeshDistortMaterial,
  Center,
  Stars,
} from "@react-three/drei";
import * as THREE from "three";
import { Vector3, Group, Mesh, Color, MathUtils, Euler } from "three";
import { useSpring, animated } from "@react-spring/three";
import {
  useMotionValue,
  useTransform,
  motion,
  useMotionTemplate,
} from "framer-motion";
import { framerMotionConfig } from "@/lib/animation";
import { suspend } from "suspend-react";
import { useCameraPosition, calculateRotation } from "@/hooks/use3DUtils";

// Utility for linear interpolation
const lerp = (start: number, end: number, t: number) =>
  start * (1 - t) + end * t;

// MouseContext to track mouse position across components
type MousePosition = { x: number; y: number };

const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      // Normalize to -1 to 1 range
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -((e.clientY / window.innerHeight) * 2 - 1),
      });
    };

    window.addEventListener("mousemove", updateMousePosition);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);

  return mousePosition;
};

// Scene Controller that manages camera and scene state
const SceneController = ({ scrollY }: { scrollY: number }) => {
  const { camera } = useThree();
  const mousePosition = useMousePosition();
  const dampedMouse = useRef({ x: 0, y: 0 });

  // Use scroll position to control camera position along a path
  useFrame(({ clock }) => {
    // Smooth mouse movement
    dampedMouse.current.x = lerp(
      dampedMouse.current.x,
      mousePosition.x * 0.5,
      0.05
    );
    dampedMouse.current.y = lerp(
      dampedMouse.current.y,
      mousePosition.y * 0.3,
      0.05
    );

    // Apply to camera rotation (subtle effect)
    camera.rotation.x = THREE.MathUtils.lerp(
      camera.rotation.x,
      -dampedMouse.current.y * 0.2,
      0.1
    );
    camera.rotation.y = THREE.MathUtils.lerp(
      camera.rotation.y,
      dampedMouse.current.x * 0.2,
      0.1
    );

    // Move camera based on scroll position (0-1 range)
    const normalizedScroll = scrollY / 1000; // Adjust divisor based on page length
    camera.position.y = THREE.MathUtils.lerp(5, -5, normalizedScroll);

    // Add some subtle movement based on time
    const t = clock.getElapsedTime() * 0.2;
    camera.position.x = Math.sin(t) * 0.2 + dampedMouse.current.x;
    camera.position.z = 5 + Math.cos(t) * 0.2;
  });

  return null;
};

// Floating card that follows mouse with parallax effect
interface FloatingElementProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  speed?: number;
  parallaxFactor?: number;
  children: React.ReactNode;
  htmlContent?: React.ReactNode;
}

const FloatingElement = ({
  position,
  rotation = [0, 0, 0],
  scale = 1,
  speed = 1,
  parallaxFactor = 1,
  children,
  htmlContent,
}: FloatingElementProps) => {
  const ref = useRef<THREE.Group>(null);
  const mousePosition = useMousePosition();
  const initialPosition = useRef(position);

  useFrame(({ clock }) => {
    if (!ref.current) return;

    // Floating animation
    const t = clock.getElapsedTime() * speed;
    ref.current.position.y = initialPosition.current[1] + Math.sin(t) * 0.2;

    // Parallax effect based on mouse position
    ref.current.position.x =
      initialPosition.current[0] + mousePosition.x * 0.2 * parallaxFactor;
    ref.current.position.z =
      initialPosition.current[2] + mousePosition.y * 0.1 * parallaxFactor;

    // Subtle rotation
    ref.current.rotation.x = rotation[0] + Math.sin(t * 0.5) * 0.05;
    ref.current.rotation.y =
      rotation[1] + Math.cos(t * 0.3) * 0.05 + mousePosition.x * 0.1;
  });

  return (
    <group
      ref={ref}
      position={position}
      rotation={rotation as any}
      scale={scale}
    >
      {children}
      {htmlContent && (
        <Html
          transform
          distanceFactor={10}
          position={[0, 0, 0.1]}
          style={{
            width: "300px",
            height: "auto",
            pointerEvents: "none",
          }}
        >
          {htmlContent}
        </Html>
      )}
    </group>
  );
};

// 3D Text with glow effect
const GlowingText = ({
  text,
  position,
  color = "#ffffff",
  fontSize = 0.5,
}: {
  text: string;
  position: [number, number, number];
  color?: string;
  fontSize?: number;
}) => {
  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <Text
        position={position}
        color={color}
        fontSize={fontSize}
        font="/fonts/Poppins-Bold.ttf"
        anchorX="center"
        anchorY="middle"
      >
        {text}
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.6}
          toneMapped={false}
        />
      </Text>
    </Float>
  );
};

// Card mesh that responds to mouse hover
const Card = ({
  position,
  width = 1,
  height = 1.5,
  depth = 0.05,
  color = "#ffffff",
}: {
  position: [number, number, number];
  width?: number;
  height?: number;
  depth?: number;
  color?: string;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (!meshRef.current) return;

    // Scale animation on hover
    meshRef.current.scale.x = THREE.MathUtils.lerp(
      meshRef.current.scale.x,
      hovered ? 1.1 : 1,
      0.1
    );
    meshRef.current.scale.y = THREE.MathUtils.lerp(
      meshRef.current.scale.y,
      hovered ? 1.1 : 1,
      0.1
    );
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[width, height, depth]} />
      <meshStandardMaterial
        color={hovered ? "#2dd4bf" : color}
        roughness={0.3}
        metalness={0.2}
      />
    </mesh>
  );
};

// 3D Models
const Models = {
  Mountain: "/models/mountain.glb",
  Compass: "/models/compass.glb",
  Backpack: "/models/backpack.glb",
  Tent: "/models/tent.glb",
};

// Mount points for objects based on scroll progress
const mountPoints = [
  { position: [0, 0, 0], rotation: [0, 0, 0], scale: 1 },
  { position: [3, 1, -3], rotation: [0, Math.PI / 4, 0], scale: 0.8 },
  { position: [-4, 0, -6], rotation: [0, -Math.PI / 3, 0], scale: 1.2 },
  { position: [0, -2, -10], rotation: [Math.PI / 10, 0, 0], scale: 1.5 },
];

// Helper function to interpolate between mount points based on progress
const interpolateObject = (progress: number, index: number) => {
  // Calculate which two mount points to interpolate between
  const segmentCount = mountPoints.length - 1;
  const segmentProgress = segmentCount * progress;
  const segmentIndex = Math.min(Math.floor(segmentProgress), segmentCount - 1);
  const segmentWeight = segmentProgress - segmentIndex;

  // If this object should be visible in this segment
  if (index >= segmentIndex && index <= segmentIndex + 1) {
    const start = mountPoints[segmentIndex];
    const end = mountPoints[segmentIndex + 1];

    // Interpolate position, rotation, and scale
    const position = [
      MathUtils.lerp(start.position[0], end.position[0], segmentWeight),
      MathUtils.lerp(start.position[1], end.position[1], segmentWeight),
      MathUtils.lerp(start.position[2], end.position[2], segmentWeight),
    ];

    const rotation = [
      MathUtils.lerp(start.rotation[0], end.rotation[0], segmentWeight),
      MathUtils.lerp(start.rotation[1], end.rotation[1], segmentWeight),
      MathUtils.lerp(start.rotation[2], end.rotation[2], segmentWeight),
    ];

    const scale = MathUtils.lerp(start.scale, end.scale, segmentWeight);

    return { position, rotation, scale, visible: true };
  }

  // Object not visible in this segment
  return {
    position: [0, -100, 0], // Move far away
    rotation: [0, 0, 0],
    scale: 0,
    visible: false,
  };
};

// Model with animations
function Model({
  url,
  scrollY,
  index,
}: {
  url: string;
  scrollY: number;
  index: number;
}) {
  const group = useRef<Group>();
  const { scene } = useGLTF(url);

  // Calculate position, rotation, and scale based on scroll progress
  const progress = scrollY / 4; // Divide by number of sections
  const { position, rotation, scale, visible } = interpolateObject(
    progress,
    index
  );

  // Spring animations for smoother movement
  const springProps = useSpring({
    position: position as any,
    rotation: rotation as any,
    scale: visible ? scale : 0,
    config: { mass: 1, tension: 280, friction: 60 },
  });

  useFrame((state, delta) => {
    if (group.current && visible) {
      // Add subtle floating animation
      group.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <animated.group
      ref={group}
      position={springProps.position}
      rotation={springProps.rotation}
      scale={springProps.scale}
    >
      <primitive object={scene.clone()} />
    </animated.group>
  );
}

// Floating Title for each section
function FloatingTitle({
  text,
  scrollY,
  index,
}: {
  text: string;
  scrollY: number;
  index: number;
}) {
  const progress = scrollY / 4;
  const { position, rotation, visible } = interpolateObject(progress, index);

  // Calculate opacity based on how close we are to this section
  const targetSection = index / 4;
  const distance = Math.abs(progress - targetSection);
  const opacity = Math.max(0, 1 - distance * 2);

  const springProps = useSpring({
    position: [position[0], position[1] + 1.5, position[2]] as any,
    rotation: rotation as any,
    opacity,
    config: { mass: 1, tension: 280, friction: 120 },
  });

  if (!visible) return null;

  return (
    <animated.group
      position={springProps.position}
      rotation={springProps.rotation}
      visible={opacity > 0.05}
    >
      <Text3D
        font="/fonts/inter_bold.json"
        size={0.5}
        height={0.1}
        curveSegments={12}
        bevelEnabled
        bevelThickness={0.02}
        bevelSize={0.02}
        bevelOffset={0}
        bevelSegments={5}
      >
        {text}
        <animated.meshStandardMaterial
          color="#2dd4bf"
          emissive="#0d9488"
          emissiveIntensity={0.5}
          opacity={springProps.opacity}
          transparent
        />
      </Text3D>
    </animated.group>
  );
}

// Atmosphere elements
function SceneAtmosphere({ scrollY }: { scrollY: number }) {
  const progress = scrollY / 4;
  const fogDensity = 0.02 + progress * 0.03;

  useThree(({ scene }) => {
    scene.fog = {
      color: new Color("#e0f2fe"),
      density: fogDensity,
      near: 1,
      far: 15,
    } as any;
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={1.5}
        castShadow
        shadow-mapSize={1024}
      />
      <Clouds material={MeshTransmissionMaterial}>
        <Cloud
          position={[-10, 5, -10]}
          opacity={0.5}
          speed={0.1}
          width={10}
          depth={1.5}
          segments={20}
        />
        <Cloud
          position={[10, 6, -15]}
          opacity={0.35}
          speed={0.08}
          width={8}
          depth={2}
          segments={15}
        />
      </Clouds>
    </>
  );
}

// Camera that responds to scroll
function CameraRig({
  scrollY,
  mouseX = 0,
  mouseY = 0,
}: {
  scrollY: number;
  mouseX?: number;
  mouseY?: number;
}) {
  const cameraGroup = useRef<Group>();

  // Path points for camera
  const cameraPathPoints = [
    new Vector3(0, 2, 5),
    new Vector3(0, 3, 2),
    new Vector3(-1, 1, 0),
    new Vector3(2, 0, -5),
    new Vector3(0, 0, -10),
  ];

  // Interpolate camera position based on scroll
  const progress = scrollY / 4;
  const segmentProgress = progress * (cameraPathPoints.length - 1);
  const segmentIndex = Math.min(
    Math.floor(segmentProgress),
    cameraPathPoints.length - 2
  );
  const segmentWeight = segmentProgress - segmentIndex;

  // Find start and end points for current segment
  const startPoint = cameraPathPoints[segmentIndex];
  const endPoint = cameraPathPoints[segmentIndex + 1];

  // Interpolate between points
  const targetPosition = new Vector3().lerpVectors(
    startPoint,
    endPoint,
    segmentWeight
  );

  // Spring for smoother camera movement
  const { cameraPos } = useSpring({
    cameraPos: [targetPosition.x, targetPosition.y, targetPosition.z],
    config: { mass: 1, tension: 180, friction: 60 },
  });

  useFrame((state, delta) => {
    if (cameraGroup.current) {
      // Add subtle mouse influence (reduced effect)
      cameraGroup.current.rotation.y +=
        (mouseX * 0.003 - cameraGroup.current.rotation.y) * 0.05;
      cameraGroup.current.rotation.x +=
        (mouseY * 0.003 - cameraGroup.current.rotation.x) * 0.05;
    }
  });

  return (
    <animated.group ref={cameraGroup} position={cameraPos as any}>
      <PerspectiveCamera makeDefault fov={60} position={[0, 0, 0]} />
    </animated.group>
  );
}

// Define the interface for the props
interface InteractiveSceneProps {
  scrollYProgress: MotionValue<number>;
  mouseX?: number;
  mouseY?: number;
  className?: string;
}

// Models to preload
const MODEL_PATHS = {
  mountains: "/models/mountains.glb",
  compass: "/models/compass.glb",
  backpack: "/models/backpack.glb",
  tent: "/models/tent.glb",
  // Add more models as needed
};

// Preload models
const usePreloadedGLTF = (path: string) => {
  return suspend(() => useGLTF(path), [path]);
};

// Mountains model
const Mountains = ({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>;
}) => {
  const ref = useRef<THREE.Mesh>(null);
  const mountain = usePreloadedGLTF(MODEL_PATHS.mountains);

  useFrame(() => {
    if (!ref.current) return;

    // Get scroll value (0-1)
    const scroll = scrollYProgress.get();

    // Apply transformations based on scroll
    ref.current.position.y = MathUtils.lerp(0, -3, scroll);
    ref.current.scale.setScalar(MathUtils.lerp(1, 0.8, scroll));
    ref.current.rotation.y = MathUtils.lerp(0, Math.PI * 0.1, scroll);
  });

  return (
    <primitive
      ref={ref}
      object={mountain.scene}
      position={[0, 0, 0]}
      scale={1}
    />
  );
};

// Compass model
const Compass = ({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>;
}) => {
  const ref = useRef<THREE.Mesh>(null);
  const compass = usePreloadedGLTF(MODEL_PATHS.compass);

  useFrame(() => {
    if (!ref.current) return;

    // Get scroll value (0-1)
    const scroll = scrollYProgress.get();

    // Apply transformations based on scroll
    ref.current.rotation.y += 0.01;
    ref.current.position.x = MathUtils.lerp(2, 0, scroll);

    // Control visibility based on scroll
    const opacity =
      MathUtils.smoothstep(0, 0.2, scroll) -
      MathUtils.smoothstep(0.4, 0.5, scroll);
    ref.current.visible = opacity > 0.01;
  });

  return (
    <primitive
      ref={ref}
      object={compass.scene}
      position={[2, 0, 0]}
      scale={0.5}
    />
  );
};

// Backpack model
const Backpack = ({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>;
}) => {
  const ref = useRef<THREE.Mesh>(null);
  const backpack = usePreloadedGLTF(MODEL_PATHS.backpack);

  useFrame(() => {
    if (!ref.current) return;

    // Get scroll value (0-1)
    const scroll = scrollYProgress.get();

    // Show backpack in the middle section
    const opacity =
      -MathUtils.smoothstep(0, 0.3, scroll) +
      MathUtils.smoothstep(0.3, 0.4, scroll) -
      MathUtils.smoothstep(0.6, 0.7, scroll);
    ref.current.visible = opacity > 0.01;

    // Position based on scroll
    ref.current.position.x = MathUtils.lerp(-5, 3, scroll);
    ref.current.rotation.y = MathUtils.lerp(0, Math.PI * 2, scroll);
  });

  return (
    <primitive
      ref={ref}
      object={backpack.scene}
      position={[-5, 0, 0]}
      scale={0.7}
    />
  );
};

// Tent model
const Tent = ({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>;
}) => {
  const ref = useRef<THREE.Mesh>(null);
  const tent = usePreloadedGLTF(MODEL_PATHS.tent);

  useFrame(() => {
    if (!ref.current) return;

    // Get scroll value (0-1)
    const scroll = scrollYProgress.get();

    // Show tent in the last section
    const opacity =
      -MathUtils.smoothstep(0, 0.5, scroll) +
      MathUtils.smoothstep(0.5, 0.6, scroll) -
      MathUtils.smoothstep(0.9, 1, scroll);
    ref.current.visible = opacity > 0.01;

    // Position based on scroll
    ref.current.position.y = MathUtils.lerp(
      -5,
      0,
      MathUtils.smoothstep(0.5, 0.7, scroll)
    );
  });

  return (
    <primitive
      ref={ref}
      object={tent.scene}
      position={[0, -5, 0]}
      scale={0.8}
    />
  );
};

// Text that follows scroll
const ScrollText = ({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>;
}) => {
  const titles = [
    "Explore South Asia",
    "Trek the Himalayas",
    "Experience Adventure",
    "Create Memories",
  ];

  const [visibleIndex, setVisibleIndex] = useState(0);

  useFrame(() => {
    // Update visible text based on scroll
    const scroll = scrollYProgress.get();
    const newIndex = Math.min(
      titles.length - 1,
      Math.floor(scroll * titles.length)
    );
    setVisibleIndex(newIndex);
  });

  return (
    <Float
      speed={2}
      rotationIntensity={0.3}
      floatIntensity={0.3}
      position={[0, 2, 3]}
    >
      <Text fontSize={0.5} color="white" anchorX="center" anchorY="middle">
        {titles[visibleIndex]}
      </Text>
    </Float>
  );
};

// Camera controller
const CameraController = ({
  scrollYProgress,
  mouseX = 0,
  mouseY = 0,
}: InteractiveSceneProps) => {
  const camera = useThree((state) => state.camera);
  const defaultPos = new Vector3(0, 0, 10);

  useFrame(() => {
    // Get scroll value (0-1)
    const scroll = scrollYProgress.get();

    // Camera position based on scroll
    camera.position.x = defaultPos.x + MathUtils.lerp(-2, 2, scroll);
    camera.position.y = defaultPos.y + MathUtils.lerp(0, -1, scroll);
    camera.position.z =
      defaultPos.z + MathUtils.lerp(0, -3, scroll * (1 - scroll) * 4);

    // Subtle mouse influence (reduced effect)
    camera.position.x += mouseX * 0.01;
    camera.position.y += mouseY * 0.01;

    // Look at center with slight offset based on scroll
    camera.lookAt(new Vector3(0, MathUtils.lerp(0, -1, scroll), 0));
  });

  return null;
};

// Main Scene component
const Scene = ({ scrollYProgress, mouseX, mouseY }: InteractiveSceneProps) => {
  return (
    <>
      <CameraController
        scrollYProgress={scrollYProgress}
        mouseX={mouseX}
        mouseY={mouseY}
      />

      <PerspectiveCamera makeDefault position={[0, 0, 10]} />

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={1} color="#ffffff" />

      {/* Environment */}
      <Environment preset="sunset" />

      {/* 3D Models */}
      <Mountains scrollYProgress={scrollYProgress} />
      <Compass scrollYProgress={scrollYProgress} />
      <Backpack scrollYProgress={scrollYProgress} />
      <Tent scrollYProgress={scrollYProgress} />

      {/* Text */}
      <ScrollText scrollYProgress={scrollYProgress} />
    </>
  );
};

// Main exported component
const InteractiveScene: React.FC<InteractiveSceneProps> = ({
  scrollYProgress,
  mouseX,
  mouseY,
  className,
}) => {
  return (
    <div className={`fixed inset-0 -z-10 ${className || ""}`}>
      <Canvas shadows dpr={[1, 2]}>
        <Scene
          scrollYProgress={scrollYProgress}
          mouseX={mouseX}
          mouseY={mouseY}
        />
      </Canvas>
    </div>
  );
};

export default InteractiveScene;
