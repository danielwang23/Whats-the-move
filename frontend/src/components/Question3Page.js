// src/components/Question3Page.js
import React, { useState } from 'react';
import '../styles/QuestionPage3CSS.css';

const options = ["Less than 1 hour", "1–2 hours", "2–4 hours", "All day"];

function Question3Page({ preferences, setPreferences, onNext }) {
  const [selectedOption, setSelectedOption] = useState(preferences.Duration || '');

  const toggleOption = (option) => {
    setSelectedOption(option === selectedOption ? '' : option);
  };

  const handleNext = () => {
    if (selectedOption) {
      setPreferences({
        ...preferences,
        Duration: selectedOption,
      });
      onNext();
    }
  };

  return (
    <div className="question-wrapper">
      <div className="question-page">
        <h1 className="question-title">How much time do you have for this activity?</h1>
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

export default Question3Page;
