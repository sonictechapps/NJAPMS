import React from 'react'
import '../../css/header.scss'

const Header =() => {
    return (
        <div className='header'>
            <img className='logo-banner' src='images/banner.png' alt='logo' />
            <p className='logo-info'>New Jersey Department of Transportation</p>
        </div>
    )
}

export default Header