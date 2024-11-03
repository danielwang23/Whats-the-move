// src/components/Map.js
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import '../styles/Map.css';

// Fix Leaflet marker icon issue with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const Map = ({ onBack, algorithmResult }) => {
  return (
    <div className="map-page">
      <header className="map-header">
        <h1>UNC Events Map</h1>
        <button onClick={onBack} className="back-button">Back to Account Page</button>
      </header>

      {algorithmResult ? (
        <div className="event-details">
          <h2>Recommended Event:</h2>
          <h3>{algorithmResult.Title}</h3>
          <p><strong>Date:</strong> {algorithmResult['Start Time']}</p>
          <p><strong>Location:</strong> {algorithmResult.Location}</p>
          <p><strong>Description:</strong> {algorithmResult.Description}</p>
          <p><strong>Cost:</strong> ${algorithmResult.Cost}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}

      <MapContainer center={[35.9049, -79.0469]} zoom={15} style={{ height: "50vh", width: "100%" }}>
        <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='© OpenStreetMap contributors'
        />

        {algorithmResult && algorithmResult.Latitude && algorithmResult.Longitude && (
          <Marker position={[algorithmResult.Latitude, algorithmResult.Longitude]}>
            <Popup>{algorithmResult.Title}</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default Map;
