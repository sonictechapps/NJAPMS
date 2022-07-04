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
import { Bar } from 'react-chartjs-2';

const BarChart = ({ data, airportDataDetails, airtPortDetails, airportValue }) => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    Title,
    Legend
  );

  const getAirPortName = (key) => {
    for (let airport of airtPortDetails) {
      if (airport?.networkId === key) {
        return airport?.description
        break
      }
    }
    return 'Unknown'
  }

  const getPCIDetails = (key) => {
    for (let i = 0; i < airportDataDetails.keys.length; i++) {
      if (airportDataDetails.keys[i] === key) {
        return airportDataDetails.values[i].overall
        break
      }
    }
    return 'Unknown'
  }

  const footer = (tooltipItem, data) => {
    if (airportValue !== 'All') {
      return 'PCI: ' + tooltipItem.formattedValue;
    } else {
      return 'PCI: ' + getPCIDetails(tooltipItem.label);
    }

  };

  return (
    <React.Fragment>
      {data !== {} &&
        <Bar
          data={data}

          options={{
            ticks: {
              maxTicksLimit: 0
            },

            animations: {
              tension: {
                duration: 1000,
                easing: 'linear',
                from: 1,
                to: 0,
                loop: true
              }
            },
            scales: {
              y: {
                ticks: { color: 'white', beginAtZero: true }
              },
              x: {
                ticks: { color: 'white', beginAtZero: true }
              },
              xAxes: [{
                display: false,
                ticks: { color: 'green' },
                gridLines: {
                  display: false,
                  zeroLineColor: "transparent"
                }
              }],
              yAxes: [{
                display: false,
                gridLines: {
                  display: false,
                  zeroLineColor: "transparent"
                }
              }]
            },
            chartArea: {
              backgroundColor: 'green'
            },
            plugins: {
              title: {
                display: true,
                text: "All airports Weighted Average PCI for overall(2014)",
                color: 'white'
              },
              legend: {
                display: true,
                position: "bottom"
              },
              tooltip: {
                callbacks: {
                  title: function (tooltipItem, data) {
                    if (airportValue === 'All') {
                      return getAirPortName(tooltipItem[0]?.label);
                    } else {
                      return tooltipItem[0]?.label
                    }

                  },
                  label: footer,
                }
              }
            }

          }}
        />}
    </React.Fragment>
  )
}

export default BarChart