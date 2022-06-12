import React, { useEffect, useRef, useState } from "react"
import axios from "axios"
import SwitchSelector from "react-switch-selector"
import OptGroupSelect from "../../atomiccomponent/OptGroupSelect"
import OptionSelect from "../../atomiccomponent/OptionSelect"
import '../../css/landing.scss'
import Controls from "../controls/Controls"
import FullScreenControl from "../controls/FullScreenControl"
import ZoomSliderControl from "../controls/ZoomSiderControl"
import Layers from "../Layer/Layers"
import Map from "../Map/Map"
import ToggleButton from "../../atomiccomponent/ToggleButton"
import BubbleChart from "../BubbleChart"
import AirportChart from "../AirportChart"

const Landing = () => {
    const dropdoenDivRef = useRef()
    const [currentTab, setCurrentTab] = useState("map")
    const [zoom, setZoom] = useState(8.3)
    const [airtPortDetails, setAirtPortDetails] = useState([])
    const [airtPortFeatureDetails, setAirtPortFeatureDetails] = useState([])
    let [optionsGroup, setOptionsGroup] = useState([])
    const [branchOption, setBranchOption] = useState([])
    const [aggregationOption, setAggregationOption] = useState([])
    const [legend, setLegend] = useState([])
    const [selectedDefaultYear, setSelectedDefaultYear] = useState([])
    const [toggleArrow, setToggleArrow] = useState(false)
    const getAllDetails = () => {
        axios.all([axios.get('https://services7.arcgis.com/N4ykIOFU2FfLoqPT/arcgis/rest/services/N87Prototype/FeatureServer/0/query?f=pgeojson&geometry=%7B%22spatialReference%22:%7B%22latestWkid%22:3857,%22wkid%22:102100%7D,%22xmin%22:-8766409.899970992,%22ymin%22:4383204.949986987,%22xmax%22:-8140237.764258992,%22ymax%22:5009377.085698988%7D&maxRecordCountFactor=3&outFields=*&outSR=102100&resultType=tile&returnExceededLimitFeatures=false&spatialRel=esriSpatialRelIntersects&where=1=1&geometryType=esriGeometryEnvelope&inSR=102100'),
        axios.get('http://localhost:3004/input'),
        axios.get('http://localhost:3004/input_pci')
        ]).then(axios.spread((...res) => {
            optionsGroup = []
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
            const airportPCIDetails = res[2].data.response.body.currentdetails
            const airportPciKeys = Object.keys(airportPCIDetails)
            let newFeature
            if (res[0]?.data?.features.length > 0 && airportPciKeys.length > 0) {
                newFeature = res[0].data.features.map(feature => {
                    let obj
                    for (let key of airportPciKeys) {

                        if (key === feature.properties.Network_ID) {
                            obj = {
                                ...feature,
                                apron: airportPCIDetails[key].apron,
                                overall: airportPCIDetails[key].overall,
                                runway: airportPCIDetails[key].runway,
                                taxiway: airportPCIDetails[key].taxiway,
                            }
                            break
                        }
                    }
                    return obj
                })
            }
            setOptionsGroup(optionsGroup)
            setSelectedDefaultYear(getCurrentAssessmentYear())
            setBranchOption(res[1].data.response.body.branchlist.map(branch => {
                return {
                    ...branch,
                    name: branch.description
                }
            }))
            setAirtPortDetails(res[1].data.response.body.airportlist.map(airport => {
                return {
                    ...airport,
                    value: airport.networkId,
                    name: airport.description
                }
            }))
            setAggregationOption(res[1].data.response.body.aggregationlist.map(aggregation => {
                return {
                    ...aggregation,
                    name: aggregation.description
                }
            }))
            setAirtPortFeatureDetails(newFeature)
            setLegend(res[1].data.response.body.legend)
        }))
    }

    useEffect(() => {
        getAllDetails()
    }, [])

    const onBranchDropDownChange = (index) => {
    }

    const onAggregationChange = (index) => {
    }

    const onAssessmentYearChange = (rootIndex, index) => {
        setSelectedDefaultYear([rootIndex, index])
    }

    const onAirportValueChange = (index) => {

    }

    const getCurrentAssessmentYear = () => {
        const date = new Date()
        const year = date.getFullYear()
        for (let i = 0; i < optionsGroup.length; i++) {
            let j = optionsGroup[i].options.findIndex(opt => {
                return opt.value === year.toString()
            })
            if (j !== -1) {
                return [i, j]
            }
        }
    }
    const toggleOptions = [{
        name: 'Map',
        value: 'map'
    }, {
        name: 'Data',
        value: 'data'
    }]

    const onToggleValue = (value) => {
        setCurrentTab(value)
    }

    const onArrowClick = () => {
        setToggleArrow(!toggleArrow)
        console.log('fff', dropdoenDivRef.current)
        dropdoenDivRef.current.style.height = !toggleArrow ? '0px': '40px'
    }

    return (
        <>

            <div className="dropdown-section" ref={dropdoenDivRef}>

                {
                    airtPortDetails.length > 0 && (
                        <div className="airport-div-inner">
                            <OptionSelect options={airtPortDetails} id={'select-airport-details'} onItemSelectedCallback={onAirportValueChange}
                                selectedIndex={0} />
                        </div>
                    )
                }
                {
                    optionsGroup.length > 0 && (
                        <div className="assessment-year-div-inner">
                            <OptGroupSelect options={optionsGroup} id={'select-year'} onItemSelectedCallback={onAssessmentYearChange}
                                selectedRootIndex={selectedDefaultYear[0]} selectedIndex={selectedDefaultYear[1]} />
                        </div>
                    )
                }
                {
                    branchOption.length > 0 && (
                        <div className="branch-div-inner">
                            <OptionSelect options={branchOption} id={'select-branch'} onItemSelectedCallback={onBranchDropDownChange}
                                selectedIndex={0} />
                        </div>
                    )
                }
                {
                    aggregationOption.length > 0 && (
                        <div className="aggregation-div-inner">
                            <OptionSelect options={aggregationOption} selectedIndex={0} id={'select-aggregation'} onItemSelectedCallback={onAggregationChange} />
                        </div>
                    )
                }
                <div className="toggle-div">
                    <ToggleButton toggleoptions={toggleOptions} onToggleValue={onToggleValue} />
                </div>

            </div>
            <div style={{textAlign: 'center'}} onClick={onArrowClick}>
                <img src='images/down_arow.png' className="down_arrow" />
            </div>
            <section className="landing">
                <div className="airport-layer">

                    <div className="airport-map">


                        <div style={{ position: 'relative', display: `${currentTab === 'map' ? 'block' : 'none'}` }}>
                            <Map zoom={zoom} legend={legend} airportFeatureList={airtPortFeatureDetails}>
                                <Layers>
                                </Layers>
                                <Controls>
                                    <FullScreenControl />
                                    <ZoomSliderControl />
                                </Controls>
                            </Map>
                        </div>



                        <div style={{ position: 'relative', top: '-58px', display: `${currentTab === 'data' ? 'block' : 'none'}` }}>
                            <AirportChart />
                        </div>

                    </div>
                </div>
            </section>
        </>

    )
}

export default Landing