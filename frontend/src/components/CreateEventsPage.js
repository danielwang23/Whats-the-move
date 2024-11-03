import React from 'react';

function CreateEventsPage({ onBack }) {
  return (
    <div className="create-events-page">
      <h2>Create Events</h2>
      <button onClick={onBack}>Back</button>
    </div>
  );
}


export default CreateEventsPage;