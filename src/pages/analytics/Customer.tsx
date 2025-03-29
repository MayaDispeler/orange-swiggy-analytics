import React from 'react';
import AnalyticsLayout from '@/components/Layout/AnalyticsLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AnalyticsCustomer = () => {
  return (
    <AnalyticsLayout 
      title="Customer Behavior" 
      description="Insights into your own ordering habits"
    >
      {/* Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Ordered Items</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <div className="flex items-center justify-center h-full text-gray-500">
              Chart will be implemented here
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Veg vs Non-Veg Preference</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <div className="flex items-center justify-center h-full text-gray-500">
              Chart will be implemented here
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Item Type Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <div className="flex items-center justify-center h-full text-gray-500">
              Chart will be implemented here
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preferred Time of Day</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <div className="flex items-center justify-center h-full text-gray-500">
              Chart will be implemented here
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Restaurant Loyalty</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <div className="flex items-center justify-center h-full text-gray-500">
              Chart will be implemented here
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Basket Size Trend</CardTitle>
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

export default AnalyticsCustomer;
