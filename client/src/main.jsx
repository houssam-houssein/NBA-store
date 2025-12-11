import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Fix for GitHub Pages single-page app routing
// This code handles the query string routing that GitHub Pages uses
try {
  (function(l) {
    // Only process if we have the query string format (/?/path)
    if (l.search && l.search.length > 1 && l.search[1] === '/') {
      var decoded = l.search.slice(1).split('&').map(function(s) { 
        return s.replace(/~and~/g, '&')
      }).join('?');
      
      // Detect base path - check for Jersey-lab (case-sensitive) first
      var basePath = '/Jersey-lab/'
      if (l.pathname.startsWith('/Jersey-lab/')) {
        basePath = '/Jersey-lab/'
      } else if (l.pathname.startsWith('/jersey-lab/')) {
        basePath = '/jersey-lab/' // Backward compatibility (lowercase)
      } else if (l.pathname.startsWith('/NBA-store/')) {
        basePath = '/NBA-store/' // Backward compatibility
      } else if (l.pathname.startsWith('/NBA/')) {
        basePath = '/NBA/' // Backward compatibility
      } else {
        // Try to extract from pathname
        var match = l.pathname.match(/^(\/[^\/]+\/)/)
        basePath = match ? match[1] : '/'
      }
      
      // Clean the decoded path
      var cleanPath = decoded.replace(/^\//, '')
      
      // Only replace if we have a valid path to avoid loops
      if (cleanPath && cleanPath !== '' && cleanPath !== 'index.html') {
        var newPath = basePath + cleanPath + l.hash
        // Prevent infinite loop: only replace if different
        if (l.pathname + l.hash !== newPath) {
          window.history.replaceState(null, null, newPath)
        }
      }
    }
  })(window.location)
} catch (error) {
  console.error('Error in GitHub Pages routing fix:', error)
  // Continue with app initialization even if routing fix fails
}

// Ensure root element exists before rendering
const rootElement = document.getElementById('root')
if (rootElement) {
  try {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    )
  } catch (error) {
    console.error('Error rendering App:', error)
    // Show error message in the root element
    rootElement.innerHTML = `
      <div style="min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background-color: #000; color: #fff; padding: 40px; font-family: system-ui, sans-serif;">
        <h1 style="font-size: 32px; margin-bottom: 20px;">Failed to load application</h1>
        <p style="margin-bottom: 20px; opacity: 0.8;">${error.message || 'An unexpected error occurred'}</p>
        <button onclick="window.location.reload()" style="padding: 12px 24px; background-color: #fff; color: #000; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; font-weight: 600;">
          Reload Page
        </button>
      </div>
    `
  }
} else {
  console.error('Root element not found!')
  document.body.innerHTML = `
    <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background-color: #000; color: #fff; font-family: system-ui, sans-serif;">
      <h1>Root element not found</h1>
    </div>
  `
}

