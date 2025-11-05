import React, { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import poster from '../assets/images/poster.png'
import './HomePage.css'

const HomePage = () => {
  const location = useLocation()

  const handleScrollDown = () => {
    const shopSection = document.querySelector('.shop-section')
    if (shopSection) {
      shopSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

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
          <img src={poster} alt="Jerzey LAB" className="main-poster" />
          <div className="scroll-indicator" onClick={handleScrollDown}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9l6 6 6-6"></path>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Shop Section */}
      <div className="shop-section">
        <div className="shop-grid">
          <Link to="/" className="shop-now-top-left">
            Shop Now
          </Link>
          
          <div id="professional-athletes" className="shop-category professional-athletes">
            <h2 className="category-title">PROFESSIONAL ATHLETES</h2>
            <p className="category-description">Browse your favorite overseas professional's international jersey.</p>
          </div>
          
          <div id="influencers" className="shop-category influencers">
            <h2 className="category-title">INFLUENCERS</h2>
            <p className="category-description">Browse your favorite influencers' gear.</p>
          </div>
          
          <Link to="/" className="shop-now-bottom-right">
            Shop Now
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HomePage

