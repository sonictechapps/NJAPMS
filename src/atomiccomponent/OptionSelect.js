import React from "react";

const OptionSelect = ({ options, id, defaultOption }) => {
    return (
        <select name={id} id={id}>
            {defaultOption && <option value='default'>{defaultOption}</option>}
            {
                options.map(option => (
                    <option value={option.value}>{option.description}</option>
                ))
            }
        </select>
    )
}

export default OptionSelect