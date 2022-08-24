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

const BarChart = ({ data, airportDataDetails, airtPortDetails, airportValue, onBarChartClick, chartType,
  selectedyear, years, branchValue, aggValue }) => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    Title,
    Legend
  )

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
        const a = aggValue.toLowerCase()
        return airportDataDetails.values[i][branchValue][a].pci
        break
      }
    }
    return 'Unknown'
  }

  const footer = (tooltipItem, data) => {
    if (airportValue !== 'All') {
      return `${chartType === 'pci' ? 'PCI: ' : 'Cost: '}` + tooltipItem.formattedValue;
    } else {
      return `${chartType === 'pci' ? 'PCI: ' : 'Cost: '}` + getPCIDetails(tooltipItem.label);
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
                ticks: { color: 'white', beginAtZero: true },
                title: {
                  display: true,
                  text: chartType === 'pci' ? 'P C I' : 'Cost',
                  color: 'white'
                }
              },
              x: {
                ticks: { color: 'white', beginAtZero: true },
                title: {
                  display: true,
                  text: airportValue !== 'All' ? 'Branch' : 'All Airports',
                  color: 'white'
                }
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
            maintainAspectRatio: false,
            onClick: (event, element) => {
              if (airportValue === 'All') {
                onBarChartClick(element[0].index)
              }

            },
            plugins: {
              title: {
                display: false,
                text: "All airports Weighted Average PCI for overall(2014)",
                color: 'white'
              },
              legend: {
                display: false,
                position: "bottom",
                labels: {
                  color: 'white',

                }
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
              },
              datalabels: {
                font: {
                  weight: 'bold'
                },
                color: 'white',
                display: function (context) {
                  return context.dataset.label !== 'Airports';
                }
              }

            }

          }}
        />}
    </React.Fragment>
  )
}

export default BarChart