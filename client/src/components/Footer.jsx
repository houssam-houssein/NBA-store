import React from 'react'
import { Link } from 'react-router-dom'
import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">QUICK LINKS</h3>
            <ul className="footer-links">
              <li><Link to="/professional-athletes">Professional Athletes</Link></li>
              <li><Link to="/influencers">Influencers</Link></li>
              <li><Link to="/high-school-athletes">High School Athletes</Link></li>
              <li><Link to="/teamwear">Teamwear</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">INFORMATION</h3>
            <ul className="footer-links">
              <li><a href="#about-us">About Us</a></li>
              <li><Link to="/shipping-returns">Shipping & Returns</Link></li>
              <li><Link to="/terms-conditions">Terms & Conditions</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">CONTACT</h3>
            <ul className="footer-links">
              <li><a href="mailto:support@jerzeylab.com">support@jerzeylab.com</a></li>
              <li><a href="mailto:sales@jerzeylab.com">sales@jerzeylab.com</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © {new Date().getFullYear()} Jerzey Lab. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

