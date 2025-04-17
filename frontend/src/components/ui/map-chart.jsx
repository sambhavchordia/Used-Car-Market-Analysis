import React from 'react';
import { cn } from "@/lib/utils";

// Simple India map outline with some major cities/regions
const INDIA_REGIONS = [
  { id: 'delhi', name: 'Delhi', path: 'M40,30 L45,25 L50,30 L45,35 Z', center: [45, 30] },
  { id: 'mumbai', name: 'Mumbai', path: 'M25,60 L20,65 L25,70 L30,65 Z', center: [25, 65] },
  { id: 'bangalore', name: 'Bangalore', path: 'M35,80 L30,85 L35,90 L40,85 Z', center: [35, 85] },
  { id: 'chennai', name: 'Chennai', path: 'M50,80 L45,85 L50,90 L55,85 Z', center: [50, 85] },
  { id: 'kolkata', name: 'Kolkata', path: 'M75,45 L70,50 L75,55 L80,50 Z', center: [75, 50] },
  { id: 'hyderabad', name: 'Hyderabad', path: 'M45,70 L40,75 L45,80 L50,75 Z', center: [45, 75] },
  { id: 'pune', name: 'Pune', path: 'M30,65 L25,70 L30,75 L35,70 Z', center: [30, 70] },
  { id: 'ahmedabad', name: 'Ahmedabad', path: 'M20,45 L15,50 L20,55 L25,50 Z', center: [20, 50] },
  { id: 'jaipur', name: 'Jaipur', path: 'M30,40 L25,45 L30,50 L35,45 Z', center: [30, 45] },
  { id: 'lucknow', name: 'Lucknow', path: 'M55,40 L50,45 L55,50 L60,45 Z', center: [55, 45] },
];

// Simple India map outline
const INDIA_OUTLINE = `
  M10,40 
  C15,20 30,10 50,10 
  C70,10 85,20 90,40 
  C95,60 90,80 70,90 
  C50,100 30,90 20,80 
  C10,70 5,60 10,40 
  Z
`;

const MapChart = ({ 
  data = [], 
  idKey = 'region',
  valueKey = 'value',
  nameKey = 'name',
  className,
  onClick,
  tooltip,
}) => {
  // Get min and max values to normalize the heat intensity
  const values = data.map(item => item[valueKey]);
  const maxValue = Math.max(...values, 1);
  const minValue = Math.min(...values, 0);
  
  // Map data by region ID for quick lookup
  const dataMap = {};
  data.forEach(item => {
    dataMap[item[idKey]] = item;
  });
  
  return (
    <div className={cn("w-full h-full relative", className)}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* India outline */}
        <path
          d={INDIA_OUTLINE}
          fill="#E5E7EB"  // gray-200
          stroke="#9CA3AF" // gray-400
          strokeWidth="0.5"
        />
        
        {/* Regions */}
        {INDIA_REGIONS.map(region => {
          const regionData = dataMap[region.id];
          
          // Calculate intensity based on value (0-1)
          let intensity = 0;
          if (regionData) {
            intensity = (regionData[valueKey] - minValue) / (maxValue - minValue) || 0;
          }
          
          // Color based on intensity
          const hue = 200; // Blue
          const saturation = 90;
          const lightness = 100 - (intensity * 50); // Higher intensity = darker
          const color = regionData ? `hsl(${hue}, ${saturation}%, ${lightness}%)` : '#CBD5E1';
          
          return (
            <g key={region.id}>
              <path
                d={region.path}
                fill={color}
                stroke="#fff"
                strokeWidth="0.3"
                className="transition-colors duration-300 hover:opacity-80 cursor-pointer"
                onClick={() => onClick && onClick(regionData || { [idKey]: region.id, [nameKey]: region.name })}
                data-tooltip-id={tooltip}
                data-tooltip-content={regionData ? 
                  `${region.name}: ${regionData[valueKey]} cars` : 
                  `${region.name}: No data`
                }
              />
              <text
                x={region.center[0]}
                y={region.center[1]}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="2.5"
                fontWeight="bold"
                fill="#374151" // gray-700
                pointerEvents="none"
              >
                {regionData ? regionData[valueKey] : ''}
              </text>
              <text
                x={region.center[0]}
                y={region.center[1] + 3}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="1.8"
                fill="#4B5563" // gray-600
                pointerEvents="none"
              >
                {region.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export { MapChart }; 