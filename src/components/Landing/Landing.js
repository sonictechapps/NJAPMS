import React, { useState } from "react"
import OptGroupSelect from "../../atomiccomponent/OptGroupSelect"
import '../../css/landing.scss'
import Controls from "../controls/Controls"
import FullScreenControl from "../controls/FullScreenControl"
import ZoomSliderControl from "../controls/ZoomSiderControl"
import Layers from "../Layer/Layers"
import Map from "../Map/Map"

const Landing = () => {
    const [zoom, setZoom] = useState(15)
    const airtPortDetails = [
        {
            name: 'Central Jersey Regional Airport(47N)',
            value: '47N'
        },
        {
            name: 'Essex County Airport(CDW)',
            value: 'CDW'
        },
        {
            name: 'Greenwood Lake Airport(4N1)',
            value: '4N1'
        },
    ]
    const optionsGroup = [
        {
            label: 'INSPECTED',
            options: [{
                value: '2009',
                name: '2009'
            }, {
                value: '2012',
                name: '2012'
            }, {
                value: '2015',
                name: '2015'
            }, {
                value: '2018',
                name: '2018'
            }]
        },
        {
            label: 'INSPECTED',
            options: [{
                value: '2019',
                name: '2019'
            }, {
                value: '2020',
                name: '2020'
            }, {
                value: '2021',
                name: '2021'
            }, {
                value: '2022',
                name: '2022'
            }, {
                value: '2023',
                name: '2023'
            }, {
                value: '2024',
                name: '2024'
            }, {
                value: '2025',
                name: '2025'
            }, {
                value: '2026',
                name: '2026'
            }, {
                value: '2027',
                name: '2027'
            }, {
                value: '2028',
                name: '2028'
            }]
        }
    ]
    return (
        <section className="landing">
            <div className="container airport-layer">
                <div className="airport-div">
                    <div class="airport-options">
                        <div className="airport-options-inner">
                            <select name="airport" id="airport" className="airport" >
                                {

                                    airtPortDetails.map(airport => (
                                        <option value={airport.value}>{airport.name}</option>
                                    ))

                                }
                            </select>
                        </div>
                    </div>
                </div>
                <div className="airport-map">
                    <OptGroupSelect optGroup={optionsGroup} id={'select-year'} />
                    <Map zoom={zoom}>
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