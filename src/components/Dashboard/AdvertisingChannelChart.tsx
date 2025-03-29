
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const data = [
  { name: 'Google Ads', value: 42 },
  { name: 'Facebook', value: 28 },
  { name: 'Instagram', value: 18 },
  { name: 'LinkedIn', value: 12 },
];

const COLORS = ['#F97316', '#3B82F6', '#10B981', '#8B5CF6'];

const AdvertisingChannelChart = () => {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [`${value}%`, 'Percentage']}
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #f0f0f0',
              borderRadius: '4px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
            }}
          />
          <Legend 
            layout="vertical" 
            verticalAlign="middle" 
            align="right" 
            iconType="circle"
            iconSize={10}
            formatter={(value: string) => (
              <span style={{ color: '#4B5563', fontSize: '12px' }}>
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AdvertisingChannelChart;
