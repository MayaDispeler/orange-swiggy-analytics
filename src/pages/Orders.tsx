
import React from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RecentOrders from '@/components/Dashboard/RecentOrders';

const Orders = () => {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">My Orders</h1>
        <p className="text-gray-500">View and manage all your Swiggy orders</p>
      </div>
      
      <div className="mb-6">
        <RecentOrders />
      </div>
    </DashboardLayout>
  );
};

export default Orders;
