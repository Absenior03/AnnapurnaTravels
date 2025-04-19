"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";

const CTA: React.FC = () => {
  return (
    <div className="container mx-auto px-4">
      <motion.div
        className="relative overflow-hidden bg-gradient-to-r from-emerald-800 to-teal-700 rounded-3xl p-8 md:p-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-white/30 blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full bg-white/20 blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-white/30 blur-3xl"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            <SectionHeading
              title="Ready for Your Next Adventure?"
              subtitle="Begin your journey through the breathtaking landscapes of South Asia today"
              align="left"
              titleSize="lg"
              titleColor="white"
              subtitleColor="gray-200"
            />

            <ul className="mt-6 space-y-2 text-gray-100">
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-emerald-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                Expert guides with deep local knowledge
              </li>
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-emerald-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                Customizable itineraries for all experience levels
              </li>
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-emerald-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                Small groups for authentic cultural experiences
              </li>
            </ul>
          </div>

          <div className="flex flex-col space-y-4">
            <Button href="/tours" variant="white" size="xl" rounded animate>
              Browse Tours
            </Button>
            <Button href="/contact" variant="outline" size="xl" rounded animate>
              Contact Us
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CTA;
