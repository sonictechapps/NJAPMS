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
  

const setColorArray = (data) => {
    let backGrdounArr = []
    data.forEach(d => {
      let color
      console.log('d', d)
      if (d >= 0 && d <= 40) {
        color = 'red'
      } else if (d >= 41 && d <= 55) {
        color = 'orange'
      } else if (d >= 56 && d <= 70) {
        color = 'yellow'
      } else if (d >= 71 && d <= 85) {
        color = 'green'
      } else if (d >= 86 && d <= 100) {
        color = 'pink'
      }
      backGrdounArr.push(color)
    })
    return backGrdounArr
  }

const getdataCall = () => {
    let labels = [];
    let data = [];
    let backGroundColor = [];
    axios.get(`https://airportswebapi.azurewebsites.net/api/ExistingCondition/overall/Greater%20Than/0`)
    .then((res) => {
        res.data.forEach(obj=>{    
          console.log('obj', obj)        
         labels.push(obj.name);
         data.push(obj.y);
        })
        backGroundColor = setColorArray(data)
        console.log('backGroundColor', backGroundColor)
        setData({
            labels:labels,
            datasets: [
              {
                label: 'Airports',
                data: data,
                backgroundColor: backGroundColor
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
        <PieChart data={data}/>
        </div>
        </React.Fragment>
      );
}

export default BarChart

