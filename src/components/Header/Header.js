import React from 'react'
import '../../css/header.scss'

const Header =() => {
    return (
        <header>
            <div className='header'>
            <div className='header-container'>
            <div class="logo-section">                
            <img className='logo-banner' src='images/banner.png' alt='logo' />
                <span className='logo-info'>New Jersey Department of Transportation</span>
            </div>
            
            </div>
            </div>
        </header>
    )
}

export default Header