import React, { useState } from 'react'
import '../css/card.scss'

const Card = ({ children, styles }) => {
    const [isExpand, setExpand] = useState(false)

    return (
        <>
            <div className={`card-container ${isExpand ? 'card-holder-expand' : 'card-holder-collapse'}`} >
                {children}
                <img src={isExpand? 'images/collapse.png' : 'images/expand.png'} alt='expand-collapse' className='expand-collaps-icon'
                 onClick={() =>  setExpand(!isExpand)}
                />
            </div>
           
        </>
    )
}

export default Card