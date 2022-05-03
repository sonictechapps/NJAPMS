import React from 'react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
  } from 'chart.js';
import { useState, useEffect } from "react"
import { Bar, Bubble } from 'react-chartjs-2';

function BarChart() {
    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        PointElement,
        Title,
        Tooltip,
        Legend
      );

    const [chartData, setChartData] = useState({})

    
      
const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

 const data = {
  labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: [10, 5, 2, 7 , 4],
      backgroundColor: [
        "#ffbb11",
        "#ecf0f1",
        "#50AF95",
        "#f3ba2f",
        "#2a71d0"
      ],
    }
  ],
};




      return (
        <React.Fragment>
         <Bar
            data={data}
            options={{
            plugins: {
                title: {
                display: true,
                text: "Cryptocurrency prices"
                },
                legend: {
                display: true,
                position: "bottom"
            }
            }
            }}
        />
        </React.Fragment>
      );
}

export default BarChart

