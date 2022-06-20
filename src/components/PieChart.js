import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);





export function PieChart({data}) {
  const counts = {};
  if(data!==undefined && data.datasets!==undefined && data.datasets[0].backgroundColor!==undefined && data.datasets[0].backgroundColor.length>0){
    if(data.datasets[0].backgroundColor.length>0){
      for (const num of data.datasets[0].backgroundColor) {
        counts[num] = counts[num] ? counts[num] + 1 : 1;
      }
    }
  }
  
  const data1 = {
    labels: ['Red', 'orange', 'Yellow', 'Green', 'pink'],
    datasets: [
      {
        label: '# of Votes',
        data: [counts['Red'], counts['orange'], counts['yellow'], counts['green'], counts['pink']],
        backgroundColor: [
          'red',
          'orange',
          'yellow',
          'green',
          'pink'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };
  return <Pie data={data1}  options={{responsive: true, maintainAspectRatio: false}} />;
}
