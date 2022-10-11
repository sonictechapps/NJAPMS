import React from 'react'
import '../../css/header.scss'

const Header = ({ onHeaderIconClick }) => {
    return (
        <header>
            <div className='header'>
                <div className='header-container'>
                    {/* <img src='images/banner_amjms.png' height='120px' width='100%' style={{zIndex: '-1'}}></img> */}
                    <div className="logo-section" onClick={()=>onHeaderIconClick()}>
                        <img className='logo-banner' src='images/njdot_logo.png' alt='logo' />
                        <span className='logo-info'>New Jersey Department of Transportation</span>
                    </div>
                    <div className="logo-section-develop-by">
                        <img className='logo-banner-develop-by' src='images/aid_logo.png' alt='aidlogo' />
                    </div>


                </div>
            </div>
        </header>
    )
}

export default Header