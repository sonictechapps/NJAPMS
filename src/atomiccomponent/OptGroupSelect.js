import React from "react";

const OptGroupSelect = ({ optGroup, id, defaultOption }) => {
    console.log('optGroup', optGroup)
    return (
        <select name={id} id={id}>
            {defaultOption && (<option value='default'>{defaultOption}</option>)}
            {
                optGroup.map(optG => (
                    <optgroup label={optG.label}>
                        {
                            optG.options.map(option => (
                                <option value={option.value}>{option.name}</option>
                            ))
                        }
                    </optgroup>
                ))
            }
        </select>
    )
}

export default OptGroupSelect