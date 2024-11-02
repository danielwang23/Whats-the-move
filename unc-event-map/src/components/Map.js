import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import eventLocations from '../data/eventLocations';
import L from 'leaflet';
import './Map.css';

// Fix Leaflet marker icon issue with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const Map = ({onBack}) => {
  return (
    <div className="map-page">
      <header className="map-header">
        <h1>UNC Events Map</h1>
        <button onClick={onBack} className="back-button">Back to Account Page</button>
      </header>
      <MapContainer center={[35.9049, -79.0469]} zoom={15} style={{ height: "100vh", width: "100%" }}>
        <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {eventLocations.map((location, index) => (
            <Marker key={index} position={location.coordinates}>
            <Popup>{location.name}</Popup>
            </Marker>
        ))}
        </MapContainer>
    </div>
  );
};

export default Map;