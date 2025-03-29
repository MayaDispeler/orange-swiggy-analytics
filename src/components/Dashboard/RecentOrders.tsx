
import React from 'react';
import { Calendar, MapPin, Clock, DollarSign, ShoppingBag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const orders = [
  {
    id: "SW43210",
    restaurant: "Meghana Foods",
    items: "Chicken Biryani, Butter Naan",
    date: "15 Aug 2023",
    amount: "₹545",
    address: "Indira Nagar, Bangalore",
    time: "32 mins",
    status: "Delivered"
  },
  {
    id: "SW43185",
    restaurant: "Pizza Hut",
    items: "Pepperoni Pizza, Garlic Bread",
    date: "10 Aug 2023",
    amount: "₹789",
    address: "Koramangala, Bangalore",
    time: "28 mins",
    status: "Delivered"
  },
  {
    id: "SW43150",
    restaurant: "Beijing Bites",
    items: "Schezwan Noodles, Manchurian",
    date: "2 Aug 2023",
    amount: "₹420",
    address: "HSR Layout, Bangalore",
    time: "25 mins",
    status: "Delivered"
  },
  {
    id: "SW43120",
    restaurant: "Fresh Cake",
    items: "Chocolate Truffle Cake",
    date: "28 July 2023",
    amount: "₹550",
    address: "Indira Nagar, Bangalore",
    time: "35 mins",
    status: "Delivered"
  }
];

const RecentOrders = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-md font-medium">Recent Orders</CardTitle>
        <Button variant="ghost" size="sm" className="text-swiggy-orange">
          View All
          <ShoppingBag className="ml-1 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-500 border-b">
                <th className="pb-2 font-medium">Order ID</th>
                <th className="pb-2 font-medium">Restaurant</th>
                <th className="pb-2 font-medium">Date</th>
                <th className="pb-2 font-medium">Amount</th>
                <th className="pb-2 font-medium">Status</th>
                <th className="pb-2 font-medium">Time</th>
                <th className="pb-2 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={index} className="border-b last:border-0 text-sm">
                  <td className="py-3 font-medium">{order.id}</td>
                  <td className="py-3">
                    <div>
                      <p className="font-medium">{order.restaurant}</p>
                      <p className="text-xs text-gray-500">{order.items}</p>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-gray-400" />
                      <span>{order.date}</span>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3.5 w-3.5 text-gray-400" />
                      <span>{order.amount}</span>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className="px-2 py-1 text-xs font-medium bg-green-50 text-green-600 rounded-full">
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-gray-400" />
                      <span>{order.time}</span>
                    </div>
                  </td>
                  <td className="py-3">
                    <Button size="sm" variant="outline" className="text-xs h-8">
                      Order Again
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentOrders;
