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
import React from 'react';
import {  Bubble } from 'react-chartjs-2';



function BubbleChart() {

    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        PointElement,
        Title,
        Tooltip,
        Legend
      );

      const options_bubble = {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      };
    
    const data_bubble = {
        datasets: [
          {
            label: 'Red dataset',
            data: [{x:10,y:16,r:10},{x:20,y:13,r:10},{x:30,y:7,r:10},{x:40,y:9,r:10},{x:50,y:10,r:10},{x:60,y:11,r:10},{x:70,y:5,r:10}],
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

    <Bubble options={options_bubble} data={data_bubble} />
    </React.Fragment>
  )
}

export default BubbleChart