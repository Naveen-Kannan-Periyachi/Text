import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "../App.css";
// ...existing code...
import { GoogleLogin } from '@react-oauth/google';

function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      setMessage("");
      return;
    }
    setError("");
    setMessage("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        setUser({ name: data.user.name, email: data.user.email });
        setMessage("Login successful!");
        navigate("/");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Login failed: " + err.message);
    }
  };

  // ...existing code...

  return (
    <div className="app-home">
      <Navbar active="login">
        <a href="/login" className="nav-link nav-active">Login</a>
        <a href="/signup" className="nav-link">Sign Up</a>
      </Navbar>
      <main className="home-main">
        <section className="main-section">
          <h1 className="fancy-title">Login</h1>
          <form className="file-uploader-card glassmorph-uploader" onSubmit={handleSubmit} style={{maxWidth: 400, margin: "0 auto"}}>
            <input type="email" className="file-input fancy-input" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
            <input type="password" className="file-input fancy-input" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
            <button type="submit" className="suggestion-submit fancy-btn" style={{marginTop: '1rem'}}>Login</button>
            <div style={{marginTop: '1rem'}}>
              <GoogleLogin
                onSuccess={async credentialResponse => {
                  // Decode Google JWT to get user info
                  const token = credentialResponse.credential;
                  let userInfo = { name: "Google User", email: "" };
                  try {
                    const base64Url = token.split('.')[1];
                    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                    }).join(''));
                    const payload = JSON.parse(jsonPayload);
                    userInfo = { name: payload.name, email: payload.email };
                  } catch { /* ignore decode errors */ }
                  // Send to backend for MongoDB storage
                  await fetch("/api/actions/google-user", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: userInfo.email, name: userInfo.name })
                  });
                  setUser(userInfo);
                  navigate("/");
                }}
                onError={() => {
                  setError("Google Login Error");
                }}
              />
            </div>
            {error && <div className="error-msg">{error}</div>}
            {message && <div className="success-msg">{message}</div>}
          </form>
        </section>
      </main>
    </div>
  );
}

export default Login;
