import React from 'react';
import './Login.css';

function SignIn() {
  return (
    <div className="signin-container">
      <h1 className="signin-title">Sign In</h1>
      
      <form className="signin-form">
        <input type="email" placeholder="Username" className="signin-input" />
        <input type="password" placeholder="Password" className="signin-input" />
        
        <button type="submit" className="signin-button">Sign In.</button>
      </form>
      
      <p className="signin-footer">
        Don’t have an account? <span className="create-account">Create an account</span>
      </p>
    </div>
  );
}

export default SignIn;
