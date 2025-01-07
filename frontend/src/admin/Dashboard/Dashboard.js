import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { Bar } from 'react-chartjs-2'; // Import Bar chart from react-chartjs-2
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'; 
import './Dashboard.css';
import Sidebar from '../Sidebar/Sidebar';

// Register necessary chart components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const Dashboard = () => {
  // Data for the bar chart
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'], // X-axis labels
    datasets: [
      {
        label: 'Sales (in Rs.)',
        data: [300, 500, 700, 800, 600, 900], // Y-axis data for each month
        backgroundColor: 'rgba(75, 192, 192, 0.2)', // Bar color
        borderColor: 'rgba(75, 192, 192, 1)', // Border color
        borderWidth: 1, // Border width
      },
    ],
  };

  // Options for the chart (can be customized)
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Sales Performance (Monthly)',
      },
    },
  };

  return (
    <div>
      <Sidebar/>

    
    <div className="dashboard">
      <h2>Welcome to the Dashboard</h2>
      {/* Bar Chart Display 
      <div className="bar-chart">
        <h3>Sales Performance</h3>
        <Bar data={data} options={options} />
      </div>*/}
    </div>
    </div>
  );
};

export default Dashboard;
