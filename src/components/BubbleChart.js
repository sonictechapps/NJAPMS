import axios from 'axios';
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
import React, { useEffect, useState } from 'react';
import { Bubble } from 'react-chartjs-2';



function BubbleChart() {

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,

    Tooltip,
    Legend
  );
  const [xaXisLabel, SetXAxislabel] = useState([])
  const options_bubble = {
    scales: {
      y: {
        beginAtZero: true
      },
      x: {
        beginAtZero: true,

        ticks: {
          beginAtZero: true,
        stepSize: 10,
          callback: function (value, index, ticks) {
            return xaXisLabel[index];
          }
        }
      },
    },
    plugins: {
      legend: {
        display: false
      }
    },
    tooltips: {
      callbacks: {
        label: function (tooltipItem) {
          return tooltipItem.yLabel;
        }
      }
    }
  };

  // const data_bubble = {
  //     datasets: [
  //       {
  //         label: 'Red dataset',
  //         data: [{x:10,y:16,r:10},{x:20,y:13,r:10},{x:30,y:7,r:10},{x:40,y:9,r:10},{x:50,y:10,r:10},{x:60,y:11,r:10},{x:70,y:5,r:10}],
  //         backgroundColor: [
  //             "#ffbb11",
  //             "#ecf0f1",
  //             "#50AF95",
  //             "#f3ba2f",
  //             "#2a71d0"
  //           ],
  //       }
  //     ],
  //   };

  const [data, setData] = useState({
    datasets: [
      {
        label: 'Red dataset',
        data: [{ x: 10, r: 10 }, { x: 20, r: 10 }, { x: 30, r: 10 }, { x: 40, r: 10 }, { x: 50, r: 10 }, { x: 60, r: 10 }, { x: 70, r: 10 }],

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
    axios.get(`https://airportswebapi.azurewebsites.net/api/FutureCondition/graph/2017/NoFunding`)
      .then((res) => {
        SetXAxislabel(['',...res.data.categories])
        let xx = []
        const dataSet = [{ data: [], backgroundColor: 'red' }, { data: [], backgroundColor: 'orange' },
        { data: [], backgroundColor: 'yellow' }, { data: [], backgroundColor: 'green' }, { data: [], backgroundColor: 'pink' }]
        let a = 0
        res.data.pcis.forEach(pci => {
          a = a + 10
          if (pci >= 0 && pci <= 40) {
            dataSet[0].data.push({ x: a, y: pci, r: 10 })
          } else if (pci >= 41 && pci <= 55) {
            dataSet[1].data.push({ x: a, y: pci, r: 10 })
          } else if (pci >= 56 && pci <= 70) {
            dataSet[2].data.push({ x: a, y: pci, r: 10 })
          } else if (pci >= 71 && pci <= 85) {
            dataSet[3].data.push({ x: a, y: pci, r: 10 })
          } else if (pci >= 86 && pci <= 100) {
            dataSet[4].data.push({ x: a, y: pci, r: 10 })
          }
          
        })
        console.log('dataSet', dataSet)
        setData(
          {
            datasets: dataSet,
          })
      });
  }


  useEffect(() => {
    getdataCall();
  }, []);


  return (
    <React.Fragment>
      <div style={{ "width": "1000px" }}>
        <Bubble options={options_bubble} data={data} />
      </div>
    </React.Fragment>
  )
}

export default BubbleChart