import React, { useRef, useState, useEffect } from "react"
import "../../css/map.scss";
import MapContext from "./MapContext";
import * as ol from "ol";
import olms from 'ol-mapbox-style';
import axios from 'axios'
import VectorLayer from "../Layer/VectorLayer";
import { vectorObject } from "../Source/vector";
import { GeoJSON } from "ol/format";
import { fromLonLat, get } from "ol/proj";
import FeatureStyles from '../../Features/Styles'
import Tile from "ol/layer/Tile";
import { Zoom } from "ol/control";
import {
	DragRotateAndZoom, PinchZoom, DragPan, MouseWheelZoom,
	defaults as defaultInteractions,
} from 'ol/interaction';
import { platformModifierKeyOnly } from 'ol/events/condition';

import Tabs from "../Tabs";
import BarChart from "../BarChart";
import BubbleChart from "../BubbleChart";

const Map = ({ children, zoom }) => {
	const mapRef = useRef();
	const [map, setMap] = useState(null)
	const [center, setCenter] = useState(fromLonLat([0, 0]))
	const [featureList, setFeatureList] = useState([])

	const [showLayer, setShowLayer] = useState(true)

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

	useEffect(() => {
		let options = {
			view: new ol.View({ zoom, minZoom: zoom}),
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
		setMap(mapObject);
		getAirportAPICall(airtPortDetails[0].value)
		setTimeout(() => { mapObject.updateSize(); mapObject.calculateBounds(); },300);
		return () => mapObject.setTarget(undefined);
	}, []);

	const getAirportAPICall = (value) => {
		axios.all([axios.get(`https://services7.arcgis.com/N4ykIOFU2FfLoqPT/ArcGIS/rest/services/N87Prototype/FeatureServer/1/query?outFields=*&spatialRel=esriSpatialRelIntersects&where=Network_ID=%27${value}%27&f=geojson`),
		axios.get(`https://services7.arcgis.com/N4ykIOFU2FfLoqPT/ArcGIS/rest/services/N87Prototype/FeatureServer/0/query?outFields=*&spatialRel=esriSpatialRelIntersects&where=Network_ID=%27${value}%27&f=geojson`)]
		).then(axios.spread((...res) => {
			setFeatureList(res[0].data.features)
			setCenter(fromLonLat(res[1].data.features[0].geometry.coordinates))
		}))
	}

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
		if (pci >= 0 && pci <= 40) {
			return 'red'
		} else if (pci >= 41 && pci <= 55) {
			return 'orange'
		} else if (pci >= 56 && pci <= 70) {
			return 'yellow'
		} else if (pci >= 71 && pci <= 85) {
			return 'green'
		} else if (pci >= 86 && pci <= 100) {
			return 'pink'
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
				
						{console.log('map', map)}
						<MapContext.Provider value={{ map }}>
							{/* <img src='./images/pan.png' alt='pan' onClick={onPanClick} /> */}
							<div ref={mapRef} className="ol-map">
								{children}
								{featureList.map(feature => (
									<VectorLayer
										source={vectorObject({
											features: new GeoJSON().readFeatures(feature, {
												featureProjection: get("EPSG:3857"),
											}),
										})}
										style={FeatureStyles.MultiPolygon(getPCIColor(feature.properties.Branch_PCI))} zIndex={2}
										visible={showLayer}
									/>
								))}

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