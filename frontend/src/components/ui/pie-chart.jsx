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
  '#4FD1C5', // teal-400
  '#A3BFFA', // indigo-300
  '#FBD38D', // yellow-400
  '#F687B3', // pink-400
  '#B794F4', // purple-400
];

const PieChart = ({ 
  data = [],
  nameKey = 'name',
  valueKey = 'value',
  colors = COLORS,
  innerRadius = 0,
  className,
  onClick,
  tooltip,
  showLabels = false,
}) => {
  const total = data.reduce((sum, item) => sum + item[valueKey], 0);
  if (!total) return <div className="flex items-center justify-center h-full">No data available</div>;

  let startAngle = 0;
  
  return (
    <div className={cn("w-full h-full relative", className)}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <g transform="translate(50,50)">
          {data.map((item, index) => {
            const percentage = (item[valueKey] / total) * 100;
            if (percentage < 0.1) return null; // Skip very small slices
            
            const angle = (percentage / 100) * 360;
            const endAngle = startAngle + angle;
            
            // Calculate SVG arc path
            const x1 = Math.cos((startAngle * Math.PI) / 180) * 50;
            const y1 = Math.sin((startAngle * Math.PI) / 180) * 50;
            
            const x2 = Math.cos((endAngle * Math.PI) / 180) * 50;
            const y2 = Math.sin((endAngle * Math.PI) / 180) * 50;
            
            // For inner radius (donut chart)
            const x1Inner = Math.cos((startAngle * Math.PI) / 180) * innerRadius;
            const y1Inner = Math.sin((startAngle * Math.PI) / 180) * innerRadius;
            
            const x2Inner = Math.cos((endAngle * Math.PI) / 180) * innerRadius;
            const y2Inner = Math.sin((endAngle * Math.PI) / 180) * innerRadius;
            
            const largeArcFlag = angle > 180 ? 1 : 0;
            
            // Create path for pie/donut slice
            let path;
            if (innerRadius === 0) {
              // Pie chart (no inner radius)
              path = `M 0 0 L ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
            } else {
              // Donut chart (with inner radius)
              path = `
                M ${x1Inner} ${y1Inner}
                L ${x1} ${y1}
                A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2}
                L ${x2Inner} ${y2Inner}
                A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x1Inner} ${y1Inner}
                Z
              `;
            }
            
            // Calculate position for label
            const labelAngle = startAngle + (angle / 2);
            const labelRadius = innerRadius ? (50 + innerRadius) / 2 : 30;
            const labelX = Math.cos((labelAngle * Math.PI) / 180) * labelRadius;
            const labelY = Math.sin((labelAngle * Math.PI) / 180) * labelRadius;
            
            const result = (
              <g key={index}>
                <path
                  d={path}
                  fill={colors[index % colors.length]}
                  stroke="#fff"
                  strokeWidth="1"
                  className="transition-opacity duration-200 hover:opacity-80 cursor-pointer"
                  onClick={() => onClick && onClick(item, index)}
                  data-tooltip-id={tooltip}
                  data-tooltip-content={`${item[nameKey]}: ${item[valueKey]} (${percentage.toFixed(1)}%)`}
                />
                {showLabels && percentage > 5 && (
                  <text
                    x={labelX}
                    y={labelY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#fff"
                    fontSize="3"
                    fontWeight="bold"
                    pointerEvents="none"
                  >
                    {percentage > 10 ? `${percentage.toFixed(0)}%` : ''}
                  </text>
                )}
              </g>
            );
            
            startAngle = endAngle;
            return result;
          })}
        </g>
      </svg>
    </div>
  );
};

export { PieChart }; 