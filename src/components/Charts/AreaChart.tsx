import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ResponsiveContainer, 
  AreaChart as RechartsAreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend as RechartsLegend 
} from 'recharts';

interface DataPoint {
  [key: string]: string | number;
}

interface AreaChartProps {
  data: DataPoint[];
  xAxisDataKey: string;
  areaDataKey: string;
  title: string;
  description?: string;
  gradient?: {
    startColor: string;
    endColor: string;
  };
}

const AreaChart = ({ 
  data, 
  xAxisDataKey, 
  areaDataKey, 
  title, 
  description,
  gradient = { startColor: "#6366F1", endColor: "#8B5CF6" } 
}: AreaChartProps) => {
  return (
    <Card className="dashboard-card hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl text-slate-700 mb-1">{title}</CardTitle>
            {description && (
              <CardDescription className="text-slate-500">{description}</CardDescription>
            )}
          </div>
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
              <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
            </svg>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full mt-2 chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsAreaChart
              data={data}
              margin={{
                top: 5,
                right: 10,
                left: 0,
                bottom: 5,
              }}
            >
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={gradient.startColor} stopOpacity={0.4}/>
                  <stop offset="95%" stopColor={gradient.endColor} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.3)" />
              <XAxis 
                dataKey={xAxisDataKey} 
                tick={{ fill: "#64748b" }}
                axisLine={{ stroke: "rgba(255,255,255,0.3)" }}
              />
              <YAxis 
                tick={{ fill: "#64748b" }}
                axisLine={{ stroke: "rgba(255,255,255,0.3)" }}
              />
              <RechartsTooltip 
                contentStyle={{ 
                  backgroundColor: "rgba(255,255,255,0.8)", 
                  borderRadius: "8px", 
                  borderColor: "rgba(255,255,255,0.5)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  backdropFilter: "blur(8px)"
                }} 
              />
              <Area 
                type="monotone" 
                dataKey={areaDataKey} 
                stroke={gradient.startColor} 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorGradient)" 
              />
            </RechartsAreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AreaChart; 