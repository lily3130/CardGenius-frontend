import React from 'react';
import "./App.css";

function LoginPage({ onSignUp, onSignIn }) {
    return (
      <div className="login-page">
        <div className="logo-container">
          <h1 className="logo">Card<span className="logo-accent">⚡</span>Genius</h1>
        </div>
        <div className="button-group">
          <button className="button" onClick={() => onSignIn(false)}>Sign in as Free</button>
          <button className="button" onClick={() => onSignIn(true)}>Sign in as Premium</button>
          <button className="button" onClick={onSignUp}>Sign up</button>
        </div>
      </div>
    );
  }

  export default LoginPage;  