import React, { useEffect, useState } from 'react';
import AnalyticsLayout from '@/components/Layout/AnalyticsLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, LineChart } from '@/components/Charts';
import { PieChart } from './Customer';
import CircularProgress from '@/components/Dashboard/CircularProgress';
import { ArrowUpIcon, ArrowDownIcon, TrendingUpIcon, TrendingDownIcon } from 'lucide-react';

// Define interfaces based on the Python data structure
interface SwiggyOrder {
  order_time: string;
  order_total: number;
  order_items: {name: string; price: number; is_veg?: string}[];
  restaurant_name: string;
  restaurant_type: string;
  restaurant_customer_distance: number;
  on_time: boolean;
  delivery_time_in_seconds: number;
  payment_method: string;
  charges: {
    GST?: number;
    [key: string]: number | undefined;
  };
}

interface OverviewMetrics {
  totalOrders: number;
  totalRevenue: number;
  avgOrderValue: number;
  totalItems: number;
  avgItemsPerOrder: number;
  uniqueRestaurants: number;
  onTimeRate: number;
  maxOrder: number;
  minOrder: number;
  avgDeliveryTime: number;
  maxDeliveryTime: number;
  totalDistance: number;
  totalTax: number;
  mostUsedRestType: string;
  mostUsedPayment: string;
}

interface MonthlyData {
  monthName: string;
  orders: number;
  revenue: number;
}

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

const AnalyticsOverview = () => {
  const [metrics, setMetrics] = useState<OverviewMetrics | null>(null);
  const [monthlyData, setMonthlyData] = useState<{ x: string[], y: number[] }>({ x: [], y: [] });
  const [revenueData, setRevenueData] = useState<{ x: string[], y: number[] }>({ x: [], y: [] });
  const [categoryData, setCategoryData] = useState<{ names: string[], values: number[], colors: string[] }>({ names: [], values: [], colors: [] });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch data and calculate metrics
    const fetchData = async () => {
      try {
        // In a real app, you would fetch data from your API
        const response = await fetch('/api/swiggy-orders');
        const orders: SwiggyOrder[] = await response.json();
        
        // Calculate metrics
        const calculatedMetrics = calculateMetrics(orders);
        setMetrics(calculatedMetrics);
        
        // Generate monthly data for charts
        generateMonthlyData(orders);
        
        // Generate category data
        generateCategoryData(orders);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Use dummy data for demo purposes
        setMetrics(getDummyMetrics());
        setDummyChartData();
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to calculate metrics from orders data
  const calculateMetrics = (orders: SwiggyOrder[]): OverviewMetrics => {
    // Total orders
    const totalOrders = orders.length;
    
    // Add delivery_time_in_minutes
    const ordersWithMinutes = orders.map(order => ({
      ...order,
      delivery_time_in_minutes: order.delivery_time_in_seconds / 60,
      total_items: Array.isArray(order.order_items) ? order.order_items.length : 0
    }));

    // Total revenue
    const totalRevenue = ordersWithMinutes.reduce((sum, order) => sum + order.order_total, 0);
    
    // Average order value
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    // Total items
    const totalItems = ordersWithMinutes.reduce((sum, order) => sum + order.total_items, 0);
    
    // Average items per order
    const avgItemsPerOrder = totalOrders > 0 ? totalItems / totalOrders : 0;
    
    // Unique restaurants
    const uniqueRestaurants = new Set(ordersWithMinutes.map(order => order.restaurant_name)).size;
    
    // On-time rate
    const onTimeDeliveries = ordersWithMinutes.filter(order => order.on_time).length;
    const onTimeRate = totalOrders > 0 ? (onTimeDeliveries / totalOrders) * 100 : 0;
    
    // Max and min order values
    const maxOrder = Math.max(...ordersWithMinutes.map(order => order.order_total));
    const minOrder = Math.min(...ordersWithMinutes.map(order => order.order_total));
    
    // Delivery time stats
    const avgDeliveryTime = ordersWithMinutes.reduce((sum, order) => sum + order.delivery_time_in_minutes, 0) / totalOrders;
    const maxDeliveryTime = Math.max(...ordersWithMinutes.map(order => order.delivery_time_in_minutes));
    
    // Total distance
    const totalDistance = ordersWithMinutes.reduce((sum, order) => sum + (order.restaurant_customer_distance || 0), 0);
    
    // Calculate total GST/tax
    let totalTax = 0;
    ordersWithMinutes.forEach(order => {
      if (order.charges && order.charges.GST) {
        totalTax += order.charges.GST;
      }
    });
    
    // Most common restaurant type and payment method
    const restTypeCounts: Record<string, number> = {};
    const paymentMethodCounts: Record<string, number> = {};
    
    ordersWithMinutes.forEach(order => {
      const restType = order.restaurant_type || "Unknown";
      const paymentMethod = order.payment_method || "Unknown";
      
      restTypeCounts[restType] = (restTypeCounts[restType] || 0) + 1;
      paymentMethodCounts[paymentMethod] = (paymentMethodCounts[paymentMethod] || 0) + 1;
    });
    
    const mostUsedRestType = Object.entries(restTypeCounts).reduce(
      (max, [type, count]) => (count > max.count ? { type, count } : max),
      { type: "Unknown", count: 0 }
    ).type;
    
    const mostUsedPayment = Object.entries(paymentMethodCounts).reduce(
      (max, [method, count]) => (count > max.count ? { method, count } : max),
      { method: "Unknown", count: 0 }
    ).method;
    
    return {
      totalOrders,
      totalRevenue,
      avgOrderValue,
      totalItems,
      avgItemsPerOrder,
      uniqueRestaurants,
      onTimeRate,
      maxOrder,
      minOrder,
      avgDeliveryTime,
      maxDeliveryTime,
      totalDistance,
      totalTax,
      mostUsedRestType,
      mostUsedPayment
    };
  };

  // Generate monthly order and revenue data
  const generateMonthlyData = (orders: SwiggyOrder[]) => {
    const monthlyOrders: Record<string, number> = {};
    const monthlyRevenue: Record<string, number> = {};
    
    // Sort orders by date
    const sortedOrders = [...orders].sort((a, b) => 
      new Date(a.order_time).getTime() - new Date(b.order_time).getTime()
    );
    
    sortedOrders.forEach(order => {
      const date = new Date(order.order_time);
      const monthYear = date.toLocaleString('default', { month: 'short', year: '2-digit' });
      
      monthlyOrders[monthYear] = (monthlyOrders[monthYear] || 0) + 1;
      monthlyRevenue[monthYear] = (monthlyRevenue[monthYear] || 0) + order.order_total;
    });
    
    const months = Object.keys(monthlyOrders);
    
    setMonthlyData({
      x: months,
      y: months.map(month => monthlyOrders[month])
    });
    
    setRevenueData({
      x: months,
      y: months.map(month => monthlyRevenue[month])
    });
  };

  // Generate category data for pie chart
  const generateCategoryData = (orders: SwiggyOrder[]) => {
    const categories: Record<string, number> = {};
    
    orders.forEach(order => {
      const category = order.restaurant_type || "Unknown";
      categories[category] = (categories[category] || 0) + 1;
    });
    
    // Get top 5 categories
    const sortedCategories = Object.entries(categories)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    // Color palette inspired by reference image - blues and purples
    const colors = [
      '#7F56E0', // Purple
      '#6366F1', // Indigo
      '#3B82F6', // Blue
      '#0EA5E9', // Light blue
      '#06B6D4', // Cyan
    ];
    
    setCategoryData({
      names: sortedCategories.map(([name]) => name),
      values: sortedCategories.map(([, count]) => count),
      colors: colors.slice(0, sortedCategories.length)
    });
  };

  // Function to get dummy metrics for demo
  const getDummyMetrics = (): OverviewMetrics => {
    return {
      totalOrders: 142,
      totalRevenue: 28640,
      avgOrderValue: 201.69,
      totalItems: 423,
      avgItemsPerOrder: 2.98,
      uniqueRestaurants: 32,
      onTimeRate: 92.3,
      maxOrder: 1250,
      minOrder: 49,
      avgDeliveryTime: 28.4,
      maxDeliveryTime: 53.1,
      totalDistance: 114.5,
      totalTax: 1758,
      mostUsedRestType: "North Indian",
      mostUsedPayment: "UPI"
    };
  };

  // Set dummy chart data
  const setDummyChartData = () => {
    // Monthly data
    setMonthlyData({
      x: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      y: [12, 18, 15, 22, 27, 24]
    });
    
    // Revenue data
    setRevenueData({
      x: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      y: [2400, 3600, 3000, 4500, 5200, 4800]
    });
    
    // Category data with new color palette
    setCategoryData({
      names: ['North Indian', 'South Indian', 'Chinese', 'Fast Food', 'Desserts'],
      values: [45, 25, 15, 10, 5],
      colors: ['#7F56E0', '#6366F1', '#3B82F6', '#0EA5E9', '#06B6D4']
    });
  };

  // Format number with commas
  const formatNumber = (num: number): string => {
    return num.toLocaleString('en-IN');
  };

  // Format currency
  const formatCurrency = (amount: number): string => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  // If loading, show loading state
  if (loading) {
    return (
      <AnalyticsLayout 
        title="Analytics Overview" 
        description="Loading data..."
      >
        <div>Loading...</div>
      </AnalyticsLayout>
    );
  }

  return (
    <AnalyticsLayout 
      title="Analytics Dashboard" 
      description="Key metrics and insights about your Swiggy orders"
    >
      {/* Top stats row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold text-blue-700">{formatNumber(metrics?.totalOrders || 0)}</div>
              <div className="rounded-full bg-green-100 p-2">
                <TrendingUpIcon className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="text-sm text-green-600 mt-2 flex items-center">
              <ArrowUpIcon className="h-3 w-3 mr-1" />
              <span>8.2% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-white border border-purple-100 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold text-purple-700">{formatCurrency(metrics?.totalRevenue || 0)}</div>
              <div className="rounded-full bg-green-100 p-2">
                <TrendingUpIcon className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="text-sm text-green-600 mt-2 flex items-center">
              <ArrowUpIcon className="h-3 w-3 mr-1" />
              <span>12.4% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Avg Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold text-indigo-700">{formatCurrency(metrics?.avgOrderValue || 0)}</div>
              <div className="rounded-full bg-green-100 p-2">
                <TrendingUpIcon className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="text-sm text-green-600 mt-2 flex items-center">
              <ArrowUpIcon className="h-3 w-3 mr-1" />
              <span>3.5% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-50 to-white border border-cyan-100 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Avg Delivery Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold text-cyan-700">{(metrics?.avgDeliveryTime || 0).toFixed(1)} min</div>
              <div className="rounded-full bg-red-100 p-2">
                <TrendingDownIcon className="h-5 w-5 text-red-600" />
              </div>
            </div>
            <div className="text-sm text-red-600 mt-2 flex items-center">
              <ArrowDownIcon className="h-3 w-3 mr-1" />
              <span>2.4% from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle>Order Performance</CardTitle>
              <CardDescription>Monthly Orders & Revenue</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <div className="h-full">
                <LineChart 
                  data={{
                    x: monthlyData.x,
                    y: monthlyData.y
                  }}
                  xAxisTitle="Month"
                  yAxisTitle="Order Count"
                  showMarkers={true}
                  color="#6366F1"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle>Restaurant Categories</CardTitle>
              <CardDescription>Order distribution by cuisine</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <div className="h-full">
                <PieChart 
                  data={categoryData}
                  title="Order Distribution"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Second Row - Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle>On-Time Delivery Rate</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="flex flex-col items-center justify-center">
              <CircularProgress 
                percentage={metrics?.onTimeRate || 0} 
                size={150} 
                strokeWidth={10} 
                color="#7F56E0"
              />
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">Your orders arrive on time</p>
                <p className="text-sm font-medium mt-1">Average: {(metrics?.onTimeRate || 0).toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-60">
            <div className="h-full">
              <BarChart 
                data={{
                  x: revenueData.x,
                  y: revenueData.y
                }}
                xAxisTitle="Month"
                yAxisTitle="Revenue (₹)"
                showValues={false}
                color="#3B82F6"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle>Highest & Lowest</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Highest Order</h3>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-blue-700">{formatCurrency(metrics?.maxOrder || 0)}</span>
                  <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                    Maximum
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Average Order</h3>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-purple-700">{formatCurrency(metrics?.avgOrderValue || 0)}</span>
                  <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                    Average
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Lowest Order</h3>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-indigo-700">{formatCurrency(metrics?.minOrder || 0)}</span>
                  <div className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs font-medium">
                    Minimum
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Items Ordered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{formatNumber(metrics?.totalItems || 0)}</div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Avg Items per Order</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">{(metrics?.avgItemsPerOrder || 0).toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Restaurants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-700">{metrics?.uniqueRestaurants}</div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Distance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyan-700">{(metrics?.totalDistance || 0).toFixed(1)} km</div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total GST Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{formatCurrency(metrics?.totalTax || 0)}</div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Max Delivery Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">{(metrics?.maxDeliveryTime || 0).toFixed(1)} min</div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Top Restaurant Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-700">{metrics?.mostUsedRestType}</div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Top Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyan-700">{metrics?.mostUsedPayment}</div>
          </CardContent>
        </Card>
      </div>
    </AnalyticsLayout>
  );
};

export default AnalyticsOverview;
