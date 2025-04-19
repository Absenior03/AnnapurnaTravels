"use client";

import React from "react";
import Image from "next/image";
import { FiStar } from "react-icons/fi";

interface TestimonialProps {
  testimonial: {
    id: number;
    name: string;
    location: string;
    image: string;
    rating: number;
    text: string;
  };
  className?: string;
}

const TestimonialCard: React.FC<TestimonialProps> = ({
  testimonial,
  className = "",
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-lg p-8 ${className}`}>
      <div className="flex items-center mb-6">
        <div className="relative w-14 h-14 rounded-full overflow-hidden mr-4">
          <Image
            src={testimonial.image}
            alt={testimonial.name}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h3 className="font-bold text-lg text-gray-800">
            {testimonial.name}
          </h3>
          <p className="text-sm text-gray-500">{testimonial.location}</p>
          <div className="flex mt-1">
            {[...Array(5)].map((_, i) => (
              <FiStar
                key={i}
                className={`${
                  i < testimonial.rating
                    ? "text-yellow-500 fill-yellow-500"
                    : "text-gray-300"
                } w-4 h-4`}
              />
            ))}
          </div>
        </div>
      </div>
      <blockquote className="text-gray-600 italic mb-4 text-base">
        "{testimonial.text}"
      </blockquote>
    </div>
  );
};

export default TestimonialCard;
