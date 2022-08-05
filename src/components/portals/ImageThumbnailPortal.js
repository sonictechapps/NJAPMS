import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom';
import '../../css/basemapportal.scss'


const ImageThumbnailPortal = ({ imagepath, showModal, onCloseClickHandler }) => {


    const onCloseClick = () => {
        onCloseClickHandler()
    }

    return ReactDOM.createPortal(
        <>
            <div className={`transparent-portal-div ${showModal ? 'modal-show' : 'modal-hide'}`}></div>
            <div className={`basemap-portal ${showModal ? 'modal-show-basemap' : 'modal-hide'}`}>
                <div style={{ width: 'fit-content', zIndex: '120000' }}>
                    <img src='images/close.png' alt='close' className='close-image' onClick={onCloseClick} />
                    <div className='image-inner-div'>
                    <img src={imagepath} className="thumb-image" />

                    </div>
                </div>

            </div>
        </>, document.getElementById('image-thumbnail-portal')
    )
}

export default ImageThumbnailPortal