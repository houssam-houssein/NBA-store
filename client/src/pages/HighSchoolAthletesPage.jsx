import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import './HighSchoolAthletesPage.css'

const shirtSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

const HighSchoolAthletesPage = () => {
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
        // Use optimized endpoint to fetch only the needed category
        const response = await fetch(`${API_URL}/api/categories/key/highSchoolAthletes`)
        if (!response.ok) {
          if (response.status === 404) {
            setProducts([])
            return
          }
          throw new Error('Failed to fetch category')
        }
        
        const category = await response.json()
        
        if (category && category.products) {
          // Filter to only show active and coming-soon products
          setProducts(category.products.filter(p => {
            if (!p || p == null) return false
            const status = (p.status || '').toLowerCase()
            return status === 'active' || status === 'coming-soon' || status === 'coming soon'
          }))
        } else {
          setProducts([])
        }
      } catch (error) {
        console.error('Failed to load high school athletes products:', error)
        setProducts([])
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
    <div className="high-school-athletes-page">
      <Link to="/" className="close-button" aria-label="Return to homepage">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </Link>

      <header className="page-header">
        <h1 className="page-title">High School Spotlight Shop</h1>
        <p className="page-subtitle">
          Support the future of the game. Rep limited merch from the country's rising stars, produced in partnership with their programs.
        </p>
      </header>

      {loading ? (
        <section className="loading-section">
          <div className="loading-spinner"></div>
          <p>Loading products...</p>
          <p className="loading-hint">First connection may take a moment</p>
        </section>
      ) : products.length === 0 ? (
        <section className="coming-soon-section" aria-label="Coming soon">
          <div className="coming-soon-content">
            <h2 className="coming-soon-title">Coming Soon</h2>
            <p className="coming-soon-message">
              We're working on bringing you the best high school athlete merchandise. Stay tuned for exciting drops!
            </p>
          </div>
        </section>
      ) : (
        <section className="products-grid" aria-label="High school athlete products">
          {products.map((product) => (
            <div
              key={product._id || product.id}
              className="product-card"
              onClick={() => handleProductClick(product)}
            >
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.title || 'Product'} className="product-image" />
              ) : (
                <div className="product-image-placeholder">
                  <span>No Image</span>
                </div>
              )}
              <div className="product-overlay">
                <h2 className="product-name-overlay">{product.title || 'Untitled Product'}</h2>
                <p className={`product-price-overlay ${(() => {
                  const status = (product.status || '').toLowerCase()
                  return status === 'coming-soon' || status === 'coming soon' ? 'coming-soon-text' : ''
                })()}`}>
                  {(() => {
                    const status = (product.status || '').toLowerCase()
                    return status === 'coming-soon' || status === 'coming soon'
                      ? 'Coming Soon' 
                      : formatPrice(product.price)
                  })()}
                </p>
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
                <h2 className="modal-product-name">{selectedProduct.title || 'Untitled Product'}</h2>
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

      <section className="programs-section">
        <h3 className="programs-title">High school athletes - let's feature your program</h3>
        <p className="programs-copy">
          Launch team stores, fundraise with specialty merch, and unlock pro-grade production with Jerzey LAB.
        </p>
        <a className="programs-link" href="mailto:teams@jerzeylab.com">
          teams@jerzeylab.com
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

export default HighSchoolAthletesPage


