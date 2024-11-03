import React, { useEffect, useState } from 'react';

function YourEventsPage({ onBack }) {
  const [savedEvents, setSavedEvents] = useState([]);

  useEffect(() => {
    // Load saved events from local storage without clearing
    const events = JSON.parse(localStorage.getItem("savedEvents")) || [];
    setSavedEvents(events);
  }, []);

  const handleClearEvents = () => {
    // Clear saved events from local storage and update state
    localStorage.removeItem("savedEvents");
    setSavedEvents([]);
  };

  return (
    <div className="your-events-page">
      <h2>Your Events</h2>
      <button onClick={onBack} className="back-button">Back</button>
      
      {savedEvents.length > 0 ? (
        <>
          <div className="events-list">
            {savedEvents.map((event, index) => (
              <div key={index} className="event-item">
                <h3>{event.name}</h3>
                <p><strong>Location:</strong> {event.address}</p>
                <p><strong>Date:</strong> {event.date}</p>
                <p><strong>Time:</strong> {event.time}</p>
              </div>
            ))}
          </div>
          <button onClick={handleClearEvents} className="clear-button">Clear All Events</button>
        </>
      ) : (
        <p className="no-events">No events saved yet.</p>
      )}
    </div>
  );
}

export default YourEventsPage;
