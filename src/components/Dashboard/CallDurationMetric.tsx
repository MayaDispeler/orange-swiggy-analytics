
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';

const CallDurationMetric = () => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-md font-medium">Avg. Call Duration</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-4 py-8">
        <div className="bg-swiggy-orange/10 rounded-full p-4">
          <Clock className="h-8 w-8 text-swiggy-orange" />
        </div>
        
        <div className="flex items-baseline space-x-1">
          <span className="text-4xl font-bold text-swiggy-orange">04:16</span>
          <span className="text-sm text-gray-500">minutes</span>
        </div>
        
        <div className="flex items-center space-x-6 mt-2">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500">Min</p>
            <p className="text-lg font-semibold">01:22</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500">Max</p>
            <p className="text-lg font-semibold">12:05</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CallDurationMetric;
