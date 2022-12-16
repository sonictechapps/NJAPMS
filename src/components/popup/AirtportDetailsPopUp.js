import React, { useEffect, useRef, useState } from 'react'
import ImageThumbnailPortal from '../portals/ImageThumbnailPortal'

const AirtportDetailsPopUp = ({ pciDetails, airportName, airtPortDetails }) => {
    const [airportDetails, setAirportDetails] = useState(true)
    const [imageDetails, setImageDetails] = useState(false)
    const [airportDetailsList, setAirportDetailsList] = useState(true)
    const [aiPort, setAiPort] = useState()
    const branchDetailsRef = useRef()
    const brancImagesRef = useRef()
    const [showModal, setShowModal] = useState(false)
    useEffect(() => {
        if (branchDetailsRef?.current) {
            branchDetailsRef.current.style.display = 'flex'
        }
        if (brancImagesRef?.current) {
            brancImagesRef.current.style.display = 'none'
        }
    }, [])

    useEffect(() => {
        const airtport = airtPortDetails?.find(airport => airport.value === airportName)
        setAiPort(airtport)
    }, [airportName])

    useEffect(() => {
        setAirportDetails(true)
        setImageDetails(false)
    }, [pciDetails.branchid])

    const onDetailsClick = (e) => {
        setAirportDetails(true)
        setImageDetails(false)
        branchDetailsRef.current.style.display = 'flex'
        brancImagesRef.current.style.display = 'none'
    }

    const onImagesClick = (e) => {
        setAirportDetails(false)
        setImageDetails(true)
        branchDetailsRef.current.style.display = 'none'
        brancImagesRef.current.style.display = 'block'
    }

    const onRightArrowClick = () => {
        setAirportDetailsList(false)
    }

    const onLeftArrowClick = () => {
        setAirportDetailsList(true)
    }

    const getDetailsStyle = () => {
        if (airportDetails) {
            return {
                cursor: 'pointer',
                backgroundColor: 'yellow',
                color: 'black'
            }
        } else {
            return {
                cursor: 'pointer',
                backgroundColor: '#404040',
                color: 'white'
            }
        }
    }

    const getImageStyle = () => {

        if (imageDetails) {
            return {
                cursor: 'pointer',
                backgroundColor: 'yellow',
                color: 'black'
            }
        } else {
            return {
                cursor: 'pointer',
                backgroundColor: '#404040',
                color: 'white'
            }
        }
    }

    const onModalCloseClick = () => {
        setShowModal(false)
    }


    return (
        <>
            <div className="airport-princenton" style={{ height: pciDetails?.pcidetails?.length > 0 ? '60%' : '100px' }}>
                {
                    airportName && (
                        <>
                            <div className="airport-princenton-header">
                                <p className='name'>{aiPort?.name}</p>
                                <p className='county'>County: {aiPort?.county}</p>
                                {
                                    aiPort?.website && aiPort?.website !== 'NA' && (
                                        <a className='website' href={aiPort?.website} target="_blank">{aiPort?.website}</a>
                                    )
                                }
                            </div>
                            {
                                pciDetails?.pcidetails?.length > 0 && (
                                    <>
                                        <div className='airport-details-tab'>
                                            <div onClick={(e) => onDetailsClick(e)} style={getDetailsStyle()}>Branch Details</div>
                                            <div onClick={(e) => onImagesClick(e)} style={getImageStyle()}>Image</div>
                                        </div>
                                        <div className="airport-princenton-branch-header">
                                            {
                                                !imageDetails && (
                                                    <>
                                                        <img src='images/right_arrow.png' className="right_arrow" onClick={onRightArrowClick}
                                                            style={{ display: airportDetailsList ? 'block' : 'none' }} />
                                                        <img src='images/left_arrow.png' className="left_arrow" onClick={onLeftArrowClick}
                                                            style={{ display: !airportDetailsList ? 'block' : 'none' }} />
                                                    </>
                                                )
                                            }

                                            <p>{`Branch- ${pciDetails.branchid}, Section- ${pciDetails.section}`}</p></div>
                                        <div className='branch-image-div-holder'>
                                            <div className='branch-all-wrapper' ref={branchDetailsRef}>
                                                <div className='branch-details' style={{ flexBasis: airportDetailsList ? '100%' : '0%' }}>
                                                    {/* <div className="airport-princenton-distress-header">{`Branch Details`}</div> */}

                                                    {
                                                        
                                                        pciDetails.pcidetails.filter(value => {
                                                            return value.name !== 'Branch ID' && value.name !== 'Section ID'
                                                        }).map((value, index) => (
                                                            <div className="airport-pci-details-list airport-pci-list-value">
                                                                <div>{value.name}</div>
                                                                <div>{value.value}</div>
                                                            </div>
                                                        ))
                                                    }

                                                </div>
                                                <div className='distress_quantities' style={{
                                                    flexBasis: !airportDetailsList ? '100%' : '0%',
                                                    height: !airportDetailsList ? 'fit-content' : '0px'
                                                }}>
                                                    <div className="airport-princenton-distress-header">{`Extrapolated Distress Quantities`}</div>
                                                    <div className='distress-heading'>
                                                        <div>Distress</div>
                                                        <div>Severity</div>
                                                        <div>Quantity</div>
                                                        <div>Unit</div>
                                                    </div>
                                                    <div className='distress-content'>
                                                        {
                                                            pciDetails.quantity.map((value) => (
                                                                <div className="airport-pci-quantity-list airport-pci-quantity-value">
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
                                            <div ref={brancImagesRef} style={{ height: '100%', width: '100%', display: !airportDetailsList ? 'block' : 'none' }}>
                                                <img src={pciDetails.image} height='200px' width='250px' style={{ marginTop: '20px', cursor: 'pointer' }} onClick={() => setShowModal(true)} />
                                            </div>
                                        </div>
                                    </>
                                )
                            }
                            {/* <div className="airport-princenton-branch-header">Branch: {pciDetails.branchid}</div> */}


                        </>
                    )
                }


            </div>
            <ImageThumbnailPortal showModal={showModal} imagepath={pciDetails.image} onCloseClickHandler={onModalCloseClick} />
        </>
    )
}

export default AirtportDetailsPopUp