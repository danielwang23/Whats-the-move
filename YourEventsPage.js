import React from 'react';
import './YourEventsPage.css';

function YourEventsPage({ onBack, events, onDeleteEvent }) {
    return (
        <div className="your-events-page">
          <h2>Your Events</h2>
          <div className="events-list">
            {events.map((event, index) => (
              <div key={index} className="event-item">
                <h3>{event.title || event.name}</h3>
                
                {event.description && <p><strong>Description:</strong> {event.description}</p>}
                {event.categories && <p><strong>Category:</strong> {event.categories.join(", ")}</p>}
                
                <p><strong>Location:</strong> {event.location || event.address}</p>
                
                {/* Use startDate and endDate for map events */}
                {event.startDate && event.endDate ? (
                  <p><strong>Date:</strong> {event.startDate} - {event.endDate}</p>
                ) : (
                  <p><strong>Date:</strong> {event.date || 'Not available'}</p>
                )}
                
                {event.cost !== undefined && <p><strong>Cost:</strong> ${event.cost}</p>}
                {event.onOffCampus && <p><strong>On/Off Campus:</strong> {event.onOffCampus}</p>}

                <button onClick={() => onDeleteEvent(index)} className="delete-button">Delete</button>
              </div>
            ))}
          </div>
          <button onClick={onBack} className="your-back-button">Back</button>
        </div>
      );
}

export default YourEventsPage;
