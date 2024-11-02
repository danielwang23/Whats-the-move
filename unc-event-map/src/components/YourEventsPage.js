import React from 'react';

function YourEventsPage({ onBack }) {
  return (
    <div className="your-events-page">
      <h2>Your Events</h2>
      <button onClick={onBack}>Back</button>
    </div>
  );
}

export default YourEventsPage;