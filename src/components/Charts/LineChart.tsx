import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartArea,
  TooltipItem,
  ScriptableContext,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { getGradient } from './utils';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface LineChartProps {
  data: {
    x: string[];
    y: number[];
  };
  xAxisTitle?: string;
  yAxisTitle?: string;
  showMarkers?: boolean;
  color?: string;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  xAxisTitle = '',
  yAxisTitle = '',
  showMarkers = false,
  color = '#6366F1' // Default to indigo instead of orange
}) => {
  const chartData = {
    labels: data.x,
    datasets: [
      {
        label: 'Value',
        data: data.y,
        borderColor: color,
        backgroundColor: (context: ScriptableContext<"line">) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return color;
          
          // Use 20% opacity version of the main color for fill
          const gradientColor = color + '33'; // Add 20% alpha
          
          return getGradient(ctx, chartArea, gradientColor, 'rgba(255, 255, 255, 0)');
        },
        borderWidth: 2,
        fill: true,
        pointRadius: showMarkers ? 4 : 0,
        pointHoverRadius: 6,
        pointBackgroundColor: color,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: !!xAxisTitle,
          text: xAxisTitle,
        },
        grid: {
          display: false
        }
      },
      y: {
        title: {
          display: !!yAxisTitle,
          text: yAxisTitle,
        },
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#333',
        bodyColor: '#666',
        bodyFont: {
          size: 12,
        },
        borderColor: '#ddd',
        borderWidth: 1,
        padding: 12,
        boxPadding: 4,
        usePointStyle: true,
        callbacks: {
          title: (tooltipItems: TooltipItem<"line">[]) => {
            return tooltipItems[0].label;
          },
          label: (context: TooltipItem<"line">) => {
            const value = context.parsed.y;
            const label = yAxisTitle || 'Value';
            return `${label}: ${value}`;
          },
        },
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
  };

  return <Line data={chartData} options={options} />;
};

export default LineChart; 