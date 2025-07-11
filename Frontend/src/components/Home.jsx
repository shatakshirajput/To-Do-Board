import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-root">
      <section className="hero-section">
        <div className="hero-content fade-in">
          <h1 className="hero-title">Collaborate in Real-Time. Organize Effortlessly.</h1>
          <p className="hero-desc">
            Experience seamless teamwork with real-time sync, intuitive drag-and-drop Kanban boards, smart task assignment, and built-in conflict resolution. Stay productive, together.
          </p>
          <div className="hero-buttons slide-up">
            <Link to="/login" className="hero-btn primary">Login</Link>
            <Link to="/register" className="hero-btn secondary">Register</Link>
          </div>
        </div>
        <div className="hero-illustration slide-up">
          <img src="/To_Do_image.png" alt="To-Do Board Illustration" className="hero-img" />
        </div>
      </section>

      <section id="features" className="features-section fade-in">
        <h2>Features</h2>
        <div className="features-list">
          <div className="feature-card">
            <h3>Real-Time Sync</h3>
            <p>See updates instantly as your team collaborates on tasks.</p>
          </div>
          <div className="feature-card">
            <h3>Drag-and-Drop Kanban</h3>
            <p>Organize tasks visually with a beautiful, interactive board.</p>
          </div>
          <div className="feature-card">
            <h3>Smart Assign</h3>
            <p>Let the app suggest the best person for each task automatically.</p>
          </div>
          <div className="feature-card">
            <h3>Conflict Resolution</h3>
            <p>Handle simultaneous edits gracefully with built-in conflict handling.</p>
          </div>
        </div>
      </section>

      <section id="about" className="about-section fade-in">
        <h2>About</h2>
        <p>
          To-Do Board is a collaborative productivity tool designed for teams who value efficiency and transparency. Built with the latest web technologies, it ensures your workflow is always smooth, secure, and up-to-date.
        </p>
      </section>
    </div>
  );
};

export default Home; 