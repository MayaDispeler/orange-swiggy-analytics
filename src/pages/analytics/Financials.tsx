import React from 'react';
import AnalyticsLayout from '@/components/Layout/AnalyticsLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AnalyticsFinancials = () => {
  return (
    <AnalyticsLayout 
      title="Financial Insights" 
      description="Analyze your spending patterns and trends"
    >
      {/* Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Fee Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <div className="flex items-center justify-center h-full text-gray-500">
              Chart will be implemented here
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Spend Summary</CardTitle>
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
            <CardTitle>💰 Total Tips Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-swiggy-orange text-center">
              ₹342.75
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Coupon Usage</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <div className="flex items-center justify-center h-full text-gray-500">
              Chart will be implemented here
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 3 */}
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Spending Trend</CardTitle>
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

export default AnalyticsFinancials;
