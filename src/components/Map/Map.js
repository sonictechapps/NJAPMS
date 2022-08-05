import React, { useRef, useState, useEffect } from "react"
import "../../css/map.scss";
import MapContext from "./MapContext";
import * as ol from "ol";
import olms from 'ol-mapbox-style';
import Point from 'ol/geom/Point';
import Overlay from 'ol/Overlay';

import axios from 'axios'
import VectorLayer from "../Layer/VectorLayer"
import { vectorObject, vectorObjectForPoint } from "../Source/vector"
import { GeoJSON } from "ol/format"
import { fromLonLat, get, toLonLat, Projection } from "ol/proj"
import FeatureStyles from '../../Features/Styles'
import Tile from "ol/layer/Tile"
import { Zoom } from "ol/control"
import {
	DragRotateAndZoom, PinchZoom,
	defaults as defaultInteractions,
} from 'ol/interaction'
import Feature from 'ol/Feature'
import { Icon, Style } from 'ol/style'
import VectorLayerPoint from "../Layer/VectorLayerPoint"
import BaseMapPortal from "../portals/BaseMapPortal"
import AirtportDetailsPopUp from "../popup/AirtportDetailsPopUp"
import { getFeatureDetails } from "../../util/commonUtils"

const Map = ({ children, zoom, legend, airportFeatureList, updateAirportDropDown1, airtPortDetailsMap, airportValue, branchSelectedIndex,
	getFeatureList, airportselectedIndex, onBranchChange, branchOption }) => {
		console.log('rrr', branchSelectedIndex, branchOption)
	const mapRef = useRef();
	const [list, setList] = useState(airtPortDetailsMap)
	const [map, setMap] = useState(null)
	const [center, setCenter] = useState(fromLonLat([0, 0]))
	const [featureList, setFeatureList] = useState([])
	const [coordinateList, setCoordinateList] = useState([])
	const [showLayer, setShowLayer] = useState(true)
	const [princentonAirport, setPrincentonAirport] = useState([])
	const [airportName, setAirportName] = useState('')
	const [showBaseMap, setShowBaseMap] = useState(false)
	const [pciDetails, setPCIDetails] = useState({
		pcidetails: [],
		quantity: []
	})
	const [branchId, setBrnachId] = useState('')
	let element
	let popup



	useEffect(() => {
		setPCIDetails({
			pcidetails: [],
			quantity: []
		})
		console.log('airportValue', airportValue)
		if (airportValue !== 'All' && branchSelectedIndex !== '' && featureList.length > 0) {
			getFeatureDetails(featureList[branchSelectedIndex].properties, returnPCiDetailsonBranch)
		}
		if (airportValue && airportValue !== 'All' && branchSelectedIndex !== '') {
			setBrnachId(branchOption[branchSelectedIndex]?.properties?.Branch_ID)
		}

	}, [branchSelectedIndex, featureList])

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
		const iconStyle = []
		if (zoom < 13 && featureList.length == 0) {
			// let airtportName = feature.properties.Name
			// if (airtportName.includes('- ')) {
			// 	airtportName = airtportName.split('- ')[1]
			// }
			// iconStyle.push(new Style({
			// 	text: new Text({
			// 		font: '12px Calibri,sans-serif',
			// 		text: airtportName,
			// 		overflow: true,
			// 		textBaseline: 'top',
			// 		offsetY: 5,
			// 		scale: [1.5, 1.5],
			// 		fill: new Fill({
			// 			color: '#FF0000',
			// 		}),
			// 		stroke: new Stroke({
			// 			color: '#fff',
			// 			width: 3,
			// 		}),
			// 	})
			// }))
			iconStyle.push(new Style({
				image: new Icon({

					anchor: [24, 48],
					anchorXUnits: 'pixels',
					anchorYUnits: 'pixels',
					imgSize: [48, 48],
					src: iconImg,
				})
			}))
			//setIconStyle(iconStyle)
			//setFeatureList([])
		} else if (zoom >= 13 && featureList.length > 0) {
			// if (iconStyle.length === 1) {
			// 	iconStyle.pop()
			// }
			iconStyle.pop()
			//setIconStyle(iconStyle)
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

	useEffect(() => {
		if (airportValue) {
			setBrnachId()
			if (airportValue !== 'All') {
				getAirportAPICall(airportValue)
				removeVectorLayer()
			} else {
				removeVectorLayer()
				//setCenter([-8273217.3285074355, 4894920.085748969])
				map.getView().animate({
					center: [-8273217.3285074355, 4894920.085748969],
					zoom: 8.4,
					duration: 2000,
				})
			}
		}

	}, [airportValue])

	useEffect(() => {
		setList(airtPortDetailsMap)
		if (airtPortDetailsMap.length > 0) {
			map.on('singleclick', (e) => {
				map.forEachFeatureAtPixel(e.pixel, function (feature) {
					if (feature?.values_?.networkId) {
						getAirportAPICall(feature.values_.networkId)
						removeVectorLayer()
					}
				})
			})
		}
	}, [airtPortDetailsMap])

	const returnPCiDetailsonBranch = (res, feature, pcidetails) => {
		setPCIDetails({
			pcidetails: pcidetails,
			quantity: res,
			image: feature.Photo,
			branchid: feature.Branch_ID,
			section: feature.Section_ID
		})
	}

	useEffect(() => {
		let options = {
			view: new ol.View({ zoom, minZoom: zoom }),
			layers: [],
			controls: [new Zoom()],
			overlays: [],
			interactions: defaultInteractions().extend([new DragRotateAndZoom(), new PinchZoom()
			]),
		}
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
		mapObject.on('singleclick', (e) => {
			mapObject.forEachFeatureAtPixel(e.pixel, (feature, layer) => {
				getFeatureDetails(feature.values_, returnPCiDetailsonBranch)
				setBrnachId(feature.values_.Branch_ID)

			}
				, {
					layerFilter: (layerCandidate) => {
						if (layerCandidate?.get('title') !== 'abc') {
							setPCIDetails({
								pcidetails: [],
								quantity: []
							})
						}
						return layerCandidate.get('title') === 'abc'
					}
				}
			)
		})


		popup = new Overlay({
			element: document.getElementById('popup'),
			offset: [-40, -30]
		});
		mapObject.addOverlay(popup)
		mapObject.on('pointermove', function (evt) {
			setPrincentonAirport([])
			popup.setPosition(undefined);
			mapObject.forEachFeatureAtPixel(evt.pixel, function (feature) {
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
					popup.setPosition(coordinate)
				}
			}, {
				layerFilter: (layerCandidate) => {
					return layerCandidate.get('title') === 'airport'
				}
			})

		})
		olms(mapObject, 'https://basemaps-api.arcgis.com/arcgis/rest/services/styles/ArcGIS:DarkGray?type=style&token=AAPK28d10d3ca2884d1c98ed6454eabcaaf330MqQ37jRDEJB70Rie9TAOx7LDeioNkVxD57HhnOby0DsK5V0v3asEZNtubkaxtd')
		setMap(mapObject)
	}, []);



	useEffect(() => {
		branchId && branchId !== '' && onBranchChange(branchId)
	}, [branchId])

	const removeVectorLayer = () => {
		let map1 = mapObject || map
		if (map1) {
			setFeatureList([])
			map1.getLayers().getArray()
				.forEach(layer => {
					if (layer.get('title') === 'abc') {
						map1.removeLayer(layer)
					}
				})
		}
	}

	const onBaseMapchange = (value) => {
		setShowBaseMap(false)
		if (value) {
			map.getLayers().getArray()
				.forEach(layer => {
					if (layer instanceof Tile) {
						map.removeLayer(layer)
					}

				})
			olms(map, `https://basemaps-api.arcgis.com/arcgis/rest/services/styles/${value}?type=style&token=AAPK28d10d3ca2884d1c98ed6454eabcaaf330MqQ37jRDEJB70Rie9TAOx7LDeioNkVxD57HhnOby0DsK5V0v3asEZNtubkaxtd`)
		}
	}

	useEffect(() => {
		if (airportFeatureList.length > 0) {
			getAirportDetails()
			setCenter([-8273217.3285074355, 4894920.085748969])
		}

		if (airportFeatureList.length > 0 && map) {
			map.on('moveend', (e) => {
				var newZoom = map.getView().getZoom();
				getAirportDetails(newZoom)
			});
		}

	}, [JSON.stringify(airportFeatureList), map])

	const getAirportAPICall = (value) => {
		let map1 = mapObject || map
		axios.all([axios.get(`https://services7.arcgis.com/N4ykIOFU2FfLoqPT/ArcGIS/rest/services/N87Prototype/FeatureServer/1/query?outFields=*&spatialRel=esriSpatialRelIntersects&where=Network_ID=%27${value}%27&f=geojson`),
		axios.get(`https://services7.arcgis.com/N4ykIOFU2FfLoqPT/ArcGIS/rest/services/N87Prototype/FeatureServer/0/query?outFields=*&spatialRel=esriSpatialRelIntersects&where=Network_ID=%27${value}%27&f=geojson`)]
		).then(axios.spread((...res) => {
			setFeatureList(res[0].data.features)
			getFeatureList(res[0].data.features, value)
			const a = fromLonLat(res[1].data.features[0].geometry.coordinates)
			map1.getView().animate({
				center: a,
				zoom: 15.5,
				duration: 2000,
			})
			updateAirportDropDown1(value)
		}))
	}

	const getAirportDetails = (zoomLevel = zoom) => {
		setCoordinateList(airportFeatureList.map(featureItem => {
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
		map.getView().animate({
			zoom: zoom,
			duration: 2000,
		})
	}, [zoom]);

	// center change handler
	useEffect(() => {
		if (!map) return;
		map.getView().setCenter(center)
	}, [center])

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

	const getPCIColorOnFeature = (pci, fe) => {
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

	return (
		<>
			<div className="map-details">
				<MapContext.Provider value={{ map }}>
					<div ref={mapRef} className="ol-map">
						<BaseMapPortal showModal={showBaseMap} onBaseMapchange={onBaseMapchange} />
						{children}
						{featureList.length > 0 && featureList.map(feature => (
							<VectorLayer
								source={vectorObject({
									features: new GeoJSON().readFeatures(feature, {
										featureProjection: get("EPSG:3857"),
									}),
								})}
								style={FeatureStyles.MultiPolygon(getPCIColorOnFeature(feature.properties.Branch_PCI, feature), branchId === feature.properties.Branch_ID ? 3 : 0)} zIndex={2}
								visible={showLayer} branchid = {branchId} feature = {feature}
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
							onClick={() => { setShowBaseMap(true) }}
						/>
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
						{
							pciDetails?.pcidetails?.length > 0 && pciDetails?.quantity?.length > 0 && (<AirtportDetailsPopUp pciDetails={pciDetails}
								airportName={airtPortDetailsMap[airportselectedIndex].name} />)
						}
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