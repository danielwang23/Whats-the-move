import React from 'react';

function Question2Page({ onNext }) {
  return (
    <div className="question-page">
      <h2>Question 2</h2>
      <button onClick={onNext}>Next</button>
    </div>
  );
}

export default Question2Page;