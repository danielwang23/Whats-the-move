import React from 'react';

function Question1Page({ onNext }) {
  return (
    <div className="question-page">
      <h2>Question 1</h2>
      <button onClick={onNext}>Next</button>
    </div>
  );
}

export default Question1Page;