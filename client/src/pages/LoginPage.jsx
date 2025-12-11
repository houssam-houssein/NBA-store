import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './LoginPage.css'

const LoginPage = () => {
  const navigate = useNavigate()
  const { login, authenticated } = useAuth()
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
  const [message, setMessage] = useState({ type: null, text: '' })
  const [isLoading, setIsLoading] = useState(false)

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Redirect if already authenticated
  useEffect(() => {
    if (authenticated) {
      navigate('/')
    }
  }, [authenticated, navigate])

  // Check for error messages from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const error = urlParams.get('error')
    if (error) {
      let errorMessage = 'Login failed. Please try again.'
      if (error === 'auth_failed') {
        errorMessage = 'Authentication failed. Please try again.'
      } else if (error === 'no_user') {
        errorMessage = 'User not found. Please sign up first.'
      } else if (error === 'session_failed') {
        errorMessage = 'Session creation failed. Please try again.'
      }
      setMessage({ type: 'error', text: errorMessage })
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage({ type: null, text: '' })

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', // Important for session cookies
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: 'Login successful! Redirecting...' })
        // Update auth context
        await login()
        // Navigate to homepage after a short delay
        setTimeout(() => {
          navigate('/')
        }, 1000)
      } else {
        setMessage({ type: 'error', text: data.error || 'Login failed. Please try again.' })
      }
    } catch (error) {
      console.error('Login error:', error)
      setMessage({ type: 'error', text: 'An error occurred during login. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-page">
      <Link to="/" className="close-button" aria-label="Close">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </Link>
      
      {message.type && (
        <div className={`login-message login-message-${message.type}`}>
          <span className="login-message-icon">
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
          <span className="login-message-text">{message.text}</span>
          <button 
            className="login-message-close"
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
      
      <h1 className="login-title">Log In</h1>
      
      <p className="signup-link-text">
        New to this site? <Link to="/signup" className="signup-text-link">Sign Up</Link>
      </p>

      <div className="login-buttons">
        <button 
          className="login-btn login-google"
          onClick={login}
        >
          <svg className="google-icon" width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span>Log in with Google</span>
        </button>

        <div className="divider">
          <span className="divider-line"></span>
          <span className="divider-text">or</span>
          <span className="divider-line"></span>
        </div>

        {!showEmailForm ? (
          <button 
            className="login-btn login-email"
            onClick={() => setShowEmailForm(true)}
          >
            <span>Log in with Email</span>
          </button>
        ) : (
          <form className="login-email-form" onSubmit={handleSubmit}>
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

            <button type="submit" className="login-btn login-submit" disabled={isLoading}>
              <span>{isLoading ? 'Logging in...' : 'Log In'}</span>
            </button>

            <button
              type="button"
              className="login-btn login-cancel"
              onClick={() => {
                setShowEmailForm(false)
                setFormData({ email: '', password: '' })
              }}
            >
              <span>Cancel</span>
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default LoginPage

