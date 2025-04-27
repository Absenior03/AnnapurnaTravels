import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { FiAlertCircle, FiX } from 'react-icons/fi';

export interface AppleTextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number';
  className?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  name?: string;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  autoComplete?: string;
  rows?: number;
  multiline?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  variant?: 'outlined' | 'filled' | 'underlined' | 'minimal';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  clearable?: boolean;
  containerClassName?: string;
  customStyles?: {
    container?: string;
    input?: string;
    label?: string;
    helperText?: string;
    error?: string;
  };
}

export const AppleTextField: React.FC<AppleTextFieldProps> = ({
  label,
  value,
  onChange,
  placeholder = '',
  type = 'text',
  className = '',
  error,
  disabled = false,
  required = false,
  id,
  name,
  maxLength,
  minLength,
  pattern,
  autoComplete,
  rows = 3,
  multiline = false,
  helperText,
  fullWidth = false,
  variant = 'outlined',
  icon,
  iconPosition = 'left',
  clearable = false,
  containerClassName = '',
  customStyles = {}
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!value);
  const [isTouched, setIsTouched] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const animations = useAnimation();

  useEffect(() => {
    setHasValue(!!value);
  }, [value]);

  useEffect(() => {
    if (isFocused || hasValue) {
      animations.start({
        y: -24,
        scale: 0.75,
        color: isFocused ? 'var(--apple-blue)' : '#666',
      });
    } else {
      animations.start({
        y: 0,
        scale: 1,
        color: '#999',
      });
    }
  }, [isFocused, hasValue, animations]);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setIsTouched(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  // Handle clear button click
  const handleClear = () => {
    onChange('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Get variant classes
  const variantClasses = {
    outlined: 'bg-white border-gray-300',
    filled: 'bg-gray-50 border-gray-200',
    underlined: 'border-t-0 border-x-0 rounded-none border-b-2',
    minimal: 'bg-transparent border-none'
  };

  const showError = isTouched && error;
  const showClearButton = clearable && value && value.length > 0 && !disabled;

  return (
    <div 
      className={`relative ${fullWidth ? 'w-full' : 'max-w-xs'} ${containerClassName} ${customStyles.container || ''}`}
      onClick={() => inputRef.current?.focus()}
    >
      <div className={`
        relative border transition-all duration-200 overflow-hidden
        ${variantClasses[variant]}
        ${isFocused ? 'border-blue-500 shadow-sm shadow-blue-200' : ''}
        ${disabled ? 'bg-gray-100 opacity-60' : ''}
        ${showError ? 'border-red-500' : ''}
        ${multiline ? 'pt-6 rounded-lg' : 'h-14 rounded-lg'}
        ${icon && iconPosition === 'left' ? 'pl-10' : ''}
        ${icon && iconPosition === 'right' || clearable ? 'pr-10' : ''}
        ${className}
      `}>
        <motion.label
          className={`absolute left-3 pointer-events-none z-10 origin-left ${customStyles.label || ''}`}
          animate={animations}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          htmlFor={id}
        >
          {label}{required && <span className="text-red-500 ml-1">*</span>}
        </motion.label>

        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            id={id}
            name={name}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={isFocused ? placeholder : ''}
            disabled={disabled}
            required={required}
            maxLength={maxLength}
            minLength={minLength}
            autoComplete={autoComplete}
            rows={rows}
            className={`w-full px-3 pt-6 pb-2 outline-none bg-transparent resize-none ${customStyles.input || ''}`}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type={type}
            id={id}
            name={name}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={isFocused ? placeholder : ''}
            disabled={disabled}
            required={required}
            maxLength={maxLength}
            minLength={minLength}
            pattern={pattern}
            autoComplete={autoComplete}
            className={`w-full h-full px-3 pt-6 outline-none bg-transparent ${customStyles.input || ''}`}
          />
        )}

        {/* Icon - Left position */}
        {icon && iconPosition === 'left' && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            {icon}
          </div>
        )}

        {/* Error icon or right positioned icon */}
        {(error || (icon && iconPosition === 'right')) && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {error ? (
              <FiAlertCircle className="text-red-500" />
            ) : (
              icon
            )}
          </div>
        )}

        {/* Clear button */}
        {showClearButton && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Clear text"
          >
            <FiX />
          </button>
        )}
      </div>

      {/* Helper text or error message */}
      {(helperText || showError) && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-xs mt-1 ml-1 ${showError ? 'text-red-500' : 'text-gray-500'} ${customStyles.helperText || ''} ${showError ? customStyles.error || '' : ''}`}
        >
          {showError ? error : helperText}
        </motion.p>
      )}
    </div>
  );
};

export default AppleTextField;