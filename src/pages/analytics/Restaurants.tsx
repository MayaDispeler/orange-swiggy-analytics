import React, { useEffect, useState } from 'react';
import AnalyticsLayout from '@/components/Layout/AnalyticsLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, LineChart, AreaChart } from '@/components/Charts';
import { PieChart } from './Customer'; // Reuse PieChart from Customer page

interface SwiggyOrder {
  order_time: string;
  restaurant_name: string;
  restaurant_type?: string;
  restaurant_area?: string;
  items_count?: number;
  order_total?: number;
  delivery_time?: number;
  is_delivered_on_time?: boolean;
  is_coupon_applied?: boolean;
  [key: string]: unknown;
}

interface RestaurantsChartData {
  topRestaurants: {
    x: string[];
    y: number[];
  };
  restaurantTypes: {
    names: string[];
    values: number[];
    colors: string[];
  };
  orderValuesByRestaurant: {
    x: string[];
    y: number[];
  };
  cuisineOrderCounts: {
    x: string[];
    y: number[];
  };
  repeatOrders: {
    x: string[];
    y: number[];
  };
}

interface RestaurantMetrics {
  totalRestaurants: number;
  favoriteRestaurant: string;
  mostOrderedCuisine: string;
  averageOrderValue: number;
}

const AnalyticsRestaurants = () => {
  const [chartData, setChartData] = useState<RestaurantsChartData | null>(null);
  const [metrics, setMetrics] = useState<RestaurantMetrics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [orders, setOrders] = useState<SwiggyOrder[]>([]);

  useEffect(() => {
    // Fetch data and calculate metrics
    const fetchData = async () => {
      try {
        // In a real app, you would fetch data from your API
        const response = await fetch('/api/swiggy-orders');
        const ordersData: SwiggyOrder[] = await response.json();
        
        setOrders(ordersData);
        
        // Process and calculate chart data
        const calculatedData = calculateRestaurantInsights(ordersData);
        setChartData(calculatedData);
        
        // Calculate key metrics
        setMetrics(calculateMetrics(ordersData, calculatedData));
      } catch (error) {
        console.error('Error fetching data:', error);
        // Use dummy data for demo
        const dummyOrders = getDummyOrders();
        setOrders(dummyOrders);
        const dummyData = getDummyRestaurantData();
        setChartData(dummyData);
        setMetrics(calculateMetrics(dummyOrders, dummyData));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Generate dummy orders for development
  const getDummyOrders = (): SwiggyOrder[] => {
    const dummyOrders: Partial<SwiggyOrder>[] = [];
    
    // Restaurant data
    const restaurants = [
      { name: 'Biryani Blues', type: 'North Indian', area: 'Koramangala' },
      { name: 'Pizza Hut', type: 'Italian', area: 'Indiranagar' },
      { name: 'McDonald\'s', type: 'Fast Food', area: 'HSR Layout' },
      { name: 'Subway', type: 'Continental', area: 'MG Road' },
      { name: 'Taco Bell', type: 'Mexican', area: 'Phoenix Mall' },
      { name: 'Domino\'s Pizza', type: 'Italian', area: 'BTM Layout' },
      { name: 'Burger King', type: 'Fast Food', area: 'Whitefield' },
      { name: 'Empire Restaurant', type: 'North Indian', area: 'Koramangala' },
      { name: 'Meghana Foods', type: 'Biryani', area: 'Residency Road' },
      { name: 'KFC', type: 'Fast Food', area: 'Marathahalli' },
    ];
    
    // Generate more orders for Biryani Blues and McDonald's to create favorites
    const restaurantFrequency = [0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 4, 5, 6, 7, 8, 9];
    
    // Generate 100 orders for realistic data
    for (let i = 0; i < 100; i++) {
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 180)); // Past 6 months
      
      // Select restaurant with weighted probability
      const restaurantIndex = restaurantFrequency[Math.floor(Math.random() * restaurantFrequency.length)];
      const restaurant = restaurants[restaurantIndex];
      
      // Order details
      const itemsCount = Math.floor(Math.random() * 4) + 1; // 1-5 items
      const orderTotal = (Math.floor(Math.random() * 500) + 100) * itemsCount; // 100-600 per item
      
      dummyOrders.push({
        order_time: date.toISOString(),
        restaurant_name: restaurant.name,
        restaurant_type: restaurant.type,
        restaurant_area: restaurant.area,
        items_count: itemsCount,
        order_total: orderTotal,
        is_coupon_applied: Math.random() > 0.6,
        is_delivered_on_time: Math.random() > 0.2,
        delivery_time: Math.floor(Math.random() * 40) + 15 // 15-55 minutes
      });
    }
    
    return dummyOrders as SwiggyOrder[];
  };

  const calculateRestaurantInsights = (orders: SwiggyOrder[]): RestaurantsChartData => {
    // 1. Top Restaurants by Order Count
    const restaurantCounts: Record<string, number> = {};
    orders.forEach(order => {
      const restaurantName = order.restaurant_name;
      restaurantCounts[restaurantName] = (restaurantCounts[restaurantName] || 0) + 1;
    });

    // Sort and take top 10
    const topRestaurantsEntries = Object.entries(restaurantCounts)
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, 10);
    
    const topRestaurants = {
      x: topRestaurantsEntries.map(([name]) => name),
      y: topRestaurantsEntries.map(([, count]) => count)
    };

    // 2. Restaurant Types Distribution
    const restaurantTypes: Record<string, number> = {};
    orders.forEach(order => {
      const type = order.restaurant_type || 'Unknown';
      restaurantTypes[type] = (restaurantTypes[type] || 0) + 1;
    });

    // Sort by frequency
    const typeEntries = Object.entries(restaurantTypes)
      .sort(([, countA], [, countB]) => countB - countA);
    
    // Generate colors for the pie chart using our color scheme
    const typeColors = [
      '#7F56E0', // Purple
      '#6366F1', // Indigo
      '#3B82F6', // Blue
      '#0EA5E9', // Light blue
      '#06B6D4', // Cyan
      '#8B5CF6', // Violet
      '#A855F7', // Purple
      '#D946EF', // Pink
      '#F472B6', // Rose
      '#4ADE80'  // Green
    ];
    
    const restaurantTypesData = {
      names: typeEntries.map(([type]) => type),
      values: typeEntries.map(([, count]) => count),
      colors: typeEntries.map((_, i) => typeColors[i % typeColors.length])
    };

    // 3. Average Order Value by Restaurant
    const restaurantOrderValues: Record<string, {total: number, count: number}> = {};
    orders.forEach(order => {
      const restaurantName = order.restaurant_name;
      const orderTotal = order.order_total || 0;
      
      if (!restaurantOrderValues[restaurantName]) {
        restaurantOrderValues[restaurantName] = {total: 0, count: 0};
      }
      
      restaurantOrderValues[restaurantName].total += orderTotal;
      restaurantOrderValues[restaurantName].count += 1;
    });
    
    // Calculate averages and sort
    const avgOrderValues = Object.entries(restaurantOrderValues)
      .map(([name, {total, count}]) => ({
        name,
        avg: total / count
      }))
      .sort((a, b) => b.avg - a.avg)
      .slice(0, 10); // Top 10 by order value
    
    const orderValuesByRestaurant = {
      x: avgOrderValues.map(r => r.name),
      y: avgOrderValues.map(r => r.avg)
    };

    // 4. Cuisine Order Count (using restaurant_type as cuisine)
    const cuisineOrderCounts = {
      x: typeEntries.map(([type]) => type).slice(0, 10), // Top 10 cuisines
      y: typeEntries.map(([, count]) => count).slice(0, 10)
    };

    // 5. Repeat Order Patterns (Frequency of orders per restaurant)
    // Group by month and restaurant to see trends
    const repeatOrdersByMonth: Record<string, Record<string, number>> = {};
    
    orders.forEach(order => {
      const date = new Date(order.order_time);
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const restaurant = order.restaurant_name;
      
      if (!repeatOrdersByMonth[month]) {
        repeatOrdersByMonth[month] = {};
      }
      
      repeatOrdersByMonth[month][restaurant] = (repeatOrdersByMonth[month][restaurant] || 0) + 1;
    });
    
    // Get top restaurant with most orders overall
    const topRestaurant = topRestaurantsEntries[0]?.[0] || 'No Data';
    
    // Track orders for top restaurant over time
    const months = Object.keys(repeatOrdersByMonth).sort();
    const topRestaurantOrders = months.map(month => {
      return {
        month,
        count: repeatOrdersByMonth[month][topRestaurant] || 0
      };
    });
    
    const repeatOrders = {
      x: topRestaurantOrders.map(item => item.month),
      y: topRestaurantOrders.map(item => item.count)
    };

    return {
      topRestaurants,
      restaurantTypes: restaurantTypesData,
      orderValuesByRestaurant,
      cuisineOrderCounts,
      repeatOrders
    };
  };

  // Calculate metrics for summary cards
  const calculateMetrics = (orders: SwiggyOrder[], data: RestaurantsChartData | null): RestaurantMetrics => {
    // Count unique restaurants
    const uniqueRestaurants = new Set(orders.map(order => order.restaurant_name)).size;
    
    // Get favorite restaurant (most ordered)
    const favoriteRestaurant = data?.topRestaurants.x[0] || 'None';
    
    // Get most ordered cuisine
    const mostOrderedCuisine = data?.restaurantTypes.names[0] || 'None';
    
    // Calculate average order value across all restaurants
    const totalOrderValue = orders.reduce((sum, order) => sum + (order.order_total || 0), 0);
    const avgOrderValue = orders.length > 0 ? totalOrderValue / orders.length : 0;
    
    return {
      totalRestaurants: uniqueRestaurants,
      favoriteRestaurant,
      mostOrderedCuisine,
      averageOrderValue: Math.round(avgOrderValue)
    };
  };

  // Dummy data for development
  const getDummyRestaurantData = (): RestaurantsChartData => {
    return {
      topRestaurants: {
        x: ['Biryani Blues', 'McDonald\'s', 'Pizza Hut', 'Meghana Foods', 'Domino\'s', 'Empire Restaurant', 'Subway', 'KFC', 'Burger King', 'Taco Bell'],
        y: [18, 14, 12, 10, 8, 7, 6, 5, 4, 3]
      },
      restaurantTypes: {
        names: ['North Indian', 'Fast Food', 'Italian', 'Biryani', 'Continental', 'Mexican'],
        values: [28, 24, 20, 15, 8, 5],
        colors: ['#7F56E0', '#6366F1', '#3B82F6', '#0EA5E9', '#06B6D4', '#8B5CF6']
      },
      orderValuesByRestaurant: {
        x: ['Meghana Foods', 'Pizza Hut', 'Biryani Blues', 'Empire Restaurant', 'McDonald\'s', 'Taco Bell', 'Domino\'s', 'Subway', 'KFC', 'Burger King'],
        y: [1200, 950, 850, 780, 650, 580, 520, 480, 450, 420]
      },
      cuisineOrderCounts: {
        x: ['North Indian', 'Fast Food', 'Italian', 'Biryani', 'Continental', 'Mexican'],
        y: [28, 24, 20, 15, 8, 5]
      },
      repeatOrders: {
        x: ['2023-01', '2023-02', '2023-03', '2023-04', '2023-05', '2023-06'],
        y: [3, 4, 2, 5, 2, 4]
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

  // If loading, show loading state
  if (loading) {
    return (
      <AnalyticsLayout 
        title="Restaurant Insights" 
        description="Loading data..."
      >
        <div>Loading...</div>
      </AnalyticsLayout>
    );
  }

  return (
    <AnalyticsLayout 
      title="Restaurant Insights" 
      description="Analyze your restaurant ordering patterns and preferences"
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Unique Restaurants</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{metrics?.totalRestaurants || 0}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Favorite Restaurant</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{metrics?.favoriteRestaurant || 'None'}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Top Cuisine</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{metrics?.mostOrderedCuisine || 'None'}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Avg Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(metrics?.averageOrderValue || 0)}</p>
          </CardContent>
        </Card>
      </div>
    
      {/* Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Most Ordered Restaurants</CardTitle>
            <CardDescription>Restaurants you've ordered from most frequently</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {chartData ? (
              <BarChart 
                data={chartData.topRestaurants}
                xAxisTitle="Restaurant"
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

        <Card>
          <CardHeader>
            <CardTitle>Cuisine Preferences</CardTitle>
            <CardDescription>Distribution of cuisines you've ordered</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {chartData ? (
              <PieChart 
                data={chartData.restaurantTypes}
                title="Cuisine Types"
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
            <CardTitle>Average Order Value by Restaurant</CardTitle>
            <CardDescription>Restaurants where you typically spend more</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {chartData ? (
              <BarChart 
                data={chartData.orderValuesByRestaurant}
                xAxisTitle="Restaurant"
                yAxisTitle="Average Order Value (₹)"
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
            <CardTitle>Cuisine Order Counts</CardTitle>
            <CardDescription>Number of orders by cuisine type</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {chartData ? (
              <BarChart 
                data={chartData.cuisineOrderCounts}
                xAxisTitle="Cuisine"
                yAxisTitle="Number of Orders"
                showValues={true}
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
            <CardTitle>Repeat Orders for Favorite Restaurant</CardTitle>
            <CardDescription>How your ordering frequency has changed over time for {chartData?.topRestaurants.x[0]}</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {chartData ? (
              <AreaChart 
                data={chartData.repeatOrders}
                xAxisTitle="Month"
                yAxisTitle="Number of Orders"
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

export default AnalyticsRestaurants;
