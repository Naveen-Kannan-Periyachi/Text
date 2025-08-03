import React from "react";
import { Link } from "react-router-dom";

function Navbar({ active, children, user, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <span className="project-name">
          {user ? (user.name || user.email) : "OCR Project"}
        </span>
      </div>
      <div className="navbar-right">
        <Link to="/" className={`nav-link${active === 'home' ? ' nav-active' : ''}`}>Home</Link>
        {children}
        {user && <button className="nav-link" style={{background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: '6px', marginLeft: '0.5rem', cursor: 'pointer'}} onClick={onLogout}>Logout</button>}
      </div>
    </nav>
  );
}

export default Navbar;
