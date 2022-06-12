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

const BarChart = ({data}) => {
    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        PointElement,
        Title,
        Tooltip,
        Legend
    );

    return (
        <React.Fragment>
             {data !== {} &&
          <Bar
            data={data}
            options={{
              responsive: true,
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
                xAxes: [{
                  display: false,
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
                backgroundColor: 'rgba(251, 85, 85, 0.4)'
              },
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
        </React.Fragment>
    )
}

export default BarChart