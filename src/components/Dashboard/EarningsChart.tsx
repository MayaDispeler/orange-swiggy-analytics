
import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const data = [
  { month: 'Jan', value: 15200000 },
  { month: 'Feb', value: 13500000 },
  { month: 'Mar', value: 14900000 },
  { month: 'Apr', value: 16700000 },
  { month: 'May', value: 18200000 },
  { month: 'Jun', value: 17900000 },
  { month: 'Jul', value: 19100000 },
  { month: 'Aug', value: 21500000 },
  { month: 'Sep', value: 20400000 },
  { month: 'Oct', value: 22300000 },
  { month: 'Nov', value: 21800000 },
  { month: 'Dec', value: 19500000 },
];

const formatValue = (value: number) => {
  if (value >= 1000000) {
    return `₹${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `₹${(value / 1000).toFixed(1)}K`;
  }
  return `₹${value}`;
};

const EarningsChart = () => {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F97316" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis 
            dataKey="month" 
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: '#888' }}
          />
          <YAxis 
            tickFormatter={formatValue} 
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: '#888' }}
          />
          <Tooltip 
            formatter={(value: number) => [formatValue(value), 'Earnings']}
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #f0f0f0',
              borderRadius: '4px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
            }}
            labelStyle={{ 
              fontWeight: 'bold', 
              color: '#333',
              marginBottom: '4px'
            }}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#F97316" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorValue)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EarningsChart;
