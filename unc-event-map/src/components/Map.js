import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import eventLocations from '../data/eventLocations'; // Import updated event locations data
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

const Map = ({ onBack, onAddEvent }) => { 
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [savedLocations, setSavedLocations] = useState([]);

  useEffect(() => {
    const savedEvents = JSON.parse(localStorage.getItem("savedEvents")) || [];
    setSavedLocations(savedEvents);
  }, []);

  // Toggle Save/Unsave event and update local storage
  const handleSaveEvent = (event) => {
    const savedEvents = JSON.parse(localStorage.getItem("savedEvents")) || [];
    const isAlreadySaved = savedEvents.some(
      (savedEvent) => savedEvent.name === event.name
    );

    let updatedEvents;
    if (isAlreadySaved) {
      // Remove event if already saved
      updatedEvents = savedEvents.filter(
        (savedEvent) => savedEvent.name !== event.name
      );
    } else {
      // Add event if not saved
      updatedEvents = [...savedEvents, event];
      onAddEvent(event); 
    }

    localStorage.setItem("savedEvents", JSON.stringify(updatedEvents));
    setSavedLocations(updatedEvents); 
  };

  return (
    <div className="map-page">
      <header className="map-header">
        <h1>UNC Events Map</h1>
        <button onClick={onBack} className="map-back-button">Back to Account Page</button>
      </header>
      <div className="map-content">
        <div className="map-list">
          {eventLocations.map((location, index) => {
            const isSaved = savedLocations.some(
              (savedLocation) => savedLocation.name === location.name
            );

            return (
              <div
                key={index}
                className="map-list-item"
                onClick={() => setSelectedLocation(location.coordinates)}
              >
                <h2>{location.name}</h2>
                <p><strong>Location:</strong> {location.address}</p>
                <p><strong>Description:</strong> {location.description}</p>
                <p><strong>Categories:</strong> {location.categories.join(", ")}</p>
                <p><strong>Start Date:</strong> {location.startDate || 'Not available'}</p>
                <p><strong>End Date:</strong> {location.endDate || 'Not available'}</p>
                <button
                  className={`save-button ${isSaved ? "saved" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSaveEvent(location);
                  }}
                >
                  {isSaved ? "Unsave" : "Save"}
                </button>
                
              </div>
            );
          })}
        </div>
        <MapContainer center={[35.9049, -79.0469]} zoom={15} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {selectedLocation && <FlyToLocation coordinates={selectedLocation} />}
          {eventLocations.map((location, index) => (
            location.coordinates && (
              <Marker key={index} position={location.coordinates}>
                <Popup>
                  <h3>{location.name}</h3>
                  <p><strong>Location:</strong> {location.address}</p>
                  <p><strong>Description:</strong> {location.description}</p>
                  <p><strong>Categories:</strong> {location.categories.join(", ")}</p>
                  <p><strong>Start Date:</strong> {location.startDate || 'Not available'}</p>
                  <p><strong>End Date:</strong> {location.endDate || 'Not available'}</p>
                </Popup>
              </Marker>
            )
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default Map;
