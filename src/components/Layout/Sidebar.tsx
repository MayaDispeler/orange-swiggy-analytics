import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Calendar, MapPin, Users, Truck, Store, BadgeDollarSign, CreditCard, Heart, ShoppingBag, ChevronRight } from 'lucide-react';

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
  return (
    <Link 
      to={href} 
      className={cn(
        "flex items-center justify-between rounded-xl px-4 py-3 text-sm transition-all duration-200 relative z-10",
        isActive 
          ? "bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-medium shadow-md" 
          : "text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/80"
      )}
    >
      <div className="flex items-center gap-3">
        <div className={cn(
          "w-8 h-8 flex items-center justify-center rounded-lg transition-colors",
          isActive 
            ? "bg-white/20 text-white" 
            : "bg-slate-100 text-slate-500"
        )}>
          {icon}
        </div>
        <span className="font-medium">{label}</span>
      </div>
      {isActive && <ChevronRight className="h-4 w-4 text-white/70" />}
    </Link>
  );
};

const Sidebar = () => {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-200 w-72 shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-2.5 rounded-xl shadow-md">
            <ShoppingBag className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
            Swiggy Analytics
          </h1>
        </div>
      </div>
      
      <div className="flex-1 px-4 py-2 space-y-2 overflow-y-auto">
        <div className="mb-2 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Dashboard
        </div>
        <SidebarItem 
          icon={<LayoutDashboard className="h-5 w-5" />} 
          label="Overview" 
          href="/analytics/overview" 
          isActive={pathname === '/analytics/overview' || pathname === '/'} 
        />
        
        <div className="mt-6 mb-2 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Insights
        </div>
        <SidebarItem 
          icon={<Calendar className="h-5 w-5" />} 
          label="Time-Based" 
          href="/analytics/time" 
          isActive={pathname === '/analytics/time'} 
        />
        <SidebarItem 
          icon={<MapPin className="h-5 w-5" />} 
          label="Geography" 
          href="/analytics/geography" 
          isActive={pathname === '/analytics/geography'} 
        />
        <SidebarItem 
          icon={<Users className="h-5 w-5" />} 
          label="Customer" 
          href="/analytics/customer" 
          isActive={pathname === '/analytics/customer'} 
        />
        <SidebarItem 
          icon={<Truck className="h-5 w-5" />} 
          label="Delivery" 
          href="/analytics/delivery" 
          isActive={pathname === '/analytics/delivery'} 
        />
        
        <div className="mt-6 mb-2 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Business
        </div>
        <SidebarItem 
          icon={<Store className="h-5 w-5" />} 
          label="Restaurants" 
          href="/analytics/restaurants" 
          isActive={pathname === '/analytics/restaurants'} 
        />
        <SidebarItem 
          icon={<BadgeDollarSign className="h-5 w-5" />} 
          label="Financials" 
          href="/analytics/financials" 
          isActive={pathname === '/analytics/financials'} 
        />
        <SidebarItem 
          icon={<CreditCard className="h-5 w-5" />} 
          label="Payment & Coupons" 
          href="/analytics/payments" 
          isActive={pathname === '/analytics/payments'} 
        />
      </div>
    </div>
  );
};

export default Sidebar;