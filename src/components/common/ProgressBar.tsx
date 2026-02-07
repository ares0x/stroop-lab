import React from 'react';

export interface ProgressBarProps {
  current: number;
  total: number;
  showLabel?: boolean;
  color?: string;
  className?: string;
}

/**
 * ProgressBar component for displaying progress with current and total values.
 * Supports optional labels and custom colors.
 * 
 * @param current - Current progress value
 * @param total - Total/maximum progress value
 * @param showLabel - Whether to show the progress label (e.g., "3/10")
 * @param color - Custom color class for the progress bar (defaults to slate)
 * @param className - Additional CSS classes
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  showLabel = true,
  color = 'bg-slate-700',
  className = '',
}) => {
  // Calculate percentage, ensuring it's between 0 and 100
  const percentage = Math.min(Math.max((current / total) * 100, 0), 100);
  
  // Format the percentage for display
  const percentageText = `${Math.round(percentage)}%`;
  
  // Format the label text
  const labelText = `${current} / ${total}`;
  
  return (
    <div className={`w-full ${className}`.trim()}>
      {/* Label row */}
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-slate-700">
            {labelText}
          </span>
          <span className="text-sm font-medium text-slate-600">
            {percentageText}
          </span>
        </div>
      )}
      
      {/* Progress bar container */}
      <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
        {/* Progress bar fill */}
        <div
          className={`h-full rounded-full transition-all duration-300 ease-out ${color}`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={current}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-label={`Progress: ${labelText}`}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
