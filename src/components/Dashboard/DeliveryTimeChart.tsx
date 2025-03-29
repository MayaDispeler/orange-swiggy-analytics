
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const data = [
  { day: 'Mon', time: 32 },
  { day: 'Tue', time: 28 },
  { day: 'Wed', time: 30 },
  { day: 'Thu', time: 26 },
  { day: 'Fri', time: 34 },
  { day: 'Sat', time: 24 },
  { day: 'Sun', time: 22 },
];

const DeliveryTimeChart = () => {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis 
            dataKey="day" 
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: '#888' }}
          />
          <YAxis 
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: '#888' }}
            tickFormatter={(value) => `${value} min`}
          />
          <Tooltip
            formatter={(value: number) => [`${value} minutes`, 'Delivery Time']}
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #f0f0f0',
              borderRadius: '4px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
            }}
          />
          <Bar 
            dataKey="time" 
            fill="#F97316" 
            radius={[4, 4, 0, 0]} 
            barSize={20}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DeliveryTimeChart;
