import React from "react";
import "./Jacklog.css"; // Make sure to style this in your CSS file

function App() {
  return (
    <div className="login-container">
      <h1 className="title">What's the Move?</h1>
      <div className="login-box">
        <input
          type="text"
          placeholder="Username"
          className="input-field"
        />
        <input
          type="password"
          placeholder="Password"
          className="input-field"
        />
        <button className="login-button">Log In</button>
        <p className="signup-text">
          Don’t have an account? <a href="/signup">Create an account</a>
        </p>
      </div>
    </div>
  );
}

export default App;
