import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom';
import '../../css/basemapportal.scss'


const BaseMapPortal = ({ showModal, onBaseMapchange }) => {

    const [showBaseMapModal, setShowBasemapModal] = useState(showModal)

    useEffect(() => {
        setShowBasemapModal(showModal)
    }, [showModal])

    const baseMapArr = [
        {
            name: 'Streets',
            value: 'ArcGIS:Streets',
            image: 'images/streetmap.png'
        },
        {
            name: 'Navigation',
            value: 'ArcGIS:Navigation',
            image: 'images/navigation.png'
        },
        {
            name: 'Topographic',
            value: 'ArcGIS:Topographic',
            image: 'images/topographic.png'
        },
        {
            name: 'Light Gray',
            value: 'ArcGIS:LightGray',
            image: 'images/lightgray.png'
        },
        {
            name: 'Dark gray',
            value: 'ArcGIS:DarkGray',
            image: 'images/darkgray.png'
        },
        {
            name: 'Streets Relief',
            value: 'ArcGIS:StreetsRelief',
            image: 'images/streetrelief.png'
        },
        {
            name: 'Imagery',
            value: 'ArcGIS:Imagery:Standard',
            image: 'images/imagery.png'
        },
        {
            name: 'ChartedTerritory',
            value: 'ArcGIS:ChartedTerritory',
            image: 'images/charterdterritory.png'
        },
        {
            name: 'ColoredPencil',
            value: 'ArcGIS:ColoredPencil',
            image: 'images/coloredpencil.png'
        },
        {
            name: 'Nova',
            value: 'ArcGIS:Nova',
            image: 'images/nova.png'
        },
        {
            name: 'Midcentury',
            value: 'ArcGIS:Midcentury',
            image: 'images/midcentury.png'
        },
        {
            name: 'OSM',
            value: 'OSM:Standard',
            image: 'images/standard.png'
        },
        {
            name: 'OSM:Streets',
            value: 'OSM:Streets',
            image: 'images/osmstreet.png'
        },
    ]

    const onBaseMapClck = (value) => {
        setShowBasemapModal(false)
        onBaseMapchange(value)
    }

    const onCloseClick = () => {
        setShowBasemapModal(false)
        onBaseMapchange()
    }

    return ReactDOM.createPortal(
        <>
            <div className={`transparent-portal-div ${showBaseMapModal ? 'modal-show' : 'modal-hide'}`}></div>
            <div className={`basemap-portal ${showBaseMapModal ? 'modal-show-basemap' : 'modal-hide'}`}>
                <div style={{ width: 'fit-content' }}>
                    <img src='images/close.png' alt='close' className='close' onClick={onCloseClick} />
                    <div className='basemap-inner-div'>
                        {
                            baseMapArr.map(base => (
                                <div onClick={() => onBaseMapClck(base.value)} className='basemap-outer-div'>
                                    <img src={base.image} style={{ height: '100%', width: '100%' }} />
                                    <div className='basemap-mapname-div'><span>{base.name}</span></div>
                                </div>
                            ))
                        }

                    </div>
                </div>

            </div>
        </>, document.getElementById('modal-basemap-portal')
    )
}

export default BaseMapPortal