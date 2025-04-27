import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export interface AppleCardProps {
  title: string;
  description?: string;
  image?: string;
  alt?: string;
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
  disabled?: boolean;
  variant?: 'default' | 'elevated' | 'glass' | 'minimal';
  hoverScale?: number;
  enableTilt?: boolean;
  enableBorder?: boolean;
  cardLink?: string;
  aspectRatio?: 'auto' | 'square' | 'video' | string;
  contentPlacement?: 'top' | 'bottom' | 'center' | 'overlay';
  gradient?: boolean;
  hasHoverEffect?: boolean;
  animationDuration?: number;
}

export const AppleCard: React.FC<AppleCardProps> = ({
  title,
  description,
  image,
  alt,
  className = '',
  onClick,
  children,
  disabled = false,
  variant = 'default',
  hoverScale = 1.02,
  enableTilt = true,
  enableBorder = true,
  aspectRatio = 'auto',
  contentPlacement = 'bottom',
  gradient = false,
  hasHoverEffect = true,
  animationDuration = 0.2,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [tiltValues, setTiltValues] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Handle mouse movement for tilt effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enableTilt || disabled) return;
    
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    // Convert to tilt values between -5 and 5 degrees
    const tiltX = -5 + y * 10;
    const tiltY = 5 - x * 10;
    
    setTiltValues({ x: tiltX, y: tiltY });
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
    setTiltValues({ x: 0, y: 0 });
  };
  
  // Variant styles
  const variantStyles = {
    default: 'bg-white shadow-sm',
    elevated: 'bg-white shadow-md',
    glass: 'backdrop-blur-md bg-white/30 dark:bg-black/20',
    minimal: 'bg-transparent',
  };
  
  // Aspect ratio styles
  const getAspectRatio = () => {
    switch (aspectRatio) {
      case 'square': return 'aspect-square';
      case 'video': return 'aspect-video';
      case 'auto': return '';
      default: return aspectRatio;
    }
  };
  
  return (
    <motion.div
      ref={cardRef}
      className={`
        overflow-hidden rounded-xl transition-all
        ${enableBorder ? 'border border-gray-200 dark:border-gray-800' : ''}
        ${variantStyles[variant]}
        ${getAspectRatio()}
        ${disabled ? 'opacity-70 pointer-events-none' : 'cursor-pointer'}
        ${className}
      `}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      animate={{
        scale: isHovered && hasHoverEffect && !disabled ? hoverScale : 1,
        rotateX: enableTilt && isHovered && !disabled ? tiltValues.x : 0,
        rotateY: enableTilt && isHovered && !disabled ? tiltValues.y : 0,
        filter: isHovered && !disabled ? 'brightness(1.05)' : 'brightness(1)'
      }}
      transition={{ duration: animationDuration, ease: 'easeOut' }}
      onClick={!disabled ? onClick : undefined}
      whileTap={{ scale: hasHoverEffect && !disabled ? 0.98 : 1 }}
    >
      {/* Card Image */}
      {image && (
        <div className={`relative ${contentPlacement === 'overlay' ? 'h-full' : ''}`}>
          <Image
            src={image}
            alt={alt || title}
            className={`w-full object-cover transition-transform ${isHovered && hasHoverEffect ? 'scale-105' : 'scale-100'}`}
            width={500}
            height={300}
            style={{
              height: contentPlacement === 'overlay' ? '100%' : 'auto',
            }}
          />
          
          {/* Gradient overlay for better text visibility when text is overlaid on image */}
          {gradient && contentPlacement === 'overlay' && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          )}
        </div>
      )}
      
      {/* Card Content */}
      {(title || description || children) && (
        <div 
          className={`
            p-5 transition-all
            ${contentPlacement === 'overlay' ? 'absolute bottom-0 left-0 right-0 text-white z-10' : ''}
          `}
        >
          {title && (
            <h3 className="font-medium text-lg mb-2">
              {title}
            </h3>
          )}
          
          {description && (
            <p className={`${contentPlacement === 'overlay' ? 'text-gray-200' : 'text-gray-600 dark:text-gray-400'} text-sm`}>
              {description}
            </p>
          )}
          
          {children}
        </div>
      )}
    </motion.div>
  );
};

export default AppleCard; 