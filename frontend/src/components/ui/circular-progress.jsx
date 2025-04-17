import React from 'react';
import { cn } from "@/lib/utils";

const CircularProgress = ({
  value = 0,
  size = 80,
  strokeWidth = 8,
  label,
  showValue = true,
  color = '#3B82F6',
  trackColor = '#E5E7EB',
  className,
}) => {
  // Calculate circle geometry
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(100, Math.max(0, value)); // Clamp between 0-100
  const offset = circumference - (progress / 100) * circumference;

  // Center coordinates
  const center = size / 2;

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Background track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        
        {/* Progress arc */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-in-out"
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showValue && (
          <span className="text-xl font-semibold">
            {progress.toFixed(0)}%
          </span>
        )}
        {label && (
          <span className="text-xs text-gray-500">
            {label}
          </span>
        )}
      </div>
    </div>
  );
};

export default CircularProgress; 