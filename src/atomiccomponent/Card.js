import React from 'react'
import '../css/card.scss'

const Card = ({ children, styles }) => {
    return (
        <div className="card-container" style={styles}>
            {children}
        </div>
    )
}

export default Card