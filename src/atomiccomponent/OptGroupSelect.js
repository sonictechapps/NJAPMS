import React, { useEffect, useRef } from "react";

const OptGroupSelect = ({ options, id, defaultOption, selectedRootIndex, selectedIndex, onItemSelectedCallback }) => {
    console.log('selectedRootIndex', selectedRootIndex, selectedIndex)
    let ul, span, dropdownDiv
    const dropDownDivOuter = useRef()
    useEffect(() => {
        ul = document.querySelector(`#${id}`)
        dropdownDiv = document.querySelector(`#dropdown-div-outer-${id}`)
        span = document.querySelector(`#dropdown-placeholder-${id}`)
        console.log('options-->', options.length)
        // if (selectedRootIndex >= 0 && selectedIndex>=0 && options.length > 0)
        //     span.innerHTML = options[selectedIndex].options[selectedRootIndex].name
    }, [])

    useEffect(()=> {
        span = document.querySelector(`#dropdown-placeholder-${id}`)
        if (selectedRootIndex >= 0 && selectedIndex>=0 && options.length > 0)
            span.innerHTML = options[selectedRootIndex].options[selectedIndex].name
    }, [selectedRootIndex, selectedIndex])

    const onULClick = (e) => {
        ul = document.querySelector(`#${id}`)
        ul.classList.toggle('active')
        //dropDownDivOuter.current.style.borderColor = getColor()
    }

    const onItemSelectd = (event, rootIndex, index) => {
        console.log('enter')
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

    return (
        <>
            <div id={`dropdown-${id}`} className='dropdown-root'>
                <div className={`dropdown-div-outer`} id={`dropdown-div-outer-${id}`} ref={dropDownDivOuter} onClick={(e) => onULClick(e)}>
                    <span className={`dropdown-placeholder`} id={`dropdown-placeholder-${id}`}>-----</span>
                    <div className={`dropdown-div-inner`} id={`dropdown-div-inner-${id}`}>
                        <ul className={`dropdown-ul`} id={id}>
                            {
                                options.map((optG, rootIndex) => (
                                    <>
                                        <li value={optG.label} disabled='true' className={'option-header-list'}>{optG.label}</li>
                                        {
                                            optG.options.map((option, index) => (
                                                <li className={'option-list'} value={option.value} onClick={(e) => onItemSelectd(e, rootIndex, index)}>{option.name}</li>
                                            ))
                                        }
                                    </>
                                ))
                            }
                        </ul>
                    </div>
                    <div className={`dropdown-hidden`} id={`dropdown-hidden-${id}`} onClick={(e) => onDropdownExpand(e)}></div>
                </div>
            </div>
        </>
    )
}

export default OptGroupSelect