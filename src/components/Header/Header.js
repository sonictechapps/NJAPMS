import React from 'react'
import '../../css/header.scss'

const Header = () => {
    return (
        <header>
            <div className='header'>
                <div className='header-container'>
                    <div className="logo-section">
                        <img className='logo-banner' src='images/banner.png' alt='logo' />
                        <span className='logo-info'>New Jersey Department of Transportation</span>
                    </div>
                    <div className="logo-section-develop-by">
                        <img className='logo-banner-develop-by' src='images/aidlogo.png' alt='aidlogo' />
                    </div>


                </div>
            </div>
        </header>
    )
}

export default Header