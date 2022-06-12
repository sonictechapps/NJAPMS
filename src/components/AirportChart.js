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
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { PieChart } from './PieChart';
import BarChart from './BarChart';

function AirportChart() {
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
    "labels": [],
    backgroundColor: '#c54964',
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

  const [response, setResponse]= useState({})

  const getdataCall = () => {
    let labels = [];
    let data = [];
    let backGroundColor = [];
    axios.get(`https://airportswebapi.azurewebsites.net/api/ExistingCondition/overall/Greater%20Than/0`)
      .then((res) => {
        res.data.forEach(obj => {
          labels.push(obj.name);
          data.push(obj.y);
        })

        backGroundColor = setColorArray(data)
        setData({
          labels: labels,
          backgroundColor: 'red',
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

  var GradientBgPlugin = {
    beforeDraw: function (chart, args, options) {
      const ctx = chart.ctx;
      const canvas = chart.canvas;
      const chartArea = chart.chartArea;

      // Chart background
      var gradientBack = canvas.getContext("2d").createLinearGradient(0, 250, 0, 0);
      gradientBack.addColorStop(0, "rgba(213,235,248,1)");
      gradientBack.addColorStop(0.16, "rgba(213,235,248,1)");
      gradientBack.addColorStop(0.17, "rgba(226,245,234,1)");
      gradientBack.addColorStop(0.25, "rgba(226,245,234,1)");
      gradientBack.addColorStop(0.26, "rgba(252,244,219,1)");
      gradientBack.addColorStop(0.5, "rgba(252,244,219,1)");
      gradientBack.addColorStop(0.51, "rgba(251,221,221,1)");
      gradientBack.addColorStop(1, "rgba(251,221,221,1)");

      ctx.fillStyle = gradientBack;
      ctx.fillRect(chartArea.left, chartArea.bottom,
        chartArea.right - chartArea.left, chartArea.top - chartArea.bottom);
    }
  };

  const plugin = {
    id: 'custom_canvas_background_color',
    beforeDraw: (chart) => {
      const ctx = chart.canvas.getContext('2d');
      ctx.save();
      ctx.globalCompositeOperation = 'destination-over';
      ctx.fillStyle = 'lightGreen';
      ctx.fillRect(0, 0, chart.width, chart.height);
      ctx.restore();
    }
  };

  return (
    <div className='airport-chart-div'>
      <div style={{backgroundColor: 'black'}}>
       <BarChart data={data} />
      </div>
      <div style={{backgroundColor: 'black'}}>
        <PieChart data={data} />
      </div>
    </div>
  );
}

export default AirportChart

