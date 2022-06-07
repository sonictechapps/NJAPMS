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
        ul && ul.classList.toggle('active')
        onItemSelectedCallback(index)
        if (ul && ul.classList.contains('active')) {
            ul.classList.remove('active')
        }
    }

    const onDropdownMouseEnter = () => {
        const dropdownDiv = document.querySelector(`#dropdown-div-inner-${id}`)
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
        <>
            <div id={`dropdown-${id}`} className='dropdown-root'>
                <div id={`dropdown-div-outer-${id}`} ref={dropDownDivOuter} onClick={(e) => onULClick(e)}>
                    <span className={`dropdown-arrow`} id={`dropdown-placeholder-${id}`}>-----</span>
                </div>
            </div>
            <div className={`dropdown-div-inner`} id={`dropdown-div-inner-${id}`}>
                <ul className={`dropdown-ul`} id={id}>
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