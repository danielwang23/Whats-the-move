// src/components/Question4Page.js
import React, { useState } from 'react';
import '../styles/QuestionPage4CSS.css';

const options = ["On Campus", "Off Campus", "Both"];

function Question4Page({ preferences, setPreferences, onNext }) {
  const [selectedOption, setSelectedOption] = useState(preferences.Location || '');

  const toggleOption = (option) => {
    setSelectedOption(option === selectedOption ? '' : option);
  };

  const handleNext = () => {
    if (selectedOption) {
      setPreferences({
        ...preferences,
        Location: selectedOption,
      });
      onNext();
    }
  };

  return (
    <div className="question-wrapper">
      <div className="question-page">
        <h1 className="question-title">Location Preference:</h1>
        <div className="options-container">
          {options.map((option) => (
            <div
              key={option}
              className={`option-box ${selectedOption === option ? 'selected' : ''}`}
              onClick={() => toggleOption(option)}
            >
              {option}
            </div>
          ))}
        </div>
        <button onClick={handleNext} disabled={!selectedOption} className="next-button">
          Next
        </button>
      </div>
    </div>
  );
}

export default Question4Page;
