
import React from 'react';
import AnalyticsLayout from '@/components/Layout/AnalyticsLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AnalyticsFinancials = () => {
  return (
    <AnalyticsLayout 
      title="Financial Insights" 
      description="Analyze your spending patterns and trends"
    >
      <Card>
        <CardHeader>
          <CardTitle>Monthly Spending Trend</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <div className="flex items-center justify-center h-full text-gray-500">
            Financial analysis will be implemented here
          </div>
        </CardContent>
      </Card>
    </AnalyticsLayout>
  );
};

export default AnalyticsFinancials;
