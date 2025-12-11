import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import './TeamwearPage.css'

const TeamwearPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    description: '',
    designFile: null
  })
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef(null)
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  const handleChange = (e) => {
    const { name, value, files, type } = e.target

    if (type === 'file') {
      const file = files && files[0] ? files[0] : null
      setFormData(prev => ({
        ...prev,
        [name]: file
      }))
      return
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Convert file to base64 if present
      let designFileBase64 = ''
      let fileName = ''
      
      if (formData.designFile) {
        const reader = new FileReader()
        designFileBase64 = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result)
          reader.onerror = reject
          reader.readAsDataURL(formData.designFile)
        })
        fileName = formData.designFile.name
      }
      
      const response = await fetch(`${API_URL}/api/teamwear-inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phoneNumber: formData.phoneNumber,
          email: formData.email,
          description: formData.description,
          designFile: designFileBase64,
          fileName: fileName
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to submit inquiry')
      }
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        description: '',
        designFile: null
      })
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      
      // Show success message
      setShowSuccessMessage(true)
      
      // Scroll to top to show the message
      window.scrollTo({ top: 0, behavior: 'smooth' })
      
      // Hide message after 5 seconds
      setTimeout(() => {
        setShowSuccessMessage(false)
      }, 5000)
    } catch (error) {
      console.error('Failed to submit teamwear inquiry:', error)
      alert('Failed to submit your inquiry. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="teamwear-page">
      <Link to="/" className="close-button" aria-label="Close">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </Link>
      
      <h1 className="teamwear-title">Teamwear</h1>
      
      <p className="teamwear-subtitle">
        Fill out the form below to request custom teamwear for your team.
      </p>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="success-message-container">
          <div className="success-message">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <div className="success-message-text">
              <h3 className="success-message-title">Thank you for your inquiry!</h3>
              <p className="success-message-detail">We will contact you soon.</p>
            </div>
            <button 
              className="success-message-close"
              onClick={() => setShowSuccessMessage(false)}
              aria-label="Close message"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      )}

      <form className="teamwear-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName" className="form-label">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="form-input"
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
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-textarea"
            rows="6"
            placeholder="Tell us about your teamwear needs, quantity, design preferences, etc."
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="designFile" className="form-label">Upload Reference Image (optional)</label>
          <input
            type="file"
            id="designFile"
            name="designFile"
            accept="image/*"
            onChange={handleChange}
            className="form-file-input"
            ref={fileInputRef}
          />
          <p className="form-help-text">
            Accepted formats: JPG, PNG, GIF. Max size 10MB.
          </p>
          {formData.designFile && (
            <p className="file-selected-name">Selected: {formData.designFile.name}</p>
          )}
        </div>

        <button type="submit" className="submit-button" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  )
}

export default TeamwearPage

