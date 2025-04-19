import React from 'react';
import "./App.css";

function LoginPage({ onSignUp, onSignInClick}) {
    return (
      <div className="login-page">
        <div className="logo-container">
          <h1 className="logo">Card<span className="logo-accent">⚡</span>Genius</h1>
        </div>
        <div className="button-group">
          <button className="button" onClick={onSignInClick}>Sign in</button>
          <button className="button" onClick={onSignUp}>Sign up</button>
        </div>
      </div>
    );
  }

  export default LoginPage;  