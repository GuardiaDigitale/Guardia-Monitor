import React from 'react';
import Svg, { G, Circle, Text as SvgText } from 'react-native-svg';

interface DoughnutChartProps {
  data: Array<{
    value: number;
    color: string;
    label: string;
  }>;
  size?: number;
  strokeWidth?: number;
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({ 
  data, 
  size = 200, //Hardcoded values to match the previous ones from library
  strokeWidth = 30  //Hardcoded values to match the previous ones from library
}) => {
  //Calculate radius and circumference
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  //Calculate total
  const total = data.reduce((sum, item) => sum + item.value, 0);

  //Filter out values with 0
  const validData = data.filter(item => item.value > 0);
  if (validData.length === 0) return null;

  //Calculate segments
  let lastOffset = 0;
  
  const segments = validData.map((item, index) => {
    const segmentLength = (item.value / total) * circumference;
    const strokeDasharray = `${segmentLength} ${circumference}`;
    const rotation = (lastOffset / circumference) * 360;
    
    lastOffset += segmentLength;
    
    return (
      <Circle
        key={index}
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="transparent"
        stroke={item.color}
        strokeWidth={strokeWidth}
        strokeDasharray={strokeDasharray}
        strokeDashoffset={0}
        rotation={-90 + rotation}
        origin={`${size / 2}, ${size / 2}`}
      />
    );
  });

  //Render chart
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <G>
        {segments}
        <SvgText
          x={size / 2}
          y={size / 2}
          textAnchor="middle"
          alignmentBaseline="middle"
          fontSize="24"
          fontWeight="bold"
          fill="#043474"
        >
          
        </SvgText>
      </G>
    </Svg>
  );
};

export default DoughnutChart;