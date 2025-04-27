import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'bordered' | 'floating' | 'apple';
  hover?: boolean;
  motionProps?: Omit<HTMLMotionProps<'div'>, 'children' | 'className'>;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  animate?: boolean;
}

export function Card({
  children,
  className,
  variant = 'default',
  hover = true,
  motionProps,
  padding = 'md',
  animate = true,
}: CardProps) {
  // Base styles
  const baseStyles = cn(
    'rounded-xl overflow-hidden relative',
    {
      'p-4': padding === 'sm',
      'p-6': padding === 'md',
      'p-8': padding === 'lg',
      'p-0': padding === 'none',
    },
    {
      // Default variant
      'bg-white dark:bg-zinc-900 shadow-md': variant === 'default',
      
      // Glass variant
      'bg-white/10 backdrop-blur-lg border border-white/20 dark:bg-zinc-900/20':
        variant === 'glass',
      
      // Bordered variant
      'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800':
        variant === 'bordered',
      
      // Floating variant
      'bg-white dark:bg-zinc-900 shadow-lg': variant === 'floating',
      
      // Apple-inspired variant
      'bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-white/40 dark:border-zinc-800/40':
        variant === 'apple',
    },
    className
  );

  // Animation variants
  const motionVariants = {
    initial: { 
      scale: 1,
      boxShadow: variant === 'apple' 
        ? '0 1px 3px rgba(0,0,0,0.05), 0 20px 25px -5px rgba(0,0,0,0.05)' 
        : '',
    },
    hover: hover ? {
      scale: 1.02,
      boxShadow: variant === 'apple' 
        ? '0 1px 3px rgba(0,0,0,0.1), 0 25px 30px -10px rgba(0,0,0,0.1)' 
        : '',
      transition: { duration: 0.3, ease: [0.23, 1, 0.32, 1] }
    } : {},
    tap: hover ? { 
      scale: 0.98, 
      transition: { duration: 0.15, ease: [0.23, 1, 0.32, 1] } 
    } : {},
  };

  if (animate) {
    return (
      <motion.div
        className={baseStyles}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        variants={motionVariants}
        {...motionProps}
      >
        {children}
      </motion.div>
    );
  }

  return <div className={baseStyles}>{children}</div>;
}

export function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex flex-col space-y-1.5 p-6', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn('text-2xl font-semibold leading-none tracking-tight', className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn('text-sm text-zinc-500 dark:text-zinc-400', className)}
      {...props}
    >
      {children}
    </p>
  );
}

export function CardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-6 pt-0', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex items-center p-6 pt-0', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardImage({
  src,
  alt = '',
  className,
  fill = false,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean }) {
  const imageClasses = cn(
    'object-cover',
    {
      'w-full h-full absolute inset-0': fill,
      'w-full h-auto': !fill,
    },
    className
  );
  
  return (
    <div className={cn('overflow-hidden', fill ? 'relative aspect-video' : '')}>
      <img 
        src={src} 
        alt={alt} 
        className={imageClasses} 
        loading="lazy"
        {...props} 
      />
    </div>
  );
} 