
import React from 'react';
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from 'recharts';

const data = [
  { area: 'A1', value: 85 },
  { area: 'A2', value: 92 },
  { area: 'A3', value: 78 },
  { area: 'A4', value: 89 },
  { area: 'A5', value: 82 },
  { area: 'A6', value: 94 },
];

const AreaCodeChart = () => {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis 
            dataKey="area" 
            tick={{ fill: '#6b7280', fontSize: 12 }}
          />
          <Radar
            name="Area Coverage"
            dataKey="value"
            stroke="#F97316"
            fill="#F97316"
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AreaCodeChart;
