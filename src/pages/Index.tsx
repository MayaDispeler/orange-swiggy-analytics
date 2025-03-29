
import React from 'react';
import { ShoppingBag, Clock, Calendar, TrendingUp, MapPin, DollarSign, Star, Pizza } from 'lucide-react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import StatCard from '@/components/Dashboard/StatCard';
import ChartCard from '@/components/Dashboard/ChartCard';
import OrderHistoryChart from '@/components/Dashboard/OrderHistoryChart';
import CircularProgress from '@/components/Dashboard/CircularProgress';
import FavoriteRestaurants from '@/components/Dashboard/FavoriteRestaurants';
import RecentOrders from '@/components/Dashboard/RecentOrders';
import SpendingCategoryChart from '@/components/Dashboard/SpendingCategoryChart';
import DeliveryTimeChart from '@/components/Dashboard/DeliveryTimeChart';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-fade-in">
        <StatCard
          title="Total Orders"
          value="132"
          icon={<ShoppingBag className="h-5 w-5 text-swiggy-orange" />}
          trend={{ value: 8.2, isPositive: true }}
        />
        <StatCard
          title="Total Spent"
          value="₹25,490"
          icon={<DollarSign className="h-5 w-5 text-swiggy-orange" />}
          trend={{ value: 12.4, isPositive: true }}
        />
        <StatCard
          title="Avg. Order Value"
          value="₹193"
          icon={<TrendingUp className="h-5 w-5 text-swiggy-orange" />}
          description="Per order"
        />
        <StatCard
          title="Avg. Delivery Time"
          value="28 min"
          icon={<Clock className="h-5 w-5 text-swiggy-orange" />}
          trend={{ value: 2.5, isPositive: false }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2 animate-slide-in">
          <ChartCard 
            title="Order History" 
            action={
              <Button variant="ghost" size="sm" className="text-swiggy-orange">
                View All
                <ShoppingBag className="ml-1 h-4 w-4" />
              </Button>
            }
          >
            <OrderHistoryChart />
          </ChartCard>
        </div>
        <div className="flex flex-col space-y-4 animate-slide-in">
          <div className="h-1/2">
            <Card className="h-full">
              <CardContent className="flex flex-col items-center justify-center h-full py-6">
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-2">Favorite Cuisine</h3>
                  <div className="bg-swiggy-orange/10 rounded-full mx-auto p-4 mb-2">
                    <Pizza className="h-8 w-8 text-swiggy-orange" />
                  </div>
                  <p className="text-2xl font-bold text-swiggy-orange">North Indian</p>
                  <p className="text-sm text-gray-500 mt-1">42% of your orders</p>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="h-1/2">
            <Card className="h-full">
              <CardContent className="flex flex-col items-center justify-center h-full py-6">
                <div className="flex space-x-4 items-center justify-center">
                  <CircularProgress 
                    percentage={92} 
                    size={90} 
                    strokeWidth={8} 
                    color="#F97316"
                  />
                  <div className="space-y-2">
                    <p className="text-lg font-medium">On-Time Delivery</p>
                    <p className="text-3xl font-bold text-swiggy-orange">92%</p>
                    <p className="text-sm text-gray-500">of your orders</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="animate-fade-in">
          <ChartCard title="Spending by Category">
            <SpendingCategoryChart />
          </ChartCard>
        </div>
        <div className="animate-fade-in">
          <ChartCard title="Delivery Time Trend">
            <DeliveryTimeChart />
          </ChartCard>
        </div>
        <div className="animate-fade-in">
          <FavoriteRestaurants />
        </div>
      </div>

      <div className="animate-slide-in">
        <RecentOrders />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
