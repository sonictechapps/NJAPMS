import React, { useEffect, useRef, useState } from "react";
import '../css/dropdown.scss'

const OptionSelect = ({ options, id, selectedIndex, onItemSelectedCallback, selectText, appendText }) => {
    let ul, span, dropdownDiv
    const dropDownDivOuter = useRef()
    useEffect(() => {
        ul = document.querySelector(`#${id}`)
        dropdownDiv = document.querySelector(`#dropdown-div-outer-${id}`)
        span = document.querySelector(`#dropdown-placeholder-${id}`)

    }, [])

    const onULClick = (e) => {
        ul = document.querySelector(`#${id}`)
        ul.classList.toggle('active')
    }

    const onItemSelectd = (event, index) => {
        event.stopPropagation()
        span = document.querySelector(`#dropdown-placeholder-${id}`)
        span.innerHTML = appendText + ': ' + options[index].name
        ul && ul.classList.toggle('active')
        onItemSelectedCallback(index)
        if (ul && ul.classList.contains('active')) {
            ul.classList.remove('active')
        }
    }

    return (
        <>
            <div id={`dropdown-${id}`} className='dropdown-root'>
                <div id={`dropdown-div-outer-${id}`} ref={dropDownDivOuter} onClick={(e) => onULClick(e)}>
                    <span className={`dropdown-arrow`} id={`dropdown-placeholder-${id}`}>{selectedIndex !== '' ?
                        appendText + ': ' + options[selectedIndex].name : selectText}</span>
                </div>
            </div>
            <div className={`dropdown-div-inner`} id={`dropdown-div-inner-${id}`}>
                <ul className={`dropdown-ul`} id={id} >
                    <li className={'option-list-select'} value='NA'>{selectText}</li>
                    {
                        options?.length > 0 && options.map((item, index) => (<li className={'option-list'}
                            value={item.value} onClick={(e) => onItemSelectd(e, index)}>{item.name}</li>))
                    }
                </ul>
            </div>
        </>
    )
}

export default OptionSelect