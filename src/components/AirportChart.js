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
import { PieChart } from './PieChart';
import BarChart from './BarChart';
import Card from '../atomiccomponent/Card';
import { getFeatureDetails, getPCIColor } from '../util/commonUtils'
import { constantsDetails } from '../util/constants';

function AirportChart({ airportDataDetails, airtPortDetails, airportValue,
  featureList, branchSelectedIndex, onBarChartIndexClick, selectedyear, years,
  branchOption, aggregationOption, aggregationIndex }) {
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
  const [branchList, setBranchList] = useState([])
  const [costArray, setCostArray] = useState([])
  const returnPCiDetailsonBranch = (res, feature, pcidetails) => {
    setPCIDetails({
      pcidetails: pcidetails,
      quantity: res,
      image: feature.Photo
    })
  }

  useEffect(() => {
    if (branchSelectedIndex !== 0 && airportValue !== 'All' && featureList.length > 0) {
      getFeatureDetails(featureList[branchSelectedIndex-1].properties, returnPCiDetailsonBranch)
    } else {
      setPCIDetails([])
    }

  }, [branchSelectedIndex])

  const [data, setData] = useState({
    "labels": ['Failed', 'Failed', 'Very Good', 'Poor', 'Fair', 'Satisfactory', 'Good'],
    datasets: [
      {
        label: '',
        data: [],
        backgroundColor: [
          constantsDetails['0-10_pci'],
          constantsDetails['11-25_pci'],
          constantsDetails['26-40_pci'],
          constantsDetails['41-55_pci'],
          constantsDetails['56-70_pci'],
          constantsDetails['71-85_pci'],
          constantsDetails['86-100_pci']
        ],
      }
    ],
  });
  const [costdata, setCostData] = useState({
    "labels": ['Failed', 'Failed', 'Very Good', 'Poor', 'Fair', 'Satisfactory', 'Good'],
    datasets: [
      {
        label: '',
        data: [],
        backgroundColor: [
          constantsDetails['0-10_pci'],
          constantsDetails['11-25_pci'],
          constantsDetails['26-40_pci'],
          constantsDetails['41-55_pci'],
          constantsDetails['56-70_pci'],
          constantsDetails['71-85_pci'],
          constantsDetails['86-100_pci']
        ],
      }
    ],
  });

  const setColorArray = (data) => {
    let backGrdounArr = []
    data.forEach(d => {
      let color
      if (d >= 0 && d <= 10) {
        color = constantsDetails['0-10_pci']
      } else if (d >= 11 && d <= 25) {
        color = constantsDetails['11-25_pci']
      } else if (d >= 26 && d <= 40) {
        color = constantsDetails['26-40_pci']
      } else if (d >= 41 && d <= 55) {
        color = constantsDetails['41-55_pci']
      } else if (d >= 56 && d <= 70) {
        color = constantsDetails['56-70_pci']
      } else if (d >= 71 && d <= 85) {
        color = constantsDetails['71-85_pci']
      } else if (d >= 86 && d <= 100) {
        color = constantsDetails['86-100_pci']
      }
      backGrdounArr.push(color)
    })
    return backGrdounArr
  }

  const setSelectedColorArray = (data, labels) => {
    let backGrdounArr = []
    data.forEach((d, index) => {
      let color
      if (branchOption[branchSelectedIndex].name !== labels[index]) {
        color = '#71797E'
      } else {
        if (d >= 0 && d <= 10) {
          color = constantsDetails['0-10_pci']
        } else if (d >= 11 && d <= 25) {
          color = constantsDetails['11-25_pci']
        } else if (d >= 26 && d <= 40) {
          color = constantsDetails['26-40_pci']
        } else if (d >= 41 && d <= 55) {
          color = constantsDetails['41-55_pci']
        } else if (d >= 56 && d <= 70) {
          color = constantsDetails['56-70_pci']
        } else if (d >= 71 && d <= 85) {
          color = constantsDetails['71-85_pci']
        } else if (d >= 86 && d <= 100) {
          color = constantsDetails['86-100_pci']
        }
      }

      backGrdounArr.push(color)
    })
    return backGrdounArr
  }

  const setSelectedCostColorArray = (data, labels) => {
    let backGrdounArr = []
    data.forEach((d, index) => {
      let color
      if (branchOption[branchSelectedIndex].name !== labels[index]) {
        color = '#71797E'
      } else {
        color = '#000080'
      }

      backGrdounArr.push(color)
    })
    return backGrdounArr
  }

  const getdataCall = () => {
    let labels = [];
    let data = [];
    let costData = []
    let backGroundColor = [];
    if (airportValue === 'All') {
      featureList.forEach(obj => {
        labels.push(obj.properties.Network_ID);
        data.push(obj[branchOption[branchSelectedIndex]?.value]?.pci)
        costData.push(obj[branchOption[branchSelectedIndex]?.value]?.cost)
      })
      setCostArray(costData)
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
      if (selectedyear[0] === 1) {
        setCostData({
          labels: labels,
          backgroundColor: 'red',
          datasets: [
            {
              label: 'Airports',
              data: costData,
              backgroundColor: branchSelectedIndex === 0 ? costData.map(cost => '#000080') : setSelectedCostColorArray(costData, labels)
            }
          ],
        })
      }
    } else {
      const filterFeatureList = featureList.filter((item,index) => {
        const i = featureList.findIndex((a)=> a.properties.Branch_ID === item.properties.Branch_ID)
        return i === index
    })
    filterFeatureList.length > 0 && filterFeatureList.map(feature => {
        labels.push(feature.properties?.Branch_ID);
        data.push(feature.properties?.Branch_PCI?.toString());
        costData.push(feature.properties?.Branch_COST?.toString() || '0')
      })
      setCostArray(costData)
      if (branchSelectedIndex === 0) {
        backGroundColor = setColorArray(data)
      } else {
        backGroundColor = setSelectedColorArray(data, labels)
      }

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
      if (selectedyear[0] === 1) {
        setCostData({
          labels: labels,
          backgroundColor: 'red',
          datasets: [
            {
              label: 'Airports',
              data: costData,
              backgroundColor: branchSelectedIndex === 0 ? costData.map(cost => '#000080') : setSelectedCostColorArray(costData, labels)
            }
          ],
        })
      }

    }

  }


  useEffect(() => {
    getdataCall()
  }, [featureList,branchSelectedIndex])

  const onBarChartClick = (index) => {
    onBarChartIndexClick(data.labels[index])
  }

  return (
    <>
      <div className='airport-details-holder'>
        <div className='airport-landing'>
          <div className='airport-chart-div'>
            <Card>
              <BarChart data={data} airportDataDetails={airportDataDetails} onBarChartClick={onBarChartClick}
                airtPortDetails={airtPortDetails} airportValue={airportValue} chartType='pci'
                selectedyear={selectedyear} years={years} branchValue={branchOption[branchSelectedIndex]?.value}
                aggValue={aggregationOption[aggregationIndex].value}
              />
            </Card>
            {
              (airportValue === 'All' || (airportValue !== 'All' && branchSelectedIndex === 0)) &&
              <Card>
                <PieChart data={data} airportValue={airportValue} />
              </Card>
            }

          </div>
        </div>
        {
          (selectedyear[0] === 1) && (
            <div className='airport-landing airport-landing-cost'>
              <div className='airport-chart-div'>
                <Card>
                  <BarChart data={costdata} airportDataDetails={airportDataDetails} onBarChartClick={onBarChartClick}
                    airtPortDetails={airtPortDetails} airportValue={airportValue} chartType='cost' 
                    aggValue={aggregationOption[aggregationIndex].value} branchValue={branchOption[branchSelectedIndex]?.value} />
                </Card>
                {
                  data?.datasets[0]?.data?.length > 0 && costdata?.datasets[0]?.data?.length > 0 && branchSelectedIndex !== 0 && (
                    <Card>
                      <div className='pci-details-container'>
                        <div className='pci-details-container-inner'>
                          <div className="airport-princenton-header">{`Yearwise PCI and Cost`}</div>
                          <div className='branch-qty-header'>
                            <div>Year</div>
                            <div>Branch</div>
                            <div>PCI</div>
                            <div>Cost</div>
                          </div>
                          <div style={{ height: '74%', overflowY: 'auto' }}>
                            <div className="branch-qty-details-cost">
                              <div>{years[selectedyear[0]].options[selectedyear[1]].value}</div>
                              <div>{branchOption[branchSelectedIndex]?.name}</div>
                              <div>{data?.datasets[0]?.data[branchSelectedIndex-1]}</div>
                              <div>{costdata?.datasets[0]?.data[branchSelectedIndex-1]}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )
                }


              </div>
            </div>
          )
        }
        {
          pciDetails?.pcidetails?.length > 0 && pciDetails?.quantity?.length > 0 && selectedyear[0] === 0 &&
          branchSelectedIndex !== 0 && (
            <div className='airport-landing'>
              <div className='airport-chart-desc-div'>
                <Card styles={{ marginRight: '30px' }}>
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
                <Card>
                  <div className='pci-details-container'>
                    <div className='pci-details-container-inner'>
                      <div className="airport-princenton-header">{`Extrapolated Distress Quantities`}</div>
                      <div className='branch-qty-header'>
                        <div>Distress</div>
                        <div>Severity</div>
                        <div>Quantity</div>
                        <div>Unit</div>
                      </div>
                      <div style={{ height: '74%', overflowY: 'auto' }}>
                        {
                          pciDetails.quantity.map((value) => (
                            <div className="branch-qty-details">
                              <div>{value.attributes.DISTRESS_MECHANISM}</div>
                              <div>{value.attributes.DISTRESS_SEVERITY}</div>
                              <div>{Math.round(parseFloat(value.attributes.DISTRESS_QUANTITY))}</div>
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

      </div>
    </>
  )
}

export default AirportChart

