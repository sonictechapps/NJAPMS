import * as olSource from "ol/source";

export function osm() {
	return new olSource.OSM();
}

export function tileArcGISRest() {
    return new olSource.XYZ({
        attributions: 'Copyright:© 2013 ESRI, i-cubed, GeoEye',
        url:
          'https://services.arcgisonline.com/arcgis/rest/services/' +
          'ESRI_Imagery_World_2D/MapServer/tile/{z}/{y}/{x}',
        maxZoom: 15,
        projection: 'EPSG:4326',
        tileSize: 512, 
        maxResolution: 180 / 512,
        wrapX: true,
    });
}