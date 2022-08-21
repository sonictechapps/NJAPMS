import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { constantsDetails } from '../util/constants';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels)



export function PieChart({ data, chartType }) {
  const counts = {};
  if (data !== undefined && data.datasets !== undefined && data.datasets[0].backgroundColor !== undefined && data.datasets[0].backgroundColor.length > 0) {
    if (data.datasets[0].backgroundColor.length > 0) {
      for (const num of data.datasets[0].backgroundColor) {
        counts[num] = counts[num] ? counts[num] + 1 : 1;
      }
    }
  }

  const data1 = {
    labels: ['Failed', 'Failed', 'Very Good', 'Poor', 'Fair', 'Satisfactory', 'Good'],
    datasets: [
      {
        label: '# of Votes',
        data: [counts[constantsDetails['0-10_pci']], counts[constantsDetails['11-25_pci']], counts[constantsDetails['26-40_pci']], counts[constantsDetails['41-55_pci']], counts[constantsDetails['56-70_pci']], counts[constantsDetails['71-85_pci']], counts[constantsDetails['86-100_pci']],
        counts['#71797E']],
        backgroundColor: [
          constantsDetails['0-10_pci'],
          constantsDetails['11-25_pci'],
          constantsDetails['26-40_pci'],
          constantsDetails['41-55_pci'],
          constantsDetails['56-70_pci'],
          constantsDetails['71-85_pci'],
          constantsDetails['86-100_pci'],
          '#71797E'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 0,
      },
    ],
  };
  return <Pie data={data1} options={{
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
        position: "bottom",
        labels: {
          color: 'white'
        }
      },
      tooltip: {
        enabled: false
      },
      datalabels: {
        font: {
          weight: 'bold',
          size: '18px'
        },
        color: (context) => {
          const c = context.dataset.backgroundColor[context.dataIndex]
          if (c === '#000000' || c === '#4D0A05' || c === '#EA3223') {
            return 'white'
          } else {
            return 'black'
          }
        },
        display: function (context) {
          return context.dataset.label !== 'Airports';
        },
        formatter: (value, context) => {
          let datasets = context.dataset.data;
          let sum = 0;
          datasets.map(dataset => {
            let d = dataset || 0
            sum += d
          });
          const a = Math.round((value / sum) * 100)
          let percentage = a + '%'
          if (!isNaN(a))
            return percentage
        }
      }
    }
  }} />;
}
