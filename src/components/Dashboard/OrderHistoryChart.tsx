
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
  { month: 'Jan', orders: 8 },
  { month: 'Feb', orders: 10 },
  { month: 'Mar', orders: 12 },
  { month: 'Apr', orders: 9 },
  { month: 'May', orders: 11 },
  { month: 'Jun', orders: 15 },
  { month: 'Jul', orders: 13 },
  { month: 'Aug', orders: 14 },
  { month: 'Sep', orders: 12 },
  { month: 'Oct', orders: 16 },
  { month: 'Nov', orders: 18 },
  { month: 'Dec', orders: 14 },
];

const OrderHistoryChart = () => {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
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
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: '#888' }}
          />
          <Tooltip 
            formatter={(value: number) => [`${value} orders`, 'Orders']}
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
            dataKey="orders" 
            stroke="#F97316" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorOrders)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OrderHistoryChart;
