import React, { useContext, useEffect } from "react";
import MapContext from "../Map/MapContext";
import {ZoomSlider} from 'ol/control';

const ZoomSliderControl = () => {
  const { map } = useContext(MapContext);
  useEffect(() => {
    if (!map) return;
    let zoomSliderControl = new ZoomSlider();
    map.controls.push(zoomSliderControl);
    
    return () => map.controls.remove(zoomSliderControl);
  }, [map]);
  return null;
};
export default ZoomSliderControl;