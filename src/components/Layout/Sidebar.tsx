import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Calendar, MapPin, Users, Truck, Store, BadgeDollarSign, CreditCard, Heart, ShoppingBag } from 'lucide-react';
interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive?: boolean;
}
const SidebarItem = ({
  icon,
  label,
  href,
  isActive
}: SidebarItemProps) => {
  return <Link to={href} className={cn("flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors", isActive ? "bg-swiggy-orange text-white" : "text-gray-600 hover:bg-swiggy-light-orange/20 hover:text-swiggy-orange")}>
      <div className="w-5 h-5">{icon}</div>
      <span>{label}</span>
    </Link>;
};
const Sidebar = () => {
  const location = useLocation();
  const pathname = location.pathname;
  return <div className="flex flex-col h-full bg-white border-r border-gray-200 w-64">
      <div className="p-4">
        <div className="flex items-center gap-2">
          <div className="bg-swiggy-orange p-2 rounded-md">
            <ShoppingBag className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">My Swiggy</h1>
        </div>
      </div>
      
      <div className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        <SidebarItem icon={<LayoutDashboard className="h-5 w-5" />} label="📊 Overview" href="/analytics/overview" isActive={pathname === '/analytics/overview' || pathname === '/'} />
        <SidebarItem icon={<Calendar className="h-5 w-5" />} label="📅 Time-Based" href="/analytics/time" isActive={pathname === '/analytics/time'} />
        <SidebarItem icon={<MapPin className="h-5 w-5" />} label="📍 Geography" href="/analytics/geography" isActive={pathname === '/analytics/geography'} />
        <SidebarItem icon={<Users className="h-5 w-5" />} label="🧍 Customer" href="/analytics/customer" isActive={pathname === '/analytics/customer'} />
        <SidebarItem icon={<Truck className="h-5 w-5" />} label="🚚 Delivery" href="/analytics/delivery" isActive={pathname === '/analytics/delivery'} />
        <SidebarItem icon={<Store className="h-5 w-5" />} label="🏪 Restaurants" href="/analytics/restaurants" isActive={pathname === '/analytics/restaurants'} />
        <SidebarItem icon={<BadgeDollarSign className="h-5 w-5" />} label="💵 Financials" href="/analytics/financials" isActive={pathname === '/analytics/financials'} />
        <SidebarItem icon={<CreditCard className="h-5 w-5" />} label="💳 Payment & Coupons" href="/analytics/payments" isActive={pathname === '/analytics/payments'} />
      </div>
      
      
    </div>;
};
export default Sidebar;