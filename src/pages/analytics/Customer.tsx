import React, { useEffect, useState } from 'react';
import AnalyticsLayout from '@/components/Layout/AnalyticsLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, LineChart } from '@/components/Charts';

// Enhanced PieChart component with better visuals and animations
export const PieChart = ({ data, title }) => {
  // Simple inline implementation for now
  const total = data.values.reduce((sum, val) => sum + val, 0);
  
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="relative w-48 h-48">
        {data.values.map((value, index) => {
          const percentage = (value / total) * 100;
          const previousPercentages = data.values
            .slice(0, index)
            .reduce((sum, val) => sum + (val / total) * 100, 0);
          
          return (
            <div 
              key={index}
              className="absolute inset-0 transition-all duration-500 ease-in-out"
              style={{
                background: `conic-gradient(transparent ${previousPercentages}%, ${data.colors[index]} ${previousPercentages}%, ${data.colors[index]} ${previousPercentages + percentage}%, transparent ${previousPercentages + percentage}%)`,
                borderRadius: '50%',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }}
            />
          );
        })}
        
        {/* Center hole with improved styling */}
        <div className="absolute inset-0 m-auto w-24 h-24 bg-white rounded-full shadow-inner flex items-center justify-center">
          <span className="text-sm font-medium text-gray-700">{title}</span>
        </div>
      </div>
      
      {/* Enhanced Legend */}
      <div className="mt-4 flex flex-wrap justify-center gap-4">
        {data.names.map((name, index) => (
          <div key={index} className="flex items-center px-2 py-1 rounded-full bg-gray-50 shadow-sm">
            <div 
              className="w-3 h-3 mr-2 rounded-full"
              style={{ backgroundColor: data.colors[index] }}
            />
            <span className="text-xs font-medium">{name} ({Math.round((data.values[index] / total) * 100)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// OrderingPatternHeatMap component for day/hour visualization
const OrderingPatternHeatMap = ({ orders }) => {
  // Initialize the day/hour grid (7 days x 24 hours)
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const hours = Array.from({ length: 24 }, (_, i) => i); // 0-23 hours
  
  // Create a 2D array to store counts
  const dayHourCounts = Array(7).fill(0).map(() => Array(24).fill(0));
  
  // Process orders to populate the grid
  orders.forEach(order => {
    const orderDate = new Date(order.order_time);
    const day = orderDate.getDay(); // 0-6 (Sunday-Saturday)
    const hour = orderDate.getHours(); // 0-23
    
    dayHourCounts[day][hour]++;
  });
  
  // Find the maximum count for color scaling
  const maxCount = Math.max(...dayHourCounts.flat());
  
  // Color function - blue scale similar to the Geography heat map
  const getColor = (count) => {
    if (count === 0) return 'rgb(240, 240, 245)';
    
    const intensity = Math.min(count / maxCount, 1);
    
    if (intensity < 0.2) {
      return `rgb(237, 237, 247)`;
    } else if (intensity < 0.4) {
      return `rgb(198, 219, 239)`;
    } else if (intensity < 0.6) {
      return `rgb(158, 202, 225)`;
    } else if (intensity < 0.8) {
      return `rgb(107, 174, 214)`;
    } else {
      return `rgb(49, 130, 189)`;
    }
  };
  
  return (
    <div className="w-full h-full">
      <div className="relative overflow-x-auto">
        <div className="grid" style={{ gridTemplateColumns: 'auto repeat(24, 1fr)' }}>
          {/* Empty cell in top-left corner */}
          <div className="h-6"></div>
          
          {/* Hour labels */}
          {hours.map(hour => (
            <div 
              key={`hour-${hour}`} 
              className="text-[10px] text-gray-500 font-medium text-center h-6"
            >
              {hour}
            </div>
          ))}
          
          {/* Days and heat map cells */}
          {days.map((day, dayIndex) => (
            <React.Fragment key={day}>
              {/* Day label */}
              <div className="text-[10px] text-gray-500 font-medium pr-2 h-5 flex items-center">
                {day}
              </div>
              
              {/* Heat map cells for this day */}
              {hours.map(hour => {
                const count = dayHourCounts[dayIndex][hour];
                return (
                  <div
                    key={`${day}-${hour}`}
                    className="h-5 w-full border-[0.5px] border-gray-100"
                    style={{ 
                      backgroundColor: getColor(count),
                      cursor: 'pointer'
                    }}
                    title={`${day} ${hour}:00 - ${count} orders`}
                  ></div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
      
      {/* Legend */}
      <div className="mt-3 flex items-center space-x-1 text-[10px] text-gray-500">
        <div className="w-3 h-3" style={{ backgroundColor: getColor(0) }}></div>
        <div className="w-3 h-3" style={{ backgroundColor: getColor(maxCount * 0.25) }}></div>
        <div className="w-3 h-3" style={{ backgroundColor: getColor(maxCount * 0.5) }}></div>
        <div className="w-3 h-3" style={{ backgroundColor: getColor(maxCount * 0.75) }}></div>
        <div className="w-3 h-3" style={{ backgroundColor: getColor(maxCount) }}></div>
        <div className="ml-1 flex gap-x-2">
          <span>0</span>
          <span>{Math.round(maxCount * 0.5)}</span>
          <span>{maxCount}</span>
          <span className="ml-1">orders</span>
        </div>
      </div>
    </div>
  );
};

// Import interfaces
interface SwiggyOrder {
  order_time: string;
  order_total: number;
  order_items: Array<{
    name: string;
    is_veg: string;
    price?: number;
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

interface CustomerChartData {
  topItems: {
    x: string[];
    y: number[];
  };
  vegNonVeg: {
    names: string[];
    values: number[];
    colors: string[];
  };
  itemsDistribution: {
    x: number[];
    y: number[];
  };
  timePreference: {
    x: string[];
    y: number[];
  };
  restaurantLoyalty: {
    x: string[];
    y: number[];
  };
  basketSizeTrend: {
    x: string[];
    y: number[];
  };
  cuisinePreference?: {
    names: string[];
    values: number[];
    colors: string[];
  };
}

const AnalyticsCustomer = () => {
  const [chartData, setChartData] = useState<CustomerChartData | null>(null);
  const [orders, setOrders] = useState<SwiggyOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Helper function to classify time category
  const getTimeCategory = (date: Date): string => {
    const hour = date.getHours();
    
    if (hour < 6) return "Late Night (12AM to 6AM)";
    if (hour < 12) return "Morning (6AM to 12PM)";
    if (hour < 18) return "Afternoon (12PM to 6PM)";
    return "Night (6PM to 12AM)";
  };

  useEffect(() => {
    // Fetch data and calculate metrics
    const fetchData = async () => {
      try {
        // In a real app, you would fetch data from your API
        const response = await fetch('/api/swiggy-orders');
        const ordersData: SwiggyOrder[] = await response.json();
        
        setOrders(ordersData);
        
        // Process and calculate chart data
        const calculatedData = calculateCustomerInsights(ordersData);
        setChartData(calculatedData);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Use dummy data for demo
        setOrders(getDummyOrders());
        setChartData(getDummyCustomerData());
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Generate dummy orders for the heat map visualization
  const getDummyOrders = (): SwiggyOrder[] => {
    const dummyOrders: Partial<SwiggyOrder>[] = [];
    
    // Generate 200 dummy orders spread across different days and times
    for (let i = 0; i < 200; i++) {
      // Random date in the last 3 months
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 90));
      
      // More orders during meal times and weekends
      const hour = Math.floor(Math.random() * 24);
      const dayOfWeek = Math.floor(Math.random() * 7);
      
      // Adjust probability based on meal times
      let skipOrder = Math.random() > 0.8;
      
      // Meal times more likely to have orders
      if ((hour >= 7 && hour <= 10) || (hour >= 12 && hour <= 14) || (hour >= 18 && hour <= 22)) {
        skipOrder = Math.random() > 0.95;  // Only 5% chance to skip during meal times
      }
      
      // Weekends more likely to have orders
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        skipOrder = skipOrder && Math.random() > 0.7;  // Less chance to skip on weekends
      }
      
      if (skipOrder) continue;
      
      date.setHours(hour, Math.floor(Math.random() * 60));
      
      dummyOrders.push({
        order_time: date.toISOString(),
        order_total: Math.floor(Math.random() * 1000) + 200,
        // Add more dummy data as needed
      });
    }
    
    return dummyOrders as SwiggyOrder[];
  };

  const calculateCustomerInsights = (orders: SwiggyOrder[]): CustomerChartData => {
    // 1. Most Ordered Items
    // Flatten all order items into a single array
    const allItems: { name: string; is_veg: string }[] = [];
    orders.forEach(order => {
      if (Array.isArray(order.order_items)) {
        allItems.push(...order.order_items);
      }
    });

    // Count occurrences of each item
    const itemCounts: Record<string, number> = {};
    allItems.forEach(item => {
      const name = item.name || "Unknown Item";
      itemCounts[name] = (itemCounts[name] || 0) + 1;
    });

    // Sort items by count and take top 10
    const sortedItems = Object.entries(itemCounts)
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, 10);

    const topItems = {
      x: sortedItems.map(([name]) => name.length > 15 ? `${name.substring(0, 15)}...` : name),
      y: sortedItems.map(([, count]) => count)
    };

    // 2. Veg vs Non-Veg Distribution
    const vegCount = allItems.filter(item => item.is_veg === '1').length;
    const nonVegCount = allItems.filter(item => item.is_veg === '0').length;
    const unknownCount = allItems.filter(item => item.is_veg !== '0' && item.is_veg !== '1').length;

    // Use the new color scheme
    const vegNonVeg = {
      names: ['Veg', 'Non-Veg', 'Unknown'],
      values: [vegCount, nonVegCount, unknownCount],
      colors: ['#10b981', '#6366F1', '#94a3b8'] // Green, Indigo, Gray
    };

    // 3. Items per Order Distribution
    const itemsPerOrder = orders.map(order => 
      Array.isArray(order.order_items) ? order.order_items.length : 0
    );

    // Group by count to create a histogram
    const itemsHistogram: Record<number, number> = {};
    itemsPerOrder.forEach(count => {
      itemsHistogram[count] = (itemsHistogram[count] || 0) + 1;
    });

    // Create arrays for x and y values
    const histogramX = Object.keys(itemsHistogram).map(Number);
    const histogramY = Object.values(itemsHistogram);

    const itemsDistribution = {
      x: histogramX,
      y: histogramY
    };

    // 4. Time-of-Day Preference
    const timeCategories: Record<string, number> = {
      "Late Night (12AM to 6AM)": 0,
      "Morning (6AM to 12PM)": 0,
      "Afternoon (12PM to 6PM)": 0,
      "Night (6PM to 12AM)": 0
    };

    orders.forEach(order => {
      const orderDate = new Date(order.order_time);
      const timeCategory = getTimeCategory(orderDate);
      timeCategories[timeCategory] += 1;
    });

    const timePreference = {
      x: Object.keys(timeCategories),
      y: Object.values(timeCategories)
    };

    // 5. Repeat Restaurant Loyalty
    const restaurantCounts: Record<string, number> = {};
    orders.forEach(order => {
      const restaurantName = order.restaurant_name || "Unknown";
      restaurantCounts[restaurantName] = (restaurantCounts[restaurantName] || 0) + 1;
    });

    // Filter for restaurants with more than 1 order (repeat visits)
    const repeatRestaurants = Object.entries(restaurantCounts)
      .filter(([, count]) => count > 1)
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, 10);

    const restaurantLoyalty = {
      x: repeatRestaurants.map(([name]) => name.length > 15 ? `${name.substring(0, 15)}...` : name),
      y: repeatRestaurants.map(([, count]) => count)
    };

    // 6. Basket Size Analysis (orders with 5+ items)
    const largeBasketOrders = orders.filter(order => 
      Array.isArray(order.order_items) && order.order_items.length >= 5
    );

    // Sort by time
    largeBasketOrders.sort((a, b) => 
      new Date(a.order_time).getTime() - new Date(b.order_time).getTime()
    );

    // Create a trend over time
    const basketSizeTrend = {
      x: largeBasketOrders.map(order => new Date(order.order_time).toISOString().split('T')[0]),
      y: largeBasketOrders.map((_, index) => index + 1) // Cumulative count
    };

    // 7. NEW: Cuisine Preference
    const cuisineMap: Record<string, number> = {};
    orders.forEach(order => {
      const restaurantType = order.restaurant_type?.toString() || "Unknown";
      const cuisineType = restaurantType.split(',')[0].trim(); // Take first cuisine if multiple
      cuisineMap[cuisineType] = (cuisineMap[cuisineType] || 0) + 1;
    });
    
    // Sort and get top cuisines
    const sortedCuisines = Object.entries(cuisineMap)
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, 7); // Top 7 cuisines
    
    // Color palette for cuisines
    const cuisineColors = [
      '#7F56E0', // Purple
      '#6366F1', // Indigo
      '#3B82F6', // Blue
      '#0EA5E9', // Light blue
      '#06B6D4', // Cyan
      '#8B5CF6', // Violet
      '#A855F7'  // Purple
    ];
    
    const cuisinePreference = {
      names: sortedCuisines.map(([cuisine]) => cuisine),
      values: sortedCuisines.map(([, count]) => count),
      colors: cuisineColors.slice(0, sortedCuisines.length)
    };

    return {
      topItems,
      vegNonVeg,
      itemsDistribution,
      timePreference,
      restaurantLoyalty,
      basketSizeTrend,
      cuisinePreference
    };
  };

  // Dummy data for development
  const getDummyCustomerData = (): CustomerChartData => {
    return {
      topItems: {
        x: ['Chicken Biryani', 'Butter Chicken', 'Paneer Tikka', 'Dal Makhani', 'Naan', 'Veg Fried Rice', 'Gulab Jamun', 'Chicken 65', 'Masala Dosa', 'Samosa'],
        y: [12, 8, 7, 6, 6, 5, 5, 4, 4, 3]
      },
      vegNonVeg: {
        names: ['Veg', 'Non-Veg', 'Unknown'],
        values: [65, 30, 5],
        colors: ['#10b981', '#6366F1', '#94a3b8'] // Green, Indigo, Gray
      },
      itemsDistribution: {
        x: [1, 2, 3, 4, 5, 6, 7, 8],
        y: [3, 7, 12, 10, 5, 3, 1, 1]
      },
      timePreference: {
        x: ['Late Night (12AM to 6AM)', 'Morning (6AM to 12PM)', 'Afternoon (12PM to 6PM)', 'Night (6PM to 12AM)'],
        y: [5, 10, 12, 15]
      },
      restaurantLoyalty: {
        x: ['Biryani Zone', 'Punjabi Tadka', 'Pizza Hut', 'Dominos', 'Chinese Wok', 'South Express', 'McDonalds', 'Subway'],
        y: [8, 6, 5, 4, 3, 3, 2, 2]
      },
      basketSizeTrend: {
        x: ['2023-01-05', '2023-01-12', '2023-01-18', '2023-02-02', '2023-02-15', '2023-03-01', '2023-03-10', '2023-03-22'],
        y: [1, 2, 3, 4, 5, 6, 7, 8]
      },
      cuisinePreference: {
        names: ['North Indian', 'Chinese', 'South Indian', 'Fast Food', 'Italian', 'Thai', 'Continental'],
        values: [25, 20, 15, 12, 10, 8, 5],
        colors: ['#7F56E0', '#6366F1', '#3B82F6', '#0EA5E9', '#06B6D4', '#8B5CF6', '#A855F7']
      }
    };
  };

  // If loading, show loading state
  if (loading) {
    return (
      <AnalyticsLayout 
        title="Customer Behavior" 
        description="Loading data..."
      >
        <div>Loading...</div>
      </AnalyticsLayout>
    );
  }

  // Calculate some summary stats for the header cards
  const totalOrders = orders.length;
  const uniqueRestaurants = new Set(orders.map(order => order.restaurant_name)).size;
  
  // Get most recent order date
  const orderDates = orders.map(order => new Date(order.order_time).getTime());
  const mostRecentDate = orderDates.length ? new Date(Math.max(...orderDates)) : null;
  
  return (
    <AnalyticsLayout 
      title="Customer Behavior" 
      description="Insights into your own ordering habits"
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalOrders}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Unique Restaurants</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{uniqueRestaurants}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Favorite Cuisine</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{chartData?.cuisinePreference?.names[0] || 'N/A'}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Last Order</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {mostRecentDate ? new Intl.DateTimeFormat('en-US', { 
                month: 'short', 
                day: 'numeric' 
              }).format(mostRecentDate) : 'N/A'}
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Heat Map - Full Width */}
      <div className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Ordering Pattern by Day & Hour</CardTitle>
            <CardDescription>When do you typically order food?</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <OrderingPatternHeatMap orders={orders} />
          </CardContent>
        </Card>
      </div>
      
      {/* Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Ordered Items</CardTitle>
            <CardDescription>Your most frequently ordered dishes</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {chartData ? (
              <BarChart 
                data={chartData.topItems}
                xAxisTitle="Item"
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
            <CardTitle>Cuisine Preference</CardTitle>
            <CardDescription>Types of food you enjoy most</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {chartData?.cuisinePreference ? (
              <PieChart 
                data={chartData.cuisinePreference}
                title="Cuisines"
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
            <CardTitle>Veg vs Non-Veg Preference</CardTitle>
            <CardDescription>Your food type preferences</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {chartData ? (
              <PieChart 
                data={chartData.vegNonVeg}
                title="Food Type"
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
            <CardTitle>Preferred Time of Day</CardTitle>
            <CardDescription>When you typically place your orders</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {chartData ? (
              <BarChart 
                data={chartData.timePreference}
                xAxisTitle="Time of Day"
                yAxisTitle="Order Count"
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

      {/* Row 3 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Restaurant Loyalty</CardTitle>
            <CardDescription>Places you order from most frequently</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {chartData ? (
              <BarChart 
                data={chartData.restaurantLoyalty}
                xAxisTitle="Restaurant"
                yAxisTitle="Visit Count"
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
            <CardTitle>Items per Order Distribution</CardTitle>
            <CardDescription>How many items you typically order</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {chartData ? (
              <BarChart 
                data={chartData.itemsDistribution}
                xAxisTitle="Items per Order"
                yAxisTitle="Frequency"
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
      
      {/* Large Orders Trend - Full Width */}
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Large Order Trend</CardTitle>
            <CardDescription>Cumulative count of orders with 5+ items</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {chartData ? (
              <LineChart 
                data={chartData.basketSizeTrend}
                xAxisTitle="Date"
                yAxisTitle="Cumulative Large Orders"
                showMarkers={true}
                color="#8B5CF6" // Violet
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

export default AnalyticsCustomer;
