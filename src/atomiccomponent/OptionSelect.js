import React, { useEffect, useRef } from "react";
import '../css/dropdown.scss'

const OptionSelect = ({ options, id, selectedIndex, onItemSelectedCallback }) => {
    let ul, span, dropdownDiv
    const dropDownDivOuter = useRef()
    useEffect(() => {
        ul = document.querySelector(`#${id}`)
        dropdownDiv = document.querySelector(`#dropdown-div-outer-${id}`)
        span = document.querySelector(`#dropdown-placeholder-${id}`)
        if (selectedIndex >= 0 && options.length > 0)
            span.innerHTML = options[selectedIndex].name
    }, [])


    const onULClick = (e) => {
        ul = document.querySelector(`#${id}`)
        ul.classList.toggle('active')
    }

    const onItemSelectd = (event, index) => {
        event.stopPropagation()
        span = document.querySelector(`#dropdown-placeholder-${id}`)
        span.innerHTML = options[index].name
        ul.classList.toggle('active')
        onItemSelectedCallback(index)
        if (ul.classList.contains('active')) {
            ul.classList.remove('active')
        }
    }

    const onDropdownExpand = (event) => {
        event.stopPropagation()
        event.target.classList.remove('disable-dropdown')
        const elemOuter = document.querySelector(`#dropdown-div-outer-${id}`)
        elemOuter.classList.remove('dropdown-div-outer-collpase')
        const elem = document.querySelector(`#dropdown-${id}`)
        elem.classList.remove('dropdown')
    }

    return (
        <div id={`dropdown-${id}`} className='dropdown-root'>
            <div className={`dropdown-div-outer`} id={`dropdown-div-outer-${id}`} ref={dropDownDivOuter} onClick={(e) => onULClick(e)}>
                <span className={`dropdown-placeholder`} id={`dropdown-placeholder-${id}`}>-----</span>
                <div className={`dropdown-div-inner`} id={`dropdown-div-inner-${id}`}>
                    <ul className={`dropdown-ul`} id={id}>
                        {
                            options?.length > 0 && options.map((item, index) => (<li className={'option-list'}
                                value={item.value} onClick={(e) => onItemSelectd(e, index)}>{item.name}</li>))
                        }
                    </ul>
                </div>
                <div className={`dropdown-hidden`} id={`dropdown-hidden-${id}`} onClick={(e) => onDropdownExpand(e)}></div>
            </div>
        </div>
    )
}

export default OptionSelect