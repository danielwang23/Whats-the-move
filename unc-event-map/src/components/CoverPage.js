import React from 'react';
import './CoverPageCSS.css';

function CoverPage({onNext}) {
  return (
    <div className="cover-page">
      <h1 className="cover-title">What's the Move?</h1>
      <button className="cover-button" onClick={onNext}>Get started!</button>
    </div>
  );
}

export default CoverPage;