import React, { useState } from "react";
import "./App.css";

// ✅ Make sure the stage is included (e.g. /prod)
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
        body: JSON.stringify({
          account,
          psw: password
        })
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ Successful login
        onLoginSuccess({
          username: account,
          userId: data.user_id,
          isPremium: false,   // ← If you need premium check, you’ll get it from /getUserProfile next
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
      <div className="logo-container">
        <h2 className="logo">Sign In</h2>
      </div>
      <div className="form">
        <input
          type="text"
          placeholder="Account"
          value={account}
          onChange={(e) => setAccount(e.target.value)}
          className="input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
        />
        {error && <div className="error">{error}</div>}
        <div className="button-group">
          <button className="button" onClick={handleLogin}>Login</button>
          <button className="button" onClick={onBack}>Back</button>
        </div>
      </div>
    </div>
  );
}

export default SignInPage;
