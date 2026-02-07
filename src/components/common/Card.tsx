import React from 'react';

export interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

/**
 * Card component for content display with consistent styling.
 * Uses Slate color system and rounded-2xl corners.
 * 
 * @param title - Optional card title
 * @param children - Card content
 * @param className - Additional CSS classes
 * @param onClick - Optional click handler (makes card interactive)
 * @param hoverable - Whether to show hover effects
 */
export const Card: React.FC<CardProps> = ({
  title,
  children,
  className = '',
  onClick,
  hoverable = false,
}) => {
  // Base styles with Slate color system and rounded-2xl corners
  const baseStyles = 'bg-white border border-slate-200 rounded-2xl shadow-sm';
  
  // Interactive styles
  const interactiveStyles = onClick || hoverable
    ? 'cursor-pointer transition-all duration-200 hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5'
    : '';
  
  // Combine styles
  const combinedStyles = `${baseStyles} ${interactiveStyles} ${className}`.trim();
  
  // Determine if card should be a button or div
  const Component = onClick ? 'button' : 'div';
  const buttonProps = onClick ? {
    type: 'button' as const,
    onClick,
  } : {};
  
  return (
    <Component
      className={combinedStyles}
      {...buttonProps}
    >
      {title && (
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">
            {title}
          </h3>
        </div>
      )}
      <div className={title ? 'p-6' : 'p-6'}>
        {children}
      </div>
    </Component>
  );
};

export default Card;
