import React, { useEffect, useState } from 'react';
import AnalyticsLayout from '@/components/Layout/AnalyticsLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, LineChart } from '@/components/Charts';
import { PieChart } from './Customer'; // Reuse PieChart from Customer page

interface SwiggyOrder {
  order_time: string;
  payment_method?: string;
  order_payment_method?: string;
  is_coupon_applied?: boolean;
  coupon_type?: string;
  discount?: number;
  [key: string]: unknown;
}

interface PaymentsChartData {
  paymentMethodDistribution: {
    names: string[];
    values: number[];
    colors: string[];
  };
  paymentGatewayUsage: {
    x: string[];
    y: number[];
  };
  couponUsageRatio: {
    names: string[];
    values: number[];
    colors: string[];
  };
  couponTypeDiscounts: {
    x: string[];
    y: number[];
  };
  monthlySavings: {
    x: string[];
    y: number[];
  };
}

const AnalyticsPayments = () => {
  const [chartData, setChartData] = useState<PaymentsChartData | null>(null);
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
        const calculatedData = calculatePaymentInsights(ordersData);
        setChartData(calculatedData);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Use dummy data for demo
        setChartData(getDummyPaymentData());
        setOrders(getDummyOrders());
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  
  // Generate dummy orders for development
  const getDummyOrders = (): SwiggyOrder[] => {
    const dummyOrders: Partial<SwiggyOrder>[] = [];
    
    // Payment methods
    const paymentMethods = ['UPI', 'Credit Card', 'Debit Card', 'Wallet', 'Cash'];
    const paymentGateways = ['PhonePe', 'Google Pay', 'Paytm', 'Amazon Pay', 'HDFC Bank', 'SBI', 'ICICI'];
    const couponTypes = ['FLAT', 'PERCENTAGE', 'BOGO', 'FESTIVAL', 'LOYALTY'];
    
    // Generate 100 orders for realistic data
    for (let i = 0; i < 100; i++) {
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 180)); // Past 6 months
      
      // Random payment method and gateway
      const methodIndex = Math.floor(Math.random() * paymentMethods.length);
      const gatewayIndex = Math.floor(Math.random() * paymentGateways.length);
      
      // Coupon details (60% chance of having a coupon)
      const hasCoupon = Math.random() > 0.4;
      const couponTypeIndex = Math.floor(Math.random() * couponTypes.length);
      
      // Discount amount between 30-200
      const discountAmount = hasCoupon ? Math.floor(Math.random() * 170) + 30 : 0;
      
      dummyOrders.push({
        order_time: date.toISOString(),
        payment_method: paymentMethods[methodIndex],
        order_payment_method: paymentGateways[gatewayIndex],
        is_coupon_applied: hasCoupon,
        coupon_type: hasCoupon ? couponTypes[couponTypeIndex] : undefined,
        discount: discountAmount
      });
    }
    
    return dummyOrders as SwiggyOrder[];
  };

  const calculatePaymentInsights = (orders: SwiggyOrder[]): PaymentsChartData => {
    // 1. Payment Method Distribution
    const paymentMethods: Record<string, number> = {};
    orders.forEach(order => {
      const method = order.payment_method || 'Unknown';
      paymentMethods[method] = (paymentMethods[method] || 0) + 1;
    });

    const methodEntries = Object.entries(paymentMethods)
      .sort(([, countA], [, countB]) => countB - countA);
    
    // Generate colors for pie chart using our color scheme
    const methodColors = [
      '#7F56E0', // Purple
      '#6366F1', // Indigo
      '#3B82F6', // Blue
      '#0EA5E9', // Light blue
      '#06B6D4', // Cyan
      '#8B5CF6', // Violet
      '#A855F7'  // Purple
    ];
    
    const paymentMethodDistribution = {
      names: methodEntries.map(([method]) => method),
      values: methodEntries.map(([, count]) => count),
      colors: methodEntries.map((_, i) => methodColors[i % methodColors.length])
    };

    // 2. Payment Gateway Usage
    const gatewayUsage: Record<string, number> = {};
    orders.forEach(order => {
      const gateway = order.order_payment_method || 'Unknown';
      gatewayUsage[gateway] = (gatewayUsage[gateway] || 0) + 1;
    });

    // Sort by usage and prepare for bar chart
    const gatewayEntries = Object.entries(gatewayUsage)
      .sort(([, countA], [, countB]) => countB - countA);
    
    const paymentGatewayUsage = {
      x: gatewayEntries.map(([gateway]) => gateway),
      y: gatewayEntries.map(([, count]) => count)
    };

    // 3. Coupon Usage Ratio
    const couponUsage = {
      applied: 0,
      notApplied: 0
    };

    orders.forEach(order => {
      if (order.is_coupon_applied) {
        couponUsage.applied += 1;
      } else {
        couponUsage.notApplied += 1;
      }
    });

    const couponUsageRatio = {
      names: ['Coupon Applied', 'No Coupon'],
      values: [couponUsage.applied, couponUsage.notApplied],
      colors: ['#10b981', '#6366F1'] // Green, Indigo
    };

    // 4. Average Discount by Coupon Type
    const couponTypeDiscounts: Record<string, { total: number, count: number }> = {};
    
    orders.forEach(order => {
      if (order.discount && order.discount > 0) {
        const couponType = order.coupon_type || 'Unknown';
        
        if (!couponTypeDiscounts[couponType]) {
          couponTypeDiscounts[couponType] = { total: 0, count: 0 };
        }
        
        couponTypeDiscounts[couponType].total += order.discount;
        couponTypeDiscounts[couponType].count += 1;
      }
    });
    
    // Calculate average discounts and sort
    const avgDiscounts = Object.entries(couponTypeDiscounts).map(([type, { total, count }]) => ({
      type,
      avgDiscount: total / count
    })).sort((a, b) => b.avgDiscount - a.avgDiscount);
    
    const couponTypeDiscountsChart = {
      x: avgDiscounts.map(item => item.type),
      y: avgDiscounts.map(item => item.avgDiscount)
    };

    // 5. Monthly Coupon Savings
    // Process orders to include month
    const processedOrders = orders.map(order => {
      const date = new Date(order.order_time);
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      return {
        ...order,
        month
      };
    });
    
    // Group by month
    const monthlySavings: Record<string, number> = {};
    
    processedOrders.forEach(order => {
      if (!monthlySavings[order.month]) {
        monthlySavings[order.month] = 0;
      }
      
      if (order.discount) {
        monthlySavings[order.month] += order.discount;
      }
    });
    
    // Sort months chronologically
    const sortedMonths = Object.keys(monthlySavings).sort();
    
    const monthlySavingsChart = {
      x: sortedMonths,
      y: sortedMonths.map(month => monthlySavings[month])
    };

    return {
      paymentMethodDistribution,
      paymentGatewayUsage,
      couponUsageRatio,
      couponTypeDiscounts: couponTypeDiscountsChart,
      monthlySavings: monthlySavingsChart
    };
  };

  // Dummy data for development
  const getDummyPaymentData = (): PaymentsChartData => {
    return {
      paymentMethodDistribution: {
        names: ['UPI', 'Credit Card', 'Debit Card', 'Wallet', 'Cash'],
        values: [45, 25, 15, 10, 5],
        colors: ['#7F56E0', '#6366F1', '#3B82F6', '#0EA5E9', '#06B6D4']
      },
      paymentGatewayUsage: {
        x: ['PhonePe', 'Google Pay', 'Paytm', 'Amazon Pay', 'HDFC Bank'],
        y: [35, 28, 20, 12, 5]
      },
      couponUsageRatio: {
        names: ['Coupon Applied', 'No Coupon'],
        values: [65, 35],
        colors: ['#10b981', '#6366F1']
      },
      couponTypeDiscounts: {
        x: ['FLAT', 'PERCENTAGE', 'BOGO', 'FESTIVAL', 'LOYALTY'],
        y: [120, 85, 150, 95, 60]
      },
      monthlySavings: {
        x: ['2023-01', '2023-02', '2023-03', '2023-04', '2023-05', '2023-06'],
        y: [520, 480, 650, 720, 580, 840]
      }
    };
  };

  // Format currency
  const formatCurrency = (amount: number): string => {
    return `₹${amount.toLocaleString('en-IN', { 
      maximumFractionDigits: 0,
      minimumFractionDigits: 0
    })}`;
  };
  
  // Calculate summary metrics for header cards
  const calculateSummaryMetrics = () => {
    if (!orders.length || !chartData) return null;
    
    // Most used payment method
    const mostUsedMethod = chartData.paymentMethodDistribution.names[0] || 'None';
    
    // Coupon usage percentage
    const couponPercentage = 
      (chartData.couponUsageRatio.values[0] / 
      (chartData.couponUsageRatio.values[0] + chartData.couponUsageRatio.values[1])) * 100;
    
    // Total savings from coupons
    const totalSavings = orders.reduce((sum, order) => sum + (order.discount || 0), 0);
    
    // Average savings per order with coupon
    const ordersWithCoupons = orders.filter(order => order.discount && order.discount > 0);
    const avgSavingsPerCoupon = ordersWithCoupons.length > 0 ? 
      (totalSavings / ordersWithCoupons.length) : 0;
    
    return {
      mostUsedMethod,
      couponPercentage: Math.round(couponPercentage),
      totalSavings,
      avgSavingsPerCoupon: Math.round(avgSavingsPerCoupon)
    };
  };

  // If loading, show loading state
  if (loading) {
    return (
      <AnalyticsLayout 
        title="Payment & Coupon Insights" 
        description="Loading data..."
      >
        <div>Loading...</div>
      </AnalyticsLayout>
    );
  }
  
  const summaryMetrics = calculateSummaryMetrics();

  return (
    <AnalyticsLayout 
      title="Payment & Coupon Insights" 
      description="Analyze your payment methods and coupon usage"
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Primary Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{summaryMetrics?.mostUsedMethod || 'None'}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Coupon Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{summaryMetrics?.couponPercentage || 0}%</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Savings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(summaryMetrics?.totalSavings || 0)}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Avg Savings/Coupon</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(summaryMetrics?.avgSavingsPerCoupon || 0)}</p>
          </CardContent>
        </Card>
      </div>
    
      {/* Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Payment Method Distribution</CardTitle>
            <CardDescription>Your preferred payment methods across orders</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {chartData ? (
              <PieChart 
                data={chartData.paymentMethodDistribution}
                title="Payment Methods"
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
            <CardTitle>Payment Gateway Usage</CardTitle>
            <CardDescription>Preferred online payment platforms and banks</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {chartData ? (
              <BarChart 
                data={chartData.paymentGatewayUsage}
                xAxisTitle="Gateway"
                yAxisTitle="Number of Orders"
                showValues={true}
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
            <CardTitle>Orders With vs Without Coupons</CardTitle>
            <CardDescription>How frequently you use discount coupons</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {chartData ? (
              <PieChart 
                data={chartData.couponUsageRatio}
                title="Coupon Usage"
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
            <CardTitle>Avg Discount by Coupon Type</CardTitle>
            <CardDescription>Which coupon types give the best value</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {chartData ? (
              <BarChart 
                data={chartData.couponTypeDiscounts}
                xAxisTitle="Coupon Type"
                yAxisTitle="Average Discount (₹)"
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
      </div>

      {/* Row 3 - Full Width */}
      <div className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Coupon Savings</CardTitle>
            <CardDescription>How much you've saved each month with coupons</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {chartData ? (
              <LineChart 
                data={chartData.monthlySavings}
                xAxisTitle="Month"
                yAxisTitle="Total Savings (₹)"
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
    </AnalyticsLayout>
  );
};

export default AnalyticsPayments;
