import React from "react"

const AirportDataTable = ({ selectedyear, optionsGroup, airportDataDetails }) => {
    return (
        <>
            <div className="data-selected-year">
                <span>{optionsGroup[selectedyear[0]]?.options[selectedyear[1]]?.name}</span>
            </div>
            {
                airportDataDetails.keys.length> 0 && airportDataDetails.keys.map( (apv, index) => (
                    <div className="data-row">
                        <div>
                            {apv}
                        </div>
                        <div>
                            {airportDataDetails.values[index].overall}
                        </div>
                    </div>
                )
                )
            }
        </>
    )
}

export default AirportDataTable