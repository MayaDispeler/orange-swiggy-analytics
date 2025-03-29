import React, { useEffect, useState } from 'react';
import AnalyticsLayout from '@/components/Layout/AnalyticsLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, LineChart, ScatterChart } from '@/components/Charts';
import { PieChart } from './Customer'; // Reuse PieChart from Customer page

interface SwiggyOrder {
  order_time: string;
  restaurant_lat?: number;
  restaurant_lng?: number;
  restaurant_customer_distance?: number;
  delivery_time_in_seconds?: number;
  restaurant_city_name?: string;
  [key: string]: unknown;
}

interface GeographyChartData {
  cityDistribution: {
    names: string[];
    values: number[];
    colors: string[];
  };
  distanceVsTime: {
    x: number[];
    y: number[];
  };
  totalDistanceOverTime: {
    x: string[];
    y: number[];
  };
  avgDistanceByCity: {
    x: string[];
    y: number[];
  };
}

// Heat Map component for professional visualization with time-based grid
const HeatMapVisualization: React.FC<{
  points: Array<{ lat: number; lng: number; label?: string }>;
}> = ({ points }) => {
  // We'll create a time-based heat map similar to the reference image
  // Days of week as rows, hours of day as columns
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const hours = Array.from({ length: 24 }, (_, i) => i); // 0-23 hours
  
  // Create regions to match reference image style
  const regions = [
    { name: 'Bangalore (BLR)', color: '#7F56E0' },
    { name: 'Mumbai (BOM)', color: '#6366F1' },
    { name: 'Delhi (DEL)', color: '#3B82F6' },
    { name: 'Hyderabad (HYD)', color: '#0EA5E9' }
  ];
  
  // Generate random heat map data for each region
  // In a real app, this would be calculated from actual order data
  const generateHeatMapData = (region: string, maxValue: number) => {
    const data: number[][] = [];
    
    // Create a 7x24 grid (7 days, 24 hours)
    for (let day = 0; day < 7; day++) {
      data[day] = [];
      for (let hour = 0; hour < 24; hour++) {
        // Generate patterns that would be plausible for restaurant orders
        let value = 0;
        
        // More orders during meal times
        const isMealTime = (hour >= 7 && hour <= 10) || // Breakfast
                          (hour >= 12 && hour <= 14) || // Lunch
                          (hour >= 18 && hour <= 22);   // Dinner
        
        // More orders on weekends
        const isWeekend = day === 0 || day === 5 || day === 6;
        
        // Base value depending on time patterns
        if (isMealTime) {
          value = Math.floor(Math.random() * (maxValue * 0.5)) + (maxValue * 0.5);
        } else {
          value = Math.floor(Math.random() * (maxValue * 0.3));
        }
        
        // Weekend boost
        if (isWeekend && isMealTime) {
          value = Math.min(value * 1.5, maxValue); // Cap at max value
        }
        
        // Regional variations
        if (region === 'Bangalore (BLR)' && hour >= 22) {
          value = Math.min(value * 1.2, maxValue); // Bangalore has late night orders
        } else if (region === 'Mumbai (BOM)' && hour >= 8 && hour <= 11) {
          value = Math.min(value * 1.3, maxValue); // Mumbai has more breakfast orders
        }
        
        data[day][hour] = Math.floor(value);
      }
    }
    
    return data;
  };
  
  // Generate data for each region with different scales
  const regionData = regions.map(region => {
    // Different max values to show regional differences
    const maxValues = {
      'Bangalore (BLR)': 1000,
      'Mumbai (BOM)': 900,
      'Delhi (DEL)': 700,
      'Hyderabad (HYD)': 500
    };
    
    const maxValue = maxValues[region.name as keyof typeof maxValues];
    
    return {
      ...region,
      data: generateHeatMapData(region.name, maxValue),
      maxValue
    };
  });
  
  // Color scale function based on value and max
  const getColor = (value: number, maxValue: number) => {
    if (value === 0) return 'rgb(240, 240, 245)';
    
    const intensity = Math.min(value / maxValue, 1);
    // Use color scale similar to reference image (yellowish to purple)
    
    // Yellow-green-blue scale
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
    <div className="heat-map-grid grid grid-cols-1 md:grid-cols-2 gap-4">
      {regionData.map(region => (
        <div key={region.name} className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="text-sm font-semibold mb-2">{region.name}</h3>
          
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
                    const value = region.data[dayIndex][hour];
                    return (
                      <div
                        key={`${day}-${hour}`}
                        className="h-5 w-full border-[0.5px] border-gray-100"
                        style={{ 
                          backgroundColor: getColor(value, region.maxValue),
                          cursor: 'pointer'
                        }}
                        title={`${day} ${hour}:00 - ${value} orders`}
                      ></div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
          
          {/* Legend */}
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center space-x-1 text-[10px] text-gray-500">
              <div className="w-3 h-3" style={{ backgroundColor: getColor(0, region.maxValue) }}></div>
              <div className="w-3 h-3" style={{ backgroundColor: getColor(region.maxValue * 0.25, region.maxValue) }}></div>
              <div className="w-3 h-3" style={{ backgroundColor: getColor(region.maxValue * 0.5, region.maxValue) }}></div>
              <div className="w-3 h-3" style={{ backgroundColor: getColor(region.maxValue * 0.75, region.maxValue) }}></div>
              <div className="w-3 h-3" style={{ backgroundColor: getColor(region.maxValue, region.maxValue) }}></div>
              <div className="ml-1 flex gap-x-2">
                <span>0</span>
                <span>{Math.round(region.maxValue * 0.5)}</span>
                <span>{region.maxValue}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const AnalyticsGeography = () => {
  const [chartData, setChartData] = useState<GeographyChartData | null>(null);
  const [mapPoints, setMapPoints] = useState<Array<{ lat: number; lng: number; label?: string }>>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch data and calculate metrics
    const fetchData = async () => {
      try {
        // In a real app, you would fetch data from your API
        const response = await fetch('/api/swiggy-orders');
        const orders: SwiggyOrder[] = await response.json();
        
        // Process and calculate chart data
        const calculatedData = calculateGeographicInsights(orders);
        setChartData(calculatedData);
        
        // Extract map points
        const points = extractMapPoints(orders);
        setMapPoints(points);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Use dummy data for demo
        setChartData(getDummyGeographyData());
        setMapPoints(getDummyMapPoints());
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const extractMapPoints = (orders: SwiggyOrder[]) => {
    const points: Array<{ lat: number; lng: number; label?: string }> = [];
    
    // Create a Set to track unique restaurant coordinates
    const uniqueCoords = new Set<string>();
    
    orders.forEach(order => {
      if (order.restaurant_lat !== undefined && order.restaurant_lng !== undefined) {
        const coordKey = `${order.restaurant_lat},${order.restaurant_lng}`;
        
        // Only add unique coordinates
        if (!uniqueCoords.has(coordKey)) {
          uniqueCoords.add(coordKey);
          points.push({
            lat: order.restaurant_lat,
            lng: order.restaurant_lng,
            label: typeof order.restaurant_name === 'string' 
              ? order.restaurant_name.substring(0, 10) 
              : undefined
          });
        }
      }
    });
    
    return points;
  };
  
  // Generate dummy map points for demo - create many more points for realistic clustering
  const getDummyMapPoints = () => {
    const basePoints = [
      { lat: 12.9716, lng: 77.5946, label: 'Restaurant A' }, // Bangalore
      { lat: 12.9352, lng: 77.6245, label: 'Restaurant B' },
      { lat: 12.9698, lng: 77.7500, label: 'Restaurant C' },
      { lat: 13.0827, lng: 77.5878, label: 'Restaurant D' },
      { lat: 12.9121, lng: 77.6446, label: 'Restaurant E' },
    ];
    
    // Generate more points around the base points
    const allPoints = [...basePoints];
    
    // Add 10-15 restaurants in each area
    basePoints.forEach(basePoint => {
      const numPoints = 10 + Math.floor(Math.random() * 6);
      
      for (let i = 0; i < numPoints; i++) {
        // Random offset within 0.01 degrees (roughly 1km)
        const latOffset = (Math.random() - 0.5) * 0.02;
        const lngOffset = (Math.random() - 0.5) * 0.02;
        
        allPoints.push({
          lat: basePoint.lat + latOffset,
          lng: basePoint.lng + lngOffset,
          label: `${basePoint.label.replace('Restaurant ', '')} ${i+1}`
        });
      }
    });
    
    return allPoints;
  };

  const calculateGeographicInsights = (orders: SwiggyOrder[]): GeographyChartData => {
    // 1. City-wise Order Distribution
    const cityCounts: Record<string, number> = {};
    orders.forEach(order => {
      const city = order.restaurant_city_name || 'Unknown';
      cityCounts[city] = (cityCounts[city] || 0) + 1;
    });

    // Sort by count and prepare for pie chart
    const sortedCities = Object.entries(cityCounts)
      .sort(([, countA], [, countB]) => countB - countA);
    
    // Generate colors for pie chart with new color palette
    const cityColors = [
      '#7F56E0', // Purple
      '#6366F1', // Indigo
      '#3B82F6', // Blue
      '#0EA5E9', // Light blue
      '#06B6D4', // Cyan
      '#8B5CF6', // Violet
      '#A855F7', // Purple
      '#D946EF', // Fuchsia
    ];
    
    const cityDistribution = {
      names: sortedCities.map(([city]) => city),
      values: sortedCities.map(([, count]) => count),
      colors: sortedCities.map((_, i) => cityColors[i % cityColors.length])
    };

    // 2. Delivery Distance vs Time
    const distanceVsTime = {
      x: [] as number[],
      y: [] as number[]
    };

    orders.forEach(order => {
      if (order.restaurant_customer_distance !== undefined && 
          order.delivery_time_in_seconds !== undefined) {
        const distance = order.restaurant_customer_distance;
        const timeInMinutes = order.delivery_time_in_seconds / 60;
        
        distanceVsTime.x.push(distance);
        distanceVsTime.y.push(timeInMinutes);
      }
    });

    // 3. Total Distance Over Time
    // Sort orders by time
    const sortedOrders = [...orders].sort((a, b) => {
      return new Date(a.order_time).getTime() - new Date(b.order_time).getTime();
    });
    
    const distanceOverTime = {
      x: [] as string[],
      y: [] as number[]
    };
    
    let cumulativeDistance = 0;
    sortedOrders.forEach(order => {
      if (order.restaurant_customer_distance !== undefined) {
        const date = new Date(order.order_time);
        const formattedDate = date.toISOString().split('T')[0]; // YYYY-MM-DD
        
        cumulativeDistance += order.restaurant_customer_distance;
        
        distanceOverTime.x.push(formattedDate);
        distanceOverTime.y.push(cumulativeDistance);
      }
    });

    // 4. Average Distance by City
    const cityDistances: Record<string, { total: number, count: number }> = {};
    
    orders.forEach(order => {
      const city = order.restaurant_city_name || 'Unknown';
      const distance = order.restaurant_customer_distance;
      
      if (distance !== undefined) {
        if (!cityDistances[city]) {
          cityDistances[city] = { total: 0, count: 0 };
        }
        
        cityDistances[city].total += distance;
        cityDistances[city].count += 1;
      }
    });
    
    const avgDistanceByCity = {
      x: [] as string[],
      y: [] as number[]
    };
    
    Object.entries(cityDistances).forEach(([city, { total, count }]) => {
      if (count > 0) {
        avgDistanceByCity.x.push(city);
        avgDistanceByCity.y.push(total / count);
      }
    });
    
    // Sort by average distance
    const sortedAvgDistances = avgDistanceByCity.x.map((city, i) => ({
      city,
      distance: avgDistanceByCity.y[i]
    })).sort((a, b) => b.distance - a.distance);
    
    avgDistanceByCity.x = sortedAvgDistances.map(item => item.city);
    avgDistanceByCity.y = sortedAvgDistances.map(item => item.distance);

    return {
      cityDistribution,
      distanceVsTime,
      totalDistanceOverTime: {
        x: distanceOverTime.x,
        y: distanceOverTime.y
      },
      avgDistanceByCity
    };
  };

  // Dummy data for development
  const getDummyGeographyData = (): GeographyChartData => {
    return {
      cityDistribution: {
        names: ['Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai'],
        values: [45, 30, 15, 10, 5],
        colors: ['#7F56E0', '#6366F1', '#3B82F6', '#0EA5E9', '#06B6D4']
      },
      distanceVsTime: {
        x: [1.2, 2.5, 3.1, 4.2, 2.8, 3.5, 1.8, 2.2, 4.8, 3.9],
        y: [22, 35, 28, 40, 32, 38, 25, 30, 45, 42]
      },
      totalDistanceOverTime: {
        x: ['2023-01-01', '2023-02-01', '2023-03-01', '2023-04-01', '2023-05-01', '2023-06-01'],
        y: [15, 35, 60, 95, 135, 180]
      },
      avgDistanceByCity: {
        x: ['Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai'],
        y: [3.2, 2.8, 4.1, 3.5, 2.9]
      }
    };
  };

  // If loading, show loading state
  if (loading) {
    return (
      <AnalyticsLayout 
        title="Geographic Insights" 
        description="Loading data..."
      >
        <div>Loading...</div>
      </AnalyticsLayout>
    );
  }

  return (
    <AnalyticsLayout 
      title="Geographic Insights" 
      description="Discover patterns in your ordering locations"
    >
      {/* Heat Map Row - Full Width */}
      <div className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Order Density by Time & Region</CardTitle>
          </CardHeader>
          <CardContent> {/* Removed fixed height for flexible sizing */}
            <HeatMapVisualization points={mapPoints} />
          </CardContent>
        </Card>
      </div>

      {/* Three column layout for the other charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Orders by City</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            {chartData ? (
              <PieChart 
                data={chartData.cityDistribution}
                title="City-wise Order Distribution"
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
            <CardTitle>Distance vs Delivery Time</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            {chartData ? (
              <ScatterChart 
                data={chartData.distanceVsTime}
                xAxisTitle="Distance (km)"
                yAxisTitle="Delivery Time (min)"
                showTrendline={true}
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
            <CardTitle>Average Distance by City</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            {chartData ? (
              <BarChart 
                data={chartData.avgDistanceByCity}
                xAxisTitle="City"
                yAxisTitle="Average Distance (km)"
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

      {/* Total Distance Over Time - Full Width */}
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Distance Over Time</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            {chartData ? (
              <LineChart 
                data={chartData.totalDistanceOverTime}
                xAxisTitle="Date"
                yAxisTitle="Cumulative Distance (km)"
                showMarkers={false}
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

export default AnalyticsGeography;
