import React, { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Footer from '../components/Footer'
import bgPoster from '../assets/images/bg-poster.png'
import logoPoster from '../assets/images/logo-poster.png'
import aboutBg from '../assets/images/about-bg.png'
import paBg from '../assets/images/pa.png'
import iBg from '../assets/images/i.png'
import haBg from '../assets/images/ha.png'
import twBg from '../assets/images/tw.png'
import './HomePage.css'

const HomePage = () => {
  const location = useLocation()
  const { checkAuth } = useAuth()

  useEffect(() => {
    // Handle scrolling to sections when navigating from navbar
    if (location.hash) {
      const sectionId = location.hash.substring(1)
      setTimeout(() => {
        const section = document.getElementById(sectionId)
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    }

    // Check if user just logged in
    if (location.search.includes('login=success')) {
      checkAuth()
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [location, checkAuth])


  return (
    <div className="homepage">
      <div className="homepage-content">
        {/* Main Poster */}
        <div className="main-logo">
          <img src={bgPoster} alt="JerseyLab Background" className="main-poster-bg" />
          <img src={logoPoster} alt="JerseyLab Logo" className="main-poster-logo" />
        </div>
      </div>
      
      {/* PA and Influencers Grid Container */}
      <div className="pa-influencers-grid">
        {/* PA Background Section */}
        <div 
          className="pa-background-section"
          style={{ backgroundImage: `url(${paBg})` }}
        >
          <div className="pa-content-wrapper">
            <div className="pa-text-content">
              <Link 
                to="/professional-athletes" 
                id="professional-athletes" 
                className="pa-category-link"
              >
                <h2 className="pa-category-title">PROFESSIONAL ATHLETES</h2>
                <p className="pa-category-description">Browse your favorite overseas professional's international jersey</p>
                <Link to="/professional-athletes" className="pa-shop-now-button">
                  SHOP NOW →
                </Link>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Influencers Background Section */}
        <div 
          className="influencers-background-section"
          style={{ backgroundImage: `url(${iBg})` }}
        >
          <div className="influencers-content-wrapper">
            <div className="influencers-text-content">
              <Link 
                to="/influencers" 
                id="influencers" 
                className="influencers-category-link"
              >
                <h2 className="influencers-category-title">INFLUENCERS</h2>
                <p className="influencers-category-description">Browse your favorite influencers' gear</p>
                <Link to="/influencers" className="influencers-shop-now-button">
                  SHOP NOW →
                </Link>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* High School Athletes and Teamwear Grid Container */}
      <div className="ha-tw-grid">
        {/* High School Athletes Background Section */}
        <div 
          className="ha-background-section"
          style={{ backgroundImage: `url(${haBg})` }}
        >
          <div className="ha-content-wrapper">
            <div className="ha-text-content">
              <Link 
                to="/high-school-athletes" 
                id="high-school-athletes" 
                className="ha-category-link"
              >
                <h2 className="ha-category-title">HIGH SCHOOL ATHLETES</h2>
                <p className="ha-category-description">Browse your favorite High School star</p>
                <Link to="/high-school-athletes" className="ha-shop-now-button">
                  SHOP NOW →
                </Link>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Teamwear Background Section */}
        <div 
          className="tw-background-section"
          style={{ backgroundImage: `url(${twBg})` }}
        >
          <div className="tw-content-wrapper">
            <div className="tw-text-content">
              <Link 
                to="/teamwear" 
                id="teamwear" 
                className="tw-category-link"
              >
                <h2 className="tw-category-title">TEAMWEAR</h2>
                <p className="tw-category-description">Design custom uniforms for your squad and submit your teamwear request</p>
                <Link to="/teamwear" className="tw-shop-now-button">
                  START YOUR ORDER →
                </Link>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* About Us Section - Full Width */}
      <div 
        id="about-us" 
        className="about-us-section"
        style={{ backgroundImage: `url(${aboutBg})` }}
      >
        <div className="about-us-content">
          <h2 className="about-us-title">JerseyLab</h2>
          <div className="about-us-text">
            <p className="about-us-paragraph">
              At JerseyLab, we believe jerseys are more than fabric. They're living stories of the game. Every player, from professional athletes to high school stars and basketball influencers, carries a legacy that deserves to be celebrated.
            </p>
            <p className="about-us-paragraph">
              That's why we partner directly with players to design and release authentic, licensed jerseys. Each piece is backed by signed agreements, ensuring that what you wear is legit, respectful, and true to the player's journey. From the teams they've represented to the years they've shined, every jersey captures a chapter of basketball history.
            </p>
            <p className="about-us-paragraph">
              Our mission is to:
            </p>
            <ul className="about-us-mission-list">
              <li>Empower players by giving them ownership of their brand and story</li>
              <li>Connect fans with exclusive, collectible jerseys that honor real moments</li>
              <li>Celebrate the culture of basketball at every level — pro, local, and digital</li>
            </ul>
            <p className="about-us-paragraph">
              JerseyLab isn't just a store. It's a movement where fans, players, and communities come together to keep the spirit of the game alive.
            </p>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}

export default HomePage

