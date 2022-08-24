import axios from 'axios'
import { constantsDetails } from './constants'
export const getFeatureDetails = (feature, fn) => {
    const majorMRDate = new Date(feature.Last_Work)
    const inspectDate = new Date(feature.Inspection_Date)
    const pcidetails = [
        {
            "name": "PCI",
            "value": feature.Branch_PCI
        },
        {
            "name": "Surface",
            "value": feature.Surface_Type
        },
        {
            "name": "Area",
            "value": feature.Section_Area
        },
        {
            "name": "Last Major M&R",
            "value": majorMRDate.toLocaleDateString('en-US')
        },
        {
            "name": "Last Insp. Date",
            "value": inspectDate.toLocaleDateString('en-US')
        },
        {
            "name": "Deduct/Load(%)",
            "value": feature.Deduct_Load
        },
        {
            "name": "Deduct/Climate(%)",
            "value": feature.Deduct_Climate
        },
        {
            "name": "Deduct/Other(%)",
            "value": feature.Deduct_Other
        },
    ]
    axios.get(`https://services7.arcgis.com/N4ykIOFU2FfLoqPT/ArcGIS/rest/services/N87Prototype/FeatureServer/42/query?f=json&outFields=*&outSR=102100&spatialRel=esriSpatialRelIntersects&where=SECTION_NAME = '${feature.Section_Name}'`)
					.then(res => {
                        fn(res?.data?.features, feature, pcidetails)						
					})
}

export const getPCIColor = (pci) => {
    if (pci.min === '0' && pci.max === '10') {
        return {
            color: constantsDetails['0-10_pci'],
            textColor: constantsDetails['0-10_pci_text']
        }
    } else if (pci.min === '11' && pci.max === '25') {
        return {
            color: constantsDetails['11-25_pci'],
            textColor: constantsDetails['11-25_pci_text']
        }
    } else if (pci.min === '26' && pci.max === '40') {
        return {
            color: constantsDetails['26-40_pci'],
            textColor: constantsDetails['26-40_pci_text']
        }
    } else if (pci.min === '41' && pci.max === '55') {
        return {
            color: constantsDetails['41-55_pci'],
            textColor: constantsDetails['41-55_pci_text']
        }
    } else if (pci.min === '56' && pci.max === '70') {
        return {
            color: constantsDetails['56-70_pci'],
            textColor: constantsDetails['56-70_pci_text']
        }
    } else if (pci.min === '71' && pci.max === '85') {
        return {
            color: constantsDetails['71-85_pci'],
            textColor: constantsDetails['71-85_pci_text']
        }
    } else if (pci.min === '86' && pci.max === '100') {
        return {
            color: constantsDetails['86-100_pci'],
            textColor: constantsDetails['86-100_pci_text']
        }
    }
}
let resValue

export const setResponse = (res)=> {
    resValue = res
}

export const getResponse = () => {
    return resValue
}
