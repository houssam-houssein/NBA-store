import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/user`, {
        credentials: 'include'
      })
      const data = await response.json()
      
      if (data.authenticated && data.user) {
        setUser(data.user)
        setAuthenticated(true)
      } else {
        setUser(null)
        setAuthenticated(false)
      }
    } catch (error) {
      console.error('Error checking auth:', error)
      setUser(null)
      setAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  const login = () => {
    // Redirect to Google OAuth
    window.location.href = `${API_URL}/api/auth/google`
  }

  const logout = async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      })
      setUser(null)
      setAuthenticated(false)
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        authenticated,
        loading,
        login,
        logout,
        checkAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

