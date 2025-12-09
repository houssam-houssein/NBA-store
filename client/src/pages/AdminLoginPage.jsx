import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './AdminLoginPage.css'

const AdminLoginPage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [forgotEmail, setForgotEmail] = useState('')
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [statusType, setStatusType] = useState('')
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  useEffect(() => {
    const isAdminAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true'
    if (isAdminAuthenticated) {
      navigate('/admin', { replace: true })
    }
  }, [navigate])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleLoginSubmit = (e) => {
    e.preventDefault()
    if (!formData.email || !formData.password) {
      setStatusType('error')
      setStatusMessage('Please enter your email and password.')
      return
    }

    setStatusType('info')
    setStatusMessage('Authenticating admin access...')

    fetch(`${API_URL}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
      credentials: 'include'
    })
      .then(async (response) => {
        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || 'Login failed')
        }
        return response.json()
      })
      .then((data) => {
        setStatusType('success')
      setStatusMessage('Login successful. Redirecting...')
        localStorage.setItem('isAdminAuthenticated', 'true')
        localStorage.setItem('adminUser', JSON.stringify(data.admin))
        setTimeout(() => navigate('/admin'), 800)
      })
      .catch((error) => {
        setStatusType('error')
        setStatusMessage(error.message)
      })
  }

  const handleForgotPassword = (e) => {
    e.preventDefault()
    if (!forgotEmail) {
      setStatusMessage('Enter your email to receive reset instructions.')
      return
    }

    setStatusMessage('Sending reset instructions...')

    setTimeout(() => {
      setStatusMessage('Reset link sent. Check your inbox for next steps.')
      setForgotEmail('')
      setShowForgotPassword(false)
    }, 1200)
  }

  return (
    <div className='admin-login-page'>
      <div className='admin-login-card'>
        <p className='eyebrow'>ADMIN ACCESS</p>
        <h1>Jerzey Lab Control Room</h1>
        <p className='subheading'>Private entry point for the owner. Manage drops, orders, and the entire catalog.</p>

        <form className='admin-login-form' onSubmit={handleLoginSubmit}>
          <div className='form-group'>
            <label htmlFor='admin-email'>Email</label>
            <input
              id='admin-email'
              name='email'
              type='email'
              placeholder='owner@jerzeylab.com'
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className='form-group'>
            <label htmlFor='admin-password'>Password</label>
            <input
              id='admin-password'
              name='password'
              type='password'
              placeholder='••••••••'
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className='form-actions'>
            <button type='submit' className='primary-button'>
              enter dashboard
            </button>
            <button
              type='button'
              className='ghost-button'
              onClick={() => setShowForgotPassword(prev => !prev)}
            >
              {showForgotPassword ? 'Cancel' : 'Forgot password?'}
            </button>
          </div>
        </form>

        {showForgotPassword && (
          <div className='forgot-panel'>
            <p className='eyebrow'>RESET ACCESS</p>
            <p className='forgot-text'>Enter the admin email and we will send you a secure reset link.</p>
            <form onSubmit={handleForgotPassword} className='forgot-form'>
              <input
                type='email'
                placeholder='owner@jerzeylab.com'
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
              />
              <button type='submit' className='secondary-button'>Send reset link</button>
            </form>
          </div>
        )}

        {statusMessage && (
          <p className={`status-message ${statusType}`}>
            {statusMessage}
          </p>
        )}

        <Link to='/' className='back-link'>Return to storefront</Link>
      </div>
    </div>
  )
}

export default AdminLoginPage
