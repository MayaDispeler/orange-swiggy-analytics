
import React from 'react';
import { Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const restaurants = [
  {
    name: "Meghana Foods",
    rating: 4.8,
    orders: 15,
    cuisine: "Biryani, North Indian"
  },
  {
    name: "Pizza Hut",
    rating: 4.2,
    orders: 12,
    cuisine: "Pizza, Italian"
  },
  {
    name: "Beijing Bites",
    rating: 4.5,
    orders: 8,
    cuisine: "Chinese, Asian"
  },
  {
    name: "Fresh Cake",
    rating: 4.7,
    orders: 6,
    cuisine: "Bakery, Desserts"
  }
];

const FavoriteRestaurants = () => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-md font-medium">Favorite Restaurants</CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-4">
          {restaurants.map((restaurant, index) => (
            <div key={index} className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0">
              <div>
                <h3 className="font-medium">{restaurant.name}</h3>
                <p className="text-xs text-gray-500">{restaurant.cuisine}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-swiggy-orange text-swiggy-orange" />
                  <span className="text-sm font-medium">{restaurant.rating}</span>
                </div>
                <p className="text-xs text-gray-500">{restaurant.orders} orders</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FavoriteRestaurants;
