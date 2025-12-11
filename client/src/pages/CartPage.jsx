import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import './CartPage.css'

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart()
  const navigate = useNavigate()
  const [promoCode, setPromoCode] = useState('')
  const [appliedPromo, setAppliedPromo] = useState(null)
  const [promoError, setPromoError] = useState('')
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [emptyCartError, setEmptyCartError] = useState(false)
  const [applyingPromo, setApplyingPromo] = useState(false)
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  const handleApplyPromo = async () => {
    const code = promoCode.trim().toUpperCase()
    setPromoError('')

    if (!code) {
      setPromoError('Please enter a promo code')
      return
    }

    if (appliedPromo && appliedPromo.code === code) {
      setPromoError('This promo code is already applied')
      return
    }

    try {
      setApplyingPromo(true)
      const subtotal = getCartTotal()
      const response = await fetch(`${API_URL}/api/promo-codes/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code: code,
          subtotal: subtotal
        })
      })

      const data = await response.json()

      if (data.valid) {
        setAppliedPromo({
          code: data.promoCode.code,
          discount: data.discount,
          discountType: data.promoCode.discountType,
          discountValue: data.promoCode.discountValue
        })
        setPromoCode('')
        setPromoError('')
      } else {
        setPromoError(data.error || 'Invalid promo code')
      }
    } catch (error) {
      console.error('Failed to validate promo code:', error)
      setPromoError('Failed to validate promo code. Please try again.')
    } finally {
      setApplyingPromo(false)
    }
  }

  const handleRemovePromo = () => {
    setAppliedPromo(null)
    setPromoCode('')
    setPromoError('')
  }

  const getDiscountAmount = () => {
    if (!appliedPromo) return 0
    return appliedPromo.discount
  }

  const getFinalTotal = () => {
    return getCartTotal() - getDiscountAmount()
  }

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      setEmptyCartError(true)
      setTimeout(() => {
        setEmptyCartError(false)
      }, 3000)
      return
    }
    setShowSuccessMessage(true)
    clearCart()
    // Scroll to top to show the message
    window.scrollTo({ top: 0, behavior: 'smooth' })
    // Navigate to homepage after 3 seconds
    setTimeout(() => {
      navigate('/')
    }, 3000)
  }

  return (
    <div className="cart-page">
      <Link to="/" className="close-button" aria-label="Return to homepage">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </Link>

      <div className="cart-container">
        <h1 className="cart-title">Shopping Cart</h1>

        {/* Success Message */}
        {showSuccessMessage && (
          <div className="success-message-container">
            <div className="success-message">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <div className="success-message-text">
                <h3 className="success-message-title">Order Confirmed!</h3>
                <p className="success-message-detail">Thank you for your order. Your order has been successfully confirmed.</p>
              </div>
              <button 
                className="success-message-close"
                onClick={() => {
                  setShowSuccessMessage(false)
                  navigate('/')
                }}
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

        {/* Empty Cart Error Message */}
        {emptyCartError && (
          <div className="error-message-container">
            <div className="error-message">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <div className="error-message-text">
                <p className="error-message-detail">Your cart is empty</p>
              </div>
              <button 
                className="error-message-close"
                onClick={() => setEmptyCartError(false)}
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

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <p className="empty-cart-message">Your cart is empty</p>
            <Link to="/professional-athletes" className="continue-shopping-button">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map((item, index) => (
                <div key={`${item.id}-${item.size}-${index}`} className="cart-item">
                  <div className="cart-item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="cart-item-details">
                    <h2 className="cart-item-name">{item.name}</h2>
                    <p className="cart-item-size">Size: {item.size}</p>
                    <p className="cart-item-price">{item.price}</p>
                  </div>
                  <div className="cart-item-quantity">
                    <label htmlFor={`quantity-${index}`}>Quantity:</label>
                    <div className="quantity-controls">
                      <button
                        type="button"
                        className="quantity-button"
                        onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                      >
                        −
                      </button>
                      <input
                        type="number"
                        id={`quantity-${index}`}
                        min="1"
                        value={item.quantity}
                        onChange={(e) => {
                          const newQuantity = parseInt(e.target.value) || 1
                          updateQuantity(item.id, item.size, newQuantity)
                        }}
                        className="quantity-input"
                      />
                      <button
                        type="button"
                        className="quantity-button"
                        onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="cart-item-total">
                    <p className="item-total-price">
                      ${(parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="remove-item-button"
                    onClick={() => removeFromCart(item.id, item.size)}
                    aria-label="Remove item"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div className="summary-row">
                <span className="summary-label">Subtotal:</span>
                <span className="summary-value">${getCartTotal().toFixed(2)}</span>
              </div>

              {/* Promo Code Section */}
              <div className="promo-code-section">
                {!appliedPromo ? (
                  <div className="promo-code-input-group">
                    <input
                      type="text"
                      placeholder="Enter promo code"
                      value={promoCode}
                      onChange={(e) => {
                        setPromoCode(e.target.value)
                        setPromoError('')
                      }}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleApplyPromo()
                        }
                      }}
                      className="promo-code-input"
                    />
                    <button
                      type="button"
                      className="apply-promo-button"
                      onClick={handleApplyPromo}
                      disabled={applyingPromo}
                    >
                      {applyingPromo ? 'Applying...' : 'Apply'}
                    </button>
                  </div>
                ) : (
                  <div className="promo-code-applied">
                    <div className="promo-code-info">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span className="promo-code-text">Promo code {appliedPromo.code} applied</span>
                    </div>
                    <button
                      type="button"
                      className="remove-promo-button"
                      onClick={handleRemovePromo}
                      aria-label="Remove promo code"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                )}
                {promoError && (
                  <p className="promo-error-message">{promoError}</p>
                )}
              </div>

              {appliedPromo && (
                <div className="summary-row discount-row">
                  <span className="summary-label">Discount ({appliedPromo.code}):</span>
                  <span className="summary-value discount-value">
                    -${getDiscountAmount().toFixed(2)}
                  </span>
                </div>
              )}

              <div className="summary-row">
                <span className="summary-label">Shipping:</span>
                <span className="summary-value">Calculated at checkout</span>
              </div>
              <div className="summary-row total-row">
                <span className="summary-label">Total:</span>
                <span className="summary-value">${getFinalTotal().toFixed(2)}</span>
              </div>
              <button className="checkout-button" onClick={handleCheckout}>
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default CartPage

