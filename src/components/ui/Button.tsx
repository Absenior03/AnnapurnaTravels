"use client";

import React, { forwardRef, ButtonHTMLAttributes, ReactNode, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { IconType } from "react-icons";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  href?: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "white" | "danger";
  size?: "sm" | "md" | "lg" | "xl";
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  rounded?: boolean;
  loading?: boolean;
  animate?: boolean;
  magnetic?: boolean;
  glint?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      href,
      type = "button",
      onClick,
      disabled = false,
      className = "",
      variant = "primary",
      size = "md",
      icon,
      iconPosition = "right",
      fullWidth = false,
      rounded = false,
      loading = false,
      animate = false,
      magnetic = false,
      glint = false,
      ...props
    },
    ref
  ) => {
    const [hover, setHover] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
    
    // Magnetic button effect - Apple style
    useEffect(() => {
      if (!magnetic || !buttonRef.current) return;
      
      const button = buttonRef.current;
      
      const handleMouseMove = (e: MouseEvent) => {
        const rect = button.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Calculate distance from center (as percentage of button size)
        const distanceX = (e.clientX - centerX) / (rect.width / 2);
        const distanceY = (e.clientY - centerY) / (rect.height / 2);
        
        // Apply magnetic effect (stronger when closer to the center)
        setPosition({
          x: distanceX * 8,
          y: distanceY * 5
        });
      };
      
      const handleMouseLeave = () => {
        // Reset position smoothly when mouse leaves
        setPosition({ x: 0, y: 0 });
      };
      
      button.addEventListener('mousemove', handleMouseMove);
      button.addEventListener('mouseleave', handleMouseLeave);
      
      return () => {
        button.removeEventListener('mousemove', handleMouseMove);
        button.removeEventListener('mouseleave', handleMouseLeave);
      };
    }, [magnetic]);

    // Button variants and styles
    const getVariantClasses = () => {
      switch (variant) {
        case "primary":
          return "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white hover:from-emerald-500 hover:to-emerald-400 focus:ring-emerald-400 shadow-md";
        case "secondary":
          return "bg-indigo-600 hover:bg-indigo-500 focus:ring-indigo-400 text-white shadow-md";
        case "outline":
          return "bg-transparent border-2 border-white hover:bg-white/10 text-white focus:ring-white";
        case "ghost":
          return "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-gray-400";
        case "white":
          return "bg-white hover:bg-gray-100 text-emerald-600 shadow-md focus:ring-emerald-400";
        case "danger":
          return "bg-red-600 hover:bg-red-500 text-white focus:ring-red-400";
        default:
          return "bg-emerald-600 hover:bg-emerald-500 text-white focus:ring-emerald-400";
      }
    };

    const getSizeClasses = () => {
      switch (size) {
        case "sm":
          return "text-xs px-3 py-1.5";
        case "md":
          return "text-sm px-4 py-2";
        case "lg":
          return "text-base px-6 py-3";
        case "xl":
          return "text-lg px-8 py-4";
        default:
          return "text-sm px-4 py-2";
      }
    };

    const composedClasses = `
      inline-flex items-center justify-center
      font-medium transition-all duration-300
      focus:outline-none focus:ring-2 focus:ring-opacity-50
      active:scale-[0.98]
      ${getVariantClasses()}
      ${getSizeClasses()}
      ${rounded ? "rounded-full" : "rounded-lg"}
      ${fullWidth ? "w-full" : ""}
      ${disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}
      ${loading ? "opacity-80 cursor-wait" : ""}
      ${glint ? "button-glint overflow-hidden" : ""}
      ${magnetic ? "transform-gpu" : ""}
      ${className}
    `;

    // Animation variants
    const buttonVariants = {
      initial: { 
        scale: 1,
        boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
      },
      hover: { 
        scale: 1.03,
        boxShadow: "0 14px 28px rgba(0,0,0,0.15), 0 10px 10px rgba(0,0,0,0.10)",
      },
      tap: { 
        scale: 0.98,
        boxShadow: "0 3px 6px rgba(0,0,0,0.12), 0 3px 6px rgba(0,0,0,0.19)",
      },
      disabled: {
        scale: 1,
        opacity: 0.6,
      }
    };

    // Content with icon
    const content = (
      <>
        {loading ? (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : icon && iconPosition === "left" ? (
          <span className="mr-2">{icon}</span>
        ) : null}
        
        <span>{children}</span>
        
        {!loading && icon && iconPosition === "right" && (
          <span className="ml-2">{icon}</span>
        )}
      </>
    );

    // Render Link or Button with animations
    if (href) {
      if (animate) {
        return (
          <motion.a
            ref={buttonRef as React.RefObject<HTMLAnchorElement>}
            href={disabled ? undefined : href}
            className={composedClasses}
            initial="initial"
            whileHover={disabled ? "disabled" : "hover"}
            whileTap={disabled ? "disabled" : "tap"}
            variants={buttonVariants}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={magnetic ? { 
              x: position.x,
              y: position.y,
              transition: "transform 0.2s cubic-bezier(0.23, 1, 0.32, 1)"
            } : undefined}
          >
            {content}
          </motion.a>
        );
      }
      
      return (
        <Link
          href={disabled ? "#" : href}
          className={composedClasses}
          ref={buttonRef as React.RefObject<HTMLAnchorElement>}
          onClick={(e) => {
            if (disabled) {
              e.preventDefault();
              return;
            }
            onClick && onClick();
          }}
          style={magnetic ? { 
            transform: `translate(${position.x}px, ${position.y}px)`,
            transition: "transform 0.2s cubic-bezier(0.23, 1, 0.32, 1)"
          } : undefined}
        >
          {content}
        </Link>
      );
    }

    if (animate) {
      return (
        <motion.button
          ref={buttonRef as React.RefObject<HTMLButtonElement>}
          type={type}
          className={composedClasses}
          disabled={disabled || loading}
          onClick={onClick}
          initial="initial"
          whileHover={disabled ? "disabled" : "hover"}
          whileTap={disabled ? "disabled" : "tap"}
          variants={buttonVariants}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          style={magnetic ? { 
            x: position.x,
            y: position.y,
            transition: "transform 0.2s cubic-bezier(0.23, 1, 0.32, 1)"
          } : undefined}
          {...props}
        >
          {content}
        </motion.button>
      );
    }

    return (
      <button
        ref={ref}
        type={type}
        className={composedClasses}
        disabled={disabled || loading}
        onClick={onClick}
        style={magnetic ? { 
          transform: `translate(${position.x}px, ${position.y}px)`,
          transition: "transform 0.2s cubic-bezier(0.23, 1, 0.32, 1)"
        } : undefined}
        {...props}
      >
        {content}
      </button>
    );
  }
);

export default Button;
