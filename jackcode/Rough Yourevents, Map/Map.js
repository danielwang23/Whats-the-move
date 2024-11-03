import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import eventLocations from '../data/eventLocations'; // Import event locations data
import L from 'leaflet';
import './Map.css';

// Fix Leaflet marker icon issue with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Utility component to focus map on a specific location
const FlyToLocation = ({ coordinates }) => {
  const map = useMap();
  map.flyTo(coordinates, 15);
  return null;
};

const Map = ({ onBack }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Save event to local storage
  const handleSaveEvent = (event) => {
    const savedEvents = JSON.parse(localStorage.getItem("savedEvents")) || [];
    
    // Check if event is already saved
    const isAlreadySaved = savedEvents.some(
      (savedEvent) => savedEvent.name === event.name && savedEvent.date === event.date
    );

    if (!isAlreadySaved) {
      savedEvents.push(event);
      localStorage.setItem("savedEvents", JSON.stringify(savedEvents));
      alert(`${event.name} has been saved!`);
    } else {
      alert(`${event.name} is already saved.`);
    }
  };

  return (
    <div className="map-page">
      <header className="map-header">
        <h1>UNC Events Map</h1>
        <button onClick={onBack} className="back-button">Back to Account Page</button>
      </header>
      <div className="map-content">
        <div className="map-list">
          {eventLocations.map((location, index) => (
            <div
              key={index}
              className="map-list-item"
              onClick={() => setSelectedLocation(location.coordinates)}
            >
              <h2>{location.name}</h2>
              <p>Location: {location.address}</p>
              <p>Date: {location.date}</p>
              <p>Time: {location.time}</p>
              <button
                className="save-button"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent map focus on save
                  handleSaveEvent(location);
                }}
              >
                Save
              </button>
            </div>
          ))}
        </div>
        <MapContainer center={[35.9049, -79.0469]} zoom={15} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {selectedLocation && <FlyToLocation coordinates={selectedLocation} />}
          {eventLocations.map((location, index) => (
            <Marker key={index} position={location.coordinates}>
              <Popup>{location.name}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default Map;
