"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

// Define button variants
const variants = {
  initial: {
    scale: 1,
    opacity: 1,
  },
  hover: {
    scale: 1.03,
    boxShadow:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    transition: {
      scale: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
      opacity: {
        duration: 0.2,
      },
    },
  },
  tap: {
    scale: 0.98,
    opacity: 0.9,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 10,
    },
  },
  disabled: {
    opacity: 0.6,
    scale: 1,
    boxShadow: "none",
  },
};

// Button sizes
const sizes = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-2.5 text-base",
  xl: "px-8 py-3.5 text-lg",
};

// Button variants
const buttonVariants = {
  primary: "bg-emerald-600 hover:bg-emerald-700 text-white",
  secondary:
    "bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-200",
  outline:
    "bg-transparent hover:bg-emerald-50 text-emerald-600 border border-emerald-600",
  ghost: "bg-transparent hover:bg-gray-100 text-gray-800",
  white: "bg-white hover:bg-gray-50 text-emerald-600 shadow-md",
  danger: "bg-red-600 hover:bg-red-700 text-white",
};

// Define the props for our button component
interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  type?: "button" | "submit" | "reset";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  className?: string;
  variant?: keyof typeof buttonVariants;
  size?: keyof typeof sizes;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  rounded?: boolean;
  loading?: boolean;
  animate?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  href,
  type = "button",
  onClick,
  disabled = false,
  className = "",
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "left",
  fullWidth = false,
  rounded = false,
  loading = false,
  animate = true,
}) => {
  // Common class names
  const baseClasses = [
    "inline-flex items-center justify-center font-medium transition-all duration-200",
    "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500",
    sizes[size],
    buttonVariants[variant],
    fullWidth ? "w-full" : "",
    rounded ? "rounded-full" : "rounded-md",
    className,
  ].join(" ");

  // Loading spinner component
  const Spinner = () => (
    <svg
      className={`animate-spin -ml-1 mr-2 h-4 w-4 ${
        variant === "outline" ? "text-emerald-600" : "text-white"
      }`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );

  // Button content
  const content = (
    <>
      {loading ? (
        <Spinner />
      ) : icon && iconPosition === "left" ? (
        <span className="mr-2">{icon}</span>
      ) : null}

      {children}

      {!loading && icon && iconPosition === "right" ? (
        <span className="ml-2">{icon}</span>
      ) : null}
    </>
  );

  // If it's a link
  if (href && !disabled) {
    return (
      <Link href={href} passHref>
        <motion.a
          className={baseClasses}
          initial="initial"
          whileHover={animate && !disabled ? "hover" : undefined}
          whileTap={animate && !disabled ? "tap" : undefined}
          animate={disabled ? "disabled" : "initial"}
          variants={animate ? variants : undefined}
        >
          {content}
        </motion.a>
      </Link>
    );
  }

  // If it's a regular button
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${
        disabled || loading ? "opacity-60 cursor-not-allowed" : ""
      }`}
      initial="initial"
      whileHover={animate && !disabled && !loading ? "hover" : undefined}
      whileTap={animate && !disabled && !loading ? "tap" : undefined}
      animate={disabled || loading ? "disabled" : "initial"}
      variants={animate ? variants : undefined}
    >
      {content}
    </motion.button>
  );
};

export default Button;
