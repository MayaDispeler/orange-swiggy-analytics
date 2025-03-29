
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Heart, 
  MapPin, 
  CreditCard, 
  Clock, 
  Settings, 
  HelpCircle, 
  User 
} from 'lucide-react';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive?: boolean;
}

const SidebarItem = ({ icon, label, href, isActive }: SidebarItemProps) => {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
        isActive 
          ? "bg-swiggy-orange text-white" 
          : "text-gray-600 hover:bg-swiggy-light-orange/20 hover:text-swiggy-orange"
      )}
    >
      <div className="w-5 h-5">{icon}</div>
      <span>{label}</span>
    </Link>
  )
}

const Sidebar = () => {
  const pathname = window.location.pathname;
  
  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200 w-60">
      <div className="p-4">
        <div className="flex items-center gap-2">
          <div className="bg-swiggy-orange p-2 rounded-md">
            <ShoppingBag className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">My Swiggy</h1>
        </div>
      </div>
      
      <div className="flex-1 px-3 py-4 space-y-1">
        <SidebarItem 
          icon={<LayoutDashboard className="h-5 w-5" />} 
          label="Dashboard" 
          href="/" 
          isActive={pathname === '/'} 
        />
        <SidebarItem 
          icon={<ShoppingBag className="h-5 w-5" />} 
          label="My Orders" 
          href="/orders" 
          isActive={pathname === '/orders'} 
        />
        <SidebarItem 
          icon={<Heart className="h-5 w-5" />} 
          label="Favorites" 
          href="/favorites" 
          isActive={pathname === '/favorites'} 
        />
        <SidebarItem 
          icon={<MapPin className="h-5 w-5" />} 
          label="Addresses" 
          href="/addresses" 
          isActive={pathname === '/addresses'} 
        />
        <SidebarItem 
          icon={<CreditCard className="h-5 w-5" />} 
          label="Payments" 
          href="/payments" 
          isActive={pathname === '/payments'} 
        />
        <SidebarItem 
          icon={<Clock className="h-5 w-5" />} 
          label="Order History" 
          href="/history" 
          isActive={pathname === '/history'} 
        />
      </div>
      
      <div className="px-3 py-4 border-t border-gray-200">
        <SidebarItem 
          icon={<User className="h-5 w-5" />} 
          label="Profile" 
          href="/profile" 
          isActive={pathname === '/profile'} 
        />
        <SidebarItem 
          icon={<HelpCircle className="h-5 w-5" />} 
          label="Help" 
          href="/help" 
          isActive={pathname === '/help'} 
        />
        <SidebarItem 
          icon={<Settings className="h-5 w-5" />} 
          label="Settings" 
          href="/settings" 
          isActive={pathname === '/settings'} 
        />
      </div>
    </div>
  )
}

export default Sidebar;
