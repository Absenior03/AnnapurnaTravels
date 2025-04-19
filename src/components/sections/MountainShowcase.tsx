"use client";

import React from "react";
import { Suspense } from "react";
import SceneWrapper from "../3d/SceneWrapper";
import SectionHeading from "../ui/SectionHeading";
import dynamic from "next/dynamic";

// Dynamically import Mountain component with no SSR
const Mountain = dynamic(() => import("../3d/Mountain"), { ssr: false });

// Add lights to the scene
const Lights = () => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight
        position={[-10, -10, -5]}
        intensity={0.5}
        color="blue"
      />
    </>
  );
};

const MountainShowcase: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4">
        <SectionHeading
          title="Discover Our Destinations"
          subtitle="Explore majestic mountain landscapes across South Asia"
          tag="Interactive"
          tagColor="blue"
          align="center"
          divider
        />

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-3">Everest Region</h3>
            <p className="text-gray-600 mb-6">
              Home to the world's tallest peak, the Everest region offers
              breathtaking views and challenging treks through ancient Sherpa
              villages.
            </p>
            <div className="h-[300px] rounded-lg overflow-hidden">
              <SceneWrapper>
                <Lights />
                <Suspense fallback={null}>
                  <Mountain
                    position={[0, -1, 0]}
                    color="#60a5fa"
                    detail={40}
                    size={3}
                    scrollMultiplier={1.2}
                  />
                </Suspense>
              </SceneWrapper>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-3">Annapurna Circuit</h3>
            <p className="text-gray-600 mb-6">
              The Annapurna Circuit takes you through diverse landscapes, from
              subtropical forests to high alpine environments with stunning
              mountain views.
            </p>
            <div className="h-[300px] rounded-lg overflow-hidden">
              <SceneWrapper>
                <Lights />
                <Suspense fallback={null}>
                  <Mountain
                    position={[0, -1, 0]}
                    color="#f97316"
                    detail={30}
                    size={2.8}
                    scrollMultiplier={0.8}
                  />
                </Suspense>
              </SceneWrapper>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MountainShowcase;
