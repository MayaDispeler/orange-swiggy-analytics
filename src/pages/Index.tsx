import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  // Redirect to analytics overview on component mount
  useEffect(() => {
    navigate('/analytics/overview');
  }, [navigate]);

  // This content will briefly appear before redirect
  return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-swiggy-orange mb-2">Redirecting to Analytics...</h2>
          <p>Please wait while we redirect you to the analytics dashboard.</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
