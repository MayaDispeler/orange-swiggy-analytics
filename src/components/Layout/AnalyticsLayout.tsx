
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{title}</h1>
        <p className="text-gray-500">{description}</p>
      </div>
      
      <div className="grid gap-6">
        {children}
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsLayout;
