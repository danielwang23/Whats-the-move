import React, { useState } from 'react';
import './MyEvents.css';

function MyEvents() {
  const [events] = useState([
    {
      id: 1,
      name: 'Sample Event',
      description: 'This is a sample event. Click to view more details.',
      date: '2024-12-01',
      location: 'New York, NY'
    },
    {
      id: 2,
      name: 'React Workshop',
      description: 'A hands-on workshop for React beginners.',
      date: '2024-12-15',
      location: 'San Francisco, CA'
    },
    {
      id: 3,
      name: 'Music Festival',
      description: 'An exciting outdoor music festival featuring local bands.',
      date: '2025-01-10',
      location: 'Austin, TX'
    }
  ]);

  const handleEventClick = (event) => {
    alert(`Viewing event: ${event.name}\nDate: ${event.date}\nLocation: ${event.location}\nDescription: ${event.description}`);
  };

  return (
    <div className="events-container">
      <h1 className="events-title">My Events</h1>

      <div className="events-list">
        {events.map((event) => (
          <div key={event.id} className="event-item" onClick={() => handleEventClick(event)}>
            <h3>{event.name}</h3>
            <p>{event.description}</p>
            <p>Date: {event.date}</p>
            <p>Location: {event.location}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyEvents;
