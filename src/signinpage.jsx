import React, { useState } from "react";
import "./App.css";

const API_BASE = "https://17hxyu8crd.execute-api.ap-southeast-1.amazonaws.com";

function SignInPage({ onLoginSuccess, onBack }) {
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!account || !password) {
      setError("Please enter both account and password.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ account, psw: password })
      });

      const data = await res.json();

      if (res.ok) {
        onLoginSuccess({
          username: account,
          userId: data.user_id,
          isPremium: false,
          transactions: []
        });
      } else {
        setError(data.error || "Login failed.");
      }
    } catch (err) {
      setError("Network error or server not responding.");
    }
  };

  return (
    <div className="login-page">
      <div className="form-wrapper">
        <h1 className="form-title">Sign In</h1>

        <div className="form-group">
          <label>Account:</label>
          <input
            type="text"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            placeholder="Enter your account"
          />
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="button-group">
          <button className="button" onClick={handleLogin}>Login</button>
          <button className="button secondary" onClick={onBack}>Back</button>
        </div>
      </div>
    </div>
  );
}

export default SignInPage;
