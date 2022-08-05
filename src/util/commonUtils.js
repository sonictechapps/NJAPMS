import axios from 'axios'
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
