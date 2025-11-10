import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Fix for GitHub Pages single-page app routing
// This code handles the query string routing that GitHub Pages uses
(function(l) {
  if (l.search[1] === '/' ) {
    var decoded = l.search.slice(1).split('&').map(function(s) { 
      return s.replace(/~and~/g, '&')
    }).join('?');
    // Preserve the base path (e.g., /NBA/)
    var basePath = l.pathname.match(/^\/[^\/]+\//) || '/'
    var cleanPath = decoded.replace(/^\//, '')
    window.history.replaceState(null, null,
        basePath + cleanPath + l.hash
    );
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

