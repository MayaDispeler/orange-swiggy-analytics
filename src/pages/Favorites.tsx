
import React from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import FavoriteRestaurants from '@/components/Dashboard/FavoriteRestaurants';
import { Heart, ShoppingBag } from 'lucide-react';

const Favorites = () => {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">My Favorites</h1>
        <p className="text-gray-500">Your favorite restaurants and dishes</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-md font-medium flex items-center gap-2">
                <Heart className="h-5 w-5 text-swiggy-orange" />
                Favorite Restaurants
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FavoriteRestaurants />
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-md font-medium flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-swiggy-orange" />
                Most Ordered Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="flex gap-3 p-3 border rounded-lg">
                    <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
                      Food
                    </div>
                    <div>
                      <h3 className="font-medium">Chicken Biryani</h3>
                      <p className="text-xs text-gray-500">Meghana Foods</p>
                      <p className="text-sm font-medium text-swiggy-orange mt-1">₹320</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Favorites;
