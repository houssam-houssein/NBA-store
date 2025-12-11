import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './SignUpPage.css'

const SignUpPage = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [message, setMessage] = useState({ type: null, text: '' })
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  // Check for success message from URL params (e.g., after Google OAuth)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('signup') === 'success') {
      setMessage({ type: 'success', text: 'Signup successful! You can now log in with Google.' })
      // Clear URL params
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [])

  // Auto-hide message after 5 seconds
  useEffect(() => {
    if (message.type) {
      const timer = setTimeout(() => {
        setMessage({ type: null, text: '' })
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [message])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleGoogleSignup = (e) => {
    e.preventDefault()
    e.stopPropagation()
    // Redirect to Google OAuth for signup
    // The server will handle creating the user account after Google authentication
    console.log('Redirecting to Google OAuth for signup...')
    window.location.href = `${API_URL}/api/auth/google?signup=true`
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' })
      return
    }
    
    try {
      // Call signup endpoint
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          password: formData.password
        })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setMessage({ type: 'success', text: 'Signup successful! You can now log in with Google.' })
        // Navigate to login after 2 seconds
        setTimeout(() => {
          navigate('/login')
        }, 2000)
      } else {
        setMessage({ type: 'error', text: data.error || 'Signup failed. Please try again.' })
      }
    } catch (error) {
      console.error('Signup error:', error)
      setMessage({ type: 'error', text: 'An error occurred during signup. Please try again.' })
    }
  }

  return (
    <div className="signup-page">
      <Link to="/" className="close-button" aria-label="Close">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </Link>
      
      {message.type && (
        <div className={`signup-message signup-message-${message.type}`}>
          <span className="signup-message-icon">
            {message.type === 'success' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            )}
          </span>
          <span className="signup-message-text">{message.text}</span>
          <button 
            className="signup-message-close"
            onClick={() => setMessage({ type: null, text: '' })}
            aria-label="Close message"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      )}
      
      <h1 className="signup-title">Sign Up</h1>
      
      <p className="login-link-text">
        Already a member? <Link to="/login" className="login-text-link">Log In</Link>
      </p>

      <div className="signup-buttons">
        <button 
          type="button"
          className="signup-btn signup-google"
          onClick={handleGoogleSignup}
        >
          <svg className="google-icon" width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span>Sign up with Google</span>
        </button>

        <div className="divider">
          <span className="divider-line"></span>
          <span className="divider-text">or</span>
          <span className="divider-line"></span>
        </div>

        {!showEmailForm ? (
          <button 
            className="signup-btn signup-email"
            onClick={() => setShowEmailForm(true)}
          >
            <span>Sign up with email</span>
          </button>
        ) : (
          <form className="signup-email-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="firstName" className="form-label">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your first name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName" className="form-label">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your last name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="form-input"
                placeholder="Confirm your password"
                required
              />
            </div>

            <button type="submit" className="signup-btn signup-submit">
              <span>Sign Up</span>
            </button>

            <button
              type="button"
              className="signup-btn signup-cancel"
              onClick={() => {
                setShowEmailForm(false)
                setFormData({
                  firstName: '',
                  lastName: '',
                  email: '',
                  password: '',
                  confirmPassword: ''
                })
              }}
            >
              <span>Cancel</span>
            </button>
          </form>
        )}
      </div>

      {!showEmailForm && (
        <div className="signup-footer">
          <label className="checkbox-label">
            <input type="checkbox" defaultChecked className="signup-checkbox" />
            <span className="checkbox-text">
              Sign up to this site with a public profile. <Link to="/read-more" className="read-more-link">Read more</Link>
            </span>
          </label>
        </div>
      )}
    </div>
  )
}

export default SignUpPage

