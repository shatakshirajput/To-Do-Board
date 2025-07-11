import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <span>© {new Date().getFullYear()} Ankit Gupta. All rights reserved.</span>
        <div className="footer-links">
          <a href="/Ankit_Gupta_Resume.pdf" target="_blank" rel="noopener noreferrer">Resume</a>
          <a href="https://www.linkedin.com/in/iamankit-gupta" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="https://x.com/ankitgupta_79" target="_blank" rel="noopener noreferrer">Twitter</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 