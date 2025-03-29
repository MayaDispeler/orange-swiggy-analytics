
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CircularProgress from './CircularProgress';

interface MetricRingProps {
  title: string;
  value: number;
  max: number;
  percentage: number;
  color: string;
}

const MetricRing = ({ title, value, max, percentage, color }: MetricRingProps) => {
  return (
    <div className="flex flex-col items-center">
      <CircularProgress 
        percentage={percentage} 
        size={100} 
        strokeWidth={8} 
        color={color}
      />
      <p className="text-sm font-medium mt-2">{title}</p>
      <p className="text-xs text-gray-500">{value} / {max}</p>
    </div>
  );
};

const PerformanceMetrics = () => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-md font-medium">Performance Metrics</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-6 pt-4">
        <div className="text-center">
          <p className="text-3xl font-bold text-swiggy-orange mb-1">926</p>
          <p className="text-sm text-gray-500">Total Calls</p>
        </div>
        
        <div className="grid grid-cols-3 gap-4 w-full">
          <MetricRing 
            title="Completed" 
            value={716} 
            max={926} 
            percentage={78} 
            color="#F97316" 
          />
          <MetricRing 
            title="Ongoing" 
            value={97} 
            max={926} 
            percentage={10} 
            color="#3B82F6" 
          />
          <MetricRing 
            title="Missed" 
            value={113} 
            max={926} 
            percentage={12} 
            color="#EF4444" 
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceMetrics;
