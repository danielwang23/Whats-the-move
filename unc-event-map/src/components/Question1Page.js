import React, { useState } from 'react';
import './QuestionPage1CSS.css';


function Question1Page({ onNext }) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
  };

  const handleNext = () => {
    if (selectedDate && selectedTime) {
      onNext();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && selectedDate && selectedTime) {
      handleNext();
    }
  };

  return (
    <div className="question-wrapper">
      <div className="question-page">
        <h1 className="question-title">When would you like to go out?</h1>

        {/* Date Picker */}
        <label className="question-label">Select Date:</label>
        <input
          type="date"
          className="question-input"
          value={selectedDate}
          onChange={handleDateChange}
          onKeyPress={handleKeyPress}
          placeholder="mm/dd/yyyy"
        />

        {/* Time Picker */}
        <label className="question-label">Select Time:</label>
        <input
          type="time"
          className="question-input"
          value={selectedTime}
          onChange={handleTimeChange}
          onKeyPress={handleKeyPress}
        />
      </div>
    </div>
  );
}

export default Question1Page;