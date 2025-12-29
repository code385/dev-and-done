'use client';

import { forwardRef } from 'react';

const Input = forwardRef(function Input(
  {
    label,
    error,
    helpText,
    className = '',
    ...props
  },
  ref
) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-foreground mb-2">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`
          w-full px-4 py-3 
          bg-muted border border-border 
          rounded-lg 
          text-foreground placeholder:text-muted-foreground
          focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
          transition-all duration-200
          ${error ? 'border-error focus:ring-error' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-error" role="alert">
          {error}
        </p>
      )}
      {helpText && !error && (
        <p className="mt-1 text-sm text-muted-foreground">
          {helpText}
        </p>
      )}
    </div>
  );
});

export default Input;

