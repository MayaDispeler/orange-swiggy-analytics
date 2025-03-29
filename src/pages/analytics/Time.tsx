import React, { useEffect, useState } from 'react';
import AnalyticsLayout from '@/components/Layout/AnalyticsLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, LineChart, AreaChart } from '@/components/Charts'; // Assuming you have chart components

// Import interfaces
interface SwiggyOrder {
  order_time: string;
  order_total: number;
  order_items: Array<{
    name: string;
    is_veg: string;
    [key: string]: unknown;
  }>;
  restaurant_name: string;
  restaurant_type: string;
  restaurant_customer_distance: number;
  on_time: boolean;
  delivery_time_in_seconds: number;
  payment_method: string;
  charges: {
    GST?: number;
    [key: string]: unknown;
  };
}

// Extended order interface with additional fields for time analysis
interface ParsedSwiggyOrder extends SwiggyOrder {
  orderDate: Date;
  order_value: number;
  total_items: number;
  order_month: string;
  order_year: number;
  order_quarter: string;
  order_day: string;
  order_hour: number;
  week_of_month: number;
}

interface TimeChartData {
  monthlyOrders: {
    x: string[];
    y: number[];
  };
  monthlyRevenue: {
    x: string[];
    y: number[];
  };
  quarterly: {
    x: string[];
    y: number[];
    color: number[];
  };
  weekdayTrend: {
    x: string[];
    y: number[];
    color: number[];
  };
  hourlyTrend: {
    x: number[];
    y: number[];
  };
  cumulativeOrders: {
    x: string[];
    y: number[];
  };
  weekOfMonth: {
    x: string[];
    y: number[];
  };
}

const AnalyticsTime = () => {
  const [chartData, setChartData] = useState<TimeChartData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Helper function to get week of month
  const getWeekOfMonth = (date: Date): number => {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const dayOfWeek = firstDayOfMonth.getDay();
    return Math.ceil((date.getDate() + dayOfWeek) / 7);
  };

  useEffect(() => {
    // Fetch data and calculate metrics
    const fetchData = async () => {
      try {
        // In a real app, you would fetch data from your API
        const response = await fetch('/api/swiggy-orders');
        const orders: SwiggyOrder[] = await response.json();
        
        // Process and calculate chart data
        const calculatedData = calculateTimeInsights(orders);
        setChartData(calculatedData);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Use dummy data for demo
        setChartData(getDummyTimeData());
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateTimeInsights = (orders: SwiggyOrder[]): TimeChartData => {
    // Convert order_time to Date objects and add derived fields
    const parsedOrders: ParsedSwiggyOrder[] = orders.map(order => {
      const orderDate = new Date(order.order_time);
      
      // Basic computed values
      const order_value = order.order_total;
      const total_items = Array.isArray(order.order_items) ? order.order_items.length : 0;
      
      // Time-based fields
      const order_month = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}`;
      const order_year = orderDate.getFullYear();
      const quarter = Math.floor(orderDate.getMonth() / 3) + 1;
      const order_quarter = `${orderDate.getFullYear()}-Q${quarter}`;
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const order_day = days[orderDate.getDay()];
      const order_hour = orderDate.getHours();
      const week_of_month = getWeekOfMonth(orderDate);
      
      return {
        ...order,
        orderDate,
        order_value,
        total_items,
        order_month,
        order_year,
        order_quarter,
        order_day,
        order_hour,
        week_of_month
      };
    });

    // 1. Monthly Order & Revenue Trends
    const monthly: Record<string, { count: number; sum: number; avg: number; items: number }> = {};
    parsedOrders.forEach(order => {
      if (!monthly[order.order_month]) {
        monthly[order.order_month] = { count: 0, sum: 0, avg: 0, items: 0 };
      }
      monthly[order.order_month].count += 1;
      monthly[order.order_month].sum += order.order_value;
      monthly[order.order_month].items += order.total_items;
    });

    // Calculate averages
    Object.keys(monthly).forEach(month => {
      monthly[month].avg = monthly[month].sum / monthly[month].count;
    });

    // Sort months chronologically
    const sortedMonths = Object.keys(monthly).sort();

    // Monthly orders chart data
    const monthlyOrders = {
      x: sortedMonths,
      y: sortedMonths.map(month => monthly[month].count)
    };

    // Monthly revenue chart data
    const monthlyRevenue = {
      x: sortedMonths,
      y: sortedMonths.map(month => monthly[month].sum)
    };

    // 2. Quarterly Trend
    const quarterly: Record<string, { count: number; sum: number }> = {};
    parsedOrders.forEach(order => {
      if (!quarterly[order.order_quarter]) {
        quarterly[order.order_quarter] = { count: 0, sum: 0 };
      }
      quarterly[order.order_quarter].count += 1;
      quarterly[order.order_quarter].sum += order.order_value;
    });

    // Sort quarters chronologically
    const sortedQuarters = Object.keys(quarterly).sort();

    // Quarterly chart data
    const quarterlyData = {
      x: sortedQuarters,
      y: sortedQuarters.map(quarter => quarterly[quarter].sum),
      color: sortedQuarters.map(quarter => quarterly[quarter].count)
    };

    // 3. Weekday Trend
    const weekday: Record<string, { count: number; sum: number; avg: number }> = {};
    parsedOrders.forEach(order => {
      if (!weekday[order.order_day]) {
        weekday[order.order_day] = { count: 0, sum: 0, avg: 0 };
      }
      weekday[order.order_day].count += 1;
      weekday[order.order_day].sum += order.order_value;
    });

    // Calculate averages
    Object.keys(weekday).forEach(day => {
      weekday[day].avg = weekday[day].sum / weekday[day].count;
    });

    // Order days by count (descending)
    const sortedWeekdays = Object.keys(weekday).sort((a, b) => 
      weekday[b].count - weekday[a].count
    );

    // Weekday chart data
    const weekdayTrend = {
      x: sortedWeekdays,
      y: sortedWeekdays.map(day => weekday[day].count),
      color: sortedWeekdays.map(day => weekday[day].sum)
    };

    // 4. Hourly Trend
    const hourly: Record<number, number> = {};
    for (let i = 0; i < 24; i++) {
      hourly[i] = 0;
    }
    
    parsedOrders.forEach(order => {
      hourly[order.order_hour] += 1;
    });

    // Hourly chart data
    const hourlyTrend = {
      x: Object.keys(hourly).map(Number),
      y: Object.values(hourly)
    };

    // 5. Cumulative Order Trend
    // Sort orders by time
    const sortedOrders = [...parsedOrders].sort(
      (a, b) => a.orderDate.getTime() - b.orderDate.getTime()
    );

    // Create cumulative data
    const cumulativeDates: string[] = [];
    const cumulativeCounts: number[] = [];
    
    sortedOrders.forEach((order, index) => {
      cumulativeDates.push(order.order_time);
      cumulativeCounts.push(index + 1);
    });

    // Cumulative chart data
    const cumulativeOrders = {
      x: cumulativeDates,
      y: cumulativeCounts
    };

    // 6. Week of Month Distribution
    const weekOfMonth: Record<number, number> = {};
    for (let i = 1; i <= 5; i++) {
      weekOfMonth[i] = 0;
    }

    parsedOrders.forEach(order => {
      weekOfMonth[order.week_of_month] += 1;
    });

    // Week of month chart data
    const weekOfMonthData = {
      x: Object.keys(weekOfMonth).map(week => `Week ${week}`),
      y: Object.values(weekOfMonth)
    };

    return {
      monthlyOrders,
      monthlyRevenue,
      quarterly: quarterlyData,
      weekdayTrend,
      hourlyTrend,
      cumulativeOrders,
      weekOfMonth: weekOfMonthData
    };
  };

  // Dummy data for development
  const getDummyTimeData = (): TimeChartData => {
    return {
      monthlyOrders: {
        x: ['2023-01', '2023-02', '2023-03', '2023-04', '2023-05', '2023-06'],
        y: [12, 15, 10, 18, 14, 20]
      },
      monthlyRevenue: {
        x: ['2023-01', '2023-02', '2023-03', '2023-04', '2023-05', '2023-06'],
        y: [2300, 2800, 1900, 3200, 2600, 3500]
      },
      quarterly: {
        x: ['2023-Q1', '2023-Q2'],
        y: [7000, 9300],
        color: [37, 52]
      },
      weekdayTrend: {
        x: ['Saturday', 'Friday', 'Sunday', 'Thursday', 'Wednesday', 'Monday', 'Tuesday'],
        y: [18, 16, 14, 12, 10, 8, 8],
        color: [3200, 2900, 2600, 2200, 1800, 1500, 1400]
      },
      hourlyTrend: {
        x: Array.from({length: 24}, (_, i) => i),
        y: [1, 0, 0, 0, 0, 2, 3, 5, 6, 4, 3, 6, 8, 7, 4, 3, 5, 8, 15, 14, 10, 7, 4, 2]
      },
      cumulativeOrders: {
        x: Array.from({length: 89}, (_, i) => new Date(2023, 0, i + 1).toISOString()),
        y: Array.from({length: 89}, (_, i) => i + 1)
      },
      weekOfMonth: {
        x: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
        y: [15, 25, 30, 18, 5]
      }
    };
  };

  // If loading, show loading state
  if (loading) {
    return (
      <AnalyticsLayout 
        title="Time-Based Insights" 
        description="Loading data..."
      >
        <div>Loading...</div>
      </AnalyticsLayout>
    );
  }

  return (
    <AnalyticsLayout 
      title="Time-Based Insights" 
      description="Analyze your ordering patterns over time"
    >
      {/* Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Orders</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            {chartData ? (
              <LineChart 
                data={chartData.monthlyOrders}
                xAxisTitle="Month"
                yAxisTitle="Order Count"
                showMarkers={true}
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
            <CardTitle>Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            {chartData ? (
              <BarChart 
                data={chartData.monthlyRevenue}
                xAxisTitle="Month"
                yAxisTitle="Total Revenue"
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

      {/* Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Quarterly Trends</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            {chartData ? (
              <BarChart 
                data={{
                  x: chartData.quarterly.x,
                  y: chartData.quarterly.y
                }}
                xAxisTitle="Quarter"
                yAxisTitle="Total Revenue"
                showValues={true}
                color="#3B82F6" // Blue
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
            <CardTitle>Cumulative Orders</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            {chartData ? (
              <AreaChart 
                data={chartData.cumulativeOrders}
                xAxisTitle="Order Date"
                yAxisTitle="Total Orders"
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

      {/* Row 3 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Order Frequency by Day of Week</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            {chartData ? (
              <BarChart 
                data={{
                  x: chartData.weekdayTrend.x,
                  y: chartData.weekdayTrend.y
                }}
                xAxisTitle="Day"
                yAxisTitle="Order Count"
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
            <CardTitle>Order Distribution by Time of Day</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            {chartData ? (
              <LineChart 
                data={{
                  x: chartData.hourlyTrend.x.map(h => h.toString() + ':00'),
                  y: chartData.hourlyTrend.y
                }}
                xAxisTitle="Hour"
                yAxisTitle="Order Count"
                showMarkers={true}
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

      {/* Row 4 */}
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Week of Month Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            {chartData ? (
              <BarChart 
                data={chartData.weekOfMonth}
                xAxisTitle="Week"
                yAxisTitle="Order Count"
                color="#06B6D4" // Cyan
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

export default AnalyticsTime;
