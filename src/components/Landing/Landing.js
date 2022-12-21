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
import { constantsDetails } from "../../util/constants"
import OptionEditSelect from "../../atomiccomponent/OptionEditSelect"

const Landing = ({ headerClick, onResetHeaderClick }) => {
    const dropdoenDivRef = useRef()
    const [currentTab, setCurrentTab] = useState("map")
    const [headerIconClick, setHeaderIconClick] = useState(headerClick)
    const [zoom, setZoom] = useState(8.3)
    const [airtPortDetails, setAirtPortDetails] = useState([])
    const [airtPortFeatureDetails, setAirtPortFeatureDetails] = useState([])
    let [optionsGroup, setOptionsGroup] = useState([])
    const [branchOption, setBranchOption] = useState()
    const [aggregationOption, setAggregationOption] = useState([])
    const [pciOption, setPciOption] = useState([{
        id: '0',
        name: '>',
        value: 'gt',
        filterValue: ''
    },
    {
        id: '1',
        name: '<',
        value: 'lt',
        filterValue: ''
    },
    {
        id: '2',
        name: '=',
        value: 'eq',
        filterValue: ''
    }])
    const [aggregationOptionAll, setAggregationOptionAll] = useState([])
    const [aggregationOptionAirport, setAggregationOptionAirport] = useState([])
    const [legend, setLegend] = useState([])
    const [selectedDefaultYear, setSelectedDefaultYear] = useState([])
    const [toggleArrow, setToggleArrow] = useState(false)
    const [airportDataDetails, setAirportDataDetails] = useState()
    const [airportIndex, setAirportIndex] = useState(0)
    const [airportValue, setAirportValue] = useState()
    const [featureList, setFeatureList] = useState([])
    const [featureListNew, setFeatureListNew] = useState()
    const [branchSelectedIndex, setBranchSelectedIndex] = useState(0)
    const [sectionSelectedIndex, setSectionSelectedIndex] = useState()
    const [aggregationIndex, setAggregationIndex] = useState(0)
    const [pciIndex, setPciIndex] = useState('')
    const [isAirportBranchAll, setAirportBranchAll] = useState({

    })
    const [aggregationDetails, setAggregationDetails] = useState({})
    const [response, setResponse] = useState()

    useEffect(() => {
        if (headerClick) {
            setAirportValue(airtPortDetails[0].networkId)
            setAirportIndex(0)
            setBranchSelectedIndex(0)
            setSelectedDefaultYear([0, (optionsGroup[0].options.length) - 1])
            setCurrentTab('map')
            setBranchOption(isAirportBranchAll)
            setAggregationOption(aggregationOptionAll)
            setAggregationIndex(0)
            // setHeaderIconClick(false)
            onResetHeaderClick(false)
        }
    }, [headerClick])

    const getAggregationDetails = () => {
        if (selectedDefaultYear[0] === 1) {
            axios.get(`${constantsDetails.BASE_URL}api/get-airportsummary-details/${airportValue}/${optionsGroup[selectedDefaultYear[0]].options[selectedDefaultYear[1]].value}`).then(res => {
                //setAirtPortFeatureDetails(res.data.response.body.airportdetails)
                getAirportAPICall(airportValue, res.data.response.body.airportdetails)
            })
        } else {
            getAirportAPICall(airportValue)
        }

    }

    const getAirportAPICall = (value, respose) => {
        axios.all([axios.get(`https://services7.arcgis.com/N4ykIOFU2FfLoqPT/ArcGIS/rest/services/N87Prototype/FeatureServer/1/query?outFields=*&spatialRel=esriSpatialRelIntersects&where=Network_ID=%27${value}%27&f=geojson`),
        axios.get(`https://services7.arcgis.com/N4ykIOFU2FfLoqPT/ArcGIS/rest/services/N87Prototype/FeatureServer/0/query?outFields=*&spatialRel=esriSpatialRelIntersects&where=Network_ID=%27${value}%27&f=geojson`)]
        ).then(axios.spread((...res) => {
            const ab = JSON.parse(JSON.stringify(res[0].data.features))
            updatefeatureList(res[0].data.features, value, respose)
            updateAirportDropDown(value)
        }))
    }

    const getBranchPCI = (branchid, branchpci, res) => {
        if (res) {
            const year = optionsGroup[selectedDefaultYear[0]].options[selectedDefaultYear[1]].value
            const branchList = res[airportValue][year]
            if (Object.keys(branchList).includes(branchid))
                return parseInt(branchList[branchid]?.noFunding?.pci)
            else {
                return 1000
            }
        }
        else
            return branchpci
    }

    const getBranchCost = (branchid, res) => {
        if (res) {
            const year = optionsGroup[selectedDefaultYear[0]].options[selectedDefaultYear[1]].value
            const aggVal = aggregationOption[aggregationIndex].value
            const branchList = res[airportValue][year]
            if (Object.keys(branchList).includes(branchid))
                return parseInt(branchList[branchid][aggVal]?.cost)
        }
    }

    const updatefeatureList = (res, val, response) => {
        const a = res.map((feature, i) => {
            feature.properties.Branch_PCI = getBranchPCI(feature.properties.Branch_ID, feature.properties.Branch_PCI, response)
            feature.properties.Branch_COST = getBranchCost(feature.properties.Branch_ID, response)
            feature.properties.index = i
            return feature
        })
        const c = a.filter(fet => fet.properties.Branch_PCI !== 1000)
        const b = JSON.parse(JSON.stringify(c))
        setFeatureList(b)
        const tempBranchArr = [{
            "id": "0",
            "name": "Overall",
            value: "Overall",
            description: "Overall"
        }, ...b?.map(branch => {
            return {
                ...branch,
                name: branch.properties.Branch_ID,
                value: branch.properties.Branch_ID
            }
        })]

        const filteredArr = tempBranchArr.filter((item, index) => {
            const i = tempBranchArr.findIndex((a) => a.value === item.value)
            return i === index
        })

        setBranchOption(filteredArr.map(item => {
            let section_arr = []
            for (let i of b) {
                if (i?.properties?.Branch_ID === item?.properties?.Branch_ID) {
                    section_arr.push({
                        ...i,
                        value: i.properties.Section_ID,
                        name: `Section - ${i.properties.Section_ID}`
                    })
                }
            }
            return {
                ...item,
                sec_arr: section_arr.length > 1 ? section_arr : []
            }
        }))
        // setBranchSelectedIndex(0)
    }

    const getAllDetails = () => {
        axios.all([axios.get('https://services7.arcgis.com/N4ykIOFU2FfLoqPT/arcgis/rest/services/N87Prototype/FeatureServer/0/query?f=pgeojson&geometry=%7B%22spatialReference%22:%7B%22latestWkid%22:3857,%22wkid%22:102100%7D,%22xmin%22:-8332517.97472933,%22ymin%22:4752380.45525098,%22xmax%22:-8256638.46259701,%22ymax%22:5031828.87352648%7D&maxRecordCountFactor=3&outFields=*&outSR=102100&resultType=tile&returnExceededLimitFeatures=false&spatialRel=esriSpatialRelIntersects&where=1=1&geometryType=esriGeometryEnvelope&inSR=102100'),
        axios.get(`${constantsDetails.BASE_URL}api/get-input-details`),
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
            setOptionsGroup(optionsGroup)
            setSelectedDefaultYear([0, (optionsGroup[0].options.length) - 1])
            setBranchOption([
                ...res[1].data.response.body.branchlist.map(branch => {
                    return {
                        ...branch,
                        name: branch.description
                    }
                })])
            setAirportBranchAll([
                ...res[1].data.response.body.branchlist.map(branch => {
                    return {
                        ...branch,
                        name: branch.description
                    }
                })])
            const airportSort = res[1].data.response.body.airportlist.sort(function (a, b) {
                let x = a.description.toLowerCase();
                let y = b.description.toLowerCase();
                if (x < y) { return -1; }
                if (x > y) { return 1; }
                return 0;
            })
            const value = [{
                "id": "0",
                "description": "All Airports",
                "networkId": "All",
                value: "All",
                name: "All Airports"
            }
                , ...airportSort.map(airport => {
                    return {
                        ...airport,
                        value: airport.networkId,
                        name: airport.description
                    }
                })]
            setAirtPortDetails(value)
            setAggregationOptionAll(res[1].data.response.body.aggregationlist.map(aggregation => {
                return {
                    ...aggregation,
                    name: aggregation.description
                }
            }))
            setAggregationOptionAirport(res[1].data.response.body.airportaggregationlist.map(aggregation => {
                return {
                    ...aggregation,
                    name: aggregation.description
                }
            }))
            setAggregationOption(res[1].data.response.body.aggregationlist.map(aggregation => {
                return {
                    ...aggregation,
                    name: aggregation.description
                }
            }))
            setLegend(res[1].data.response.body.legend)
            setAirportValue(value[0].networkId)
        }))
    }

    useEffect(() => {
        getAllDetails()
    }, [])

    const getPCIDetailsOnAggregation = (airportPciKeys, isFuture, airportPCIDetails) => {
        let newFeature
        let a = featureListNew || response
        if (a.length > 0) {
            newFeature = a.map(feature => {
                let obj
                for (let key of airportPciKeys) {
                    if (key === feature.properties.Network_ID) {
                        let agValue = aggregationOption[aggregationIndex].value.toLowerCase()
                        if (isFuture === 'Y') {
                            obj = {
                                ...feature,
                                apron: {
                                    pci: airportPCIDetails[key]?.apron !== null ?
                                        airportPCIDetails[key]?.apron[agValue]?.pci : '',
                                    cost: airportPCIDetails[key]?.apron !== null ?
                                        airportPCIDetails[key]?.apron[agValue]?.cost : ''
                                },
                                overall: {
                                    pci: airportPCIDetails[key]?.overall !== null ?
                                        airportPCIDetails[key]?.overall[agValue]?.pci : '',
                                    cost: airportPCIDetails[key]?.overall !== null ?
                                        airportPCIDetails[key]?.overall[agValue]?.cost : ''
                                },
                                runway: {
                                    pci: airportPCIDetails[key]?.runway !== null ?
                                        airportPCIDetails[key]?.runway[agValue]?.pci : '',
                                    cost: airportPCIDetails[key]?.runway !== null ?
                                        airportPCIDetails[key]?.runway[agValue]?.cost : ''
                                }
                                ,
                                taxiway: {
                                    pci: airportPCIDetails[key]?.taxiway !== null ?
                                        airportPCIDetails[key]?.taxiway[agValue]?.pci : '',
                                    cost: airportPCIDetails[key]?.taxiway !== null ?
                                        airportPCIDetails[key]?.taxiway[agValue]?.cost : ''
                                },

                            }
                        }

                        else {
                            obj = {
                                ...feature,
                                apron: {
                                    pci: airportPCIDetails[key]?.APRON !== null ?
                                        airportPCIDetails[key]?.APRON : ''
                                },
                                overall: {
                                    pci: airportPCIDetails[key]?.Overall !== null ?
                                        airportPCIDetails[key]?.Overall : ''
                                },
                                runway: {
                                    pci: airportPCIDetails[key]?.RW ?
                                        airportPCIDetails[key]?.RW : ''
                                },
                                taxiway: {
                                    pci: airportPCIDetails[key]?.TW ?
                                        airportPCIDetails[key]?.TW : ''
                                },
                            }
                        }
                        break
                    }
                }
                return obj
            })
            if (pciOption.every(item => item.filterValue === '')) {
                setFeatureList(newFeature)
            } else {
                setFeatureList(newFeature.filter((feature) => {

                    if (pciOption[0].filterValue !== '') {
                        return parseInt(pciOption[0].filterValue) < parseInt(feature[branchOption[branchSelectedIndex].value].pci)
                    }
                    if (pciOption[1].filterValue !== '') {
                        return parseInt(pciOption[1].filterValue) > parseInt(feature[branchOption[branchSelectedIndex].value].pci)
                    }
                    if (pciOption[2].filterValue !== '') {
                        return parseInt(pciOption[2].filterValue) === parseInt(feature[branchOption[branchSelectedIndex].value].pci)
                    }
                }))
            }
            // onPCIFilter(pciOption)
            //setFeatureList(newFeature)
            setFeatureListNew(newFeature)
        }
    }

    const getAirportPCIDetails = () => {
        if (airportIndex === 0) {
            let year = optionsGroup[selectedDefaultYear[0]].options[selectedDefaultYear[1]].value
            let isFuture = optionsGroup[selectedDefaultYear[0]].options[selectedDefaultYear[1]].isFuture ? 'Y' : 'N'
            axios.get(`${constantsDetails.BASE_URL}api/get-pci-details/${year}/${isFuture}`).then(res => {
                const airportPCIDetails = isFuture === 'Y' ? res.data.response.body.futuredetails :
                    res.data.response.body.currentdetails
                const airportPciKeys = Object.keys(airportPCIDetails)
                const airportPciValues = Object.values(airportPCIDetails)
                setAirportDataDetails({
                    keys: airportPciKeys,
                    values: airportPciValues
                })
                getPCIDetailsOnAggregation(airportPciKeys, isFuture, airportPCIDetails)
            })
        }
    }
    useEffect(() => {
        setFeatureList([])
        if (selectedDefaultYear.length > 0 && airportValue) {
            if (airportValue === 'All' && response?.length > 0) {
                getAirportPCIDetails()
            }
            else
                getAggregationDetails()
        }

    }, [JSON.stringify(selectedDefaultYear), airportValue, aggregationIndex, branchSelectedIndex])

    const onBranchDropDownChange = (index) => {
        setBranchSelectedIndex(index)
    }

    const onItemSectionSelectedCallback = (index) => {
        setSectionSelectedIndex(index)
    }

    const onAggregationChange = (index) => {
        setAggregationIndex(index)
    }

    const onAssessmentYearChange = (rootIndex, index) => {
        setPciOption([{
            id: '0',
            name: '>',
            value: 'gt',
            filterValue: ''
        },
        {
            id: '1',
            name: '<',
            value: 'lt',
            filterValue: ''
        },
        {
            id: '2',
            name: '=',
            value: 'eq',
            filterValue: ''
        }])
        setSelectedDefaultYear([rootIndex, index])
        setAggregationIndex(0)
        if (airportValue === 'All') {
            if (rootIndex === 0) {
                setBranchOption(isAirportBranchAll)
            } else {
                setBranchOption([isAirportBranchAll[0]])
                setBranchSelectedIndex(0)
            }
        }

        // if (rootIndex === 0) {
        //     setAggregationIndex('')
        // } else {
        //     setAggregationIndex(0)
        // }
    }

    const onAirportValueChange = (index) => {
        const value = airtPortDetails[index].value
        setAirportValue(value)
        setAirportIndex(index)
        setBranchSelectedIndex(0)

        if (index === 0) {
            setBranchOption(isAirportBranchAll)
            setBranchSelectedIndex(0)
            setAggregationOption(aggregationOptionAll)
            setPciOption([{
                id: '0',
                name: '>',
                value: 'gt',
                filterValue: ''
            },
            {
                id: '1',
                name: '<',
                value: 'lt',
                filterValue: ''
            },
            {
                id: '2',
                name: '=',
                value: 'eq',
                filterValue: ''
            }])
        } else {
            setPciOption(pciOption.map((item, index) => {
                return {
                    ...item,
                    filterValue: ''
                }
            }))
            setAggregationOption(aggregationOptionAirport)
        }
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
                setAirportValue(value)
            }
        })
    }

    const onBarChartClick = (value) => {
        setAirportValue(value)
        setAggregationOption(aggregationOptionAirport)
        setAggregationIndex(0)
    }

    const updateBranchId = (branchID, branchOption) => {
        setBranchOption(branchOption)
        const index = branchOption.findIndex(branch => {
            return branch.value === branchID
        })
        setBranchSelectedIndex(index)
        setSectionSelectedIndex(undefined)
    }

    const onPCIFilter = (pciOptions) => {
        setPciOption(pciOption.map((item, index) => {
            return {
                ...item,
                filterValue: pciOptions[index]
            }
        }))
        if (pciOptions.every(item => item === '')) {
            setFeatureList(featureListNew)
        } else {
            setFeatureList(featureListNew.filter((feature) => {
                if (pciOptions[0] !== '') {
                    return parseInt(pciOptions[0]) < parseInt(feature[branchOption[branchSelectedIndex].value]?.pci)
                }
                if (pciOptions[1] !== '') {
                    return parseInt(pciOptions[1]) > parseInt(feature[branchOption[branchSelectedIndex].value]?.pci)
                }
                if (pciOptions[2] !== '') {
                    return parseInt(pciOptions[2]) === parseInt(feature[branchOption[branchSelectedIndex].value]?.pci)
                }
            }))
        }
    }

    const onLegendFilterClick = (pcimin, pcimax) => {
        if (airportValue === 'All')
            setFeatureList(featureListNew.filter((feature) => {
                return parseInt(feature[branchOption[branchSelectedIndex].value]?.pci) >= parseInt(pcimin) && parseInt(feature[branchOption[branchSelectedIndex].value]?.pci) <= parseInt(pcimax)
            }))
    }

    return (
        <>
            <div className="dropdown-section" ref={dropdoenDivRef}>
                {
                    airtPortDetails.length > 0 && (
                        <div className="airport-div-inner">
                            <OptionSelect options={airtPortDetails} id={'select-airport-details'} onItemSelectedCallback={onAirportValueChange}
                                selectedIndex={airportIndex} selectText={'Select Airport'} />
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
                            onItemSectionSelectedCallback = {onItemSectionSelectedCallback}
                                selectedIndex={branchSelectedIndex} selectText={'Select Branch'} appendText='Branch' />
                        </div>
                    )
                }
                {
                    aggregationOption.length > 0 && (
                        <div className="aggregation-div-inner">
                            <OptionSelect options={aggregationOption} selectedIndex={aggregationIndex} id={'select-aggregation'} onItemSelectedCallback={onAggregationChange}
                                selectText={'Select Aggregation'} isDisabled={selectedDefaultYear[0] === 0} />
                        </div>
                    )
                }
                {
                    pciOption.length > 0 && (
                        <div className="pci-div-inner">
                            <OptionEditSelect options={pciOption} selectedIndex={pciIndex} id={'select-pci'} onItemSelectedCallback={onPCIFilter}
                                selectText={'PCI Filter'} appendText='PCI Filter' isDisabled={airportValue !== 'All'} airportValue={airportValue}
                                selectedDefaultYear={selectedDefaultYear} />
                        </div>
                    )
                }
                <div className="toggle-div">
                    <ToggleButton toggleoptions={toggleOptions} onToggleValue={onToggleValue} />
                </div>

            </div>
            <div style={{ textAlign: 'right', display: 'inline', float: 'right', visibility: 'hidden' }} onClick={onArrowClick}>
                <img src='images/down_arow.png' className="down_arrow" />
            </div>
            <section className="landing" style={{ backgroundColor: 'black' }}>
                <div className="airport-layer">
                    <div className="airport-map">
                        <div style={{ position: 'relative', display: `${currentTab === 'map' ? 'block' : 'none'}` }}>
                            {branchOption &&
                                <Map zoom={zoom} legend={legend} featureList={featureList} headerClick={headerClick}
                                    airportValue={airportValue} branchSelectedIndex={branchSelectedIndex} sectionSelectedIndex = {sectionSelectedIndex}
                                    airportselectedIndex={airportIndex} branchOption={branchOption} airtPortDetails={airtPortDetails}
                                    years={optionsGroup} selectedDefaultYear={selectedDefaultYear} aggregationOption={aggregationOption}
                                    aggregationIndex={aggregationIndex} updateBranchId={updateBranchId} updateAirportDropDown={updateAirportDropDown}
                                    onLegendFilterClick={onLegendFilterClick}
                                >
                                    <Layers>
                                    </Layers>
                                    <Controls>
                                        <FullScreenControl />
                                        <ZoomSliderControl />
                                    </Controls>
                                </Map>
                            }


                        </div>
                        <div style={{ position: 'relative', display: `${currentTab === 'data' ? 'block' : 'none'}`, minHeight: '70vh' }}>
                            {airportValue && <AirportChart selectedyear={selectedDefaultYear} optionsGroup={optionsGroup} airportDataDetails={airportDataDetails}
                                airtPortDetails={airtPortDetails} airportValue={airportValue} featureList={featureList} branchSelectedIndex={branchSelectedIndex} onBarChartIndexClick={onBarChartClick}
                                aggregationDetails={aggregationDetails} years={optionsGroup} branchOption={branchOption}
                                airtPortFeatureDetails={airtPortFeatureDetails} aggregationOption={aggregationOption} sectionSelectedIndex = {sectionSelectedIndex}
                                aggregationIndex={aggregationIndex} />}
                        </div>
                        {
                            currentTab === 'data' && (
                                <div className="pci-details pci-details-data">
                                    {
                                        legend.map(pci => (
                                            <div className="pci-item" style={{ backgroundColor: getPCIColor(pci).color }} onClick={() => onLegendFilterClick(pci.min, pci.max)}>
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