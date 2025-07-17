import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-root">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="black-text">SyncPath brings all your</span><br />
            <span className="blue-text">tasks, teammates, and tools</span><br />
            <span className="black-text">together.</span>
          </h1>

          <p className="hero-desc">
            Keep everything in the same place — even if your team isn't.
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="hero-btn primary">Sign up — it’s free!</Link>
            <button className="hero-btn secondary">Watch video</button>
          </div>
        </div>
      </section>

      <div className="boards-section">
        <div className="board-colum">
          <h3>📋 To Do</h3>
          <div className="task-card">
            <h4>Design new homepage</h4>
            <div className="task-footer">
              <span className="avatar orange">DM</span>
              <small>Due tomorrow</small>
            </div>
          </div>
          <div className="task-card">
            <h4>User research</h4>
            <div className="task-footer">
              <span className="avatar green">JS</span>
            </div>
          </div>
        </div>

        <div className="board-colum">
          <h3>⚡ In Progress</h3>
          <div className="task-card">
            <h4>Implement authentication</h4>
            <div className="task-footer">
              <span className="avatar blue">AS</span>
            </div>
          </div>
        </div>

        <div className="board-colum">
          <h3>✅ Done</h3>
          <div className="task-card">
            <h4>Setup project structure</h4>
            <div className="task-footer">
              <span className="avatar purple">MK</span>
            </div>
          </div>
        </div>
      </div>

      <section className="info-section">
        <div className="info-card">
          <div className="info-icon blue">📋</div>
          <h4>Boards</h4>
          <p>Keep tasks organized and work moving forward. See everything from "to-do" to "aww yeah we did it!".</p>
        </div>
        <div className="info-card">
          <div className="info-icon green">📅</div>
          <h4>Lists</h4>
          <p>Stages of a task. Start simple, or build a workflow custom to your team's needs.</p>
        </div>
        <div className="info-card">
          <div className="info-icon orange">📊</div>
          <h4>Cards</h4>
          <p>Hold all the info to get the job done. Move cards across lists to show progress.</p>
        </div>
      </section>

      <section className="cta-section">
        <h2>Get started in seconds</h2>
        <p>Millions of people trust Trello to turn their dreams into reality.</p>
        <Link to="/register" className="hero-btn primary cta-btn">Sign up — it’s free!</Link>
      </section>
    </div>
  );
};

export default Home;