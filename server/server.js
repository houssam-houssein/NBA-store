import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import session from 'express-session'
import mongoose from 'mongoose'
import Admin from './models/Admin.js'
import Category from './models/Category.js'
import TeamwearInquiry from './models/TeamwearInquiry.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/Jerseylab'

const defaultOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
]
const envOrigins = process.env.CLIENT_URLS || process.env.CLIENT_URL || ''
const allowedOrigins = [...new Set([...defaultOrigins, ...envOrigins.split(',').map(origin => origin.trim()).filter(Boolean)])]

// CORS configuration - allow credentials and multiple origins
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true)
    }
    console.warn(`Blocked request from disallowed origin: ${origin}`)
    return callback(new Error('Not allowed by CORS'))
  },
  credentials: true
}))

// Middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}))

// Mongo connection
mongoose.connect(MONGODB_URI).then(() => {
  console.log('Connected to MongoDB')
}).catch((error) => {
  console.error('MongoDB connection error:', error)
})

// Initialize Passport
app.use(passport.initialize())
app.use(passport.session())

// Passport Google OAuth Strategy (optional)
const hasGoogleKeys = process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET

if (hasGoogleKeys) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback'
  }, (accessToken, refreshToken, profile, done) => {
    const user = {
      id: profile.id,
      email: profile.emails[0].value,
      name: profile.displayName,
      picture: profile.photos[0].value,
      provider: 'google'
    }
    return done(null, user)
  }))
} else {
  console.warn('⚠️  Google OAuth environment variables missing. Skipping Google strategy setup.')
}

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user)
})

// Deserialize user from session
passport.deserializeUser((user, done) => {
  done(null, user)
})

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' })
})

// Admin authentication routes (local)
app.post('/api/admin/login', async (req, res) => {
  const { email, password } = req.body
  try {
    const admin = await Admin.findOne({ email })
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const isMatch = await admin.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    res.json({
      token: 'placeholder-token',
      admin: {
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    })
  } catch (error) {
    console.error('Admin login error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Categories endpoints
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: 1 })
    res.json(categories)
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    res.status(500).json({ error: 'Failed to fetch categories' })
  }
})

app.put('/api/categories/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { products, ...categoryData } = req.body
    
    // Update category fields and products array
    const updated = await Category.findByIdAndUpdate(
      id,
      {
        ...categoryData,
        products: products || []
      },
      { new: true, runValidators: true }
    )
    
    if (!updated) {
      return res.status(404).json({ error: 'Category not found' })
    }
    
    res.json(updated)
  } catch (error) {
    console.error('Failed to update category:', error)
    res.status(500).json({ error: 'Failed to update category', details: error.message })
  }
})

// Teamwear Inquiry endpoints
app.post('/api/teamwear-inquiries', async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber, email, description, designFile, fileName } = req.body
    
    const inquiry = await TeamwearInquiry.create({
      firstName,
      lastName,
      phoneNumber,
      email,
      description,
      designFile: designFile || '',
      fileName: fileName || '',
      status: 'pending'
    })
    
    res.status(201).json(inquiry)
  } catch (error) {
    console.error('Failed to create teamwear inquiry:', error)
    res.status(500).json({ error: 'Failed to submit inquiry', details: error.message })
  }
})

app.get('/api/teamwear-inquiries', async (req, res) => {
  try {
    const inquiries = await TeamwearInquiry.find().sort({ createdAt: -1 })
    res.json(inquiries)
  } catch (error) {
    console.error('Failed to fetch teamwear inquiries:', error)
    res.status(500).json({ error: 'Failed to fetch inquiries', details: error.message })
  }
})

app.put('/api/teamwear-inquiries/:id', async (req, res) => {
  try {
    const { id } = req.params
    const updated = await TeamwearInquiry.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
    
    if (!updated) {
      return res.status(404).json({ error: 'Inquiry not found' })
    }
    
    res.json(updated)
  } catch (error) {
    console.error('Failed to update teamwear inquiry:', error)
    res.status(500).json({ error: 'Failed to update inquiry', details: error.message })
  }
})

// Google OAuth Routes (only if keys provided)
if (hasGoogleKeys) {
  app.get('/api/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
  )

  app.get('/api/auth/google/callback',
    passport.authenticate('google', { failureRedirect: process.env.CLIENT_URL + '/login?error=auth_failed' }),
    (req, res) => {
      res.redirect(process.env.CLIENT_URL + '/?login=success')
    }
  )
}

// Get current user
app.get('/api/auth/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user, authenticated: true })
  } else {
    res.json({ user: null, authenticated: false })
  }
})

// Logout
app.post('/api/auth/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' })
    }
    res.json({ message: 'Logged out successfully' })
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
  console.log(`Google OAuth callback URL: ${process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback'}`)
})

