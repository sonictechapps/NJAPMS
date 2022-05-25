import axios from "axios"
import React, { useEffect, useState } from "react"
import SwitchSelector from "react-switch-selector"
import OptGroupSelect from "../../atomiccomponent/OptGroupSelect"
import OptionSelect from "../../atomiccomponent/OptionSelect"
import '../../css/landing.scss'
import BarChart from "../BarChart"
import Controls from "../controls/Controls"
import FullScreenControl from "../controls/FullScreenControl"
import ZoomSliderControl from "../controls/ZoomSiderControl"
import Layers from "../Layer/Layers"
import Map from "../Map/Map"

const Landing = () => {
    const [currentTab, setCurrentTab] = useState("data")
    const [zoom, setZoom] = useState(9)
    const [airtPortDetails, setAirtPortDetails] = useState([])
    const [airtPortFeatureDetails, setAirtPortFeatureDetails] = useState([])
    const [optionsGroup, setOptionsGroup] = useState([])
    const [branchOption, setBranchOption] = useState([])
    const [aggregationOption, setAggregationOption] = useState([])
    const [legend, setLegend] = useState([])

    const getAllDetails = () => {
        axios.all([axios.get('https://services7.arcgis.com/N4ykIOFU2FfLoqPT/arcgis/rest/services/N87Prototype/FeatureServer/0/query?f=pgeojson&geometry=%7B%22spatialReference%22:%7B%22latestWkid%22:3857,%22wkid%22:102100%7D,%22xmin%22:-8766409.899970992,%22ymin%22:4383204.949986987,%22xmax%22:-8140237.764258992,%22ymax%22:5009377.085698988%7D&maxRecordCountFactor=3&outFields=*&outSR=102100&resultType=tile&returnExceededLimitFeatures=false&spatialRel=esriSpatialRelIntersects&where=1=1&geometryType=esriGeometryEnvelope&inSR=102100'),
        axios.get('http://localhost:3004/input'),
        axios.get('http://localhost:3004/input_pci')
    ]).then(axios.spread((...res) => {
        console.log('res-->', res)
        const assessmentYearList = res[1].data.response.body.assessmentyear
        optionsGroup.push({
            label: 'INSPECTED',
            options: []
        })
        optionsGroup.push({
            label: 'PREDICTED',
            options: []
        })
        for (let year of assessmentYearList) {
            console.log('year', year)
            if (year.isfuture === 'true') {
                optionsGroup[1].options.push({
                    value: year.year,
                    name: year.year
                })
            } else {
                optionsGroup[0].options.push({
                    value: year.year,
                    name: year.year
                })
            }
        }
        let featureList = []
        console.log('ddd1', res[0]?.data?.features.length, res[2].data.response.body.currentdetails.length)
        if (res[0]?.data?.features.length > 0 && res[2].data.response.body.currentdetails.length > 0) {
            console.log('hhhh111', res[2].data.response.body.currentdetails)
            res[0].data.features.map(feature => {
                let obj
                for(let current of res[2].data.response.body.currentdetails) {
                    let networkId = Object.keys(current)
                    if (networkId[0] === feature.properties.Network_ID) {
                        obj = {
                            ...feature,
                            apron: current[networkId[0]].apron,
                            overall: current[networkId[0]].overall,
                            runway: current[networkId[0]].runway,
                            taxiway: current[networkId[0]].taxiway,
                        }
                    }
                }
                return obj
            })
        }
        console.log('optionsGroup', featureList)
        setOptionsGroup(optionsGroup)
        setBranchOption(res[1].data.response.body.branchlist)
        setAirtPortDetails(res[1].data.response.body.airportlist)
        setAggregationOption(res[1].data.response.body.aggregationlist)
        setAirtPortFeatureDetails(featureList)
        setLegend(res[1].data.response.body.legend)
    }))
    }
    const options = [
        {
          label: "Map",
          value: "map",
          selectedBackgroundColor: "#E52A33",
          innerHeight: 50
        },
        {
          label: "Data",
          value: "data",
          selectedBackgroundColor: "#E52A33"
        }
      ];

    const initialSelectedIndex = options.findIndex(({ value }) => value === "data");

    useEffect(() => {
        getAllDetails()
    }, [])

    const onChange = newValue => {
        console.log(newValue);
        setCurrentTab(newValue);
      };

    return (
        <section className="landing">
            <div className="airport-layer">
                <div className="airport-div">
                    <div class="airport-options">   
                        <div className="airport-options-inner">
                            {console.log('optionsGroup11', optionsGroup)}
                            <select name="airport" id="airport" className="airport" >
                                {

                                    airtPortDetails.map(airport => (
                                        <option value={airport.networkId}>{airport.description}</option>
                                    ))

                                }
                            </select>
                        </div>
                    </div>
                </div>
                <div className="airport-map">
                    {console.log('ddd', optionsGroup.length)}
                    <div style={{height: '50px'}}>
                        {
                            optionsGroup.length > 0 && <OptGroupSelect optGroup={optionsGroup} id={'select-year'} defaultOption= {'Assessment Year'}/>
                        }
                    
                    <OptionSelect options={branchOption} id={'select-branch'} defaultOption= 'Branch'/>
                    <OptionSelect options={aggregationOption} id={'select-aggregation'} defaultOption= 'Aggregation'/>
                    <span className="switch-container">
                    <SwitchSelector
                        onChange={onChange}
                        options={options}
                        initialSelectedIndex={initialSelectedIndex}
                        backgroundColor={"#efefee"}
                        fontColor={"#3B3B3B"}
                        />
                    </span>
                    </div>
                    {currentTab ==='map' && 
                    <Map zoom={zoom} legend={legend} airportFeatureList={airtPortFeatureDetails}>
                        <Layers>
                        </Layers>
                        <Controls>
                            <FullScreenControl />
                            <ZoomSliderControl />
                        </Controls>
                    </Map>}
                    {currentTab ==='data' && 
                        <BarChart/>
                    }
                </div>
            </div>
        </section>
    )
}

export default Landing