import React from 'react';
import './Navbar.css';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  return (
    <nav className="navbar-home">
      <div className="navbar-logo">
        <span role="img" aria-label="logo" className="logo-icon">📝</span>
        <span className="logo-text">To-Do Board</span>
      </div>
      <input type="checkbox" id="nav-toggle" className="nav-toggle" aria-label="Toggle navigation" />
      <label htmlFor="nav-toggle" className="nav-toggle-label" aria-label="Open navigation menu">
        <span></span>
      </label>
      <ul className="navbar-links">
        <li><Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link></li>
        <li><a href="#features">Features</a></li>
        <li><a href="#about">About</a></li>
        <li><Link to="/login" className={location.pathname === '/login' ? 'active' : ''}>Login</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar; 