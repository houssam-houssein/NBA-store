import React, { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import bgPoster from '../assets/images/bg-poster.png'
import logoPoster from '../assets/images/logo-poster.png'
import aboutBg from '../assets/images/about-bg.png'
import './HomePage.css'

const HomePage = () => {
  const location = useLocation()

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
  }, [location])

  return (
    <div className="homepage">
      <div className="homepage-content">
        {/* Main Poster */}
        <div className="main-logo">
          <img src={bgPoster} alt="Jerzey LAB Background" className="main-poster-bg" />
          <img src={logoPoster} alt="Jerzey LAB Logo" className="main-poster-logo" />
        </div>
      </div>
      
      {/* Shop Section */}
      <div className="shop-section">
        <div className="shop-grid">
          <Link to="/" className="shop-now-top-left">
            Shop Now
          </Link>
          
          <div className="section-with-shop">
            <Link to="/professional-athletes" id="professional-athletes" className="shop-category professional-athletes">
              <h2 className="category-title">PROFESSIONAL ATHLETES</h2>
              <p className="category-description">Browse your favorite overseas professional's international jersey.</p>
            </Link>
            <Link to="/professional-athletes" className="shop-now-bottom-right desktop-shop-now">
              Shop Now
            </Link>
            <Link to="/professional-athletes" className="shop-now-bottom-right mobile-shop-now">
              Shop Now
            </Link>
          </div>
          
          <div className="section-with-shop">
            <Link to="/influencers" id="influencers" className="shop-category influencers">
              <h2 className="category-title">INFLUENCERS</h2>
              <p className="category-description">Browse your favorite influencers' gear.</p>
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
              <p className="category-description">Browse your favorite High School star.</p>
            </Link>
            <Link to="/high-school-athletes" className="shop-now-left-high-school mobile-shop-now">
              Shop Now
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
          <h2 className="category-title">ABOUT US</h2>
          <p className="category-description">Learn more about Jerzey LAB and our mission.</p>
        </div>
      </div>
    </div>
  )
}

export default HomePage

