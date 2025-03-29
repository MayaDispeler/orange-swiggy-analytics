
import React from 'react';
import { Bell, Search, ChevronDown, ShoppingBag } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';

const Navbar = () => {
  return (
    <div className="h-16 border-b border-gray-200 flex items-center justify-between px-4 bg-white">
      <div className="flex items-center gap-3 w-72">
        <div className="relative w-full">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search orders..." 
            className="w-full pl-8 pr-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-swiggy-orange/20 focus:border-swiggy-orange text-sm" 
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-full hover:bg-gray-100">
          <Bell className="h-5 w-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-swiggy-orange rounded-full"></span>
        </button>
        
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <div className="bg-swiggy-orange text-white font-medium flex items-center justify-center h-full w-full text-sm">
              JD
            </div>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">John Doe</span>
            <span className="text-xs text-gray-500">Premium Member</span>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </div>
      </div>
    </div>
  )
}

export default Navbar;
