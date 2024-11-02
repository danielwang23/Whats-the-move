import React from 'react';
import './CreateAccount.css';

function CreateAccount() {
  return (
    <div className="signin-container">
      <h1 className="signin-title">Create Account</h1>
      
      <form className="signin-form">
        <input type="text" placeholder="Username" className="signin-input" />
        <input type="email" placeholder="Email" className="signin-input" />
        <input type="password" placeholder="Password" className="signin-input" />
        
        <button type="submit" className="signin-button">Sign Up</button>
      </form>
      
      <p className="signin-footer">
        Already have an account? <span className="create-account">Sign In</span>
      </p>
    </div>
  );
}

export default CreateAccount;
