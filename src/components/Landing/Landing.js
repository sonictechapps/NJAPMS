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
import { getPCIColor } from "../../util/commonUtils"

const Landing = () => {
    const dropdoenDivRef = useRef()
    const [currentTab, setCurrentTab] = useState("map")
    const [zoom, setZoom] = useState(8.3)
    const [airtPortDetails, setAirtPortDetails] = useState([])
    const [airtPortFeatureDetails, setAirtPortFeatureDetails] = useState([])
    let [optionsGroup, setOptionsGroup] = useState([])
    const [branchOption, setBranchOption] = useState()
    const [aggregationOption, setAggregationOption] = useState([])
    const [legend, setLegend] = useState([])
    const [selectedDefaultYear, setSelectedDefaultYear] = useState([])
    const [toggleArrow, setToggleArrow] = useState(false)
    const [airportDataDetails, setAirportDataDetails] = useState()
    const [airportIndex, setAirportIndex] = useState(0)
    const [airportValue, setAirportValue] = useState()
    const [featureList, setFeatureList] = useState([])
    const [branchSelectedIndex, setBranchSelectedIndex] = useState(0)
    const [aggregationIndex, setAggregationIndex] = useState(0)
    const [isAirportBranchAll, setAirportBranchAll] = useState({

    })
    const [aggregationDetails, setAggregationDetails] = useState({})
    const [response, setResponse] = useState()

    const getAggregationDetails = () => {
        if (selectedDefaultYear[0] === 1)
            axios.get(`http://ec2-34-224-86-31.compute-1.amazonaws.com:9001/api/get-airportsummary-details/${airportValue}/${optionsGroup[selectedDefaultYear[0]].options[selectedDefaultYear[1]].value}`).then(res => {
                setAggregationDetails(res.data.response.body.airportdetails)
            })
    }

    const getAllDetails = () => {
        axios.all([axios.get('https://services7.arcgis.com/N4ykIOFU2FfLoqPT/arcgis/rest/services/N87Prototype/FeatureServer/0/query?f=pgeojson&geometry=%7B%22spatialReference%22:%7B%22latestWkid%22:3857,%22wkid%22:102100%7D,%22xmin%22:-8766409.899970992,%22ymin%22:4383204.949986987,%22xmax%22:-8140237.764258992,%22ymax%22:5009377.085698988%7D&maxRecordCountFactor=3&outFields=*&outSR=102100&resultType=tile&returnExceededLimitFeatures=false&spatialRel=esriSpatialRelIntersects&where=1=1&geometryType=esriGeometryEnvelope&inSR=102100'),
        axios.get('http://ec2-34-224-86-31.compute-1.amazonaws.com:9001/api/get-input-details'),
        axios.get('http://localhost:3004/input_pci')
        ]).then(axios.spread((...res) => {
            setResponse(res[0]?.data?.features)
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
                if (year.isfuture) {
                    optionsGroup[1].options.push({
                        value: year.year,
                        name: year.year,
                        isFuture: true
                    })
                } else {
                    optionsGroup[0].options.push({
                        value: year.year,
                        name: year.year,
                        isFuture: false
                    })
                }
            }


            //setAirtPortFeatureDetails(res[0]?.data?.features)
            setOptionsGroup(optionsGroup)
            setSelectedDefaultYear(getCurrentAssessmentYear())

            setBranchOption(
                res[1].data.response.body.branchlist.map(branch => {
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
            const value = [{
                "id": "0",
                "description": "All Airports",
                "networkId": "All",
                value: "All",
                name: "All Airports"
            }
                , ...res[1].data.response.body.airportlist.map(airport => {
                    return {
                        ...airport,
                        value: airport.networkId,
                        name: airport.description
                    }
                })]
            setAirtPortDetails(value)
            // setAggregationDetails(res[3].data.response.body.airportdetails[res[1].data.response.body.airportlist[0].networkId])
            setAggregationOption(res[1].data.response.body.aggregationlist.map(aggregation => {
                return {
                    ...aggregation,
                    name: aggregation.description
                }
            }))
            //setAirtPortFeatureDetails(res[0]?.data?.features)
            setLegend(res[1].data.response.body.legend)
            setAirportValue(value[0].networkId)
            getAirportPCIDetails(value[0].networkId, getCurrentAssessmentYear(), res[0]?.data?.features,
                res[1].data.response.body.aggregationlist[0])
            // if (res[1].data.response.body.airportlist[0].networkId === 'All') {

            // }
        }))
    }

    useEffect(() => {
        getAllDetails()
    }, [])

    const getPCIDeetailsOnAggregation = (airportPCIDetails, features, airportPciKeys, isFuture, aggregationValue) => {
        let newFeature
        if (features.length > 0) {
            console.log('features-->', features)
            newFeature = features.map(feature => {
                let obj
                for (let key of airportPciKeys) {
                    if (key === feature.properties.Network_ID) {
                        let agValue = aggregationValue.value
                        if (isFuture) {
                            obj = {
                                ...feature,
                                apron: airportPCIDetails[key]?.apron !== null ?
                                    airportPCIDetails[key]?.apron[agValue]?.pci : '',
                                overall: airportPCIDetails[key]?.overall !== null ?
                                    airportPCIDetails[key]?.overall[agValue]?.pci : '',
                                runway: airportPCIDetails[key]?.runway !== null ?
                                    airportPCIDetails[key]?.runway[agValue]?.pci : '',
                                taxiway: airportPCIDetails[key]?.taxiway !== null ?
                                    airportPCIDetails[key]?.taxiway[agValue]?.pci : '',
                            }
                        }

                        else {
                            obj = {
                                ...feature,
                                apron: airportPCIDetails[key]?.APRON !== null ?
                                    airportPCIDetails[key]?.APRON : '',
                                overall: airportPCIDetails[key]?.Overall !== null ?
                                    airportPCIDetails[key]?.Overall : '',
                                runway: airportPCIDetails[key]?.runway ?
                                    airportPCIDetails[key]?.runway : '',
                                taxiway: airportPCIDetails[key]?.taxiway ?
                                    airportPCIDetails[key]?.taxiway : '',
                            }
                        }
                        break
                    }
                }
                return obj
            })
            setAirtPortFeatureDetails(newFeature)
        }
    }

    const getAirportPCIDetails = (value, selectedYear, features, aggregationValue) => {
        if (airportIndex === 0) {
            let year = optionsGroup[selectedYear[0]].options[selectedYear[1]].value
            let isFuture = optionsGroup[selectedYear[0]].options[selectedYear[1]].isFuture ? 'Y' : 'N'
            axios.get(`http://ec2-34-224-86-31.compute-1.amazonaws.com:9001/api/get-pci-details/${year}/${isFuture}`).then(res => {
                const airportPCIDetails = isFuture === 'Y' ? res.data.response.body.futuredetails :
                    res.data.response.body.currentdetails
                const airportPciKeys = Object.keys(airportPCIDetails)
                const airportPciValues = Object.values(airportPCIDetails)
                setAirportDataDetails({
                    keys: airportPciKeys,
                    values: airportPciValues,
                    res: airportPCIDetails
                })
                getPCIDeetailsOnAggregation(airportPCIDetails, features, airportPciKeys, optionsGroup[selectedYear[0]].options[selectedYear[1]].isFuture, aggregationValue)
            })
        }
    }
    useEffect(() => {
        if (selectedDefaultYear.length > 0 && airportValue) {
            if (airportValue === 'All') {
                getAirportPCIDetails(airportValue, selectedDefaultYear, response, aggregationOption[aggregationIndex])
                setZoom(8.3)
            }
            else
                getAggregationDetails()
        }
       
    }, [JSON.stringify(selectedDefaultYear), airportValue])

    useEffect(() => {
        if (airportDataDetails)
            getPCIDeetailsOnAggregation(airportDataDetails.res, airtPortFeatureDetails, airportDataDetails.keys,
                optionsGroup[selectedDefaultYear[0]].options[selectedDefaultYear[1]].isFuture, aggregationOption[aggregationIndex])
    }, [aggregationIndex])

    const onBranchDropDownChange = (index) => {
        setBranchSelectedIndex(index)
    }

    const onAggregationChange = (index) => {
        setAggregationIndex(index)
    }

    const onAssessmentYearChange = (rootIndex, index) => {
        setSelectedDefaultYear([rootIndex, index])
    }

    const onAirportValueChange = (index) => {
        const value = airtPortDetails[index].value
        setAirportValue(value)
        setAirportIndex(index)
        if (index === 0) {
            setBranchOption(isAirportBranchAll)
            setBranchSelectedIndex(0)
            return
        }
        // setBranchSelectedIndex('')

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
        setBranchOption([{
            "id": "0",
            "name": "Overall",
            value: "Overall",
            description: "Overall"
        }, ...value?.map(branch => {
            return {
                ...branch,
                name: branch.properties.Branch_ID,
                value: branch.properties.Branch_ID
            }
        })])
        setBranchSelectedIndex(0)
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
                            <OptionSelect options={aggregationOption} selectedIndex={selectedDefaultYear[0] === 0 ? '' : 0} id={'select-aggregation'} onItemSelectedCallback={onAggregationChange}
                                selectText={'Select Aggregation'} appendText='Aggregation' isDisabled={selectedDefaultYear[0] === 0} />
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
                                    airportVal={airportValue} getFeatureList={getFeatureList} branchSelectedIndex={branchSelectedIndex}
                                    airportselectedIndex={airportIndex} onBranchChange={onBranchChange} branchOption={branchOption}
                                    years={optionsGroup} selectedDefaultYear={selectedDefaultYear} aggregationOption={aggregationOption}
                                    aggregationIndex={aggregationIndex} aggregationDetails={aggregationDetails}
                                >
                                    <Layers>
                                    </Layers>
                                    <Controls>
                                        <FullScreenControl />
                                        <ZoomSliderControl />
                                    </Controls>
                                </Map>

                            

                        </div>
                        <div style={{ position: 'relative', display: `${currentTab === 'data' ? 'block' : 'none'}`, minHeight: '70vh' }}>
                            {(optionsGroup.length > 0 && airportDataDetails?.keys?.length > 0 && selectedDefaultYear.length > 0 && airportValue &&
                                (airportValue === 'All' || (airportValue !== 'All' & Object.keys(aggregationDetails).length > 0))) && <AirportChart selectedyear={selectedDefaultYear} optionsGroup={optionsGroup} airportDataDetails={airportDataDetails}
                                    airtPortDetails={airtPortDetails} legend={legend} airportValue={airportValue} featureList={featureList} branchSelectedIndex={branchSelectedIndex} onBarChartIndexClick={onBarChartClick}
                                    aggregationDetails={aggregationDetails} years={optionsGroup} branchOption={branchOption}
                                    airtPortFeatureDetails={airtPortFeatureDetails} aggregationOption={aggregationOption}
                                    aggregationIndex={aggregationIndex} />}
                        </div>
                        {
                            currentTab === 'data' && (
                                <div className="pci-details pci-details-data">
                                    {
                                        legend.map(pci => (
                                            <div className="pci-item" style={{ backgroundColor: getPCIColor(pci).color }}>
                                                <p style={{ color: getPCIColor(pci).textColor }}>{pci.description}</p>
                                                <p style={{ color: getPCIColor(pci).textColor }}>{`(${pci.min}-${pci.max})`}</p>
                                            </div>
                                        ))
                                    }
                                </div>
                            )
                        }

                    </div>
                </div>
            </section>
        </>

    )
}

export default Landing