import { useContext, useEffect } from "react";
import MapContext from "../Map/MapContext";
import VectorLayer from "ol/layer/Vector";

const VectorLayerPoint = ({ source, zIndex = 0 }) => {
	const { map } = useContext(MapContext);
	useEffect(() => {
		if (!map) return;
		let vectorLayer = new VectorLayer({
			source,
			title: 'airport',
		});
        map.addLayer(vectorLayer);
		
		vectorLayer.setZIndex(zIndex);

		return () => {
			if (map) {
				map.removeLayer(vectorLayer);
			}
		};
	}, [map, source]);

	return null;
};

export default VectorLayerPoint;