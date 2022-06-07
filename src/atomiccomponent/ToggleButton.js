import React, { useState } from "react"
import '../css/togglebutton.scss'

const ToggleButton = ({ toggleoptions, onToggleValue }) => {
    const [toggleValue, SetToggleValue] =  useState(toggleoptions[0].value)

    const onToggleChange = (value) => {
        SetToggleValue(value)
        onToggleValue(value)
    }
    return (
        <div className="toggle-inner-div">
            {
                toggleoptions.map((toggle, index) => (
                    <>
                        <input id="toggle-on" className={`toggle ${index === 0 ? 'toggle-left' : 'toggle-right'}`} name="toggle" value={toggle.value} type="radio" checked={toggleValue === toggle.value} />
                        <label for="toggle-on" className="btn1" onClick={(e) => onToggleChange(toggle.value)}>{toggle.name}</label>
                    </>
                ))
            }
        </div>
    )
}

export default ToggleButton