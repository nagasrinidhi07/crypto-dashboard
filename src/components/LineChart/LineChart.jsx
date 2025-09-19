import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineChart = ({ historicalData, darkMode }) => {
  if (!historicalData) return null;

  const labels = historicalData.prices.map(p => new Date(p[0]).toLocaleDateString());
  const dataPoints = historicalData.prices.map(p => p[1]);

  const data = {
    labels,
    datasets: [
      {
        label: 'Price',
        data: dataPoints,
        borderColor: darkMode ? '#38bdf8' : '#3b82f6',
        backgroundColor: darkMode ? 'rgba(56,189,248,0.2)' : 'rgba(59,130,246,0.2)',
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: darkMode ? '#fff' : '#000',
        },
      },
    },
    scales: {
      x: {
        ticks: { color: darkMode ? '#fff' : '#000' },
        grid: { color: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' },
      },
      y: {
        ticks: { color: darkMode ? '#fff' : '#000' },
        grid: { color: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' },
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default LineChart;
