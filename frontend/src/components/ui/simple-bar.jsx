import React from 'react';
import { cn } from "@/lib/utils";

const SimpleBar = ({
  data = [],
  valueKey = 'value',
  labelKey = 'label',
  colors = ['#4299E1'],
  tooltip,
  className,
  onClick,
  layout = 'vertical', // or 'horizontal'
  showValues = true,
  showLabels = true,
  height = 250,
  barWidth = 8,
  animate = true,
}) => {
  if (!data.length) {
    return <div className="flex items-center justify-center h-full">No data available</div>;
  }
  
  // Get the maximum value for scaling
  const maxValue = Math.max(...data.map(item => item[valueKey] || 0), 1);
  
  return (
    <div className={cn("w-full h-full", className)}>
      {layout === 'vertical' ? (
        // Vertical layout (bars going up)
        <div className="w-full h-full flex items-end justify-center gap-1">
          {data.map((item, index) => {
            const value = item[valueKey] || 0;
            const percentage = (value / maxValue) * 100;
            const color = Array.isArray(colors) ? colors[index % colors.length] : colors;
            
            return (
              <div key={index} className="flex flex-col items-center">
                <div
                  className={cn(
                    "rounded-t-md hover:opacity-80 transition-all",
                    animate && "transition-height duration-500"
                  )}
                  style={{ 
                    backgroundColor: color,
                    width: `${barWidth}px`,
                    height: `${Math.max((value / maxValue) * 180, 20)}px`,
                  }}
                  onClick={() => onClick && onClick(item)}
                  data-tooltip-id={tooltip}
                  data-tooltip-content={`${item[labelKey]}: ${value}`}
                >
                  {showValues && percentage > 30 && (
                    <div className="text-white text-xs text-center font-medium pt-1">
                      {value}
                    </div>
                  )}
                </div>
                {showLabels && (
                  <div className="text-xs mt-2 text-center max-w-20 truncate" title={item[labelKey]}>
                    {item[labelKey]}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        // Horizontal layout (bars going right)
        <div className="w-full h-full flex flex-col justify-between gap-1">
          {data.map((item, index) => {
            const value = item[valueKey] || 0;
            const percentage = (value / maxValue) * 100;
            const color = Array.isArray(colors) ? colors[index % colors.length] : colors;
            
            return (
              <div key={index} className="flex items-center h-8 mb-2">
                {showLabels && (
                  <div className="min-w-20 mr-2 text-xs truncate" title={item[labelKey]}>
                    {item[labelKey]}
                  </div>
                )}
                <div
                  className={cn(
                    "h-full rounded-r-md hover:opacity-80 transition-opacity flex items-center",
                    animate && "transition-width duration-500"
                  )}
                  style={{ 
                    backgroundColor: color,
                    width: `${Math.max((value / maxValue) * 200, 30)}px`,
                  }}
                  onClick={() => onClick && onClick(item)}
                  data-tooltip-id={tooltip}
                  data-tooltip-content={`${item[labelKey]}: ${value}`}
                >
                  {showValues && percentage > 10 && (
                    <span className="text-xs text-white font-medium ml-2">
                      {value}
                    </span>
                  )}
                </div>
                {!showLabels && (
                  <div className="ml-2 text-xs text-muted-foreground">
                    {value}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export { SimpleBar }; 