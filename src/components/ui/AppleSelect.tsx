import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiCheck, FiAlertCircle } from 'react-icons/fi';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface AppleSelectProps {
  options: SelectOption[];
  value?: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
  className?: string;
  fullWidth?: boolean;
  variant?: 'outlined' | 'filled' | 'underlined';
  size?: 'sm' | 'md' | 'lg';
}

export function AppleSelect({
  options,
  value,
  onChange,
  label,
  placeholder = 'Select an option',
  error,
  helperText,
  disabled = false,
  required = false,
  name,
  id,
  className = '',
  fullWidth = false,
  variant = 'outlined',
  size = 'md',
}: AppleSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find(option => option.value === value);

  // Size classes
  const sizeClasses = {
    sm: 'py-1.5 text-sm',
    md: 'py-2 text-base',
    lg: 'py-2.5 text-lg'
  };

  // Variant classes
  const variantClasses = {
    outlined: `border ${error ? 'border-red-500' : isFocused ? 'border-blue-500' : 'border-gray-300 dark:border-gray-700'} bg-transparent rounded-lg px-3`,
    filled: `${error ? 'bg-red-50 dark:bg-red-900/10' : isFocused ? 'bg-blue-50 dark:bg-blue-900/10' : 'bg-gray-100 dark:bg-gray-800/50'} rounded-lg px-3`,
    underlined: `border-b-2 px-1 ${error ? 'border-red-500' : isFocused ? 'border-blue-500' : 'border-gray-300 dark:border-gray-700'} bg-transparent rounded-none`
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`relative ${fullWidth ? 'w-full' : 'max-w-xs'} ${className}`} ref={selectRef}>
      {/* Label */}
      {label && (
        <label 
          htmlFor={id} 
          className={`block mb-1.5 text-sm font-medium
            ${disabled ? 'text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'}
            ${error ? 'text-red-500' : ''}
          `}
        >
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      {/* Select trigger */}
      <div
        className={`
          relative cursor-pointer flex items-center justify-between transition-all duration-200
          ${variantClasses[variant]} 
          ${sizeClasses[size]}
          ${disabled ? 'opacity-60 cursor-not-allowed bg-gray-100 dark:bg-gray-800/30' : ''}
          ${fullWidth ? 'w-full' : ''}
        `}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        tabIndex={disabled ? -1 : 0}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        role="combobox"
        aria-disabled={disabled}
      >
        <span className={`block truncate ${!selectedOption?.label ? 'text-gray-400 dark:text-gray-500' : ''}`}>
          {selectedOption?.label || placeholder}
        </span>
        
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex items-center"
        >
          {error ? (
            <FiAlertCircle className="text-red-500 mr-1" />
          ) : null}
          <FiChevronDown className={`h-4 w-4 ${error ? 'text-red-500' : 'text-gray-500'}`} />
        </motion.div>
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={`
              absolute z-10 mt-1 max-h-60 overflow-auto rounded-lg 
              ${fullWidth ? 'w-full' : 'min-w-[240px]'}
              bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700
              scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600
            `}
            role="listbox"
          >
            <div className="py-1">
              {options.map((option) => (
                <motion.div
                  key={option.value}
                  whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
                  whileTap={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
                  className={`
                    ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    ${option.value === value ? 'bg-gray-100 dark:bg-gray-700/50' : ''}
                    flex items-center justify-between px-3 py-2
                  `}
                  onClick={() => {
                    if (!option.disabled) {
                      onChange(option.value);
                      setIsOpen(false);
                    }
                  }}
                  role="option"
                  aria-selected={option.value === value}
                >
                  <span>{option.label}</span>
                  {option.value === value && <FiCheck className="h-4 w-4 text-blue-500" />}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Helper text or error message */}
      {(helperText || error) && (
        <div className={`mt-1 text-sm ${error ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
          {error || helperText}
        </div>
      )}
    </div>
  );
} 