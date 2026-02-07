import React from 'react';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
}

/**
 * Button component with support for multiple variants and sizes.
 * Ensures minimum touch target size of 44x44px for accessibility.
 * 
 * @param variant - Button style variant (primary, secondary, danger)
 * @param size - Button size (sm, md, lg)
 * @param children - Button content
 * @param onClick - Click handler
 * @param disabled - Whether button is disabled
 * @param fullWidth - Whether button should take full width
 * @param className - Additional CSS classes
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled = false,
  fullWidth = false,
  className = '',
}) => {
  // Base styles - ensures minimum 44x44px touch target
  const baseStyles = 'rounded-2xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  // Variant styles using Slate color system
  const variantStyles = {
    primary: 'bg-slate-700 text-white hover:bg-slate-800 focus:ring-slate-500 active:bg-slate-900',
    secondary: 'bg-slate-200 text-slate-900 hover:bg-slate-300 focus:ring-slate-400 active:bg-slate-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 active:bg-red-800',
  };
  
  // Size styles - all sizes meet minimum 44x44px requirement
  const sizeStyles = {
    sm: 'px-4 py-2.5 text-sm min-h-[44px]',  // 44px minimum height
    md: 'px-6 py-3 text-base min-h-[48px]',   // 48px height
    lg: 'px-8 py-4 text-lg min-h-[56px]',     // 56px height
  };
  
  // Width style
  const widthStyle = fullWidth ? 'w-full' : '';
  
  // Combine all styles
  const combinedStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`.trim();
  
  return (
    <button
      type="button"
      className={combinedStyles}
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
