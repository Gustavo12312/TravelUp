import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import 'sweetalert2/src/sweetalert2.scss';
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";  // Import Bar chart from react-chartjs-2
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const baseUrl = "http://localhost:3000";  // Your backend URL

const ManagerChart = () => {
  const [dataProject, setDataProject] = useState([]);  // State to hold the project data

  // Fetch project data when the component is mounted
  useEffect(() => {
    LoadProject();
  }, []);

  // Function to fetch request data from API
  const LoadProject = () => {
    const url = baseUrl + '/project/list';
    axios
      .get(url)  // Replace with your auth header
      .then((res) => {
        if (res.data.success) {
          setDataProject(res.data.data);  // Update state with fetched data
        } else {
          alert("Error fetching data");
        }
      })
      .catch((error) => {
        alert("Error: " + error.message);
      });
  };

  // Prepare chart data
  const chartData = {
    labels: dataProject.map((project) => project.name),  // Project names for X-axis
    datasets: [
      {
        label: "Total Cost(€)",
        data: dataProject.map((project) => project.totalCost),  // Total cost for each project
        backgroundColor: "rgba(75, 192, 192, 0.6)",  // Color for Total Cost bars
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
      },
      {
        label: "Budget(€)",
        data: dataProject.map((project) => project.budget),  // Budget for each project
        backgroundColor: "rgba(255, 99, 132, 0.6)",  // Color for Budget bars
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 2,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: "Projects",  // Label for the X-axis
        },
      },
      y: {
        title: {
          display: true,
          text: "Amount (€)",  // Label for the Y-axis
        },
        beginAtZero: true,  // Start Y-axis at 0
      },
    },
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Budget vs Total Cost</h1>
      </div>
      {/* Render the bar chart */}
      <div
        style={{
          width: '100%',
          height: '100%'
        }}
      >
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default ManagerChart;
