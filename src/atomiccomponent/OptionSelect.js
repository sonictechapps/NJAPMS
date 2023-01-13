import React, { useEffect, useRef, useState } from "react";
import '../css/dropdown.scss'

const OptionSelect = ({ options, id, selectedIndex, onItemSelectedCallback, selectText, appendText, isDisabled, onItemSectionSelectedCallback }) => {
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

    const onItemSelectd = (event, index, item) => {
        event.stopPropagation()
        if (!item?.sec_arr || item?.sec_arr?.length === 0) {
            span = document.querySelector(`#dropdown-placeholder-${id}`)
            span.innerHTML = appendText ? appendText + ': ' + options[index].name : options[index].name
            ul && ul.classList.toggle('active')
            onItemSelectedCallback(index)
            onItemSectionSelectedCallback && onItemSectionSelectedCallback(undefined)
            if (ul && ul.classList.contains('active')) {
                ul.classList.remove('active')
            }
            let id1 = `option-list-${id}`
            let collapseArr = document.getElementsByClassName(id1)
            for (let j = 0; j < collapseArr.length; j++) {
                collapseArr[j].classList.remove("active-accordion-list")
                let panel = collapseArr[j].nextElementSibling
                if (panel)  panel.style.maxHeight = null
            }
        } else {
            let id1 = `option-list-${id}`
            let collapseArr = document.getElementsByClassName(id1);
            const elem = event.target
            elem.classList.toggle("active-accordion-list");
            let panel = elem.nextElementSibling;
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            } else {
                panel.style.maxHeight = 300 + "px";
            }
            for (let j = 0; j < collapseArr.length; j++) {
                if (collapseArr[j] === elem) continue
                collapseArr[j].classList.remove("active-accordion-list")
                let panel = collapseArr[j].nextElementSibling;
                panel.style.maxHeight = null
            }
        }

    }

    const onSubItemSelected = (event, index, mainindex, item) => {
        event.stopPropagation()
        span = document.querySelector(`#dropdown-placeholder-${id}`)
        span.innerHTML = appendText ? appendText + ': ' + options[mainindex].name : options[mainindex].name
        ul && ul.classList.toggle('active')
        onItemSelectedCallback(mainindex)
        onItemSectionSelectedCallback(index)
        if (ul && ul.classList.contains('active')) {
            ul.classList.remove('active')
        }
    }

    return (
        <div style={{ position: 'relative' }}>
            <div id={`dropdown-${id}`} className='dropdown-root'>
                <div id={`dropdown-div-outer-${id}`} ref={dropDownDivOuter} onClick={(e) => onULClick(e)}>
                    <span className={`dropdown-arrow`} id={`dropdown-placeholder-${id}`}>{selectedIndex !== '' && !isDisabled ?
                        appendText ? appendText + ': ' + options[selectedIndex]?.name : options[selectedIndex]?.name : selectText}</span>
                </div>
            </div>
            {
                isDisabled && (
                    <div className={`dropdown-disabled`}>
                        <div id={`dropdown-div-outer-${id}`} ref={dropDownDivOuter}>
                            <span className={`dropdown-arrow`} id={`dropdown-placeholder-${id}`}>{selectedIndex !== '' ?
                                appendText ? appendText + ': ' + options[selectedIndex].name : options[selectedIndex].name : selectText}</span>
                        </div>
                    </div>
                )
            }

            {
                !isDisabled && (
                    <div className={`dropdown-div-inner`} id={`dropdown-div-inner-${id}`}>
                        <ul className={`dropdown-ul`} id={id} >
                            <li className={'option-list-select'} value='NA'>{selectText}</li>
                            {
                                options?.length > 0 && options.map((item, mainindex) => (<><li className={`option-list option-list-${id} ${item?.sec_arr?.length > 0 && 'option-list-child-expand'}`}
                                    value={item.value} onClick={(e) => onItemSelectd(e, mainindex, item)}>{item.name}

                                </li>
                                    {
                                        item?.sec_arr?.length > 0 && (
                                            <ul className={`dropdown-ul-inner`} id={id} >
                                                {
                                                    item?.sec_arr?.map((item, index) => (
                                                        <li value={item.value} className={`dropdown-li-inner`} onClick={(e) => onSubItemSelected(e, index, mainindex, item)}>{item.name}</li>
                                                    ))
                                                }

                                            </ul>
                                        )
                                    }
                                </>))
                            }
                        </ul>
                    </div>
                )
            }


        </div>
    )
}

export default OptionSelect