import React, { useState } from 'react'
import Map from './../components/Map/Map';
import Layers from './../components/Layer/Layers';
import Controls from './../components/controls/Controls';
import FullScreenControl from './../components/controls/FullScreenControl';
import ZoomSliderControl from './../components/controls/ZoomSiderControl';
import { Link } from 'react-router-dom';

function Home() {
    
  const [zoom, setZoom] = useState(15)
  return (
      <React.Fragment>
      
      <Map zoom={zoom}>
        <Layers>
        </Layers>
        <Controls>
          <FullScreenControl />
          <ZoomSliderControl />
        </Controls>
      </Map>
      </React.Fragment>
     
  )
}

export default Home