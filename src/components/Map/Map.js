import React, { useRef, useState, useEffect } from "react"
import "../../css/map.scss";
import MapContext from "./MapContext";
import * as ol from "ol";
import olms from 'ol-mapbox-style';
import Point from 'ol/geom/Point';
import axios from 'axios'
import VectorLayer from "../Layer/VectorLayer";
import VectorSource from 'ol/source/Vector';
import { vectorObject, vectorObjectForPoint } from "../Source/vector";
import { GeoJSON } from "ol/format";
import { fromLonLat, get, toLonLat } from "ol/proj";
import FeatureStyles from '../../Features/Styles'
import Tile from "ol/layer/Tile";
import { Zoom } from "ol/control";
import { Tile as TileLayer, Vector as VectorLayer1 } from 'ol/layer';
import {
	DragRotateAndZoom, PinchZoom, DragPan, MouseWheelZoom,
	defaults as defaultInteractions,
} from 'ol/interaction';
import Feature from 'ol/Feature'
import { Icon, Style } from 'ol/style';
import { platformModifierKeyOnly } from 'ol/events/condition';

import Tabs from "../Tabs";
import BarChart from "../BarChart";
import BubbleChart from "../BubbleChart";
import VectorLayerPoint from "../Layer/VectorLayerPoint";

const Map = ({ children, zoom, legend, airportFeatureList }) => {
	const mapRef = useRef();
	const [map, setMap] = useState(null)
	const [center, setCenter] = useState(fromLonLat([0, 0]))
	const [featureList, setFeatureList] = useState([])
	const [coordinateList, setCoordinateList] = useState([])
	const [showLayer, setShowLayer] = useState(true)
	// const rome = new Feature({
	// 	geometry: new Point(fromLonLat([12.5, 41.9])),
	// 	name: 'Null Island',
	// });

	

	const getIconStyle = (img) => {
		const iconStyle = new Style({
			image: new Icon({
				color: '#FF0000',
				anchor: [24, 48],
				anchorXUnits: 'pixels',
				anchorYUnits: 'pixels',
				imgSize: [48, 48],
	
				src: '/images/marker.png',
			}),
		});
		return iconStyle
	}

	//rome.setStyle(iconStyle);
	let mapObject
	const baseMapArr = [
		{
			name: 'Streets',
			value: 'ArcGIS:Streets'
		},
		{
			name: 'Navigation',
			value: 'ArcGIS:Navigation'
		},
		{
			name: 'Topographic',
			value: 'ArcGIS:Topographic'
		},
		{
			name: 'Light Gray',
			value: 'ArcGIS:LightGray'
		},
		{
			name: 'Dark gray',
			value: 'ArcGIS:DarkGray'
		},
		{
			name: 'Streets Relief',
			value: 'ArcGIS:StreetsRelief'
		},
		{
			name: 'Imagery',
			value: 'ArcGIS:Imagery:Standard'
		},
		{
			name: 'ChartedTerritory',
			value: 'ArcGIS:ChartedTerritory'
		},
		{
			name: 'ColoredPencil',
			value: 'ArcGIS:ColoredPencil'
		},
		{
			name: 'Nova',
			value: 'ArcGIS:Nova'
		},
		{
			name: 'Midcentury',
			value: 'ArcGIS:Midcentury'
		},
		{
			name: 'OSM',
			value: 'OSM:Standard'
		},
		{
			name: 'OSM:Streets',
			value: 'OSM:Streets'
		},
	]

	const pciColor = [{
		color: 'red',
		pci: '0-40'
	}, {
		color: 'orange',
		pci: '41-55'
	}, {
		color: 'yellow',
		pci: '56-70'
	}, {
		color: 'green',
		pci: '71-85'
	}, {
		color: 'pink',
		pci: '86-100'
	}]

	const airtPortDetails = [
		{
			name: 'Central Jersey Regional Airport(47N)',
			value: '47N'
		},
		{
			name: 'Essex County Airport(CDW)',
			value: 'CDW'
		},
		{
			name: 'Greenwood Lake Airport(4N1)',
			value: '4N1'
		},
	]
	const [airportValueSelect, setAirportValueSelect] = useState(airtPortDetails[0].value)

	// const vectorSource = new VectorSource({
	// 	features: [rome],
	// });

	// const vectorLayer = new VectorLayer1({
	// 	source: vectorSource,
	// });

	useEffect(() => {
		let options = {
			view: new ol.View({ zoom, minZoom: zoom }),
			layers: [],
			controls: [new Zoom()],
			overlays: [],
			interactions: defaultInteractions().extend([new DragRotateAndZoom(), new PinchZoom()
			]),
		};

		mapObject = new ol.Map(options);
		mapObject.setTarget(mapRef.current);
		const overLayContainerElement = document.querySelector('.overlay-container')
		const overlayLayer = new ol.Overlay({
			element: overLayContainerElement
		})
		mapObject.addOverlay(overlayLayer)
		const overLayPCIValue = document.getElementsByClassName('overlay-text-pci')[0]
		const overLayBranchID = document.getElementsByClassName('overlay-branch-id')[0]
		mapObject.on('pointermove', (e) => {
			console.log('pointermove')
			overlayLayer.setPosition(undefined)
			mapObject.forEachFeatureAtPixel(e.pixel, (feature, layer) => {
				let clickeCordinate = e.coordinate
				overLayPCIValue.innerHTML = `PCI: ${feature.get('Branch_PCI')}`
				overLayBranchID.innerHTML = `Branch Id: ${feature.get('Branch_ID')}`
				overlayLayer.setPosition(clickeCordinate)
			}, {
				layerFilter: (layerCandidate) => {
					return layerCandidate.get('title') === 'abc'
				}
			})
		})
		olms(mapObject, 'https://basemaps-api.arcgis.com/arcgis/rest/services/styles/ArcGIS:Streets?type=style&token=AAPK28d10d3ca2884d1c98ed6454eabcaaf330MqQ37jRDEJB70Rie9TAOx7LDeioNkVxD57HhnOby0DsK5V0v3asEZNtubkaxtd');
		//console.log('vectorLayer', vectorLayer)
		// setTimeout(() => {
		// 	mapObject.addLayer(vectorLayer)
		// }, 5000)
		//mapObject.addLayer(vectorLayer)
		setMap(mapObject);
		getAirportAPICall(airtPortDetails[0].value)
		//airportFeatureList.length > 0 && getAirportDetails()
		//	setTimeout(() => { mapObject.updateSize(); mapObject.calculateBounds(); },300);
		return () => mapObject.setTarget(undefined);
	}, []);

	useEffect(()=> {
		if (airportFeatureList.length > 0) {
			getAirportDetails()
		}
	},[JSON.stringify(airportFeatureList)])

	const getAirportAPICall = (value) => {
		axios.all([axios.get(`https://services7.arcgis.com/N4ykIOFU2FfLoqPT/ArcGIS/rest/services/N87Prototype/FeatureServer/1/query?outFields=*&spatialRel=esriSpatialRelIntersects&where=Network_ID=%27${value}%27&f=geojson`),
		axios.get(`https://services7.arcgis.com/N4ykIOFU2FfLoqPT/ArcGIS/rest/services/N87Prototype/FeatureServer/0/query?outFields=*&spatialRel=esriSpatialRelIntersects&where=Network_ID=%27${value}%27&f=geojson`)]
		).then(axios.spread((...res) => {
			setFeatureList(res[0].data.features)
			console.log('latlng', toLonLat([-8312257.30208827, 4957348.5768442]))
			//setCenter(fromLonLat(toLonLat([-8312257.30208827, 4957348.5768442])))
		}))
	}

	const getAirportDetails = () => {
		console.log('airportFeatureList', airportFeatureList)
		setCenter(fromLonLat(toLonLat(airportFeatureList[0].geometry?.coordinates)))
		setCoordinateList(airportFeatureList.map(featureItem => {
			const feature = new Feature({
				geometry: new Point(fromLonLat(toLonLat(featureItem.geometry?.coordinates))),
			})
			feature.setStyle(getIconStyle());
			return feature
		}))
	}

	// const getAirportDetails = () => {
	// 	axios.get('https://services7.arcgis.com/N4ykIOFU2FfLoqPT/arcgis/rest/services/N87Prototype/FeatureServer/0/query?f=pgeojson&geometry=%7B%22spatialReference%22:%7B%22latestWkid%22:3857,%22wkid%22:102100%7D,%22xmin%22:-8766409.899970992,%22ymin%22:4383204.949986987,%22xmax%22:-8140237.764258992,%22ymax%22:5009377.085698988%7D&maxRecordCountFactor=3&outFields=*&outSR=102100&resultType=tile&returnExceededLimitFeatures=false&spatialRel=esriSpatialRelIntersects&where=1=1&geometryType=esriGeometryEnvelope&inSR=102100').then(response => {
	// 		console.log('response-->', response.data.features)
	// 		setCenter(fromLonLat(toLonLat(response.data.features[0].geometry?.coordinates)))
	// 		setCoordinateList(response.data.features.map(featureItem => {
	// 			const feature = new Feature({
	// 				geometry: new Point(fromLonLat(toLonLat(featureItem.geometry?.coordinates))),
	// 			})
	// 			feature.setStyle(iconStyle);
	// 			return feature
	// 		}))
	// 	})
	// }

	// zoom change handler
	useEffect(() => {
		if (!map) return;

		map.getView().setZoom(zoom);
	}, [zoom]);

	// center change handler
	useEffect(() => {
		if (!map) return;
		console.log('center', center)
		map.getView().setCenter(center)

	}, [center])

	const onBasemapDropdoenChange = (e) => {
		if (map?.getLayers().getArray().length > 1) {
			map.getLayers().getArray().pop();
		}
		map.getLayers().getArray()
			.forEach(layer => {
				if (layer instanceof Tile) {
					map.removeLayer(layer)
				}

			})
		olms(map, `https://basemaps-api.arcgis.com/arcgis/rest/services/styles/${e.target.value}?type=style&token=AAPK28d10d3ca2884d1c98ed6454eabcaaf330MqQ37jRDEJB70Rie9TAOx7LDeioNkVxD57HhnOby0DsK5V0v3asEZNtubkaxtd`);
		setMap(map);
	}

	const getPCIColor = (pci) => {
		if (pci.min === '0' && pci.max === '10') {
			return {
				color: '#000000',
				textColor: '#fff'
			}
		} else if (pci.min === '11' && pci.max === '25') {
			return {
				color: '#4D0A05',
				textColor: '#fff'
			}
		} else if (pci.min === '26' && pci.max === '40') {
			return {
				color: '#EA3223',
				textColor: '#fff'
			}
		} else if (pci.min === '41' && pci.max === '55') {
			return {
				color: '#CD70ED',
				textColor: '#fff'
			}
		} else if (pci.min === '56' && pci.max === '70') {
			return {
				color: '#FFFD54',
				textColor: '#000'
			}
		} else if (pci.min === '71' && pci.max === '85') {
			return {
				color: '#75F94C',
				textColor: '#000'
			}
		} else if (pci.min === '86' && pci.max === '100') {
			console.log('oo')
			return {
				color: '#225313',
				textColor: '#fff'
			}
		}
	}

	const getPCIColorOnFeature = (pci) => {
		if (pci >= 0 && pci <= 10) {
			return '#000000'
		} else if (pci >= 11 && pci <= 25) {
			return '#4D0A05'
		} else if (pci >= 26 && pci <= 40) {
			return '#EA3223'
		} else if (pci >= 41 && pci <= 55) {
			return '#CD70ED'
		} else if (pci >= 56 && pci <= 70) {
			return '#FFFD54'
		} else if (pci >= 71 && pci <= 85) {
			return '#75F94C'
		} else if (pci >= 86 && pci <= 100) {
			return '#225313'
		}
	}

	const onAirportChange = (e) => {
		setAirportValueSelect(e.target.value)
		setFeatureList([])
		getAirportAPICall(e.target.value)
	}

	const onPanClick = () => {
		map.getView().animate({
			center: center,
			duration: 2000,
		})
	}

	return (
		<>
			<div className="map-details">

				{console.log('map', coordinateList)}
				<MapContext.Provider value={{ map }}>
					{/* <img src='./images/pan.png' alt='pan' onClick={onPanClick} /> */}
					<div ref={mapRef} className="ol-map">
						{children}
						{console.log('featureList', featureList)}
						{featureList.map(feature => (
							<VectorLayer
								source={vectorObject({
									features: new GeoJSON().readFeatures(feature, {
										featureProjection: get("EPSG:3857"),
									}),
								})}
								style={FeatureStyles.MultiPolygon(getPCIColorOnFeature(feature.properties.Branch_PCI))} zIndex={2}
								visible={showLayer}
							/>
						))}
						{
							coordinateList.length > 0 && (
								<VectorLayerPoint
									source={new vectorObjectForPoint(coordinateList)}
									visible={true} zIndex={2}
								/>
							)
						}

						{/* <VectorLayer
								source={new VectorSource({
									features: [rome],
								})}
								visible={true}
							/> */}
						{console.log('999', map?.getLayers())}
						<div className="pci-details">
							{
								legend.map(pci => (
									<div className="pci-item" style={{ backgroundColor: getPCIColor(pci).color }}>
										<p style={{ color: getPCIColor(pci).textColor }}>{pci.description}</p>
										<p style={{ color: getPCIColor(pci).textColor }}>{`(${pci.min}-${pci.max})`}</p>
									</div>
								))
							}
						</div>
					</div>



				</MapContext.Provider>

			</div>
			<div className="overlay-container">
				<span className="overlay-text-pci"></span><br />
				<span className="overlay-branch-id"></span><br />

			</div>

		</>
	)
}

export default Map;