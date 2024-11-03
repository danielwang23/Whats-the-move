import React, { useState } from 'react';
import './QuestionPage5CSS.css';

function Question5Page({ onNext }) {
  const [budget, setBudget] = useState(10); 
  const [anyBudget, setAnyBudget] = useState(false);

  const handleBudgetChange = (e) => {
    setBudget(e.target.value);
  };

  const handleAnyBudgetChange = () => {
    setAnyBudget(!anyBudget);
  };

  const handleNext = () => {
    onNext();
  };

  return (
    <div className="question-wrapper">
      <div className="question-page">
        <h1 className="question-title">What’s your budget?</h1>
        
        <div className="slider-container">
          <input
            type="range"
            min="0"
            max="100"
            value={budget}
            onChange={handleBudgetChange}
            className="budget-slider"
            disabled={anyBudget}
          />
          <span className="budget-display">
            {anyBudget ? "Any" : `$${budget}`}
          </span>
        </div>
        
        <label className="any-budget-label">
          <input
            type="checkbox"
            checked={anyBudget}
            onChange={handleAnyBudgetChange}
            className="any-budget-checkbox"
          />
          Any Budget
        </label>

        <button onClick={handleNext} className="next-button">
          Next
        </button>
      </div>
    </div>
  );
}

export default Question5Page;
