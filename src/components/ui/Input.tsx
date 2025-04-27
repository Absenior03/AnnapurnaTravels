import React, { useState, useMemo, forwardRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FiAlertCircle } from 'react-icons/fi';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  variant?: 'default' | 'filled' | 'outlined' | 'glass';
  animate?: boolean;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      helperText,
      error,
      startIcon,
      endIcon,
      variant = 'default',
      animate = true,
      fullWidth = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const [focused, setFocused] = useState(false);
    const [hasValue, setHasValue] = useState(
      !!props.value || !!props.defaultValue
    );
    
    const isInView = useInView({ once: true, amount: 0.3 });
    
    const containerAnimVariants = {
      hidden: { opacity: 0, y: 10 },
      visible: { opacity: 1, y: 0 },
    };
    
    const baseInputStyles = cn(
      'flex h-10 w-full rounded-md px-3 py-2 text-sm ring-offset-background',
      'file:border-0 file:bg-transparent file:text-sm file:font-medium',
      'placeholder:text-muted-foreground disabled:cursor-not-allowed',
      'focus-visible:outline-none transition-shadow duration-200',
      'disabled:opacity-50',
      startIcon ? 'pl-9' : '',
      endIcon ? 'pr-9' : '',
      fullWidth ? 'w-full' : 'max-w-sm',
      focused ? 'ring-2 ring-offset-2 ring-ring' : '',
      error ? 'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500' : '',
    );

    const variantStyles = {
      default: cn(
        'border border-input bg-background',
        focused ? 'shadow-sm' : ''
      ),
      filled: cn(
        'border-0 bg-secondary/50',
        focused ? 'bg-secondary/80' : ''
      ),
      outlined: cn(
        'border-2 border-input bg-transparent',
        focused ? 'border-primary' : ''
      ),
      glass: cn(
        'backdrop-blur-md bg-white/10 border border-white/20',
        'text-white placeholder:text-white/60',
        focused ? 'bg-white/20 border-white/30' : ''
      ),
    };
    
    const inputId = useMemo(() => `input-${Math.random().toString(36).substring(2, 9)}`, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(!!e.target.value);
      if (props.onChange) {
        props.onChange(e);
      }
    };

    return (
      <motion.div
        className={cn(
          'grid gap-1.5',
          fullWidth ? 'w-full' : 'max-w-sm',
          className
        )}
        initial={animate ? 'hidden' : 'visible'}
        animate={animate && isInView ? 'visible' : ''}
        variants={containerAnimVariants}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        {label && (
          <motion.label
            htmlFor={inputId}
            className={cn(
              'text-sm font-medium transition-colors',
              error ? 'text-red-500' : 'text-foreground',
              disabled ? 'opacity-70' : ''
            )}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: animate ? 0.1 : 0, duration: 0.2 }}
          >
            {label}
          </motion.label>
        )}
        
        <div className="relative">
          {startIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {startIcon}
            </div>
          )}
          
          <input
            id={inputId}
            className={cn(baseInputStyles, variantStyles[variant])}
            ref={ref}
            onFocus={(e) => {
              setFocused(true);
              if (props.onFocus) props.onFocus(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              if (props.onBlur) props.onBlur(e);
            }}
            onChange={handleChange}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-description` : undefined}
            {...props}
          />
          
          {endIcon && !error && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {endIcon}
            </div>
          )}
          
          {error && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
              <FiAlertCircle size={16} />
            </div>
          )}
        </div>
        
        {(helperText || error) && (
          <motion.p
            id={error ? `${inputId}-error` : `${inputId}-description`}
            className={cn(
              'text-xs',
              error ? 'text-red-500' : 'text-muted-foreground'
            )}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: animate ? 0.2 : 0, duration: 0.2 }}
          >
            {error || helperText}
          </motion.p>
        )}
      </motion.div>
    );
  }
);

Input.displayName = 'Input';

export default Input; 