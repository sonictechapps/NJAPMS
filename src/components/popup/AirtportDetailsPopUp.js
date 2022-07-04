import React, { useEffect, useRef, useState } from 'react'

const AirtportDetailsPopUp = ({ pciDetails }) => {
    const [airportDetails, setAirportDetails] = useState(true)
    const [imageDetails, setImageDetails] = useState(false)
    const [airportDetailsList, setAirportDetailsList] = useState(true)
    const branchDetailsRef = useRef(null)
    const brancImagesRef = useRef(null)

    useEffect(()=> {
        branchDetailsRef.current.style.display = 'flex'
        brancImagesRef.current.style.display = 'none'
    }, [])

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
                backgroundColor: 'black',
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
                backgroundColor: 'black',
                color: 'white'
            }
        }
    }


    return (
        <div className="airport-princenton" style={{ maxHeight: pciDetails?.pcidetails?.length > 0 ? '294px' : '0px' }}>
            {
                pciDetails?.pcidetails?.length > 0 && (
                    <>
                        <div className="airport-princenton-header">{`Branch Details`}</div>
                        <div className='airport-details-tab'>
                            <div onClick={(e) => onDetailsClick(e)} style={getDetailsStyle()}>Details</div>
                            <div onClick={(e) => onImagesClick(e)} style={getImageStyle()}>Image</div>
                        </div>
                        <div className='branch-image-div-holder'>
                            <div className='branch-all-wrapper' ref={branchDetailsRef}>
                                <div className='branch-details' style={{ flexBasis: airportDetailsList ? '100%' : '0%' }}>
                                    {
                                        pciDetails.pcidetails.map((value, index) => (
                                            <div className="airport-pci-details-list airport-pci-list-value">
                                                <div>{value.name}</div>
                                                <div>{value.value}</div>
                                            </div>
                                        ))
                                    }
                                    <img src='images/right_arrow.png' className="right_arrow" onClick={onRightArrowClick}
                                        style={{ display: airportDetailsList ? 'block' : 'none' }} />
                                </div>
                                <div className='distress_quantities' style={{
                                    flexBasis: !airportDetailsList ? '100%' : '0%',
                                    height: !airportDetailsList ? 'fit-content' : '0px'
                                }}>
                                    <div className="airport-princenton-header">{`Extrapolated Distress Quantities`}</div>
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
                                    <img src='images/left_arrow.png' className="left_arrow" onClick={onLeftArrowClick}
                                        style={{ display: !airportDetailsList ? 'block' : 'none' }} />
                                </div>
                            </div>
                            <div ref={brancImagesRef} style={{height: '100%', width: '100%'}}>
                               <img src={pciDetails.image} height='200px' width='250px' style={{marginTop: '20px'}}/>
                            

                            </div>
                        </div>

                    </>
                )
            }


        </div>
    )
}

export default AirtportDetailsPopUp