import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import logo from '../assets/images/logo.png'
import './Navbar.css'

const Navbar = () => {
  const [isMoreOpen, setIsMoreOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  const handleSearch = (e) => {
    e.preventDefault()
    // Handle search functionality
    console.log('Searching for:', searchQuery)
  }

  const handleProfessionalAthletesClick = (e) => {
    e.preventDefault()
    if (location.pathname === '/') {
      // Already on homepage, scroll to section
      const section = document.getElementById('professional-athletes')
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      // Navigate to homepage then scroll
      navigate('/#professional-athletes')
      setTimeout(() => {
        const section = document.getElementById('professional-athletes')
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' })
        }
      }, 300)
    }
  }

  const handleInfluencersClick = (e) => {
    e.preventDefault()
    if (location.pathname === '/') {
      // Already on homepage, scroll to section
      const section = document.getElementById('influencers')
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      // Navigate to homepage then scroll
      navigate('/#influencers')
      setTimeout(() => {
        const section = document.getElementById('influencers')
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' })
        }
      }, 300)
    }
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo">
          <Link to="/">
            <img src={logo} alt="Jerzey LAB" className="logo-img" />
          </Link>
        </div>

        {/* Right Side - All content except logo */}
        <div className="navbar-right-group">
          {/* Navigation Links */}
          <div className="navbar-links">
            <a href="#professional-athletes" className="nav-link" onClick={handleProfessionalAthletesClick}>
              PROFESSIONAL ATHLETES
            </a>
            <a href="#influencers" className="nav-link" onClick={handleInfluencersClick}>
              INFLUENCERS
            </a>
            <Link to="/high-school-athletes" className="nav-link">
              HIGH SCHOOL ATHLETES
            </Link>
            <Link to="/teamwear" className="nav-link">
              TEAMWEAR
            </Link>
            <Link to="/about" className="nav-link">
              ABOUT
            </Link>
            <Link to="/shipping-returns" className="nav-link">
              SHIPPING & RETURNS
            </Link>
            <div 
              className="nav-link more-link"
              onMouseEnter={() => setIsMoreOpen(true)}
              onMouseLeave={() => setIsMoreOpen(false)}
            >
              MORE
              {isMoreOpen && (
                <div className="dropdown-menu">
                  <Link to="/terms-conditions">Terms & Conditions</Link>
                </div>
              )}
            </div>
          </div>

          {/* Search and Login */}
          <div className="navbar-right">
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                placeholder="SEARCH..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="search-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </button>
            </form>
            <Link to="/login" className="login-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span>Log In</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

