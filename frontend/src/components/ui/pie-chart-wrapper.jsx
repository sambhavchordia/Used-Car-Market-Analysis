import React, { useState } from 'react';
import { PieChart } from '@/components/ui/pie-chart';
import { cn } from '@/lib/utils';

// Default colors that match the PieChart component
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
  '#4FD1C5', // teal-400
  '#A3BFFA', // indigo-300
  '#FBD38D', // yellow-400
  '#F687B3', // pink-400
  '#B794F4', // purple-400
];

const PieChartWrapper = ({
  data,
  nameKey = 'name',
  valueKey = 'value',
  title,
  subtitle,
  className,
  innerRadius = 0,
  showLegend = true,
  legendPosition = 'bottom-right',
  ...props
}) => {
  const [hoveredItem, setHoveredItem] = useState(null);
  
  // Calculate total for percentages
  const total = data.reduce((sum, item) => sum + item[valueKey], 0);
  
  const handleMouseEnter = (item) => {
    setHoveredItem(item);
  };
  
  const handleMouseLeave = () => {
    setHoveredItem(null);
  };
  
  const getLegendPositionClass = () => {
    switch (legendPosition) {
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'top-right':
        return 'top-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      default:
        return 'bottom-4 right-4';
    }
  };
  
  return (
    <div className={cn("relative w-full h-full", className)}>
      {/* Tooltip */}
      {hoveredItem && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-2 rounded-md text-sm z-10">
          {hoveredItem[nameKey]}: {hoveredItem[valueKey]} ({((hoveredItem[valueKey] / total) * 100).toFixed(1)}%)
        </div>
      )}
      
      <PieChart
        data={data}
        nameKey={nameKey}
        valueKey={valueKey}
        innerRadius={innerRadius}
        onClick={(item) => console.log('Selected:', item)}
        colors={COLORS}
        {...props}
      />
      
      {/* Data values overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {data.map((item, index) => (
          <div
            key={index}
            className="absolute opacity-0 inset-0"
            style={{
              pointerEvents: 'all',
              cursor: 'pointer'
            }}
            onMouseEnter={() => handleMouseEnter(item)}
            onMouseLeave={handleMouseLeave}
          />
        ))}
      </div>
      
      {/* Legend */}
      {showLegend && (
        <div className={`absolute ${getLegendPositionClass()} bg-white/80 p-2 rounded text-xs shadow max-h-[60%] overflow-y-auto`}>
          {data.map((item, index) => (
            <div 
              key={index} 
              className="flex items-center gap-1 mb-1"
              onMouseEnter={() => handleMouseEnter(item)}
              onMouseLeave={handleMouseLeave}
            >
              <div 
                className="w-3 h-3 rounded-sm flex-shrink-0" 
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="truncate">{item[nameKey]}</span>
              <span className="ml-auto whitespace-nowrap">
                {item[valueKey]} ({((item[valueKey] / total) * 100).toFixed(0)}%)
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export { PieChartWrapper }; 