
import React from 'react';
import AnalyticsLayout from '@/components/Layout/AnalyticsLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AnalyticsCustomer = () => {
  return (
    <AnalyticsLayout 
      title="Customer Behavior" 
      description="Insights into your own ordering habits"
    >
      <Card>
        <CardHeader>
          <CardTitle>Order Frequency Analysis</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <div className="flex items-center justify-center h-full text-gray-500">
            Customer behavior analysis will be implemented here
          </div>
        </CardContent>
      </Card>
    </AnalyticsLayout>
  );
};

export default AnalyticsCustomer;
