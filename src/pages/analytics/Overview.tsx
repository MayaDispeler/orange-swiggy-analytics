import React from 'react';
import AnalyticsLayout from '@/components/Layout/AnalyticsLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DeliveryTimeChart from '@/components/Dashboard/DeliveryTimeChart';

const AnalyticsOverview = () => {
  return (
    <AnalyticsLayout 
      title="Analytics Overview" 
      description="Key metrics and insights about your Swiggy orders"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-swiggy-orange">42</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue (₹)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-swiggy-orange">₹8,246</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value (₹)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-swiggy-orange">₹196.33</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Items Ordered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-swiggy-orange">180</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Items per Order</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-swiggy-orange">4.29</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Unique Restaurants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-swiggy-orange">23</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">On-Time Delivery Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-swiggy-orange">92.3%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Max Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-swiggy-orange">₹784</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Min Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-swiggy-orange">₹49</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Delivery Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-swiggy-orange">28.4 min</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Max Delivery Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-swiggy-orange">53.1 min</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Distance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-swiggy-orange">114.5 km</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total GST Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-swiggy-orange">₹618</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Top Restaurant Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-swiggy-orange">Indian</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Top Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-swiggy-orange">UPI</div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Delivery Time Across Week</CardTitle>
          </CardHeader>
          <CardContent>
            <DeliveryTimeChart />
          </CardContent>
        </Card>
      </div>
    </AnalyticsLayout>
  );
};

export default AnalyticsOverview;
