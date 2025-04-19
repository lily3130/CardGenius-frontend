import React, { useState } from "react";
import "./App.css";

const API_BASE = "https://17hxyu8crd.execute-api.ap-southeast-1.amazonaws.com";

function RegisterPage({ onCreateAccount }) {
    const [username, setUsername] = useState('');
    const [account, setAccount] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
  
    const handleSubmit = async (e) => {
      e.preventDefault();

      if ( !username || !account || !password || !confirmPassword) {
        setError("All fields are required.");
        return;
      }
      if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
      setError('');

      try {
        const res = await fetch(`${API_BASE}/register`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            user_name: username,
            account,
            psw: password
          })
        });
  
        const data = await res.json();
  
        if (res.ok) {
          alert(data.message || "Registration successful!");
          onCreateAccount({
            username: username,
            password,
            account,
          });
        } else {
          setError(data.error || "Registration failed.");
        }
      } catch (err) {
        console.error("Registration error:", err);
        setError("Network or server error.");
      }
    };

    return (
      
        <div className="register-page-wrapper">
          <h1 className="welcome-title">Welcome To CardGenius!</h1>
          <form className="register-form" onSubmit={handleSubmit}>
            
              <label>Name:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <label>Account:</label>
              <input
                type="text"
                value={account}
                onChange={(e) => setAccount(e.target.value)}
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