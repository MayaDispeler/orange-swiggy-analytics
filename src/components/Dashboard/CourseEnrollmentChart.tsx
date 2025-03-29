
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jan', value: 42 },
  { month: 'Feb', value: 38 },
  { month: 'Mar', value: 47 },
  { month: 'Apr', value: 51 },
  { month: 'May', value: 55 },
  { month: 'Jun', value: 62 },
  { month: 'Jul', value: 58 },
  { month: 'Aug', value: 65 },
  { month: 'Sep', value: 71 },
  { month: 'Oct', value: 68 },
  { month: 'Nov', value: 76 },
  { month: 'Dec', value: 79 },
];

const CourseEnrollmentChart = () => {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
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
          <Bar 
            dataKey="value" 
            fill="#F97316" 
            radius={[4, 4, 0, 0]} 
            barSize={20}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CourseEnrollmentChart;
