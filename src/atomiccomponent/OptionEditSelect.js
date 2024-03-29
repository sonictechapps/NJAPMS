import React, { useEffect, useRef, useState } from 'react'
import '../css/dropdown.scss'

const OptionEditSelect = ({ options, id, selectedIndex, selectText, appendText, onItemSelectedCallback, isDisabled, airportValue, selectedDefaultYear }) => {
    let ul, span, dropdownDiv
    const dropDownDivOuter = useRef()
    const [editOptions, setEditOptions] = useState([])

    useEffect(() => {
        ul = document.querySelector(`#${id}`)
        dropdownDiv = document.querySelector(`#dropdown-div-outer-${id}`)
        span = document.querySelector(`#dropdown-placeholder-${id}`)
        let arr = []
        options.forEach((item) => {
            arr.push(item.filterValue)
        })
        setEditOptions(arr)
    }, [])

    useEffect(() => {
        if (editOptions.some(item => item.filterValue !== '') && airportValue !== 'All') {
            setEditOptions(editOptions.map(item => ''))
        }
    }, [airportValue])

    useEffect(() => {
        if (editOptions.some(item => item.filterValue !== '')) {
            setEditOptions(editOptions.map(item => ''))
        }
    }, [JSON.stringify(selectedDefaultYear)])


    const onULClick = (e) => {
        ul = document.querySelector(`#${id}`)
        ul.classList.toggle('active')
    }

    const onEditChange = (val, index) => {
        let v = parseInt(val)
        if (val !== '' && v >= 0 && v <= 100) {
            // const a = editOptions.map((i,in1) => {
            //     if (in1 !== index) {
            //         return ''
            //     } else {
            //         return val
            //     }
            // })
            let arr = editOptions.map((i, in1) => {
                if (in1 !== index) {
                    return ''
                } else {
                    return val
                }
            })
            setEditOptions(arr)
            onItemSelectedCallback(arr)
        }
        if (val === '') {
            editOptions[index] = ''
            let arr = JSON.parse(JSON.stringify(editOptions))
            setEditOptions(arr)
            onItemSelectedCallback(arr)
        }
        // if (val === '' || (v >= 0 && v <= 100)) {
        //     editOptions[index] = val
        //     let arr = JSON.parse(JSON.stringify(editOptions))
        //     setEditOptions(arr)
        // }

    }

    const getPCIText = () => {
        if (options[0].filterValue !== '' && options[1].filterValue !== '') {
            return `${options[0].name} ${options[0].filterValue} AND ${options[1].name} ${options[1].filterValue}`
        }
        if (options[0].filterValue !== '') {
            return `${options[0].name} ${options[0].filterValue}`
        }
        if (options[1].filterValue !== '') {
            return `${options[1].name} ${options[1].filterValue}`
        }
        if (options[2].filterValue !== '') {
            return `${options[2].name} ${options[2].filterValue}`
        }
    }



    return (
        <div style={{ position: 'relative' }}>
            <div id={`dropdown-${id}`} className='dropdown-root'>
                <div id={`dropdown-div-outer-${id}`} ref={dropDownDivOuter} onClick={(e) => onULClick(e)}>
                    <span className={`dropdown-arrow`} id={`dropdown-placeholder-${id}`}>{options.some(item => item.filterValue !== '') && !isDisabled ?
                        appendText + ': ' + getPCIText() : selectText}</span>
                </div>
            </div>
            {
                isDisabled && (
                    <div className={`dropdown-disabled`}>
                        <div id={`dropdown-div-outer-${id}`} ref={dropDownDivOuter}>
                            <span className={`dropdown-arrow`} id={`dropdown-placeholder-${id}`}>{selectText}</span>
                        </div>
                    </div>
                )
            }
            {
                !isDisabled && (
                    <div className={`dropdown-div-inner`} id={`dropdown-div-inner-${id}`}>
                        <ul className={`dropdown-ul`} id={id} >
                            {
                                editOptions?.length > 0 && options?.length > 0 && options.map((item, index) => (<li className={'option-list'}
                                    value={item.value}>
                                    <div className='option-edit-div'>
                                        <div><p>{item.name}</p></div>
                                        <div>

                                            <input type="number" min="0" max="100" onKeyDown={(e) => { if (e.key === '.') { e.preventDefault() } }}
                                                value={editOptions[index]} onChange={(e) => onEditChange(e.target.value, index)}
                                            />
                                        </div>
                                    </div>
                                </li>))
                            }
                        </ul>
                    </div>
                )
            }

        </div>
    )
}

export default OptionEditSelect