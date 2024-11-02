import React from "react";
import "./HomePage.css";

function HomePage() {
  return (
    <div className="homepage-container">
      <h1 className="homepage-title">What’s the move?</h1>
      <div className="homepage-underline"></div>
      <div className="card-container">
        <div className="card">
          <div className="card-icon-placeholder">👁️</div> {/* View icon placeholder */}
          <p>View your events</p>
        </div>
        <div className="card">
          <div className="card-icon-placeholder">📅</div> {/* Calendar icon placeholder */}
          <p>Find new events</p>
        </div>
        <div className="card">
          <div className="card-icon-placeholder">➕</div> {/* Plus icon placeholder */}
          <p>Create event post</p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
