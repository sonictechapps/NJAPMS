import { useContext, useEffect } from "react";
import MapContext from "../Map/MapContext";
import OLVectorLayer from "ol/layer/Vector";

const  VectorLayer = ({ source, style, zIndex = 0, visible, branchid, feature, branchSelectedIndex, branchOption }) => {
	const { map } = useContext(MapContext)
	useEffect(() => {
		if (!map) return;
			let vectorLayer = new OLVectorLayer({
				source,
				style,
				title: 'abc',
				focusFeature: branchid ==  feature?.properties?.Branch_ID,
				visible,
				branchOption
			});
			
			if (branchOption.length > 1) {
				map.removeLayer(vectorLayer);
				map.addLayer(vectorLayer);
				vectorLayer.setZIndex(zIndex);
			}
			
		

		return () => {
			if (map) {
				map.removeLayer(vectorLayer);
			}
		};
	}, [map, visible, feature.properties.Branch_PCI, branchid, branchOption])
	return null;
};

export default VectorLayer;