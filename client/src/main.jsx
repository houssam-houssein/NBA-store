import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Fix for GitHub Pages single-page app routing
// This code handles the query string routing that GitHub Pages uses
(function(l) {
  // Only process if we have the query string format (/?/path)
  if (l.search && l.search.length > 1 && l.search[1] === '/') {
    var decoded = l.search.slice(1).split('&').map(function(s) { 
      return s.replace(/~and~/g, '&')
    }).join('?');
    
    // Detect base path - check for jersey-lab first
    var basePath = '/jersey-lab/'
    if (l.pathname.startsWith('/jersey-lab/')) {
      basePath = '/jersey-lab/'
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
    if (cleanPath && cleanPath !== '') {
      var newPath = basePath + cleanPath + l.hash
      // Prevent infinite loop: only replace if different
      if (l.pathname + l.hash !== newPath) {
        window.history.replaceState(null, null, newPath)
      }
    }
  }
}(window.location))

// Ensure root element exists before rendering
console.log('main.jsx: Starting React app initialization')
const rootElement = document.getElementById('root')
if (rootElement) {
  console.log('main.jsx: Root element found, rendering App')
  try {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    )
    console.log('main.jsx: App rendered successfully')
  } catch (error) {
    console.error('main.jsx: Error rendering App:', error)
  }
} else {
  console.error('main.jsx: Root element not found!')
}

