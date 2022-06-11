import React, { useRef, useState, useEffect } from "react"
import "../../css/map.scss";
import MapContext from "./MapContext";
import * as ol from "ol";
import olms from 'ol-mapbox-style';
import Point from 'ol/geom/Point';
import Overlay from 'ol/Overlay';
import axios from 'axios'
import VectorLayer from "../Layer/VectorLayer";
import VectorSource from 'ol/source/Vector';
import { vectorObject, vectorObjectForPoint } from "../Source/vector";
import { GeoJSON } from "ol/format";
import { fromLonLat, get, toLonLat } from "ol/proj";
import FeatureStyles from '../../Features/Styles'
import Tile from "ol/layer/Tile";
import { Zoom } from "ol/control";
import {
	DragRotateAndZoom, PinchZoom, DragPan, MouseWheelZoom,
	defaults as defaultInteractions,
} from 'ol/interaction';
import Feature from 'ol/Feature'
import $ from 'jquery'

import { Fill, Icon, Stroke, Style, Text } from 'ol/style';
import VectorLayerPoint from "../Layer/VectorLayerPoint"
import BaseMapPortal from "../portals/BaseMapPortal";

const Map = ({ children, zoom, legend, airportFeatureList }) => {
	const mapRef = useRef();
	const [map, setMap] = useState(null)
	const [center, setCenter] = useState(fromLonLat([0, 0]))
	const [featureList, setFeatureList] = useState([])
	const [coordinateList, setCoordinateList] = useState([])
	const [showLayer, setShowLayer] = useState(true)
	const [princentonAirport, setPrincentonAirport] = useState([])
	const [airportName, setAirportName] = useState('')
	const [showBaseMap, setShowBaseMap] = useState(false)
	let element
	let popup
	const getIconStyle = (feature, zoom = 0) => {
		let iconImg
		const pciValue = parseInt(feature.overall)
		if (pciValue >= 0 && pciValue <= 10) {
			iconImg = '/images/pci_0_10.png'
		} else if (pciValue >= 11 && pciValue <= 25) {
			iconImg = '/images/pci_11_25.png'
		} else if (pciValue >= 26 && pciValue <= 40) {
			iconImg = '/images/pci_26_40.png'
		} else if (pciValue >= 41 && pciValue <= 55) {
			iconImg = '/images/pci_41_55.png'
		} else if (pciValue >= 56 && pciValue <= 70) {
			iconImg = '/images/pci_56_70.png'
		} else if (pciValue >= 71 && pciValue <= 85) {
			iconImg = '/images/pci_71_85.png'
		} else if (pciValue >= 86 && pciValue <= 100) {
			iconImg = '/images/pci_86_100.png'
		}
		const iconStyle = [new Style({
			image: new Icon({
				color: '#FF0000',
				anchor: [24, 48],
				anchorXUnits: 'pixels',
				anchorYUnits: 'pixels',
				imgSize: [48, 48],
				src: iconImg,
			})
		}),
		];
		if (zoom > 11 && iconStyle.length <= 1) {
			let airtportName = feature.properties.Name
			if (airtportName.includes('- ')) {
				airtportName = airtportName.split('- ')[1]
			}
			iconStyle.push(new Style({
				text: new Text({
					font: '12px Calibri,sans-serif',
					text: airtportName,
					overflow: true,
					textBaseline: 'top',
					offsetY: 5,
					scale: [1.5, 1.5],
					fill: new Fill({
						color: '#FF0000',
					}),
					stroke: new Stroke({
						color: '#fff',
						width: 3,
					}),
				})
			}))
		} else {
			if (iconStyle.length === 2) {
				iconStyle.pop()
			}
		}
		return iconStyle
	}
	let mapObject

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
		popup = new Overlay({
			element: document.getElementById('popup'),
			offset: [-40, -30]
		});
		mapObject.addOverlay(popup)
		mapObject.on('movestart', function () {
			setPrincentonAirport([])
			popup.setPosition(undefined);
		});
		mapObject.on('click', function (evt) {
			const feature = mapObject.forEachFeatureAtPixel(evt.pixel, function (feature) {
				return feature;
			})
			element = document.getElementById('popup');
			const airportSpan = document.getElementById('popup-overlay-text-airport1')
			const pciOverallSpan = document.getElementById('popup-overlay-text-pci-overall1')
			const pciRunwaySpan = document.getElementById('popup-overlay-text-pci-runway1')
			const pcitaxiWaySpan = document.getElementById('popup-overlay-text-pci-taxiway1')
			const pciApronSpan = document.getElementById('popup-overlay-text-pci-apron1')


			if (feature?.values_?.airporttName) {
				let geometry = feature.getGeometry()
				let coordinate = geometry.getCoordinates()
				axios.get(`https://services7.arcgis.com/N4ykIOFU2FfLoqPT/ArcGIS/rest/services/N87Prototype/FeatureServer/1/query?outFields=*&spatialRel=esriSpatialRelIntersects&where=Network_ID=%27${feature.values_.networkId}%27&f=geojson`)
					.then(res => {
						setPrincentonAirport(res.data.features)
						setAirportName(feature?.values_?.airporttName)
					})
				airportSpan.innerHTML = feature.values_.airporttName
				pciOverallSpan.innerHTML = `Overall: ${feature.values_.overAll}`
				pciRunwaySpan.innerHTML = `Runway: ${feature.values_.runway}`
				pcitaxiWaySpan.innerHTML = `Taxiway: ${feature.values_.taxiway}`
				pciApronSpan.innerHTML = `Apron: ${feature.values_.apron}`
				popup.setPosition(coordinate);
			} else {
				setPrincentonAirport([])
				popup.setPosition(undefined);
			}
		});

		olms(mapObject, 'https://basemaps-api.arcgis.com/arcgis/rest/services/styles/OSM:Streets?type=style&token=AAPK28d10d3ca2884d1c98ed6454eabcaaf330MqQ37jRDEJB70Rie9TAOx7LDeioNkVxD57HhnOby0DsK5V0v3asEZNtubkaxtd')
		setMap(mapObject);
		getAirportAPICall(airtPortDetails[0].value)
	}, []);

	const onBaseMapchange = (value) => {
		console.log('oooo', map.getLayers().getArray())
		setShowBaseMap(false)
		if (value) {
			map.getLayers().getArray()
				.forEach(layer => {
					if (layer instanceof Tile) {
						map.removeLayer(layer)
					}

				})
			console.log('oooo11', map.getLayers().getArray())
			olms(map, `https://basemaps-api.arcgis.com/arcgis/rest/services/styles/${value}?type=style&token=AAPK28d10d3ca2884d1c98ed6454eabcaaf330MqQ37jRDEJB70Rie9TAOx7LDeioNkVxD57HhnOby0DsK5V0v3asEZNtubkaxtd`)
		}
		//setMap(mapObject);
	}

	useEffect(() => {
		if (airportFeatureList.length > 0) {
			getAirportDetails()
			setCenter(fromLonLat(toLonLat(airportFeatureList[0].geometry?.coordinates)))
		}

		if (airportFeatureList.length > 0 && map) {
			map.on('moveend', (e) => {
				var newZoom = map.getView().getZoom();
				getAirportDetails(newZoom)
			});
		}

	}, [JSON.stringify(airportFeatureList), map])

	const getAirportAPICall = (value) => {
		axios.all([axios.get(`https://services7.arcgis.com/N4ykIOFU2FfLoqPT/ArcGIS/rest/services/N87Prototype/FeatureServer/1/query?outFields=*&spatialRel=esriSpatialRelIntersects&where=Network_ID=%27${value}%27&f=geojson`),
		axios.get(`https://services7.arcgis.com/N4ykIOFU2FfLoqPT/ArcGIS/rest/services/N87Prototype/FeatureServer/0/query?outFields=*&spatialRel=esriSpatialRelIntersects&where=Network_ID=%27${value}%27&f=geojson`)]
		).then(axios.spread((...res) => {
			setFeatureList(res[0].data.features)
		}))
	}

	const getAirportDetails = (zoomLevel = zoom) => {

		setCoordinateList(airportFeatureList.map(featureItem => {
			console.log('featureItem-->', featureItem)
			const feature = new Feature({
				geometry: new Point(fromLonLat(toLonLat(featureItem.geometry?.coordinates))),
				airporttName: featureItem.properties.Name,
				networkId: featureItem.properties.Network_ID,
				id: featureItem.id,
				apron: featureItem.apron,
				overAll: featureItem.overall,
				runway: featureItem.runway,
				taxiway: featureItem.taxiway
			})
			feature.setStyle(getIconStyle(featureItem, zoomLevel));
			return feature
		}))
	}

	useEffect(() => {
		if (!map) return;

		map.getView().setZoom(zoom);
	}, [zoom]);

	// center change handler
	useEffect(() => {
		if (!map) return;
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

				<MapContext.Provider value={{ map }}>
					{/* <img src='./images/pan.png' alt='pan' onClick={onPanClick} /> */}
					<div ref={mapRef} className="ol-map">
						<BaseMapPortal showModal={showBaseMap} onBaseMapchange={onBaseMapchange} />
						{children}
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
						<img className='basemap-grid' src='images/grid.png' alt='basemap-grid'
							onClick={() => { console.log('hhh'); setShowBaseMap(true) }}
						/>

						{/* <VectorLayer
								source={new VectorSource({
									features: [rome],
								})}
								visible={true}
							/> */}
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
						<div className="airport-princenton" style={{ maxHeight: princentonAirport.length > 0 ? '400px' : '0px' }}>
							{
								princentonAirport.length > 0 && (
									<>
										<div className="airport-princenton-header">{`${airportName.split('- ')[1]}`}</div>
										<div className="airport-pci-list">
											<div>Branch</div>
											<div>No of Sections</div>
											<div>PCI</div>
										</div>
										<div style={{ overflow: 'auto' }}>
											{
												princentonAirport.map(airport => (
													<div className="airport-pci-list airport-pci-list-value">
														<div>{airport.properties.Branch_ID}</div>
														<div>{airport.properties.Section_Qty}</div>
														<div>{airport.properties.Branch_PCI}</div>
													</div>
												))
											}
										</div>
									</>
								)

							}

						</div>
					</div>
				</MapContext.Provider>

			</div>
			<div className="overlay-container">
				<span className="overlay-text-pci"></span><br />
				<span className="overlay-branch-id"></span><br />

			</div>
			<div id="popup" className="overlay-container-popup">
				<span className="popup-overlay-text-airport" id='popup-overlay-text-airport1'></span><br />
				<span className="popup-overlay-text-pci-overall" id='popup-overlay-text-pci-overall1'></span><br />
				<span className="popup-overlay-text-pci-apron" id='popup-overlay-text-pci-apron1'></span><br />
				<span className="popup-overlay-text-pci-runway" id='popup-overlay-text-pci-runway1'></span><br />
				<span className="popup-overlay-text-pci-taxiway" id='popup-overlay-text-pci-taxiway1'></span><br />
			</div>
		</>
	)
}

export default Map;