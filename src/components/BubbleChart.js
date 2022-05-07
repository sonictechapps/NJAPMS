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

      const [data, setData] = useState( {
        datasets: [
          {
            label: 'Red dataset',
            data: [{x:10,r:10},{x:20,r:10},{x:30,r:10},{x:40,r:10},{x:50,r:10},{x:60,r:10},{x:70,r:10}],
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
        axios.get(`https://airportswebapi.azurewebsites.net/api/FutureCondition/graph/2017/NoFunding`)
        .then((res) => {
            res.data.categories.forEach((obj,index)=>{            
             //labels.push(obj.name);
            data.push({x:parseInt(obj),y:res.data.pcis[index],r:10});
            })
            console.log(data)
            setData(
              {
                datasets: [
                  {
                    label: 'Future Conditions Cost & PCI',
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
    <Bubble options={options_bubble} data={data} />
    </div>
    </React.Fragment>
  )
}

export default BubbleChart