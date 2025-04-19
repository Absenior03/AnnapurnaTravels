"use client";

import React from "react";
import { motion } from "framer-motion";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  tag?: string;
  tagColor?: string;
  align?: "left" | "center" | "right";
  className?: string;
  titleSize?: "sm" | "md" | "lg" | "xl";
  subtitleSize?: "sm" | "md" | "lg";
  divider?: boolean;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "h4";
  id?: string;
}

const tagColors = {
  emerald: "bg-emerald-100 text-emerald-700",
  blue: "bg-blue-100 text-blue-700",
  yellow: "bg-yellow-100 text-yellow-700",
  red: "bg-red-100 text-red-700",
  purple: "bg-purple-100 text-purple-700",
  gray: "bg-gray-100 text-gray-700",
};

const titleSizes = {
  sm: "text-xl md:text-2xl",
  md: "text-2xl md:text-3xl",
  lg: "text-3xl md:text-4xl",
  xl: "text-4xl md:text-5xl",
};

const subtitleSizes = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

const alignments = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  subtitle,
  tag,
  tagColor = "emerald",
  align = "center",
  className = "",
  titleSize = "lg",
  subtitleSize = "md",
  divider = false,
  delay = 0,
  as = "h2",
  id,
}) => {
  // Base animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: delay,
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 90,
      },
    },
  };

  // Divider animation variants
  const dividerVariants = {
    hidden: {
      width: 0,
      opacity: 0,
    },
    visible: {
      width: divider && align === "center" ? "120px" : "40px",
      opacity: 1,
      transition: {
        delay: delay + 0.4,
        duration: 0.8,
        ease: [0.165, 0.84, 0.44, 1],
      },
    },
  };

  // Dynamic tag class based on color
  const tagClass =
    tagColor in tagColors
      ? tagColors[tagColor as keyof typeof tagColors]
      : tagColors.emerald;

  // Create the heading element based on the 'as' prop
  const TitleComponent = as;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className={`${alignments[align]} ${className}`}
      id={id}
    >
      {tag && (
        <motion.span
          variants={childVariants}
          className={`inline-block px-3 py-1 ${tagClass} rounded-full text-xs font-medium mb-4`}
        >
          {tag}
        </motion.span>
      )}

      <TitleComponent
        className={`font-bold text-gray-800 ${titleSizes[titleSize]} mb-4`}
      >
        <motion.span
          variants={childVariants}
          className="block"
          dangerouslySetInnerHTML={{ __html: title }}
        />
      </TitleComponent>

      {divider && (
        <div
          className={`flex ${
            align === "center"
              ? "justify-center"
              : align === "right"
              ? "justify-end"
              : "justify-start"
          } my-4`}
        >
          <motion.div
            variants={dividerVariants}
            className="h-1 bg-emerald-500 rounded-full"
          ></motion.div>
        </div>
      )}

      {subtitle && (
        <motion.p
          variants={childVariants}
          className={`text-gray-600 max-w-3xl mx-auto ${subtitleSizes[subtitleSize]}`}
          dangerouslySetInnerHTML={{ __html: subtitle }}
        ></motion.p>
      )}
    </motion.div>
  );
};

export default SectionHeading;
