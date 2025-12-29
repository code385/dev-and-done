'use client';

import { motion } from 'framer-motion';
import { trackButtonClick } from '@/lib/analytics/track';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  type = 'button',
  disabled = false,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-gradient-to-r from-primary to-secondary text-white hover:from-primary-dark hover:to-secondary/90 focus:ring-primary shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-shadow',
    secondary: 'bg-secondary text-white hover:bg-secondary/90 focus:ring-secondary',
    ghost: 'bg-transparent text-foreground hover:bg-muted border border-border focus:ring-primary',
    outline: 'border-2 border-primary text-primary bg-transparent hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-white focus:ring-primary transition-all',
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };
  
  const handleClick = (e) => {
    if (!disabled && onClick) {
      // Track button click
      const buttonText = typeof children === 'string' ? children : 'Button';
      trackButtonClick(buttonText, window.location.pathname);
      onClick(e);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={handleClick}
      type={type}
      disabled={disabled}
      aria-disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
}

