import React, { useEffect, useState } from 'react';
import AnalyticsLayout from '@/components/Layout/AnalyticsLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, LineChart } from '@/components/Charts';
import { PieChart } from './Customer'; // Reuse PieChart from Customer page

// Import interfaces
interface SwiggyOrder {
  order_time: string;
  order_total?: number;
  order_subtotal?: number;
  restaurant_name: string;
  delivery_fee?: number;
  packing_charges?: number;
  taxes_and_charges?: number;
  gst?: number;
  service_tax?: number;
  tip?: number;
  payment_method?: string;
  is_coupon_applied?: boolean;
  discount?: number;
  coupon_code?: string;
  charges?: {
    [key: string]: number;
  };
  [key: string]: unknown;
}

interface FinancialsChartData {
  feeBreakdown: {
    x: string[];
    y: number[];
  };
  totalSummary: {
    names: string[];
    values: number[];
    colors: string[];
  };
  totalTips: number;
  couponUsage: {
    names: string[];
    values: number[];
    colors: string[];
  };
  monthlySpending: {
    x: string[];
    y: number[];
  };
}

const AnalyticsFinancials = () => {
  const [chartData, setChartData] = useState<FinancialsChartData | null>(null);
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
        const calculatedData = calculateFinancialInsights(ordersData);
        setChartData(calculatedData);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Use dummy data for demo
        const dummyOrders = getDummyOrders();
        setOrders(dummyOrders);
        setChartData(calculateFinancialInsights(dummyOrders));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  
  // Generate dummy orders
  const getDummyOrders = (): SwiggyOrder[] => {
    const dummyOrders: Partial<SwiggyOrder>[] = [];
    
    // Restaurant data
    const restaurants = [
      'Biryani Blues', 'Pizza Hut', 'McDonald\'s', 'Subway', 
      'Taco Bell', 'Domino\'s Pizza', 'Burger King', 
      'Empire Restaurant', 'Meghana Foods', 'KFC'
    ];
    
    // Generate 100 orders for realistic data
    for (let i = 0; i < 100; i++) {
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 180)); // Past 6 months
      
      // Select restaurant and create order
      const restaurantIndex = Math.floor(Math.random() * restaurants.length);
      const restaurantName = restaurants[restaurantIndex];
      
      // Randomize order amount between 200-1500
      const orderSubtotal = Math.floor(Math.random() * 1300) + 200;
      
      // Various fees
      const deliveryFee = Math.floor(Math.random() * 60) + 20; // 20-80
      const packingCharges = Math.floor(Math.random() * 50) + 10; // 10-60
      const gst = Math.round(orderSubtotal * 0.05); // 5% GST
      const serviceTax = Math.round(orderSubtotal * 0.025); // 2.5% service tax
      
      // Coupon and discount
      const hasCoupon = Math.random() > 0.4; // 60% chance of coupon
      const discount = hasCoupon ? Math.floor(Math.random() * 150) + 50 : 0; // 50-200 discount
      
      // Tip
      const hasTip = Math.random() > 0.7; // 30% chance of tip
      const tip = hasTip ? Math.floor(Math.random() * 40) + 20 : 0; // 20-60 tip
      
      // Total
      const orderTotal = orderSubtotal + deliveryFee + packingCharges + gst + serviceTax - discount + tip;
      
      dummyOrders.push({
        order_time: date.toISOString(),
        restaurant_name: restaurantName,
        order_subtotal: orderSubtotal,
        delivery_fee: deliveryFee,
        packing_charges: packingCharges,
        gst: gst,
        service_tax: serviceTax,
        taxes_and_charges: gst + serviceTax,
        tip: tip,
        is_coupon_applied: hasCoupon,
        discount: discount,
        coupon_code: hasCoupon ? `SWIGGY${Math.floor(Math.random() * 500)}` : undefined,
        order_total: orderTotal,
        charges: {
          'Delivery Fee': deliveryFee,
          'Packing Charges': packingCharges,
          'GST': gst,
          'Service Tax': serviceTax
        }
      });
    }
    
    return dummyOrders as SwiggyOrder[];
  };

  const calculateFinancialInsights = (orders: SwiggyOrder[]): FinancialsChartData => {
    // 1. Fee Breakdown (Delivery Fee, Packing, Taxes, etc.)
    const feeTypes = [
      'Delivery Fee', 
      'Packing Charges', 
      'GST', 
      'Service Tax'
    ];
    
    const totalFees: Record<string, number> = {
      'Delivery Fee': 0,
      'Packing Charges': 0,
      'GST': 0,
      'Service Tax': 0,
    };
    
    orders.forEach(order => {
      // If order has charges object, use it
      if (order.charges) {
        for (const feeType of feeTypes) {
          if (order.charges[feeType]) {
            totalFees[feeType] += order.charges[feeType];
          }
        }
      } else {
        // Otherwise use individual properties
        totalFees['Delivery Fee'] += order.delivery_fee || 0;
        totalFees['Packing Charges'] += order.packing_charges || 0;
        totalFees['GST'] += order.gst || 0;
        totalFees['Service Tax'] += order.service_tax || 0;
      }
    });
    
    // Sort fees by total amount
    const sortedFees = Object.entries(totalFees)
      .sort(([, amountA], [, amountB]) => amountB - amountA);
    
    const feeBreakdown = {
      x: sortedFees.map(([feeType]) => feeType),
      y: sortedFees.map(([, amount]) => amount)
    };

    // 2. Total Summary (Food Cost vs Fees vs Discounts)
    // Calculate totals
    const totalSubtotal = orders.reduce((sum, order) => sum + (order.order_subtotal || 0), 0);
    const totalDeliveryFees = orders.reduce((sum, order) => sum + (order.delivery_fee || 0), 0);
    const totalPackingCharges = orders.reduce((sum, order) => sum + (order.packing_charges || 0), 0);
    const totalTaxes = orders.reduce((sum, order) => sum + (order.taxes_and_charges || (order.gst || 0) + (order.service_tax || 0)), 0);
    const totalDiscounts = orders.reduce((sum, order) => sum + (order.discount || 0), 0);
    
    const totalSummary = {
      names: ['Food Cost', 'Delivery Fees', 'Packing Charges', 'Taxes', 'Discounts'],
      values: [totalSubtotal, totalDeliveryFees, totalPackingCharges, totalTaxes, totalDiscounts],
      colors: ['#6366F1', '#3B82F6', '#0EA5E9', '#06B6D4', '#10b981']
    };

    // 3. Tips Paid
    const totalTips = orders.reduce((sum, order) => sum + (order.tip || 0), 0);

    // 4. Coupon Usage Analysis
    const couponCounts = {
      applied: 0,
      notApplied: 0
    };
    
    orders.forEach(order => {
      if (order.is_coupon_applied) {
        couponCounts.applied += 1;
      } else {
        couponCounts.notApplied += 1;
      }
    });
    
    const couponUsage = {
      names: ['With Coupon', 'Without Coupon'],
      values: [couponCounts.applied, couponCounts.notApplied],
      colors: ['#10b981', '#6366F1'] // Green, Indigo
    };

    // 5. Monthly Spending Trends
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
    const monthlySpend: Record<string, number> = {};
    
    processedOrders.forEach(order => {
      if (!monthlySpend[order.month]) {
        monthlySpend[order.month] = 0;
      }
      
      monthlySpend[order.month] += order.order_total || 0;
    });
    
    // Sort months chronologically
    const sortedMonths = Object.keys(monthlySpend).sort();
    
    const monthlySpending = {
      x: sortedMonths,
      y: sortedMonths.map(month => monthlySpend[month])
    };

    return {
      feeBreakdown,
      totalSummary,
      totalTips,
      couponUsage,
      monthlySpending
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
    if (!orders.length) return null;
    
    // Total spend
    const totalSpent = orders.reduce((sum, order) => sum + (order.order_total || 0), 0);
    
    // Average order value
    const avgOrderValue = totalSpent / orders.length;
    
    // Total savings from coupons
    const totalSavings = orders.reduce((sum, order) => sum + (order.discount || 0), 0);
    
    // Percentage of orders with coupons
    const ordersWithCoupon = orders.filter(order => order.is_coupon_applied).length;
    const couponPercentage = (ordersWithCoupon / orders.length) * 100;
    
    return {
      totalSpent,
      avgOrderValue,
      totalSavings,
      couponPercentage: Math.round(couponPercentage)
    };
  };

  // If loading, show loading state
  if (loading) {
    return (
      <AnalyticsLayout 
        title="Financial Insights" 
        description="Loading data..."
      >
        <div>Loading...</div>
      </AnalyticsLayout>
    );
  }
  
  const summaryMetrics = calculateSummaryMetrics();

  return (
    <AnalyticsLayout 
      title="Financial Insights" 
      description="Analyze your spending patterns and costs"
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(summaryMetrics?.totalSpent || 0)}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Avg Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(summaryMetrics?.avgOrderValue || 0)}</p>
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
            <CardTitle className="text-sm font-medium text-gray-500">Coupon Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{summaryMetrics?.couponPercentage || 0}%</p>
          </CardContent>
        </Card>
      </div>
    
      {/* Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Fee Breakdown</CardTitle>
            <CardDescription>How much you spend on different types of fees</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {chartData ? (
              <BarChart 
                data={chartData.feeBreakdown}
                xAxisTitle="Fee Type"
                yAxisTitle="Total Amount (₹)"
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

        <Card>
          <CardHeader>
            <CardTitle>Total Spend Summary</CardTitle>
            <CardDescription>Breakdown of where your money goes</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {chartData ? (
              <PieChart 
                data={chartData.totalSummary}
                title="Spending Breakdown"
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
            <CardTitle>Tips Paid</CardTitle>
            <CardDescription>How much you've given in tips to delivery partners</CardDescription>
          </CardHeader>
          <CardContent className="h-80 flex flex-col items-center justify-center">
            {chartData ? (
              <div className="text-center">
                <div className="text-5xl font-bold text-indigo-600 mb-2">
                  {formatCurrency(chartData.totalTips)}
                </div>
                <p className="text-gray-500">
                  Total tips paid to delivery partners
                </p>
                <div className="text-sm mt-6 max-w-md mx-auto">
                  <p className="text-gray-600">
                    {chartData.totalTips > 0 
                      ? "Thank you for supporting delivery partners with tips! Your generosity helps make their day better."
                      : "Consider tipping your delivery partners to show appreciation for their service."}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-gray-500">
                No data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Coupon Usage</CardTitle>
            <CardDescription>How often you use discount coupons</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {chartData ? (
              <PieChart 
                data={chartData.couponUsage}
                title="Coupon Utilization"
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
            <CardTitle>Monthly Spending Trends</CardTitle>
            <CardDescription>How your spending has changed over time</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {chartData ? (
              <LineChart 
                data={chartData.monthlySpending}
                xAxisTitle="Month"
                yAxisTitle="Total Spent (₹)"
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

export default AnalyticsFinancials;
