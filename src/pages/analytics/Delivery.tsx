import React, { useEffect, useState } from 'react';
import AnalyticsLayout from '@/components/Layout/AnalyticsLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, LineChart } from '@/components/Charts';
import { PieChart } from './Customer'; // Reuse PieChart from Customer page

// Import interfaces
interface SwiggyOrder {
  order_time: string;
  order_total: number;
  on_time: boolean;
  delivery_time_in_seconds: number;
  delivery_boy?: {
    name: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

interface DeliveryChartData {
  onTimeStatus: {
    names: string[];
    values: number[];
    colors: string[];
  };
  deliveryTimeDistribution: {
    x: number[];
    y: number[];
  };
  topPartners: {
    x: string[];
    y: number[];
  };
  monthlyDeliveryTime: {
    x: string[];
    y: number[];
  };
  lateTrend: {
    x: string[];
    y: number[];
  };
}

const AnalyticsDelivery = () => {
  const [chartData, setChartData] = useState<DeliveryChartData | null>(null);
  const [orders, setOrders] = useState<SwiggyOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch data and calculate metrics
    const fetchData = async () => {
      try {
        // In a real app, you would fetch data from your API
        const response = await fetch('/api/swiggy-orders');
        const ordersData: SwiggyOrder[] = await response.json();
        
        setOrders(ordersData);
        
        // Process and calculate chart data
        const calculatedData = calculateDeliveryInsights(ordersData);
        setChartData(calculatedData);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Use dummy data for demo
        const dummyData = getDummyDeliveryData();
        setChartData(dummyData);
        setOrders(getDummyOrders());
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  
  // Generate dummy orders
  const getDummyOrders = (): SwiggyOrder[] => {
    const dummyOrders: Partial<SwiggyOrder>[] = [];
    
    // Generate 100 dummy orders
    for (let i = 0; i < 100; i++) {
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 180)); // Last 6 months
      
      const isOnTime = Math.random() > 0.15; // 85% on-time rate
      const deliveryTime = isOnTime ? 
        Math.floor(Math.random() * 20 + 20) * 60 : // 20-40 min for on-time
        Math.floor(Math.random() * 30 + 40) * 60;  // 40-70 min for late
      
      dummyOrders.push({
        order_time: date.toISOString(),
        on_time: isOnTime,
        delivery_time_in_seconds: deliveryTime,
        delivery_boy: {
          name: [
            'Rahul S.', 'Arvind K.', 'Vikram M.', 'Suresh P.', 
            'Amit R.', 'Kunal T.', 'Rajesh S.', 'Dinesh K.'
          ][Math.floor(Math.random() * 8)]
        }
      });
    }
    
    return dummyOrders as SwiggyOrder[];
  };

  const calculateDeliveryInsights = (orders: SwiggyOrder[]): DeliveryChartData => {
    // 1. On-Time vs Late Delivery Count
    const onTimeCount = orders.filter(order => order.on_time === true).length;
    const lateCount = orders.filter(order => order.on_time === false).length;
    
    const onTimeStatus = {
      names: ['On Time', 'Late'],
      values: [onTimeCount, lateCount],
      colors: ['#10b981', '#6366F1'] // Green for on-time, Indigo for late
    };

    // 2. Delivery Time Histogram
    // Convert seconds to minutes for all orders
    const deliveryTimeMinutes = orders.map(order => order.delivery_time_in_seconds / 60);
    
    // Create bins for histogram (5-minute intervals)
    const binSize = 5;
    const minTime = Math.floor(Math.min(...deliveryTimeMinutes) / binSize) * binSize;
    const maxTime = Math.ceil(Math.max(...deliveryTimeMinutes) / binSize) * binSize;
    
    // Create the bins
    const bins: Record<number, number> = {};
    for (let i = minTime; i <= maxTime; i += binSize) {
      bins[i] = 0;
    }
    
    // Count orders in each bin
    deliveryTimeMinutes.forEach(time => {
      const binStart = Math.floor(time / binSize) * binSize;
      bins[binStart] = (bins[binStart] || 0) + 1;
    });
    
    const deliveryTimeDistribution = {
      x: Object.keys(bins).map(Number),
      y: Object.values(bins)
    };

    // 3. Top Delivery Partners
    const partnerCounts: Record<string, number> = {};
    
    orders.forEach(order => {
      if (order.delivery_boy && order.delivery_boy.name) {
        const partnerName = order.delivery_boy.name;
        partnerCounts[partnerName] = (partnerCounts[partnerName] || 0) + 1;
      }
    });
    
    // Sort by count and take top 10
    const topPartnersList = Object.entries(partnerCounts)
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, 10);
    
    const topPartners = {
      x: topPartnersList.map(([name]) => name.length > 15 ? `${name.substring(0, 15)}...` : name),
      y: topPartnersList.map(([, count]) => count)
    };

    // 4. Monthly Avg Delivery Time
    // Process orders to include month and delivery time in minutes
    const processedOrders = orders.map(order => {
      const date = new Date(order.order_time);
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const deliveryTimeMinutes = order.delivery_time_in_seconds / 60;
      
      return {
        ...order,
        month,
        deliveryTimeMinutes
      };
    });
    
    // Group by month
    const monthlyData: Record<string, { totalTime: number; count: number }> = {};
    
    processedOrders.forEach(order => {
      if (!monthlyData[order.month]) {
        monthlyData[order.month] = { totalTime: 0, count: 0 };
      }
      
      monthlyData[order.month].totalTime += order.deliveryTimeMinutes;
      monthlyData[order.month].count += 1;
    });
    
    // Calculate average time per month
    const sortedMonths = Object.keys(monthlyData).sort();
    
    const monthlyDeliveryTime = {
      x: sortedMonths,
      y: sortedMonths.map(month => monthlyData[month].totalTime / monthlyData[month].count)
    };

    // 5. Late Deliveries Over Time
    // Mark orders as late or not
    const ordersWithLateFlag = processedOrders.map(order => ({
      ...order,
      isLate: !order.on_time
    }));
    
    // Count late deliveries by month
    const monthlyLate: Record<string, number> = {};
    
    sortedMonths.forEach(month => {
      monthlyLate[month] = ordersWithLateFlag
        .filter(order => order.month === month && order.isLate)
        .length;
    });
    
    const lateTrend = {
      x: sortedMonths,
      y: sortedMonths.map(month => monthlyLate[month])
    };

    return {
      onTimeStatus,
      deliveryTimeDistribution,
      topPartners,
      monthlyDeliveryTime,
      lateTrend
    };
  };

  // Dummy data for development
  const getDummyDeliveryData = (): DeliveryChartData => {
    return {
      onTimeStatus: {
        names: ['On Time', 'Late'],
        values: [85, 15],
        colors: ['#10b981', '#6366F1']
      },
      deliveryTimeDistribution: {
        x: [15, 20, 25, 30, 35, 40, 45, 50, 55, 60],
        y: [2, 5, 12, 18, 9, 6, 3, 2, 1, 1]
      },
      topPartners: {
        x: ['Rahul S.', 'Arvind K.', 'Vikram M.', 'Suresh P.', 'Amit R.', 'Kunal T.', 'Rajesh S.', 'Dinesh K.'],
        y: [12, 10, 8, 7, 6, 5, 4, 3]
      },
      monthlyDeliveryTime: {
        x: ['2023-01', '2023-02', '2023-03', '2023-04', '2023-05', '2023-06'],
        y: [28.5, 27.2, 30.1, 25.8, 26.3, 24.9]
      },
      lateTrend: {
        x: ['2023-01', '2023-02', '2023-03', '2023-04', '2023-05', '2023-06'],
        y: [3, 2, 4, 2, 1, 3]
      }
    };
  };

  // Calculate summary metrics for header cards
  const calculateSummaryMetrics = () => {
    if (!orders.length || !chartData) return null;
    
    // On-time delivery percentage
    const onTimePercentage = chartData.onTimeStatus.values[0] / 
      (chartData.onTimeStatus.values[0] + chartData.onTimeStatus.values[1]) * 100;
      
    // Average delivery time in minutes
    const avgDeliveryTime = orders.reduce((total, order) => 
      total + order.delivery_time_in_seconds, 0) / (orders.length * 60);
      
    // Fastest delivery in minutes
    const fastestDelivery = Math.min(...orders.map(o => o.delivery_time_in_seconds)) / 60;
    
    // Unique delivery partners
    const uniquePartners = new Set(
      orders
        .filter(o => o.delivery_boy && o.delivery_boy.name)
        .map(o => o.delivery_boy!.name)
    ).size;
    
    return {
      onTimePercentage: Math.round(onTimePercentage),
      avgDeliveryTime: Math.round(avgDeliveryTime),
      fastestDelivery: Math.round(fastestDelivery),
      uniquePartners
    };
  };

  // If loading, show loading state
  if (loading) {
    return (
      <AnalyticsLayout 
        title="Delivery Insights" 
        description="Loading data..."
      >
        <div>Loading...</div>
      </AnalyticsLayout>
    );
  }
  
  const summaryMetrics = calculateSummaryMetrics();

  return (
    <AnalyticsLayout 
      title="Delivery Insights" 
      description="Analyze delivery performance and patterns"
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">On-Time Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{summaryMetrics?.onTimePercentage || 0}%</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Avg. Delivery Time</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{summaryMetrics?.avgDeliveryTime || 0} min</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Fastest Delivery</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{summaryMetrics?.fastestDelivery || 0} min</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Delivery Partners</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{summaryMetrics?.uniquePartners || 0}</p>
          </CardContent>
        </Card>
      </div>
    
      {/* Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>On-Time Delivery Rate</CardTitle>
            <CardDescription>Percentage of orders delivered on schedule</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {chartData ? (
              <div className="flex flex-col items-center h-full">
                <div className="relative w-48 h-48 mb-4">
                  {/* Pie chart background */}
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: `conic-gradient(#10b981 0% ${chartData.onTimeStatus.values[0] / (chartData.onTimeStatus.values[0] + chartData.onTimeStatus.values[1]) * 100}%, #6366F1 ${chartData.onTimeStatus.values[0] / (chartData.onTimeStatus.values[0] + chartData.onTimeStatus.values[1]) * 100}% 100%)`,
                    }}
                  />
                  {/* Center hole with percentage */}
                  <div className="absolute inset-0 m-auto w-32 h-32 bg-white rounded-full shadow-inner flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-gray-800">
                      {Math.round(chartData.onTimeStatus.values[0] / (chartData.onTimeStatus.values[0] + chartData.onTimeStatus.values[1]) * 100)}%
                    </span>
                    <span className="text-sm text-gray-500">On-Time</span>
                  </div>
                </div>
                
                {/* Status indicators */}
                <div className="grid grid-cols-2 w-full max-w-xs gap-4">
                  <div className="flex flex-col items-center p-3 bg-green-50 rounded-lg border border-green-100">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                      <span className="font-medium text-sm">On Time</span>
                    </div>
                    <span className="text-xl font-bold text-gray-800">{chartData.onTimeStatus.values[0]}</span>
                    <span className="text-xs text-gray-500">deliveries</span>
                  </div>
                  
                  <div className="flex flex-col items-center p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                      <span className="font-medium text-sm">Late</span>
                    </div>
                    <span className="text-xl font-bold text-gray-800">{chartData.onTimeStatus.values[1]}</span>
                    <span className="text-xs text-gray-500">deliveries</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Delivery Time Distribution</CardTitle>
            <CardDescription>Frequency of different delivery durations</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {chartData ? (
              <BarChart 
                data={chartData.deliveryTimeDistribution}
                xAxisTitle="Delivery Time (minutes)"
                yAxisTitle="Number of Orders"
                color="#6366F1" // Indigo
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Delivery Partners</CardTitle>
            <CardDescription>Most frequent delivery personnel</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {chartData ? (
              <BarChart 
                data={chartData.topPartners}
                xAxisTitle="Delivery Partner"
                yAxisTitle="Deliveries"
                showValues={true}
                color="#7F56E0" // Purple
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Avg Delivery Time</CardTitle>
            <CardDescription>Average delivery duration trend by month</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {chartData ? (
              <LineChart 
                data={chartData.monthlyDeliveryTime}
                xAxisTitle="Month"
                yAxisTitle="Avg Time (minutes)"
                showMarkers={true}
                color="#0EA5E9" // Light blue
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Row 3 - Full Width */}
      <div className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Late Delivery Trend</CardTitle>
            <CardDescription>Monthly pattern of late deliveries</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {chartData ? (
              <LineChart 
                data={chartData.lateTrend}
                xAxisTitle="Month"
                yAxisTitle="Late Deliveries"
                showMarkers={true}
                color="#3B82F6" // Blue
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AnalyticsLayout>
  );
};

export default AnalyticsDelivery;
