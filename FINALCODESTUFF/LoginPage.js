import React, { useState } from 'react';
import './LoginPage.css';


// function LoginPage({ onLogin }) {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');

//   const handleLogin = () => {
//     if (username && password) {
//       onLogin(username); // Pass username to AccountPage
//     }
//   };

//   return (
//     <div className="login-page">
//       <h2>Login</h2>
//       <input
//         type="text"
//         placeholder="Username"
//         value={username}
//         onChange={(e) => setUsername(e.target.value)}
//       />
//       <input
//         type="password"
//         placeholder="Password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//       />
//       <button onClick={handleLogin} disabled={!username || !password}>
//         Login
//       </button>
//     </div>
//   );
// }

// export default LoginPage;

function SignIn({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
  
    const handleLogin = (e) => {
      e.preventDefault(); // Prevent form submission from reloading the page
      if (username && password) {
        onLogin(username); // Pass username to AccountPage
      }
    };
  
    return (
        <div className="login-page-body">
        <div className="signin-container">
          <h1 className="signin-title">Sign In</h1>
          
          <form className="signin-form" onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="signin-input"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="signin-input"
            />
            
            <button type="submit" className="signin-button" disabled={!username || !password}>
              Sign In
            </button>
          </form>
          
          <p className="signin-footer">
            Don’t have an account? <span className="create-account">Create an account</span>
          </p>
        </div>
      </div>
    );
  }
  
  export default SignIn;