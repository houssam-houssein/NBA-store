import React, { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('jerzeyLabCart')
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart))
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('jerzeyLabCart', JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (item) => {
    setCartItems(prevItems => {
      // Check if item with same id and size already exists
      const existingItem = prevItems.find(
        cartItem => cartItem.id === item.id && cartItem.size === item.size
      )

      if (existingItem) {
        // Update quantity
        return prevItems.map(cartItem =>
          cartItem.id === item.id && cartItem.size === item.size
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      } else {
        // Add new item
        return [...prevItems, { ...item, quantity: 1 }]
      }
    })
  }

  const removeFromCart = (itemId, size) => {
    setCartItems(prevItems =>
      prevItems.filter(item => !(item.id === itemId && item.size === size))
    )
  }

  const updateQuantity = (itemId, size, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId, size)
      return
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId && item.size === size
          ? { ...item, quantity }
          : item
      )
    )
  }

  const clearCart = () => {
    setCartItems([])
  }

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.price.replace('$', ''))
      return total + price * item.quantity
    }, 0)
  }

  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

