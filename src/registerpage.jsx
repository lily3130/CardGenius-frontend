import React, { useState } from "react";
import "./App.css";

function RegisterPage({ onCreateAccount }) {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
  
    const handleSubmit = (e) => {
      e.preventDefault();
      if (!name || !username || !password || !confirmPassword) {
        setError("There are missing fields");
        return;
      }
      if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
      setError('');
      onCreateAccount({ name, username, password });
    };
    return (
      
        <div className="register-page-wrapper">
          <h1 className="welcome-title">Welcome To CardGenius!</h1>
          <form className="register-form" onSubmit={handleSubmit}>
            
              <label>Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            
            
              <label>Username:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            
            
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            
            
              <label>Confirm password:</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            
  
            <div className="error-message">
                {error || '\u00A0'}
            </div>
  
            <div className="button-group">
              <button
                className="button"
                type="submit"
              >
                Create Account and Add Your First Card
              </button>
            </div>
          </form>
        </div>
    );
  }

  export default RegisterPage;