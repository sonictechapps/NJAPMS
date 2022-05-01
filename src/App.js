import './App.scss';
import Map from './components/Map/Map';
import Layers from './components/Layer/Layers';
import { useState } from 'react';
import Controls from './components/controls/Controls';
import FullScreenControl from './components/controls/FullScreenControl';
import ZoomSliderControl from './components/controls/ZoomSiderControl';

function App() {
  const [zoom, setZoom] = useState(15)
  return (
    <div className="App">
      <Map zoom={zoom}>
        <Layers>
        </Layers>
        <Controls>
          <FullScreenControl />
          <ZoomSliderControl />
        </Controls>
      </Map>
    </div>
  );
}

export default App
