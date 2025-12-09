import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import './ProfessionalAthletesPage.css'

const shirtSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

const ProfessionalAthletesPage = () => {
  const { addToCart } = useCart()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedSize, setSelectedSize] = useState('')
  const [showSizeError, setShowSizeError] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${API_URL}/api/categories`)
        if (!response.ok) throw new Error('Failed to fetch categories')
        
        const categories = await response.json()
        const professionalCategory = categories.find(cat => 
          cat.key && cat.key.toLowerCase() === 'professionalathletes'
        )
        
        if (professionalCategory && professionalCategory.products) {
          setProducts(professionalCategory.products.filter(p => p != null))
        }
      } catch (error) {
        console.error('Failed to load professional athletes products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [API_URL])

  const handleProductClick = (product) => {
    setSelectedProduct(product)
    setSelectedSize('')
    setShowSizeError(false)
  }

  const handleCloseModal = () => {
    setSelectedProduct(null)
    setSelectedSize('')
    setShowSizeError(false)
  }

  const handleSizeSelect = (size) => {
    setSelectedSize(size)
    setShowSizeError(false)
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      setShowSizeError(true)
      return
    }
    
    const price = typeof selectedProduct.price === 'number' 
      ? `$${selectedProduct.price.toFixed(2)}` 
      : selectedProduct.price || '$0.00'
    
    addToCart({
      id: selectedProduct._id || selectedProduct.id,
      name: selectedProduct.title || 'Untitled Product',
      image: selectedProduct.imageUrl || '',
      price: price,
      size: selectedSize
    })
    
    handleCloseModal()
    
    setShowSuccessMessage(true)
    setTimeout(() => {
      setShowSuccessMessage(false)
    }, 3000)
  }

  const formatPrice = (price) => {
    if (price === undefined || price === null) return 'Price TBD'
    if (typeof price === 'number') return `$${price.toFixed(2)}`
    return price
  }

  return (
    <div className="professional-athletes-page">
      <Link to="/" className="close-button" aria-label="Return to homepage">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </Link>

      <header className="page-header">
        <h1 className="page-title">Professional Athletes Collection</h1>
        <p className="page-subtitle">
          Shop the latest drops from your favorite overseas pros and elite hoopers. Every jersey is verified, game-ready, and ships with a certificate of authenticity.
        </p>
      </header>

      {loading ? (
        <section className="loading-section">
          <p>Loading products...</p>
        </section>
      ) : products.length === 0 ? (
        <section className="coming-soon-section" aria-label="Coming soon">
          <div className="coming-soon-content">
            <h2 className="coming-soon-title">Coming Soon</h2>
            <p className="coming-soon-message">
              We're working on bringing you the best professional athlete merchandise. Stay tuned for exciting drops!
            </p>
          </div>
        </section>
      ) : (
        <section className="athletes-grid" aria-label="Professional athlete jerseys">
          {products.map((product) => (
            <div
              key={product._id || product.id}
              className="athlete-image-card"
              onClick={() => handleProductClick(product)}
            >
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.title || 'Product'} className="athlete-image" />
              ) : (
                <div className="athlete-image-placeholder">
                  <span>No Image</span>
                </div>
              )}
              <div className="athlete-overlay">
                <h2 className="athlete-name-overlay">{product.title || 'Untitled Product'}</h2>
                <p className="athlete-price-overlay">{formatPrice(product.price)}</p>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Modal/Cart */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseModal} aria-label="Close">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <div className="modal-body">
              <div className="modal-image-container">
                {selectedProduct.imageUrl ? (
                  <img src={selectedProduct.imageUrl} alt={selectedProduct.title} className="modal-image" />
                ) : (
                  <div className="modal-image-placeholder">
                    <span>No Image</span>
                  </div>
                )}
              </div>
              <div className="modal-info">
                <h2 className="modal-athlete-name">{selectedProduct.title || 'Untitled Product'}</h2>
                {selectedProduct.description && (
                  <p className="modal-description">{selectedProduct.description}</p>
                )}
                <p className="modal-price">{formatPrice(selectedProduct.price)}</p>
                
                <div className="size-selection">
                  <h3 className="size-title">Select Size</h3>
                  <div className="size-options">
                    {shirtSizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        className={`size-button ${selectedSize === size ? 'selected' : ''}`}
                        onClick={() => handleSizeSelect(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  {showSizeError && (
                    <p className="size-error-message">Please select a size</p>
                  )}
                </div>

                <button
                  type="button"
                  className="add-to-cart-button"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <section className="support-section">
        <h3 className="support-title">Need a custom order?</h3>
        <p className="support-copy">
          Contact our concierge team for player-signed memorabilia, bulk orders, or jersey personalization.
        </p>
        <a className="support-link" href="mailto:sales@jerzeylab.com">
          sales@jerzeylab.com
        </a>
      </section>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="success-message">
          <div className="success-message-content">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>Item added to cart successfully!</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfessionalAthletesPage


