
import React from 'react';
import AnalyticsLayout from '@/components/Layout/AnalyticsLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AnalyticsGeography = () => {
  return (
    <AnalyticsLayout 
      title="Geographic Insights" 
      description="Discover patterns in your ordering locations"
    >
      <Card>
        <CardHeader>
          <CardTitle>Orders by Area</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <div className="flex items-center justify-center h-full text-gray-500">
            Map visualization will be implemented here
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Most Ordered Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Koramangala</span>
                <span className="font-medium">18 orders</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Indiranagar</span>
                <span className="font-medium">12 orders</span>
              </div>
              <div className="flex justify-between items-center">
                <span>HSR Layout</span>
                <span className="font-medium">8 orders</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AnalyticsLayout>
  );
};

export default AnalyticsGeography;
