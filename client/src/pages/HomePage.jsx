import React, { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Footer from '../components/Footer'
import bgPoster from '../assets/images/bg-poster.png'
import logoPoster from '../assets/images/logo-poster.png'
import aboutBg from '../assets/images/about-bg.png'
import paBg from '../assets/images/pa.png'
import iBg from '../assets/images/i.png'
import haBg from '../assets/images/ha.jpg'
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
          <img src={bgPoster} alt="Jerzey LAB Background" className="main-poster-bg" />
          <img src={logoPoster} alt="Jerzey LAB Logo" className="main-poster-logo" />
        </div>
      </div>
      
      {/* PA Background Section */}
      <div 
        className="pa-background-section"
        style={{ backgroundImage: `url(${paBg})` }}
      >
        <div className="pa-content-wrapper">
          <Link to="/professional-athletes" className="pa-shop-now-left">
            Shop Now
          </Link>
          <div className="pa-text-content">
            <Link 
              to="/professional-athletes" 
              id="professional-athletes" 
              className="pa-category-link"
            >
              <h2 className="pa-category-title">PROFESSIONAL ATHLETES</h2>
              <p className="pa-category-description">Browse your favorite overseas professional's international jersey</p>
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
            </Link>
          </div>
          <Link to="/influencers" className="influencers-shop-now-right">
            Shop Now
          </Link>
        </div>
      </div>
      
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
            </Link>
          </div>
          <Link to="/high-school-athletes" className="ha-shop-now-right">
            Shop Now
          </Link>
        </div>
      </div>
      
      {/* Shop Section */}
      <div className="shop-section">
        <div className="shop-grid">
          <div className="section-with-shop">
            <Link to="/influencers" id="influencers" className="shop-category influencers">
              <h2 className="category-title">INFLUENCERS</h2>
              <p className="category-description">Browse your favorite influencers' gear</p>
            </Link>
            <Link to="/influencers" className="shop-now-top-left mobile-shop-now">
              Shop Now
            </Link>
          </div>
          
          <div className="section-with-shop">
            <Link to="/high-school-athletes" className="shop-now-left-high-school desktop-shop-now">
              Shop Now
            </Link>
            <Link to="/high-school-athletes" id="high-school-athletes" className="shop-category high-school-athletes">
              <h2 className="category-title">HIGH SCHOOL ATHLETES</h2>
              <p className="category-description">Browse your favorite High School star</p>
            </Link>
            <Link to="/high-school-athletes" className="shop-now-left-high-school mobile-shop-now">
              Shop Now
            </Link>
          </div>

          <div className="section-with-shop">
            <Link to="/teamwear" id="teamwear" className="shop-category teamwear">
              <h2 className="category-title">TEAMWEAR</h2>
              <p className="category-description">
                Design custom uniforms for your squad and submit your teamwear request.
              </p>
            </Link>
            <Link to="/teamwear" className="shop-now-right-teamwear desktop-shop-now">
              Start Your Order
            </Link>
            <Link to="/teamwear" className="shop-now-right-teamwear mobile-shop-now">
              Start Your Order
            </Link>
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
          <h2 className="about-us-title">Jerzey Lab</h2>
          <div className="about-us-text">
            <p className="about-us-paragraph">
              At Jerzey Lab, we believe jerseys are more than fabric. They're living stories of the game. Every player, from professional athletes to high school stars and basketball influencers, carries a legacy that deserves to be celebrated.
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
              Jerzey Lab isn't just a store. It's a movement where fans, players, and communities come together to keep the spirit of the game alive.
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

