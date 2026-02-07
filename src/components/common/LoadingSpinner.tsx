import React from 'react';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
  label?: string;
}

/**
 * LoadingSpinner component for indicating asynchronous loading states.
 * Provides a spinning animation with customizable size and color.
 * 
 * @param size - Spinner size (sm, md, lg)
 * @param color - Custom color class for the spinner (defaults to slate)
 * @param className - Additional CSS classes
 * @param label - Optional accessible label for screen readers
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'border-slate-700',
  className = '',
  label = 'Loading...',
}) => {
  // Size styles
  const sizeStyles = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4',
  };
  
  // Combine styles
  const spinnerStyles = `${sizeStyles[size]} border-t-transparent rounded-full animate-spin ${color}`.trim();
  
  return (
    <div className={`flex flex-col items-center justify-center ${className}`.trim()}>
      <div
        className={spinnerStyles}
        role="status"
        aria-label={label}
      >
        <span className="sr-only">{label}</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
