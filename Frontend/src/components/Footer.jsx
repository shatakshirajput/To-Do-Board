
import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <span>© {new Date().getFullYear()} Shatakshi Rajput. All rights reserved.</span>
        <div className="footer-links">
          <a href="/Shatakshi_Rajput_Resume.pdf" target="_blank" rel="noopener noreferrer">Resume</a>
          <a href="https://www.linkedin.com/in/shatakshi-rajput" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="https://x.com/shatakshi_rajput" target="_blank" rel="noopener noreferrer">Twitter</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
