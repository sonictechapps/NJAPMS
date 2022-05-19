import React from "react";

const OptGroupSelect = ({ optGroup, id, defaultOption }) => {
    return (
        <select name={id} id={id}>
            {
                optGroup.map(optG => (
                    <optgroup label={optG.label}>
                        {<option value={option.value}>{option.name}</option>}
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