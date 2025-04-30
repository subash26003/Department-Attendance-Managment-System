import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SubjectWiseAnalysis = ({ data }) => {
  // Function to determine color based on percentage
  const getColor = (percentage) => {
    if (percentage >= 90) return '#10B981';  
    if (percentage >= 75) return '#F59E0B';  
    return '#EF4444';                        // Red for poor attendance
  };

  const chartData = {
    labels: data.map(item => item.code),
    datasets: [
      {
        label: 'Attendance %',
        data: data.map(item => item.avgPercentage),
        backgroundColor: data.map(item => getColor(item.avgPercentage)),
        borderColor: data.map(item => getColor(item.avgPercentage)),
        borderWidth: 1
      },
      {
        label: 'Remaining %',
        data: data.map(item => 100 - item.avgPercentage),
        backgroundColor: '#E5E7EB',  // Light gray for remaining portion
        borderColor: '#D1D5DB',
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 12,
          padding: 20,
          usePointStyle: true
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const datasetLabel = context.dataset.label || '';
            return `${datasetLabel}: ${context.raw}%`;
          }
        }
      }
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false
        },
        ticks: {
          font: {
            weight: 'bold'
          }
        }
      },
      y: {
        stacked: true,
        min: 0,
        max: 100,
        ticks: {
          callback: (value) => `${value}%`,
          stepSize: 10
        },
        title: {
          display: true,
          text: 'Attendance Percentage',
          font: {
            weight: 'bold'
          }
        }
      }
    },
    layout: {
      padding: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md md:p-6 ">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Subject-wise Attendance Analysis</h2>
      <div className="h-96">
        <Bar data={chartData} options={chartOptions} />
      </div>
      <div className="mt-4 flex justify-center space-x-4">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
          <span className="text-sm">≥ 90% (Excellent)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
          <span className="text-sm">75-89% (Good)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
          <span className="text-sm">≤ 74% (Needs Improvement)</span>
        </div>
      </div>
    </div>
  );
};

export default SubjectWiseAnalysis;