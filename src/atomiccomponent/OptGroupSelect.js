import React, { useEffect, useRef } from "react";
import '../css/dropdown.scss'

const OptGroupSelect = ({ options, id, defaultOption, selectedRootIndex, selectedIndex, onItemSelectedCallback }) => {
    let ul, span, dropdownDiv
    const dropDownDivOuter = useRef()
    useEffect(() => {
        ul = document.querySelector(`#${id}`)
        dropdownDiv = document.querySelector(`#dropdown-div-outer-${id}`)
        span = document.querySelector(`#dropdown-placeholder-${id}`)
        let acc = document.getElementsByClassName("option-header-list");
        let collapseArr = acc
    }, [])

    useEffect(() => {
        span = document.querySelector(`#dropdown-placeholder-${id}`)
        if (selectedRootIndex >= 0 && selectedIndex >= 0 && options.length > 0)
            span.innerHTML = options[selectedRootIndex].options[selectedIndex].name
    }, [selectedRootIndex, selectedIndex])

    const onULClick = (e) => {
        ul = document.querySelector(`#${id}`)
        ul.classList.toggle('active')
    }

    const onItemSelectd = (event, rootIndex, index) => {
        event.stopPropagation()
        span = document.querySelector(`#dropdown-placeholder-${id}`)
        span.innerHTML = options[rootIndex].options[index].name
        ul.classList.toggle('active')
        onItemSelectedCallback(rootIndex, index)

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

    const onAccordionClick = (e) => {
        e.stopPropagation()
        let collapseArr = document.getElementsByClassName("option-header-list");
        const elem = e.target
        elem.classList.toggle("active-accordion");
        let panel = elem.nextElementSibling;
        if (panel.style.maxHeight) {
            panel.style.maxHeight = null;
        } else {
            panel.style.maxHeight = panel.scrollHeight + "px";
        }
        for (let j = 0; j < collapseArr.length; j++) {
            if (collapseArr[j] === elem) continue
            collapseArr[j].classList.remove("active-accordion")
            let panel = collapseArr[j].nextElementSibling;
            panel.style.maxHeight = null
        }
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
                                options.map((optG, rootIndex) => (
                                    <>
                                        <button className={'option-header-list'} onClick={(e) => onAccordionClick(e)}>{optG.label}</button>
                                        <div className='panel'>
                                            {
                                                optG.options.map((option, index) => (
                                                    <li className={'option-list'} value={option.value} onClick={(e) => onItemSelectd(e, rootIndex, index)}>{option.name}</li>
                                                ))
                                            }
                                        </div>
                                    </>
                                ))
                            }
                        </ul>
                    </div>
        </>
    )
}

export default OptGroupSelect