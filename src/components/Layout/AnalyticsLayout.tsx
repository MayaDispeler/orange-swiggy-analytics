import React from 'react';
import DashboardLayout from './DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AnalyticsLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
}

const AnalyticsLayout = ({ children, title, description }: AnalyticsLayoutProps) => {
  return (
    <DashboardLayout>
      <div className="mb-10 animate-fade-in">
        <div className="relative">
          <div className="absolute -top-6 -left-6 w-20 h-20 rounded-full bg-indigo-500/10 blur-xl"></div>
          <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full bg-purple-500/10 blur-xl"></div>
          
          <h1 className="text-4xl font-bold gradient-heading mb-4 relative z-10">
            {title}
          </h1>
          
          <div className="relative z-10">
            <p className="text-slate-600 max-w-3xl text-lg">
              {description}
            </p>
            <div className="h-1 w-24 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 rounded-full mt-5 animate-pulse-slow"></div>
          </div>
        </div>
      </div>
      
      <div className="grid gap-8 animate-slide-up">
        {React.Children.map(children, (child, index) => (
          <div 
            className="transition-all duration-500 relative hover:z-10" 
            style={{ 
              animationDelay: `${index * 0.15}s`,
              transform: 'perspective(1000px)',
              transformStyle: 'preserve-3d'
            }}
          >
            <div className="animate-shimmer">
              {child}
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsLayout;
