
import React from 'react';
import AnalyticsLayout from '@/components/Layout/AnalyticsLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AnalyticsTime = () => {
  return (
    <AnalyticsLayout 
      title="Time-Based Insights" 
      description="Analyze your ordering patterns over time"
    >
      <Card>
        <CardHeader>
          <CardTitle>Order Frequency by Day of Week</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <div className="flex items-center justify-center h-full text-gray-500">
            Chart will be implemented here
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Order Distribution by Time of Day</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <div className="flex items-center justify-center h-full text-gray-500">
              Chart will be implemented here
            </div>
          </CardContent>
        </Card>
      </div>
    </AnalyticsLayout>
  );
};

export default AnalyticsTime;
