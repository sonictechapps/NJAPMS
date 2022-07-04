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
import axios from 'axios';
import { PieChart } from './PieChart';
import BarChart from './BarChart';
import Card from '../atomiccomponent/Card';
import { getFeatureDetails } from '../util/commonUtils'

function AirportChart({ airportDataDetails, airtPortDetails, airportValue, featureList, branchSelectedIndex }) {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    Title,
    Tooltip,
    Legend
  )
  const [pciDetails, setPCIDetails] = useState({})

  const returnPCiDetailsonBranch = (res, feature, pcidetails) => {
    setPCIDetails({
      pcidetails: pcidetails,
      quantity: res,
      image: feature.Photo
    })
  }

  useEffect(() => {
    if (branchSelectedIndex !== '' && airportValue !== 'All' && featureList.length > 0) {
      getFeatureDetails(featureList[branchSelectedIndex].properties, returnPCiDetailsonBranch)
    } else {
      setPCIDetails([])
    }

  }, [branchSelectedIndex])

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
      if (d >= 0 && d <= 10) {
        color = '#000000'
      } else if (d >= 11 && d <= 25) {
        color = '#4D0A05'
      } else if (d >= 26 && d <= 40) {
        color = '#EA3223'
      } else if (d >= 41 && d <= 55) {
        color = '#CD70ED'
      } else if (d >= 56 && d <= 70) {
        color = '#FFFD54'
      } else if (d >= 71 && d <= 85) {
        color = '#75F94C'
      } else if (d >= 86 && d <= 100) {
        color = '#225313'
      }
      backGrdounArr.push(color)
    })
    return backGrdounArr
  }

  const getdataCall = () => {
    let labels = [];
    let data = [];
    let backGroundColor = [];
    if (airportValue === 'All') {
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
        })
    } else {
      featureList.length > 0 && featureList.map(feature => {
        labels.push(feature.properties.Branch_ID);
        data.push(feature.properties.Branch_PCI.toString());
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
    }

  }


  useEffect(() => {
    getdataCall();
  }, [airportValue, featureList]);



  return (
    <>
      <div className='airport-landing'>
        <div className='airport-chart-div'>
          <Card>
            <div style={{ backgroundColor: 'black', height: '450px', width: '100%' }}>
              <BarChart data={data} airportDataDetails={airportDataDetails}
                airtPortDetails={airtPortDetails} airportValue={airportValue} />
            </div>
          </Card>
          <Card>
            <div style={{ backgroundColor: 'black', height: '450px', width: '100%' }}>
              <PieChart data={data} airportValue={airportValue} />
            </div>
          </Card>
        </div>


        {/* <div className='airport-data-div'>
        <AirportDataTable selectedyear={selectedyear} optionsGroup={optionsGroup} airportDataDetails={airportDataDetails} />
      </div> */}
      </div>
      {
        pciDetails?.pcidetails?.length > 0 && pciDetails?.quantity?.length > 0 && (
          <div className='airport-landing'>
            <div className='airport-details-div'>
              <Card styles={{ flexBasis: '50%', marginTop: '1px' }}>
                <div className='pci-details-container'>
                  <div className='pci-details-container-inner'>
                    <div className="airport-princenton-header">{`Branch Details`}</div>
                    {
                      pciDetails.pcidetails.map((value, index) => (
                        <div className='branch-item-wrapper' >

                          <div>{value.name}</div>
                          <div>{value.value}</div>
                        </div>
                      ))
                    }


                  </div>
                </div>
              </Card>
              <Card styles={{ flexBasis: '50%', marginTop: '1px' }}>
                <div className='pci-details-container'>
                  <div className='pci-details-container-inner'>
                    <div className="airport-princenton-header">{`Extrapolated Distress Quantities`}</div>
                    <div className='branch-qty-header'>
                      <div>Distress</div>
                      <div>Severity</div>
                      <div>Quantity</div>
                      <div>Unit</div>
                    </div>
                    <div>
                    {
                      pciDetails.quantity.map((value) => (
                        <div className="branch-qty-details">
                          <div>{value.attributes.DISTRESS}</div>
                          <div>{value.attributes.DISTRESS_SEVERITY}</div>
                          <div>{value.attributes.DISTRESS_QUANTITY}</div>
                          <div>{value.attributes.DISTRESS_UNITS}</div>
                        </div>
                      ))
                    }
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )
      }

    </>
  );
}

export default AirportChart

