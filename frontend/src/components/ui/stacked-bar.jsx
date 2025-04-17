import React from 'react';
import { cn } from "@/lib/utils";

const COLORS = [
  '#4299E1', // blue-500
  '#48BB78', // green-500
  '#F6AD55', // orange-400
  '#9F7AEA', // purple-500
  '#F56565', // red-500
  '#ED8936', // orange-500
  '#38B2AC', // teal-500
  '#667EEA', // indigo-500
  '#FC8181', // red-400
  '#68D391', // green-400
];

const StackedBar = ({
  data = [],
  keys = [],
  indexBy = 'name',
  colors = COLORS,
  className,
  onClick,
  tooltip,
  layout = 'vertical', // or 'horizontal'
  showValues = true,
  showLabels = true,
  showLegend = true,
}) => {
  if (!data.length || !keys.length) {
    return <div className="flex items-center justify-center h-full">No data available</div>;
  }
  
  // Calculate totals for each item
  data.forEach(item => {
    item._total = keys.reduce((sum, key) => sum + (item[key] || 0), 0);
  });
  
  // Get the maximum total value
  const maxTotal = Math.max(...data.map(item => item._total), 1);
  
  return (
    <div className={cn("w-full h-full flex flex-col", className)}>
      {/* Legend */}
      {showLegend && (
        <div className="flex flex-wrap justify-end mb-2 gap-4">
          {keys.map((key, i) => (
            <div key={key} className="flex items-center">
              <div 
                className="w-3 h-3 mr-1 rounded-sm" 
                style={{ backgroundColor: colors[i % colors.length] }}
              ></div>
              <span className="text-xs">{key}</span>
            </div>
          ))}
        </div>
      )}
      
      {/* Chart */}
      <div className="flex-1 flex">
        {layout === 'vertical' ? (
          // Vertical bars
          <div className="w-full h-full flex items-end justify-between">
            {data.map((item, itemIndex) => (
              <div key={itemIndex} className="flex flex-col items-center">
                <div
                  className="w-12 flex flex-col-reverse"
                  style={{ height: `${(item._total / maxTotal) * 100}%` }}
                >
                  {keys.map((key, keyIndex) => {
                    const value = item[key] || 0;
                    const percentage = (value / item._total) * 100;
                    return (
                      <div
                        key={key}
                        className="w-full transition-opacity duration-200 hover:opacity-80 cursor-pointer"
                        style={{
                          backgroundColor: colors[keyIndex % colors.length],
                          height: `${percentage}%`,
                        }}
                        onClick={() => onClick && onClick(item, key)}
                        data-tooltip-id={tooltip}
                        data-tooltip-content={`${item[indexBy]} - ${key}: ${value}`}
                      >
                        {showValues && percentage > 15 && (
                          <span className="text-xs text-white font-bold text-center block py-1">
                            {value}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
                {showLabels && (
                  <div className="text-xs mt-2 text-center max-w-20 truncate" title={item[indexBy]}>
                    {item[indexBy]}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          // Horizontal bars
          <div className="w-full h-full flex flex-col justify-between">
            {data.map((item, itemIndex) => (
              <div key={itemIndex} className="flex items-center h-8">
                <div className="min-w-20 mr-2 text-xs truncate" title={item[indexBy]}>
                  {item[indexBy]}
                </div>
                <div className="flex h-full flex-1">
                  {keys.map((key, keyIndex) => {
                    const value = item[key] || 0;
                    const percentage = (value / maxTotal) * 100;
                    return (
                      <div
                        key={key}
                        className="h-full transition-opacity duration-200 hover:opacity-80 cursor-pointer flex items-center"
                        style={{
                          backgroundColor: colors[keyIndex % colors.length],
                          width: `${percentage}%`,
                        }}
                        onClick={() => onClick && onClick(item, key)}
                        data-tooltip-id={tooltip}
                        data-tooltip-content={`${item[indexBy]} - ${key}: ${value}`}
                      >
                        {showValues && percentage > 5 && (
                          <span className="text-xs text-white font-bold ml-1">
                            {value}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export { StackedBar }; 