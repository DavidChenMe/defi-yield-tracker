import React from 'react';

interface ChartDataPoint {
  date: string;
  value: number;
}

interface SimpleChartProps {
  data: ChartDataPoint[];
  title: string;
  height?: number;
  color?: string;
}

const SimpleChart: React.FC<SimpleChartProps> = ({ 
  data, 
  title, 
  height = 200, 
  color = '#007bff' 
}) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>No data to display</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const valueRange = maxValue - minValue || 1;
  
  const chartWidth = 600;
  const chartHeight = height - 40;
  const pointSpacing = chartWidth / (data.length - 1 || 1);

  const getY = (value: number) => {
    return chartHeight - ((value - minValue) / valueRange) * chartHeight;
  };

  const pathData = data.map((point, index) => {
    const x = index * pointSpacing;
    const y = getY(point.value);
    return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
  }).join(' ');

  const areaPath = `${pathData} L ${(data.length - 1) * pointSpacing} ${chartHeight} L 0 ${chartHeight} Z`;

  const formatValue = (value: number) => {
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}k`;
    }
    return `$${value.toFixed(0)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h4 style={{ marginBottom: '20px' }}>{title}</h4>
      
      <div style={{ position: 'relative' }}>
        <svg width={chartWidth} height={height} style={{ overflow: 'visible' }}>
          <defs>
            <linearGradient id={`gradient-${title.replace(/\s+/g, '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={color} stopOpacity={0.1} />
            </linearGradient>
          </defs>
          
          <path
            d={areaPath}
            fill={`url(#gradient-${title.replace(/\s+/g, '')})`}
            stroke="none"
          />
          
          <path
            d={pathData}
            fill="none"
            stroke={color}
            strokeWidth="2"
          />
          
          {data.map((point, index) => (
            <g key={index}>
              <circle
                cx={index * pointSpacing}
                cy={getY(point.value)}
                r="4"
                fill={color}
                stroke="white"
                strokeWidth="2"
              />
            </g>
          ))}
          
          <line
            x1="0"
            y1={chartHeight}
            x2={chartWidth}
            y2={chartHeight}
            stroke="#ddd"
            strokeWidth="1"
          />
          
          <line
            x1="0"
            y1="0"
            x2="0"
            y2={chartHeight}
            stroke="#ddd"
            strokeWidth="1"
          />
          
          {[0.25, 0.5, 0.75].map((ratio, index) => (
            <g key={index}>
              <line
                x1="0"
                y1={chartHeight * ratio}
                x2={chartWidth}
                y2={chartHeight * ratio}
                stroke="#eee"
                strokeWidth="1"
                strokeDasharray="2,2"
              />
              <text
                x="-5"
                y={chartHeight * ratio + 5}
                fontSize="12"
                fill="#666"
                textAnchor="end"
              >
                {formatValue(maxValue - (maxValue - minValue) * ratio)}
              </text>
            </g>
          ))}
          
          {data.filter((_, index) => index % Math.max(1, Math.floor(data.length / 6)) === 0).map((point, index, filteredData) => (
            <text
              key={index}
              x={data.indexOf(point) * pointSpacing}
              y={chartHeight + 20}
              fontSize="12"
              fill="#666"
              textAnchor="middle"
            >
              {formatDate(point.date)}
            </text>
          ))}
        </svg>
        
        <div style={{ 
          position: 'absolute', 
          top: '10px', 
          right: '10px', 
          fontSize: '14px', 
          fontWeight: 'bold',
          color: color
        }}>
          {formatValue(data[data.length - 1]?.value || 0)}
        </div>
      </div>
    </div>
  );
};

export default SimpleChart;