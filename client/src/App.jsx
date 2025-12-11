import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import ErrorBoundary from './components/ErrorBoundary'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import ShippingReturnsPage from './pages/ShippingReturnsPage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import TeamwearPage from './pages/TeamwearPage'
import ProfessionalAthletesPage from './pages/ProfessionalAthletesPage'
import InfluencersPage from './pages/InfluencersPage'
import HighSchoolAthletesPage from './pages/HighSchoolAthletesPage'
import CartPage from './pages/CartPage'
import TermsConditionsPage from './pages/TermsConditionsPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import AdminLoginPage from './pages/AdminLoginPage'
import './App.css'

// Get basename for GitHub Pages
// If deployed at username.github.io/repo-name, extract repo-name
// If deployed at username.github.io (root), use '/'
function getBasename() {
  try {
    const path = window.location.pathname
    const hostname = window.location.hostname
    const search = window.location.search
    
    // Debug logging (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.log('Current pathname:', path)
      console.log('Current hostname:', hostname)
      console.log('Current search:', search)
    }
    
    // On localhost, always use root basename
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.') || hostname.startsWith('10.') || hostname.startsWith('172.')) {
      return '/'
    }
    
    // Check if we're on GitHub Pages (github.io domain)
    const isGitHubPages = hostname.includes('github.io')
    
    // For GitHub Pages: /repo-name/ -> /repo-name
    // Check for Jersey-lab (case-sensitive) first
    if (path.startsWith('/Jersey-lab/') || path === '/Jersey-lab') {
      return '/Jersey-lab'
    }
    
    // Backward compatibility checks (lowercase)
    if (path.startsWith('/jersey-lab/') || path === '/jersey-lab') {
      return '/jersey-lab'
    }
    
    if (path.startsWith('/NBA-store/') || path === '/NBA-store') {
      return '/NBA-store'
    }
    
    if (path.startsWith('/NBA/') || path === '/NBA') {
      return '/NBA'
    }
    
    // If on GitHub Pages, try to extract repo name from path
    if (isGitHubPages) {
      const pathMatch = path.match(/^\/([^\/]+)/)
      if (pathMatch && pathMatch[1]) {
        const repoName = pathMatch[1]
        // Common routes to exclude from basename detection
        const excludedRoutes = ['admin', 'admin-login', 'login', 'signup', 'cart', 'teamwear', 
          'professional-athletes', 'influencers', 'high-school-athletes', 
          'shipping-returns', 'terms-conditions', 'assets', 'static', 'index.html']
        
        if (!excludedRoutes.includes(repoName) && repoName !== '') {
          return `/${repoName}`
        }
      }
    }
    
    // Default to root
    return '/'
  } catch (error) {
    console.error('Error in getBasename:', error)
    // Fallback to root on error
    return '/'
  }
}

const AppContent = () => {
  const location = useLocation()
  const hideNavbar = location.pathname.startsWith('/admin') || location.pathname.startsWith('/admin-login')

  return (
    <div className="App">
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shipping-returns" element={<ShippingReturnsPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/teamwear" element={<TeamwearPage />} />
        <Route path="/professional-athletes" element={<ProfessionalAthletesPage />} />
        <Route path="/influencers" element={<InfluencersPage />} />
        <Route path="/high-school-athletes" element={<HighSchoolAthletesPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/terms-conditions" element={<TermsConditionsPage />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <Router basename={getBasename()}>
            <AppContent />
          </Router>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App

