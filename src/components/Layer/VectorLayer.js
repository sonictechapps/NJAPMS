import { useContext, useEffect } from "react";
import MapContext from "../Map/MapContext";
import OLVectorLayer from "ol/layer/Vector";

const  VectorLayer = ({ source, style, zIndex = 0, visible, branchid, feature }) => {
	const { map } = useContext(MapContext)
	useEffect(() => {
		if (!map) return;

		let vectorLayer = new OLVectorLayer({
			source,
			style,
			title: 'abc',
			focusFeature: branchid ==  feature?.properties?.Branch_ID,
			visible,
		});
		if (branchid ==  feature?.properties?.Branch_ID) {
			map.removeLayer(vectorLayer);
			//map.addLayer(vectorLayer);
		}
		map.addLayer(vectorLayer);
		vectorLayer.setZIndex(zIndex);

		return () => {
			if (map) {
				map.removeLayer(vectorLayer);
			}
		};
	}, [map, visible, branchid]);

	return null;
};

export default VectorLayer;