
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  BarChart, 
  PieChart, 
  Users, 
  Phone, 
  Activity, 
  Settings 
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
            <BarChart className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Swiggy Analytics</h1>
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
          icon={<BarChart className="h-5 w-5" />} 
          label="Sales Analysis" 
          href="/sales" 
          isActive={pathname === '/sales'} 
        />
        <SidebarItem 
          icon={<Users className="h-5 w-5" />} 
          label="Training" 
          href="/training" 
          isActive={pathname === '/training'} 
        />
        <SidebarItem 
          icon={<Phone className="h-5 w-5" />} 
          label="Call Center" 
          href="/calls" 
          isActive={pathname === '/calls'} 
        />
        <SidebarItem 
          icon={<PieChart className="h-5 w-5" />} 
          label="Advertising" 
          href="/advertising" 
          isActive={pathname === '/advertising'} 
        />
        <SidebarItem 
          icon={<Activity className="h-5 w-5" />} 
          label="Performance" 
          href="/performance" 
          isActive={pathname === '/performance'} 
        />
      </div>
      
      <div className="px-3 py-4 border-t border-gray-200">
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
