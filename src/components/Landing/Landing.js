import React, { useEffect, useRef, useState } from "react"
import axios from "axios"
import OptGroupSelect from "../../atomiccomponent/OptGroupSelect"
import OptionSelect from "../../atomiccomponent/OptionSelect"
import '../../css/landing.scss'
import Controls from "../controls/Controls"
import FullScreenControl from "../controls/FullScreenControl"
import ZoomSliderControl from "../controls/ZoomSiderControl"
import Layers from "../Layer/Layers"
import Map from "../Map/Map"
import ToggleButton from "../../atomiccomponent/ToggleButton"
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
    const [airportDataDetails, setAirportDataDetails] = useState()
    const [airportIndex, setAirportIndex] = useState(0)
    const [airportValue, setAirportValue] = useState()
    const [featureList, setFeatureList] = useState([])
    const [branchSelectedIndex, setBranchSelectedIndex] = useState(0)
    const [isAirportBranchAll, setAirportBranchAll] = useState({})
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
            const airportPciValues = Object.values(airportPCIDetails)
            setAirportDataDetails({
                keys: airportPciKeys,
                values: airportPciValues
            })
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
            setAirportBranchAll(res[1].data.response.body.branchlist.map(branch => {
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
            setAirportValue(res[1].data.response.body.airportlist[0].networkId)
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
        setBranchSelectedIndex(index)
    }

    const onAggregationChange = (index) => {
    }

    const onAssessmentYearChange = (rootIndex, index) => {
        setSelectedDefaultYear([rootIndex, index])
    }

    const onAirportValueChange = (index) => {
        const value = airtPortDetails[index].value
        setAirportValue(value)
        if (index === 0) {
            setBranchOption(isAirportBranchAll)
            setBranchSelectedIndex(0)
            return
        }
        setBranchSelectedIndex('')

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
        dropdoenDivRef.current.style.height = !toggleArrow ? '0px' : '40px'
        const map = document.getElementsByClassName('ol-map')[0]
        map.style.height = !toggleArrow ? '87vh' : '82vh'
    }

    const updateAirportDropDown = (value) => {
        airtPortDetails.length > 0 && airtPortDetails.some((val, index) => {
            if (val.value === value) {
                setAirportIndex(index)
            }
        })
    }


    const getFeatureList = (value, airportvalue) => {
        setFeatureList(value)
        setBranchOption(value?.map(branch => {
            return {
                ...branch,
                name: branch.properties.Branch_ID,
                value: branch.properties.Branch_ID
            }
        }))
        setBranchSelectedIndex('')
        setAirportValue(airportvalue)
    }
    const onBranchChange = (id) => {
        setBranchSelectedIndex(branchOption.findIndex(branch => branch.name === id))
    }

    const onBarChartClick = (value) => {
        setAirportValue(value)
    }

    return (
        <>
            <div className="dropdown-section" ref={dropdoenDivRef}>
                {
                    airtPortDetails.length > 0 && (
                        <div className="airport-div-inner">
                            <OptionSelect options={airtPortDetails} id={'select-airport-details'} onItemSelectedCallback={onAirportValueChange}
                                selectedIndex={airportIndex} selectText={'Select Airport'} appendText='Airport' />
                        </div>
                    )
                }
                {
                    optionsGroup.length > 0 && (
                        <div className="assessment-year-div-inner">
                            <OptGroupSelect options={optionsGroup} id={'select-year'} onItemSelectedCallback={onAssessmentYearChange}
                                selectedRootIndex={selectedDefaultYear[0]} selectedIndex={selectedDefaultYear[1]}
                                selectText={'Select Year'} appendText='Year' />
                        </div>
                    )
                }
                {
                    branchOption?.length > 0 && (
                        <div className="branch-div-inner">
                            <OptionSelect options={branchOption} id={'select-branch'} onItemSelectedCallback={onBranchDropDownChange}
                                selectedIndex={branchSelectedIndex} selectText={'Select Branch'} appendText='Branch' />
                        </div>
                    )
                }
                {
                    aggregationOption.length > 0 && (
                        <div className="aggregation-div-inner">
                            <OptionSelect options={aggregationOption} selectedIndex={airportValue !== 'All' ? '' : 0} id={'select-aggregation'} onItemSelectedCallback={onAggregationChange}
                                selectText={'Select Aggregation'} appendText='Aggregation' isDisabled={airportValue !== 'All'} />
                        </div>
                    )
                }
                <div className="toggle-div">
                    <ToggleButton toggleoptions={toggleOptions} onToggleValue={onToggleValue} />
                </div>

            </div>
            <div style={{ textAlign: 'right', display: 'inline', float: 'right' }} onClick={onArrowClick}>
                <img src='images/down_arow.png' className="down_arrow" />
            </div>
            <section className="landing" style={{ backgroundColor: 'black' }}>
                <div className="airport-layer">
                    <div className="airport-map">
                        <div style={{ position: 'relative', display: `${currentTab === 'map' ? 'block' : 'none'}` }}>
                            <Map zoom={zoom} legend={legend} airportFeatureList={airtPortFeatureDetails}
                                updateAirportDropDown1={updateAirportDropDown} airtPortDetailsMap={airtPortDetails} featureList={featureList}
                                airportValue={airportValue} getFeatureList={getFeatureList} branchSelectedIndex={branchSelectedIndex}
                                airportselectedIndex={airportIndex} onBranchChange={onBranchChange} branchOption= {branchOption}
                            >
                                <Layers>
                                </Layers>
                                <Controls>
                                    <FullScreenControl />
                                    <ZoomSliderControl />
                                </Controls>
                            </Map>
                        </div>
                        <div style={{ position: 'relative', display: `${currentTab === 'data' ? 'block' : 'none'}` }}>
                            {(optionsGroup.length > 0 && airportDataDetails?.keys?.length > 0) && <AirportChart selectedyear={selectedDefaultYear} optionsGroup={optionsGroup} airportDataDetails={airportDataDetails}
                                airtPortDetails={airtPortDetails} airportValue={airportValue} featureList={featureList} branchSelectedIndex={branchSelectedIndex} onBarChartIndexClick={onBarChartClick} />}
                        </div>
                    </div>
                </div>
            </section>
        </>

    )
}

export default Landing