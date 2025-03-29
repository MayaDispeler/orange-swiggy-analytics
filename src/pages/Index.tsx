
import React from 'react';
import { ArrowRightCircle, BarChart3, Phone, BookOpen, TrendingUp, Users } from 'lucide-react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import StatCard from '@/components/Dashboard/StatCard';
import ChartCard from '@/components/Dashboard/ChartCard';
import EarningsChart from '@/components/Dashboard/EarningsChart';
import CircularProgress from '@/components/Dashboard/CircularProgress';
import PerformanceMetrics from '@/components/Dashboard/PerformanceMetrics';
import AreaCodeChart from '@/components/Dashboard/AreaCodeChart';
import AdvertisingChannelChart from '@/components/Dashboard/AdvertisingChannelChart';
import CallDurationMetric from '@/components/Dashboard/CallDurationMetric';
import CourseEnrollmentChart from '@/components/Dashboard/CourseEnrollmentChart';
import SalesTeamTable from '@/components/Dashboard/SalesTeamTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-fade-in">
        <StatCard
          title="Total Earnings"
          value="₹15,99,00,000"
          icon={<BarChart3 className="h-5 w-5 text-swiggy-orange" />}
          trend={{ value: 8.2, isPositive: true }}
        />
        <StatCard
          title="Highest"
          value="₹1,85,90,000"
          icon={<TrendingUp className="h-5 w-5 text-swiggy-orange" />}
          description="Week of Nov 12"
        />
        <StatCard
          title="Average"
          value="₹1,33,25,000"
          icon={<BarChart3 className="h-5 w-5 text-swiggy-orange" />}
          description="Per week"
        />
        <StatCard
          title="Total Calls"
          value="926"
          icon={<Phone className="h-5 w-5 text-swiggy-orange" />}
          trend={{ value: 12.4, isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2 animate-slide-in">
          <ChartCard 
            title="Total Earnings by Month" 
            action={
              <Button variant="ghost" size="sm" className="text-swiggy-orange">
                View Report
                <ArrowRightCircle className="ml-1 h-4 w-4" />
              </Button>
            }
          >
            <EarningsChart />
          </ChartCard>
        </div>
        <div className="flex flex-col space-y-4 animate-slide-in">
          <div className="h-1/2">
            <CallDurationMetric />
          </div>
          <div className="h-1/2">
            <Card className="h-full">
              <CardContent className="flex flex-col items-center justify-center h-full py-6">
                <div className="flex space-x-4 items-center justify-center">
                  <CircularProgress 
                    percentage={75} 
                    size={90} 
                    strokeWidth={8} 
                    color="#F97316"
                  />
                  <div className="space-y-2">
                    <p className="text-lg font-medium">Total Paid</p>
                    <p className="text-3xl font-bold text-swiggy-orange">326</p>
                    <p className="text-sm text-gray-500">Out of 421 orders</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="animate-fade-in">
          <ChartCard title="Advertising Channel">
            <AdvertisingChannelChart />
          </ChartCard>
        </div>
        <div className="animate-fade-in">
          <ChartCard title="Area Code">
            <AreaCodeChart />
          </ChartCard>
        </div>
        <div className="animate-fade-in">
          <PerformanceMetrics />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="animate-slide-in">
          <ChartCard 
            title="Enrolled Courses" 
            action={
              <div className="flex items-center text-sm text-swiggy-orange font-medium">
                <span>2,643</span>
                <span className="mx-1 text-gray-400">|</span>
                <span>2.14 avg.</span>
              </div>
            }
          >
            <CourseEnrollmentChart />
          </ChartCard>
        </div>
        <div className="animate-slide-in">
          <SalesTeamTable />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
