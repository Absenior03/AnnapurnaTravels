import React, { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export interface AnimatedCardProps {
  title: string;
  description?: string;
  imageUrl?: string;
  href?: string;
  category?: string;
  date?: string;
  author?: {
    name: string;
    avatarUrl?: string;
  };
  tags?: string[];
  variant?: "default" | "featured" | "minimal" | "horizontal";
  className?: string;
  onClick?: () => void;
  stats?: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
  }[];
  hoverEffect?: "3d" | "scale" | "glow" | "none";
  aspectRatio?: "auto" | "video" | "square" | "portrait";
  priority?: boolean;
}

export const AnimatedCard = ({
  title,
  description,
  imageUrl,
  href,
  category,
  date,
  author,
  tags = [],
  variant = "default",
  className = "",
  onClick,
  stats,
  hoverEffect = "3d",
  aspectRatio = "auto",
  priority = false,
}: AnimatedCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Motion values for mouse position tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth physics-based springs for more natural animation
  const springConfig = { damping: 25, stiffness: 300 };
  const rotateX = useSpring(useMotionValue(0), springConfig);
  const rotateY = useSpring(useMotionValue(0), springConfig);
  const scaleValue = useSpring(1, springConfig);

  // Transform mouse position to rotation values
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || hoverEffect !== "3d") return;

    const rect = cardRef.current.getBoundingClientRect();

    // Calculate mouse position relative to card center (in -0.5 to 0.5 range)
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const relativeX = (e.clientX - centerX) / rect.width;
    const relativeY = (e.clientY - centerY) / rect.height;

    // Set motion values for mouse position
    mouseX.set(relativeX);
    mouseY.set(relativeY);

    // Apply rotation based on mouse position (limited to +/- 8 degrees)
    rotateY.set(relativeX * 8);
    rotateX.set(relativeY * -8); // Inverted for natural tilt
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (hoverEffect === "scale") {
      scaleValue.set(1.05);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Reset all transforms
    mouseX.set(0);
    mouseY.set(0);
    rotateX.set(0);
    rotateY.set(0);
    scaleValue.set(1);
  };

  // Get the appropriate aspect ratio class
  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case "video":
        return "aspect-video";
      case "square":
        return "aspect-square";
      case "portrait":
        return "aspect-[3/4]";
      default:
        return "aspect-[16/9]";
    }
  };

  // Transform values for highlight effects
  const highlightOpacity = useTransform(mouseX, [-0.5, 0, 0.5], [0, 0.3, 0]);

  const highlightY = useTransform(
    mouseY,
    [-0.5, 0, 0.5],
    ["0%", "50%", "100%"]
  );

  const highlightX = useTransform(
    mouseX,
    [-0.5, 0, 0.5],
    ["0%", "50%", "100%"]
  );

  // Custom shadow based on mouse position
  const shadowX = useTransform(mouseX, [-0.5, 0.5], [-15, 15]);
  const shadowY = useTransform(mouseY, [-0.5, 0.5], [-15, 15]);
  const shadow = useTransform(
    [shadowX, shadowY],
    ([latestX, latestY]) => `${latestX}px ${latestY}px 30px rgba(0, 0, 0, 0.15)`
  );

  // Determine card content and layout based on variant
  const renderCardContent = () => {
    return (
      <>
        {/* Image Container */}
        {imageUrl && (
          <div
            className={`${getAspectRatioClass()} relative overflow-hidden rounded-t-lg w-full bg-gray-100`}
          >
            <Image
              src={imageUrl}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={priority}
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            {category && (
              <span className="absolute top-4 left-4 px-3 py-1 text-xs font-medium text-white bg-emerald-600 bg-opacity-90 backdrop-blur-sm rounded-full">
                {category}
              </span>
            )}
          </div>
        )}

        {/* Card Body */}
        <div className="p-5 flex-1 flex flex-col">
          {/* Stats Row */}
          {stats && stats.length > 0 && (
            <div className="flex justify-between mb-3 text-gray-500 text-sm">
              {stats.map((stat, index) => (
                <div key={index} className="flex items-center space-x-1">
                  <span className="text-emerald-500">{stat.icon}</span>
                  <span>
                    {stat.value} {stat.label}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Title */}
          <h3
            className={`font-bold ${
              variant === "featured" ? "text-xl mb-3" : "text-lg mb-2"
            } text-gray-800 group-hover:text-emerald-600 transition-colors`}
          >
            {title}
          </h3>

          {/* Description */}
          {description && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {description}
            </p>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-auto mb-3">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Author & Date */}
          {(author || date) && (
            <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between text-sm">
              {author && (
                <div className="flex items-center space-x-2">
                  {author.avatarUrl && (
                    <div className="w-6 h-6 rounded-full overflow-hidden">
                      <Image
                        src={author.avatarUrl}
                        alt={author.name}
                        width={24}
                        height={24}
                        className="object-cover"
                      />
                    </div>
                  )}
                  <span className="text-gray-700">{author.name}</span>
                </div>
              )}
              {date && <span className="text-gray-500">{date}</span>}
            </div>
          )}
        </div>

        {/* Highlight Effect */}
        {hoverEffect === "3d" && (
          <motion.div
            className="absolute inset-0 rounded-lg pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, transparent 80%)",
              opacity: highlightOpacity,
              top: highlightY,
              left: highlightX,
              translateX: "-50%",
              translateY: "-50%",
            }}
          />
        )}

        {/* Glow Effect */}
        {hoverEffect === "glow" && isHovered && (
          <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-lg opacity-70 blur-md group-hover:opacity-100 transition duration-1000 group-hover:duration-500 animate-pulse" />
        )}
      </>
    );
  };

  // Wrap content with Link if href is provided
  const CardContent = () => (
    <motion.div
      ref={cardRef}
      className={`bg-white rounded-lg overflow-hidden shadow-md transition duration-300 relative group flex flex-col h-full ${className}`}
      style={{
        rotateX: hoverEffect === "3d" ? rotateX : 0,
        rotateY: hoverEffect === "3d" ? rotateY : 0,
        scale: scaleValue,
        boxShadow: hoverEffect === "3d" ? shadow : undefined,
        transformPerspective: 1000,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileHover={{
        y: hoverEffect === "none" ? 0 : -5,
      }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 30,
      }}
    >
      {renderCardContent()}
    </motion.div>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full">
        <CardContent />
      </Link>
    );
  }

  return <CardContent />;
};
