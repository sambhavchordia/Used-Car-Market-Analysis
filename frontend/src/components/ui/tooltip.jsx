import React, { useState } from 'react';
import { cn } from '@/lib/utils';

const Tooltip = ({ 
  children, 
  content,
  position = 'top',
  delay = 0,
  className
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  
  const handleMouseEnter = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    
    let x = 0;
    let y = 0;
    
    switch (position) {
      case 'top':
        x = rect.left + rect.width / 2;
        y = rect.top;
        break;
      case 'bottom':
        x = rect.left + rect.width / 2;
        y = rect.bottom;
        break;
      case 'left':
        x = rect.left;
        y = rect.top + rect.height / 2;
        break;
      case 'right':
        x = rect.right;
        y = rect.top + rect.height / 2;
        break;
      default:
        x = rect.left + rect.width / 2;
        y = rect.top;
    }
    
    setTooltipPosition({ x, y });
    
    if (delay) {
      setTimeout(() => setIsVisible(true), delay);
    } else {
      setIsVisible(true);
    }
  };
  
  const handleMouseLeave = () => {
    setIsVisible(false);
  };
  
  const positionStyles = {
    top: {
      top: `${tooltipPosition.y - 10}px`,
      left: `${tooltipPosition.x}px`,
      transform: 'translate(-50%, -100%)'
    },
    bottom: {
      top: `${tooltipPosition.y + 10}px`,
      left: `${tooltipPosition.x}px`,
      transform: 'translate(-50%, 0)'
    },
    left: {
      top: `${tooltipPosition.y}px`,
      left: `${tooltipPosition.x - 10}px`,
      transform: 'translate(-100%, -50%)'
    },
    right: {
      top: `${tooltipPosition.y}px`,
      left: `${tooltipPosition.x + 10}px`,
      transform: 'translate(0, -50%)'
    }
  };
  
  return (
    <div 
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      
      {isVisible && (
        <div
          className={cn(
            "fixed z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-md shadow-lg pointer-events-none",
            className
          )}
          style={positionStyles[position]}
        >
          {content}
          <div
            className={cn(
              "absolute w-2 h-2 bg-gray-900 transform rotate-45",
              position === 'top' && "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2",
              position === 'bottom' && "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2",
              position === 'left' && "right-0 top-1/2 translate-x-1/2 -translate-y-1/2",
              position === 'right' && "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2"
            )}
          />
        </div>
      )}
    </div>
  );
};

export { Tooltip }; 