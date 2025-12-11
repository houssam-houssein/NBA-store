import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import logo from '../assets/images/logo.png'
import './Navbar.css'

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { getCartItemCount } = useCart()
  const { user, authenticated, logout } = useAuth()
  const cartItemCount = getCartItemCount()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const handleAboutUsClick = (e) => {
    e.preventDefault()
    setIsMobileMenuOpen(false)
    if (location.pathname === '/') {
      // Already on homepage, scroll to section
      const section = document.getElementById('about-us')
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      // Navigate to homepage then scroll
      navigate('/#about-us')
      setTimeout(() => {
        const section = document.getElementById('about-us')
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' })
        }
      }, 300)
    }
  }

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

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
          {/* Navigation Links - Desktop */}
          <div className="navbar-links desktop-nav-links">
            <Link to="/professional-athletes" className="nav-link">
              PROFESSIONAL ATHLETES
            </Link>
            <Link to="/influencers" className="nav-link">
              INFLUENCERS
            </Link>
            <Link to="/high-school-athletes" className="nav-link">
              HIGH SCHOOL ATHLETES
            </Link>
            <Link to="/teamwear" className="nav-link">
              TEAMWEAR
            </Link>
            <a href="#about-us" className="nav-link" onClick={handleAboutUsClick}>
              ABOUT
            </a>
            <Link to="/shipping-returns" className="nav-link">
              SHIPPING & RETURNS
            </Link>
            <Link to="/terms-conditions" className="nav-link">
              TERMS & CONDITIONS
            </Link>
          </div>

          {/* Cart, Menu Button, and Login - Mobile */}
          <div className="navbar-right">
            <Link to="/cart" className="cart-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              {cartItemCount > 0 && (
                <span className="cart-badge">{cartItemCount}</span>
              )}
            </Link>
            
            {/* Burger Menu Button - Mobile */}
            <button 
              className="burger-menu-button"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {isMobileMenuOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </>
                ) : (
                  <>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                  </>
                )}
              </svg>
            </button>

            {/* Login/User Menu - Desktop Only */}
            <div className="desktop-login-menu">
              {authenticated && user ? (
                <div className="user-menu">
                  <div className="user-info">
                    {user.picture ? (
                      <img 
                        src={user.picture} 
                        alt={user.name} 
                        className="user-avatar"
                        onError={(e) => {
                          // If image fails to load, hide it or show a fallback
                          e.target.style.display = 'none'
                        }}
                      />
                    ) : (
                      <div className="user-avatar-fallback">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                    )}
                    <span className="user-name">{user.name}</span>
                  </div>
                  <button onClick={handleLogout} className="logout-button">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16 17 21 12 16 7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <Link to="/login" className="login-link">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <span>Log In</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`mobile-menu-overlay ${isMobileMenuOpen ? 'open' : ''}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setIsMobileMenuOpen(false)
          }
        }}
      >
        <div className="mobile-menu-content">
          <div className="mobile-nav-links">
            <Link to="/professional-athletes" className="mobile-nav-link" onClick={handleLinkClick}>
              PROFESSIONAL ATHLETES
            </Link>
            <Link to="/influencers" className="mobile-nav-link" onClick={handleLinkClick}>
              INFLUENCERS
            </Link>
            <Link to="/high-school-athletes" className="mobile-nav-link" onClick={handleLinkClick}>
              HIGH SCHOOL ATHLETES
            </Link>
            <Link to="/teamwear" className="mobile-nav-link" onClick={handleLinkClick}>
              TEAMWEAR
            </Link>
            <a href="#about-us" className="mobile-nav-link" onClick={handleAboutUsClick}>
              ABOUT
            </a>
            <Link to="/shipping-returns" className="mobile-nav-link" onClick={handleLinkClick}>
              SHIPPING & RETURNS
            </Link>
            <Link to="/terms-conditions" className="mobile-nav-link" onClick={handleLinkClick}>
              TERMS & CONDITIONS
            </Link>
          </div>
          
          {/* Mobile Login/User Menu */}
          <div className="mobile-login-section">
            {authenticated && user ? (
              <div className="mobile-user-info">
                <div className="mobile-user-details">
                  {user.picture ? (
                    <img 
                      src={user.picture} 
                      alt={user.name} 
                      className="mobile-user-avatar"
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                  ) : (
                    <div className="mobile-user-avatar-fallback">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <span className="mobile-user-name">{user.name}</span>
                </div>
                <button onClick={() => { handleLogout(); handleLinkClick(); }} className="mobile-logout-button">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link to="/login" className="mobile-login-link" onClick={handleLinkClick}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span>Log In</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

