import './App.scss';
import Map from './components/Map/Map';
import Layers from './components/Layer/Layers';
import { useState } from 'react';

function App() {
  const [zoom, setZoom] = useState(15)
  return (
    <div className="App">
      <Map zoom={zoom}>
        <Layers>
        </Layers>
      </Map>
    </div>
  );
}

export default App
