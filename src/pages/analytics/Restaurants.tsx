
import React from 'react';
import AnalyticsLayout from '@/components/Layout/AnalyticsLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AnalyticsRestaurants = () => {
  return (
    <AnalyticsLayout 
      title="Restaurant Insights" 
      description="Analyze your restaurant preferences and patterns"
    >
      <Card>
        <CardHeader>
          <CardTitle>Top Restaurants by Orders</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <div className="flex items-center justify-center h-full text-gray-500">
            Restaurant analysis will be implemented here
          </div>
        </CardContent>
      </Card>
    </AnalyticsLayout>
  );
};

export default AnalyticsRestaurants;
