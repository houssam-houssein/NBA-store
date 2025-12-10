import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
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
  const path = window.location.pathname
  
  // Debug logging
  console.log('Current pathname:', path)
  
  // For GitHub Pages: /repo-name/ -> /repo-name
  // Check for jersey-lab specifically first
  if (path.startsWith('/jersey-lab/') || path === '/jersey-lab' || path.startsWith('/jersey-lab')) {
    console.log('Detected jersey-lab repo, using basename: /jersey-lab')
    return '/jersey-lab'
  }
  
  // Backward compatibility checks
  if (path.startsWith('/NBA-store/') || path === '/NBA-store' || path.startsWith('/NBA-store')) {
    console.log('Detected NBA-store repo, using basename: /NBA-store')
    return '/NBA-store'
  }
  
  if (path.startsWith('/NBA/') || path === '/NBA' || path.startsWith('/NBA')) {
    console.log('Detected NBA repo, using basename: /NBA')
    return '/NBA'
  }
  
  // Extract repo name from path (e.g., /repo-name/ -> /repo-name)
  const pathMatch = path.match(/^\/([^\/]+)/)
  if (pathMatch && pathMatch[1] && pathMatch[1] !== 'assets' && pathMatch[1] !== 'static' && pathMatch[1] !== '') {
    console.log('Detected repo:', pathMatch[1], 'using basename:', `/${pathMatch[1]}`)
    return `/${pathMatch[1]}`
  }
  
  // Default to root
  console.log('Using default basename: /')
  return '/'
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
    <AuthProvider>
      <CartProvider>
        <Router basename={getBasename()}>
          <AppContent />
        </Router>
      </CartProvider>
    </AuthProvider>
  )
}

export default App

