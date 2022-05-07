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
import axios from 'axios';
import { PieChart } from './PieChart';

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

 

   

const [data, setData] = useState({
    "labels":[],
    datasets: [
      {
        label: 'Airports',
        data: [],
        backgroundColor: [
          "#ffbb11",
          "#ecf0f1",
          "#50AF95",
          "#f3ba2f",
          "#2a71d0"
        ],
      }
    ],
  });



const getdataCall = () => {
    let labels = [];
    let data = [];
    axios.get(`https://airportswebapi.azurewebsites.net/api/ExistingCondition/overall/Greater%20Than/0`)
    .then((res) => {
        res.data.forEach(obj=>{            
         labels.push(obj.name);
         data.push(obj.y);
        })
        setData({
            labels:labels,
            datasets: [
              {
                label: 'Airports',
                data: data,
                backgroundColor: [
                  "#ffbb11",
                  "#ecf0f1",
                  "#50AF95",
                  "#f3ba2f",
                  "#2a71d0"
                ],
              }
            ],
          })
    });
}


useEffect(() => {
    getdataCall();
  }, []);

      return (
        <React.Fragment>
            <div style={{"width":"1000px"}}>
        {data !== {} &&        
         <Bar
            data={data}
            options={{
            plugins: {
                title: {
                display: true,
                text: "All airports Weighted Average PCI for overall(2014)"
                },
                legend: {
                display: true,
                position: "bottom"
            }
            }
            }}
        />} 
        </div>
        <div style={{"width":"500px"}}>
        <PieChart/>
        </div>
        </React.Fragment>
      );
}

export default BarChart

