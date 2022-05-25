import axios from "axios"
import React, { useEffect, useState } from "react"
import OptGroupSelect from "../../atomiccomponent/OptGroupSelect"
import OptionSelect from "../../atomiccomponent/OptionSelect"
import '../../css/landing.scss'
import Controls from "../controls/Controls"
import FullScreenControl from "../controls/FullScreenControl"
import ZoomSliderControl from "../controls/ZoomSiderControl"
import Layers from "../Layer/Layers"
import Map from "../Map/Map"

const Landing = () => {
    const [zoom, setZoom] = useState(9)
    const [airtPortDetails, setAirtPortDetails] = useState([])
    const [airtPortFeatureDetails, setAirtPortFeatureDetails] = useState([])
    let [optionsGroup, setOptionsGroup] = useState([])
    const [branchOption, setBranchOption] = useState([])
    const [aggregationOption, setAggregationOption] = useState([])
    const [legend, setLegend] = useState([])
    const [selectedDefaultYear, setSelectedDefaultYear] = useState([])

    const getAllDetails = () => {
        axios.all([axios.get('https://services7.arcgis.com/N4ykIOFU2FfLoqPT/arcgis/rest/services/N87Prototype/FeatureServer/0/query?f=pgeojson&geometry=%7B%22spatialReference%22:%7B%22latestWkid%22:3857,%22wkid%22:102100%7D,%22xmin%22:-8766409.899970992,%22ymin%22:4383204.949986987,%22xmax%22:-8140237.764258992,%22ymax%22:5009377.085698988%7D&maxRecordCountFactor=3&outFields=*&outSR=102100&resultType=tile&returnExceededLimitFeatures=false&spatialRel=esriSpatialRelIntersects&where=1=1&geometryType=esriGeometryEnvelope&inSR=102100'),
        axios.get('http://localhost:3004/input'),
        axios.get('http://localhost:3004/input_pci')
        ]).then(axios.spread((...res) => {
            console.log('res-->', res)
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
            const airportPCIDetails = res[2].data.response.body.currentdetails
            const airportPciKeys = Object.keys(airportPCIDetails)
            console.log('ddd1', res[0]?.data?.features.length, airportPciKeys.length)
            let newFeature
            if (res[0]?.data?.features.length > 0 && airportPciKeys.length > 0) {
                console.log('hhhh111', airportPCIDetails)
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
            console.log('optionsGroup', newFeature)
            setOptionsGroup(optionsGroup)
            setSelectedDefaultYear(getCurrentAssessmentYear())
            setBranchOption(res[1].data.response.body.branchlist.map(branch => {
                return {
                    ...branch,
                    name: branch.description
                }
            }))
            setAirtPortDetails(res[1].data.response.body.airportlist)
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
        console.log('index-->', index)
    }

    const onAggregationChange = (index) => {
        console.log('index1-->', index)
    }

    const onAssessmentYearChange = (rootIndex, index) => {
        console.log('index1-->', index, rootIndex)
        setSelectedDefaultYear([rootIndex, index])
    }

    const getCurrentAssessmentYear = () => {
        const date = new Date()
        const year = date.getFullYear()
        for (let i = 0; i < optionsGroup.length; i++) {
            // console.log('options', options)
            let j = optionsGroup[i].options.findIndex(opt => {
                console.log('opt', opt)
                return opt.value === year.toString()
            })
            if (j !== -1) {
                return [i, j]
            }
            console.log('999911', i, j)
        }
    }

    return (
        <section className="landing">
            <div className="container airport-layer">
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
                    <div style={{ height: '50px' }}>
                        {
                            optionsGroup.length > 0 && <OptGroupSelect options={optionsGroup} id={'select-year'} onItemSelectedCallback={onAssessmentYearChange}
                                selectedRootIndex={selectedDefaultYear[0]} selectedIndex={selectedDefaultYear[1]} />
                        }
                        {
                            branchOption.length > 0 && <OptionSelect options={branchOption} selectedIndex={0} onItemSelectedCallback={onBranchDropDownChange} id='select-branch'
                            />
                        }
                        {
                            aggregationOption.length > 0 && <OptionSelect options={aggregationOption} selectedIndex={0} id={'select-aggregation'} onItemSelectedCallback={onAggregationChange} />
                        }

                        {/* <OptionSelect options={branchOption} id={'select-branch'} defaultOption='Branch' /> */}

                    </div>
                    <Map zoom={zoom} legend={legend} airportFeatureList={airtPortFeatureDetails}>
                        <Layers>
                        </Layers>
                        <Controls>
                            <FullScreenControl />
                            <ZoomSliderControl />
                        </Controls>
                    </Map>
                </div>
            </div>
        </section>
    )
}

export default Landing