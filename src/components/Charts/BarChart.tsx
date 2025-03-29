import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { getGradient } from './utils';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartProps {
  data: {
    x: string[];
    y: number[];
  };
  xAxisTitle?: string;
  yAxisTitle?: string;
  showValues?: boolean;
  color?: string;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  xAxisTitle = '',
  yAxisTitle = '',
  showValues = false,
  color = '#3B82F6' // Default to blue instead of orange
}) => {
  const chartData = {
    labels: data.x,
    datasets: [
      {
        label: 'Value',
        data: data.y,
        backgroundColor: (context: { chart: { ctx: CanvasRenderingContext2D; chartArea?: { top: number; bottom: number; }; }; }) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return color;
          
          // Use 20% opacity version of the main color for fill
          const gradientColor = color + '33'; // Add 20% alpha
          
          return getGradient(ctx, chartArea, gradientColor, color);
        },
        borderColor: color,
        borderWidth: 1,
        borderRadius: 4,
        hoverBackgroundColor: color,
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
          title: (tooltipItems: { label: string }[]) => {
            return tooltipItems[0].label;
          },
          label: (context: { parsed: { y: number }; }) => {
            const value = context.parsed.y;
            const label = yAxisTitle || 'Value';
            return `${label}: ${value}`;
          },
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default BarChart; 