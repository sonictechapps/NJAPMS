import { useContext, useEffect } from "react";
import MapContext from "../Map/MapContext";
import Tile from "ol/layer/Tile";

const TileLayer = ({ source, zIndex = 0 }) => {
	const { map } = useContext(MapContext);

	useEffect(() => {
		if (!map) return;

		let tileLayer = new Tile({
			source,
			zIndex,
		});

		map.addLayer(tileLayer);
		tileLayer.setZIndex(zIndex);

		return () => {
			if (map) {
				map.removeLayer(tileLayer);
			}
		};
	}, [map]);

	return null;
};

export default TileLayer;