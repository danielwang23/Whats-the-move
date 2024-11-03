import React, { useState } from 'react';
import './createEvent.css';

function CreateEventsPage({ onBack, onAddEvent }) {
  const [eventDetails, setEventDetails] = useState({
    title: '',
    description: '',
    categories: '',
    startTime: '',
    endTime: '',
    location: '',
    cost: 0,
    onOffCampus: 'On Campus',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation check: Ensure all required fields (except cost) are filled in
    const { title, description, categories, startTime, endTime, location } = eventDetails;
    if (!title || !description || !categories || !startTime || !endTime || !location) {
      alert('Please fill in all required fields.');
      return;
    }
    onAddEvent(eventDetails);
    // If all required fields are filled, submit the form
    alert('Event Created Successfully');
    setEventDetails({
      title: '',
      description: '',
      categories: '',
      startTime: '',
      endTime: '',
      location: '',
      cost: 0,
      onOffCampus: 'On Campus',
    });
  };

  return (
    <div className="create-event-page">
      <div className="create-event-container">
        <h2 className="create-event-title">Create Event</h2>
        <form className="create-event-form" onSubmit={handleSubmit}>
          {/* Event Title */}
          <div className="form-group full-width">
            <label className="form-label">Event Title</label>
            <input
              type="text"
              name="title"
              placeholder="Enter event title"
              value={eventDetails.title}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>

          {/* Event Description */}
          <div className="form-group full-width">
            <label className="form-label">Event Description</label>
            <textarea
              name="description"
              placeholder="Enter event description"
              value={eventDetails.description}
              onChange={handleInputChange}
              className="form-input textarea"
            ></textarea>
          </div>

          {/* Categories */}
          <div className="form-group">
            <label className="form-label">Categories</label>
            <select
              name="categories"
              value={eventDetails.categories}
              onChange={handleInputChange}
              className="form-input"
            >
              <option value="">Select a category</option>
              <option value="Arts">Arts</option>
              <option value="Community Building & Social Activities">Community Building & Social Activities</option>
              <option value="Social">Social</option>
              <option value="Cultural">Cultural</option>
              <option value="Athletics">Athletics</option>
              <option value="Learning">Learning</option>
              <option value="Service">Service</option>
              <option value="Spirituality">Spirituality</option>
              <option value="Group Business">Group Business</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Location */}
          <div className="form-group">
            <label className="form-label">Location</label>
            <input
              type="text"
              name="location"
              placeholder="Enter event location"
              value={eventDetails.location}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>

          {/* Start Time */}
          <div className="form-group">
            <label className="form-label">Start Time</label>
            <input
              type="time"
              name="startTime"
              value={eventDetails.startTime}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>

          {/* End Time */}
          <div className="form-group">
            <label className="form-label">End Time</label>
            <input
              type="time"
              name="endTime"
              value={eventDetails.endTime}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>

          {/* Cost */}
          <div className="form-group">
            <label className="form-label">Cost</label>
            <input
              type="number"
              name="cost"
              placeholder="Enter event cost"
              value={eventDetails.cost}
              onChange={handleInputChange}
              className="form-input"
              min="0"
            />
          </div>

          {/* On/Off Campus */}
          <div className="form-group">
            <label className="form-label">On/Off Campus</label>
            <select
              name="onOffCampus"
              value={eventDetails.onOffCampus}
              onChange={handleInputChange}
              className="form-input"
            >
              <option value="On Campus">On Campus</option>
              <option value="Off Campus">Off Campus</option>
            </select>
          </div>

          <button type="submit" className="submit-button">Add Event</button>
        </form>
        <button onClick={onBack} className="create-event-back-button">Back</button>
      </div>
    </div>
  );
}

export default CreateEventsPage;
