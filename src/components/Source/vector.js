import VectorSource  from "ol/source/Vector";
import { GeoJSON } from "ol/format";
function vector() {
    return new VectorSource({
        format: new GeoJSON(),
        url: 'https://services7.arcgis.com/N4ykIOFU2FfLoqPT/ArcGIS/rest/services/N87Prototype/FeatureServer/1/query?outFields=*&spatialRel=esriSpatialRelIntersects&where=Network_ID=%274N1%27&f=geojson',
        maxZoom: 15,
        projection: 'EPSG:4326',
        tileSize: 512,
        maxResolution: 180 / 512,
        wrapX: true,
    });
}

export function vectorObject({ features }) {
    const vectorsource = new VectorSource()
    vectorsource.addFeatures(features)
    return vectorsource
}

export function vectorObjectForPoint( features ) {
    const vectorsource = new VectorSource({
        features: features
    })
    return vectorsource
}

export default vector