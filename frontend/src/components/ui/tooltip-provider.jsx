import React, { useState, useEffect, useRef, createContext, useContext } from 'react';

const TooltipContext = createContext();

export const useTooltip = () => {
  const context = useContext(TooltipContext);
  if (!context) {
    throw new Error('useTooltip must be used within a TooltipProvider');
  }
  return context;
};

export const TooltipProvider = ({ children }) => {
  const [tooltip, setTooltip] = useState({ visible: false, content: '', x: 0, y: 0 });
  const timeoutRef = useRef(null);
  
  const showTooltip = (content, x, y) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setTooltip({ visible: true, content, x, y });
  };
  
  const hideTooltip = (delay = 0) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    if (delay) {
      timeoutRef.current = setTimeout(() => {
        setTooltip(prev => ({ ...prev, visible: false }));
      }, delay);
    } else {
      setTooltip(prev => ({ ...prev, visible: false }));
    }
  };
  
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  return (
    <TooltipContext.Provider value={{ showTooltip, hideTooltip }}>
      {children}
      
      {tooltip.visible && (
        <div 
          className="fixed z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-md shadow-lg pointer-events-none"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: 'translate(-50%, -100%)',
            maxWidth: '250px',
            marginTop: '-10px'
          }}
        >
          {tooltip.content}
        </div>
      )}
    </TooltipContext.Provider>
  );
};

export function withTooltip(WrappedComponent) {
  return function WithTooltipComponent(props) {
    const { showTooltip, hideTooltip } = useTooltip();
    
    const handleMouseEnter = (event, content) => {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top;
      showTooltip(content, x, y);
    };
    
    const handleMouseLeave = () => {
      hideTooltip(100);
    };
    
    return (
      <WrappedComponent
        {...props}
        tooltip={{ handleMouseEnter, handleMouseLeave }}
      />
    );
  };
} 