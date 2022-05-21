import React, { useEffect } from 'react'

const TreeView = ({data}) => {  
    useEffect(()=>{
        iterateObject(data)
    }, [])
    return (
        <div></div>
    )
}

const iterateObject = (data) => {
    for (let i of Object.keys(data)) {
        if (typeof(data[i]) ===  'object') {
            iterateObject(data[i])
        } else {
            console.log(data[i])
        }
    }
}

export default TreeView