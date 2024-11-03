import React, { useState } from 'react';
import './QuestionPage4CSS.css';

const options = ["On Campus", "Off Campus", "Both"];

function Question4Page({ onNext }) {
  const [selectedOption, setSelectedOption] = useState('');

  const toggleOption = (option) => {
    setSelectedOption(option === selectedOption ? '' : option);
  };

  const handleNext = () => {
    if (selectedOption) {
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
