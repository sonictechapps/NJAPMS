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
import { FullScreen, Zoom, ZoomSlider } from "ol/control"
import {
	DragRotateAndZoom, PinchZoom,
	defaults as defaultInteractions,
} from 'ol/interaction'
import Feature from 'ol/Feature'
import { Icon, Style } from 'ol/style'
import VectorLayerPoint from "../Layer/VectorLayerPoint"
import BaseMapPortal from "../portals/BaseMapPortal"
import AirtportDetailsPopUp from "../popup/AirtportDetailsPopUp"
import { getFeatureDetails, getPCIColor, getResponse, setResponse } from "../../util/commonUtils"

const Map = ({ children, zoom, legend, airportFeatureList, updateAirportDropDown1, airtPortDetailsMap, airportVal, branchSelectedIndex,
	getFeatureList, airportselectedIndex, onBranchChange, branchOption, years, selectedDefaultYear, aggregationOption, aggregationIndex,
	aggregationDetails }) => {
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
	const [airportValue, setAirportValue] = useState(airportVal)
	const [pciDetails, setPCIDetails] = useState({
		pcidetails: [],
		quantity: []
	})
	const [branchId, setBrnachId] = useState('')
	const [saveFeatureList, setSaveFeatureList] = useState([])
	let element
	const [zoom1, setZoom1] = useState(zoom)
	let popup

	useEffect(() => {
		setAirportValue(airportVal)
		if (airportVal === 'All') {
			setFeatureList([])
		}
	}, [airportVal])


	useEffect(() => {
		setPCIDetails({
			pcidetails: [],
			quantity: []
		})
		if (airportValue !== 'All' && branchSelectedIndex !== '' && branchSelectedIndex !== 0 && featureList.length > 0) {
			getFeatureDetails(featureList[branchSelectedIndex - 1].properties, returnPCiDetailsonBranch)
		}
		if (airportValue && airportValue !== 'All' && branchSelectedIndex !== '' && branchSelectedIndex !== '0') {
			setBrnachId(branchOption[branchSelectedIndex]?.properties?.Branch_ID)
		}
	}, [branchSelectedIndex])
	useEffect(() => {
		if (selectedDefaultYear[0] === 1) {
			if (airportValue && airportValue !== 'All') {
				const a = JSON.parse(JSON.stringify(featureList))
				const b = a.map(feature => {
					feature.properties.Branch_PCI = getBranchPCI(feature.properties.Branch_ID, feature.properties.Branch_PCI)
					feature.properties.Branch_COST = getBranchCost(feature.properties.Branch_ID)
					return feature
				})
				setFeatureList(b)
				getFeatureList(b, airportValue)
				if (branchSelectedIndex !== 0)
					getFeatureDetails(b[branchSelectedIndex - 1].properties, returnPCiDetailsonBranch)
			}
		} else if (selectedDefaultYear[0] === 0) {
			setFeatureList(saveFeatureList)
			getFeatureList(saveFeatureList, airportValue)
			if (branchSelectedIndex !== 0)
				getFeatureDetails(saveFeatureList[branchSelectedIndex - 1].properties, returnPCiDetailsonBranch)
		}

	}, [selectedDefaultYear, aggregationIndex])

	const getIconStyle = (feature, zoom = 0) => {
		let iconImg
		const pciValue = parseInt(feature[branchOption[branchSelectedIndex].value])
		if (pciValue >= 0 && pciValue <= 10) {
			iconImg = '/images/pci_0_10.png'
		} else if (pciValue >= 11 && pciValue <= 25) {
			iconImg = '/images/pci_11_25.png'
		} else if (pciValue >= 26 && pciValue <= 40) {
			iconImg = '/images/	pci_26_40.png'
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
		console.log('*********', zoom, featureList)
		if (zoom < 13 && featureList.length == 0 && !isNaN(pciValue)) {
			iconStyle.push(new Style({
				image: new Icon({
					anchor: [24, 48],
					anchorXUnits: 'pixels',
					anchorYUnits: 'pixels',
					imgSize: [48, 48],
					src: iconImg,
				})
			}))
		} else if (zoom >= 13 && featureList.length > 0) {
			iconStyle.pop()
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
			if (airportValue === 'All') {
				//getAirportAPICall(airportValue)
				console.log('llll', airportValue)
				removeVectorLayer()
				setCenter([-8273217.3285074355, 4894920.085748969])
				//setZoom1(8.3)
				map.getView().animate({
					center: [-8273217.3285074355, 4894920.085748969],
					zoom: 8.3,
					duration: 2000,
				})
			}
			map.on('moveend', (e) => {
				var newZoom = map.getView().getZoom();
				console.log('ff', newZoom)
				//getAirportDetails(newZoom)
			});
		}

	}, [airportValue])

	useEffect(() => {
		if (airportValue) {
			setBrnachId()
			if (airportValue !== 'All') {
				getAirportAPICall(airportValue)
				removeVectorLayer()
			}
		}
	}, [aggregationDetails])



	useEffect(() => {
		setList(airtPortDetailsMap)
		if (airtPortDetailsMap.length > 0) {
			map.on('singleclick', (e) => {
				map.forEachFeatureAtPixel(e.pixel, function (feature) {
					if (feature?.values_?.networkId) {
						setAirportValue(feature?.values_?.networkId)
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
			controls: [new FullScreen()],
			overlays: [],
			interactions: defaultInteractions().extend([new DragRotateAndZoom(), new PinchZoom()
			]),
		}
		mapObject = new ol.Map(options);
		mapObject.addControl(new ZoomSlider())
		//mapObject.controls.push
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

			popup.setPosition(undefined);
			mapObject.forEachFeatureAtPixel(evt.pixel, function (feature) {
				setPrincentonAirport([])
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
		if (airportFeatureList.length > 0 && airportValue === 'All') {
			console.log('test')
			getAirportDetails()
			//setCenter([-8273217.3285074355, 4894920.085748969])
		}

		// if (airportFeatureList.length > 0 && map) {
		// 	map.on('moveend', (e) => {
		// 		var newZoom = map.getView().getZoom();
		// 		getAirportDetails(newZoom)
		// 	});
		// }

	}, [JSON.stringify(airportFeatureList), map, branchSelectedIndex, aggregationIndex, airportValue])

	const getAirportAPICall = (value) => {
		console.log('shubhajit')
		let map1 = mapObject || map
		axios.all([axios.get(`https://services7.arcgis.com/N4ykIOFU2FfLoqPT/ArcGIS/rest/services/N87Prototype/FeatureServer/1/query?outFields=*&spatialRel=esriSpatialRelIntersects&where=Network_ID=%27${value}%27&f=geojson`),
		axios.get(`https://services7.arcgis.com/N4ykIOFU2FfLoqPT/ArcGIS/rest/services/N87Prototype/FeatureServer/0/query?outFields=*&spatialRel=esriSpatialRelIntersects&where=Network_ID=%27${value}%27&f=geojson`)]
		).then(axios.spread((...res) => {
			const ab = JSON.parse(JSON.stringify(res[0].data.features))
			//ab.push(JSON.parse(JSON.stringify(res[0].data.features)))
			//const ab = 
			//console.log('call', c === res[0].data.features.toString())
			setSaveFeatureList(ab)
			//setResponse(ab)
			updatefeatureList(res[0].data.features, value)
			const a = fromLonLat(res[1].data.features[0].geometry.coordinates)
			map1.getView().animate({
				center: a,
				zoom: 15.5,
				duration: 2000,
			})
			setZoom1(15.5)
			if (value !== '')
				updateAirportDropDown1(value)
		}))
	}

	const updatefeatureList = (res, val) => {
		if (selectedDefaultYear[0] === 1) {
			const a = res.map(feature => {
				feature.properties.Branch_PCI = getBranchPCI(feature.properties.Branch_ID, feature.properties.Branch_PCI)
				feature.properties.Branch_COST = getBranchCost(feature.properties.Branch_ID)
				return feature
			})
			const b = JSON.parse(JSON.stringify(a))
			setFeatureList(b)
			getFeatureList(b, val)
		}

		// ab.map(fature => {
		// 	...feature,

		// })

	}

	const getAirportDetails = (zoomLevel = zoom) => {
		console.log('cc')
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

	// useEffect(() => {
	// 	console.log('zoom1', zoom1)
	// 	if (!map) return;
	// 	console.log('map')
	// 	map.getView().animate({
	// 		zoom: zoom1,
	// 		duration: 2000,
	// 	})
	// }, [zoom1]);

	// center change handler
	useEffect(() => {
		if (!map) return;
		map.getView().setCenter(center)
	}, [center])



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
	//[aggregationOption[aggregationIndex]
	const getBranchPCI = (branchid, branchpci) => {
		if (airportValue && aggregationDetails[airportValue][years[selectedDefaultYear[0]].options[selectedDefaultYear[1]].value] && selectedDefaultYear[0] === 1 && Object.keys(aggregationDetails[airportValue][years[selectedDefaultYear[0]].options[selectedDefaultYear[1]].value]).includes(branchid)) {
			return parseInt(aggregationDetails[airportValue][years[selectedDefaultYear[0]].options[selectedDefaultYear[1]].value][branchid]?.noFunding?.pci)
		}

		else
			return branchpci
	}

	const getBranchCost = (branchid) => {
		if (airportValue && aggregationDetails[airportValue][years[selectedDefaultYear[0]].options[selectedDefaultYear[1]].value] && selectedDefaultYear[0] === 1 && Object.keys(aggregationDetails[airportValue][years[selectedDefaultYear[0]].options[selectedDefaultYear[1]].value]).includes(branchid))
			return parseInt(aggregationDetails[airportValue][years[selectedDefaultYear[0]].options[selectedDefaultYear[1]].value][branchid]?.noFunding?.cost)
	}

	const isBrnchPCI = (branchId) => {
		//const a = 2

		if (selectedDefaultYear[0] === 0)
			return true
		if (aggregationDetails[airportValue][years[selectedDefaultYear[0]].options[selectedDefaultYear[1]].value] && Object.keys(aggregationDetails[airportValue][years[selectedDefaultYear[0]].options[selectedDefaultYear[1]].value]).includes(branchId)) {
			const pcival = aggregationDetails[airportValue][years[selectedDefaultYear[0]].options[selectedDefaultYear[1]].value][branchId]?.noFunding?.pci
			return pcival || pcival !== null
		}
		return false
	}

	return (
		<>
			<div className="map-details">
				<MapContext.Provider value={{ map }}>
					<div ref={mapRef} className="ol-map">
						<BaseMapPortal showModal={showBaseMap} onBaseMapchange={onBaseMapchange} />
						{children}
						{/* {console.log('aggregationDetails', aggregationDetails && aggregationDetails[airportValue][years[selectedDefaultYear[0]].options[selectedDefaultYear[1]].value])} */}
						{airportValue && airportValue !== 'All' && featureList.length > 0 && featureList.map(feature => (
							<>
								{
									(aggregationDetails[airportValue] && aggregationDetails[airportValue][years[selectedDefaultYear[0]].options[selectedDefaultYear[1]].value] || selectedDefaultYear[0] === 0) && Object.keys(aggregationDetails).length > 0 && isBrnchPCI(feature.properties.Branch_ID) && (

										<VectorLayer
											source={vectorObject({
												features: new GeoJSON().readFeatures(feature, {
													featureProjection: get("EPSG:3857"),
												}),
											})}
											style={FeatureStyles.MultiPolygon(getPCIColorOnFeature(getBranchPCI(feature.properties.Branch_ID, feature.properties.Branch_PCI), feature), branchId === feature.properties.Branch_ID ? 3 : 0)} zIndex={2}
											visible={showLayer} branchid={branchId} feature={feature}
										/>

									)
								}

							</>
						))}
						{
							airportValue && airportValue === 'All' && coordinateList.length > 0 && (
								<VectorLayerPoint
									source={new vectorObjectForPoint(coordinateList)}
									visible={true} zIndex={2}
								/>
							)
						}
						<img className='basemap-grid' src='images/grid.png' alt='basemap-grid'
							onClick={() => { setShowBaseMap(true) }}
						/>
						<div className="map-pci-details">
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
							![0, ''].includes(branchSelectedIndex) && pciDetails?.pcidetails?.length > 0 && pciDetails?.quantity?.length > 0 && (<AirtportDetailsPopUp pciDetails={pciDetails}
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