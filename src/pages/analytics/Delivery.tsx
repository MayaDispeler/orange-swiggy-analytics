
import React from 'react';
import AnalyticsLayout from '@/components/Layout/AnalyticsLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AnalyticsDelivery = () => {
  return (
    <AnalyticsLayout 
      title="Delivery Insights" 
      description="Analyze delivery performance and patterns"
    >
      <Card>
        <CardHeader>
          <CardTitle>Delivery Time Analysis</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <div className="flex items-center justify-center h-full text-gray-500">
            Delivery performance analysis will be implemented here
          </div>
        </CardContent>
      </Card>
    </AnalyticsLayout>
  );
};

export default AnalyticsDelivery;
