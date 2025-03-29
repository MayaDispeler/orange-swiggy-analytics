import React from 'react';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

interface ScatterChartProps {
  data: {
    x: number[];
    y: number[];
  };
  xAxisTitle?: string;
  yAxisTitle?: string;
  showTrendline?: boolean;
  color?: string;
}

export const ScatterChart: React.FC<ScatterChartProps> = ({
  data,
  xAxisTitle = '',
  yAxisTitle = '',
  showTrendline = false,
  color = '#6366F1' // Default to indigo
}) => {
  // Calculate trendline if needed
  let trendlineData: { x: number, y: number }[] = [];
  
  if (showTrendline && data.x.length > 1) {
    // Simple linear regression
    const n = data.x.length;
    const sumX = data.x.reduce((a, b) => a + b, 0);
    const sumY = data.y.reduce((a, b) => a + b, 0);
    const sumXY = data.x.reduce((sum, x, i) => sum + x * data.y[i], 0);
    const sumXX = data.x.reduce((sum, x) => sum + x * x, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    // Get min and max X values
    const minX = Math.min(...data.x);
    const maxX = Math.max(...data.x);
    
    // Create two points for the trendline
    trendlineData = [
      { x: minX, y: slope * minX + intercept },
      { x: maxX, y: slope * maxX + intercept }
    ];
  }

  const chartData: ChartData<'scatter'> = {
    datasets: [
      {
        label: 'Data Points',
        data: data.x.map((x, i) => ({ x, y: data.y[i] })),
        backgroundColor: color,
        pointRadius: 5,
        pointHoverRadius: 8,
        pointBorderColor: 'white',
        pointBorderWidth: 1,
        pointHitRadius: 10
      }
    ]
  };

  // Add trendline dataset if needed
  if (showTrendline && trendlineData.length > 0) {
    chartData.datasets.push({
      label: 'Trend Line',
      data: trendlineData,
      backgroundColor: 'transparent',
      borderColor: color,
      borderWidth: 2,
      borderDash: [5, 5],
      pointRadius: 0,
      showLine: true,
      tension: 0
    });
  }

  const options: ChartOptions<'scatter'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: !!xAxisTitle,
          text: xAxisTitle,
        },
        ticks: {
          precision: 1
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
          title: () => '',
          label: (context) => {
            const xLabel = xAxisTitle || 'X';
            const yLabel = yAxisTitle || 'Y';
            return [
              `${xLabel}: ${context.parsed.x}`,
              `${yLabel}: ${context.parsed.y}`
            ];
          },
        },
      },
    },
  };

  return <Scatter data={chartData} options={options} />;
};

export default ScatterChart; 