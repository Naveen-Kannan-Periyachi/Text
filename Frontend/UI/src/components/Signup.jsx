import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "../App.css";
// ...existing code...
import { GoogleLogin } from '@react-oauth/google';

function Signup({ setUser }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill all fields.");
      setMessage("");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setMessage("");
      return;
    }
    setError("");
    setMessage("");
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (res.ok) {
        setUser({ name: data.user.name, email: data.user.email });
        setMessage("Signup successful!");
        navigate("/login");
      } else {
        setError(data.message || "Signup failed");
      }
    } catch (err) {
      setError("Signup failed: " + err.message);
    }
  };

  // ...existing code...

  return (
    <div className="app-home">
      <Navbar active="signup">
        <a href="/login" className="nav-link">Login</a>
        <a href="/signup" className="nav-link nav-active">Sign Up</a>
      </Navbar>
      <main className="home-main">
        <section className="main-section">
          <h1 className="fancy-title">Sign Up</h1>
          <form className="file-uploader-card glassmorph-uploader" onSubmit={handleSubmit} style={{maxWidth: 400, margin: "0 auto"}}>
            <input type="text" className="file-input fancy-input" placeholder="Username" value={name} onChange={e => setName(e.target.value)} required />
            <input type="email" className="file-input fancy-input" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
            <input type="password" className="file-input fancy-input" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
            <input type="password" className="file-input fancy-input" placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
            <button type="submit" className="suggestion-submit fancy-btn" style={{marginTop: '1rem'}}>Sign Up</button>
            <div style={{marginTop: '1rem'}}>
              <GoogleLogin
                onSuccess={async credentialResponse => {
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
                  await fetch("/api/actions/google-user", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: userInfo.email, name: userInfo.name })
                  });
                  setUser(userInfo);
                  navigate("/");
                }}
                onError={() => {
                  setError("Google Signup Error");
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

export default Signup;
