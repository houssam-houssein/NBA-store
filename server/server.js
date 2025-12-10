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
import User from './models/User.js'

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

// Mongo connection with Atlas-optimized options and connection pooling
mongoose.connect(MONGODB_URI, {
  retryWrites: true,
  w: 'majority',
  // Connection pool settings for better performance
  maxPoolSize: 10, // Maintain up to 10 socket connections
  minPoolSize: 2, // Maintain at least 2 socket connections
  serverSelectionTimeoutMS: 5000, // How long to try selecting a server
  socketTimeoutMS: 45000, // How long a send or receive on a socket can take before timing out
  connectTimeoutMS: 10000, // How long to wait for initial connection
  // Keep connections alive
  heartbeatFrequencyMS: 10000
}).then(() => {
  console.log('Connected to MongoDB Atlas')
}).catch((error) => {
  console.error('MongoDB connection error:', error)
  process.exit(1)
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
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value
      const googleId = profile.id
      const name = profile.displayName
      const picture = profile.photos && profile.photos[0] ? profile.photos[0].value : null

      // Check if user exists in database
      let user = await User.findOne({ 
        $or: [
          { googleId: googleId },
          { email: email }
        ]
      })

      // Simplified flow: Allow signup automatically
      // If user doesn't exist, create them (signup)
      // If user exists but hasn't signed up, complete signup
      // If user exists and has signed up, regular login
      
      if (user) {
        // If user exists but hasn't signed up, complete signup
        if (!user.hasSignedUp) {
          user.hasSignedUp = true
          user.googleId = googleId
          user.name = name
          user.picture = picture
          user.isVerified = true
          user.lastLogin = new Date()
          user.loginCount = 1
          await user.save()
        } else {
          // User exists and has signed up - regular login
          user.googleId = googleId
          user.name = name
          user.picture = picture
          user.lastLogin = new Date()
          user.loginCount = (user.loginCount || 0) + 1
          user.isVerified = true
          await user.save()
        }
      } else {
        // User doesn't exist - create new user (signup)
        user = await User.create({
          googleId: googleId,
          email: email,
          name: name,
          picture: picture,
          provider: 'google',
          hasSignedUp: true,
          isVerified: true,
          lastLogin: new Date(),
          loginCount: 1
        })
      }

      // Return user object for session (without mongoose document methods)
      const userObj = {
        id: user._id.toString(),
        googleId: user.googleId,
        email: user.email,
        name: user.name,
        picture: user.picture,
        provider: user.provider,
        hasSignedUp: user.hasSignedUp,
        isVerified: user.isVerified
      }

      return done(null, userObj)
    } catch (error) {
      console.error('Error in Google OAuth strategy:', error)
      return done(error, null)
    }
  }))
} else {
  console.warn('⚠️  Google OAuth environment variables missing. Skipping Google strategy setup.')
}

// Serialize user for session (store user ID)
passport.serializeUser((user, done) => {
  done(null, user.id) // Store user ID in session
})

// Deserialize user from session (fetch from database)
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id)
    if (user) {
      const userObj = {
        id: user._id.toString(),
        googleId: user.googleId,
        email: user.email,
        name: user.name,
        picture: user.picture,
        provider: user.provider
      }
      done(null, userObj)
    } else {
      done(null, null)
    }
  } catch (error) {
    console.error('Error deserializing user:', error)
    done(error, null)
  }
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

// Simple in-memory cache for categories (5 minute TTL)
const categoryCache = new Map()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

const getCachedCategory = (key) => {
  const cached = categoryCache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data
  }
  return null
}

const setCachedCategory = (key, data) => {
  categoryCache.set(key, {
    data,
    timestamp: Date.now()
  })
}

// Categories endpoints
app.get('/api/categories', async (req, res) => {
  try {
    // Check cache first
    const cacheKey = 'all_categories'
    const cached = getCachedCategory(cacheKey)
    if (cached) {
      return res.json(cached)
    }

    // Only fetch essential fields to reduce payload size
    const categories = await Category.find()
      .select('key title description heroImage status products')
      .sort({ createdAt: 1 })
      .lean() // Use lean() for faster queries (returns plain JS objects)
    
    // Cache the result
    setCachedCategory(cacheKey, categories)
    
    res.json(categories)
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    res.status(500).json({ error: 'Failed to fetch categories' })
  }
})

// Get single category by key (optimized endpoint with caching)
app.get('/api/categories/key/:key', async (req, res) => {
  try {
    const { key } = req.params
    
    // Check cache first
    const cached = getCachedCategory(key)
    if (cached) {
      return res.json(cached)
    }
    
    const category = await Category.findOne({ key: key })
      .select('key title description heroImage status products')
      .lean()
    
    if (!category) {
      return res.status(404).json({ error: 'Category not found' })
    }
    
    // Cache the result
    setCachedCategory(key, category)
    
    res.json(category)
  } catch (error) {
    console.error('Failed to fetch category:', error)
    res.status(500).json({ error: 'Failed to fetch category' })
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
    
    // Clear cache when category is updated
    categoryCache.clear()
    
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

// Signup endpoint - creates user account
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, name, password } = req.body

    if (!email || !name) {
      return res.status(400).json({ error: 'Email and name are required' })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    
    if (existingUser) {
      if (existingUser.hasSignedUp) {
        return res.status(400).json({ error: 'User already exists. Please log in instead.' })
      } else {
        // User exists but hasn't signed up - update them
        existingUser.name = name
        if (password) {
          existingUser.password = password // Will be hashed by pre-save hook
        }
        existingUser.hasSignedUp = true
        existingUser.provider = password ? 'local' : 'google'
        await existingUser.save()
        return res.json({ 
          message: 'Signup successful. You can now log in.',
          user: {
            id: existingUser._id.toString(),
            email: existingUser.email,
            name: existingUser.name,
            hasSignedUp: existingUser.hasSignedUp
          }
        })
      }
    }

    // Create new user
    const userData = {
      email: email.toLowerCase(),
      name: name,
      hasSignedUp: true,
      isVerified: false,
      provider: password ? 'local' : 'google' // Set provider based on whether password is provided
    }
    
    if (password) {
      userData.password = password // Will be hashed by pre-save hook
    }

    const user = await User.create(userData)

    res.json({ 
      message: password ? 'Signup successful! You can now log in.' : 'Signup successful. You can now log in with Google.',
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        hasSignedUp: user.hasSignedUp
      }
    })
  } catch (error) {
    console.error('Error in signup:', error)
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Email already exists' })
    }
    res.status(500).json({ error: 'Failed to create user', details: error.message })
  }
})

// Login endpoint - email/password authentication
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() })
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    // Check if user has signed up
    if (!user.hasSignedUp) {
      return res.status(401).json({ error: 'Please complete signup first' })
    }

    // Check if user has a password (local provider)
    if (!user.password) {
      return res.status(401).json({ error: 'This account uses Google login. Please log in with Google instead.' })
    }

    // Compare password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    // Update last login
    user.lastLogin = new Date()
    user.loginCount = (user.loginCount || 0) + 1
    await user.save()

    // Create session
    req.login(user, (err) => {
      if (err) {
        console.error('Session creation error:', err)
        return res.status(500).json({ error: 'Failed to create session' })
      }

      res.json({
        message: 'Login successful',
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          picture: user.picture,
          provider: user.provider
        }
      })
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Server error', details: error.message })
  }
})

// Google OAuth Routes (only if keys provided)
if (hasGoogleKeys) {
  app.get('/api/auth/google',
    (req, res, next) => {
      console.log('Google OAuth initiated', { signup: req.query.signup, sessionId: req.sessionID })
      // Store signup intent in session if coming from signup page
      if (req.query.signup === 'true') {
        req.session.isSignupFlow = true
        console.log('Signup flow flag set in session')
      }
      // Force redirect to Google OAuth page
      // passport.authenticate automatically redirects to Google
      // We need to ensure it always redirects, even if user is already authenticated
      passport.authenticate('google', { 
        scope: ['profile', 'email'],
        prompt: 'select_account' // Force account selection screen
      })(req, res, next)
    }
  )

  app.get('/api/auth/google/callback',
    (req, res, next) => {
      const isSignupFlow = req.session?.isSignupFlow || false
      passport.authenticate('google', (err, user, info) => {
        if (err) {
          console.error('OAuth error:', err.message)
          // Clear signup flag on error
          if (req.session) {
            req.session.isSignupFlow = false
          }
          return res.redirect(process.env.CLIENT_URL + '/login?error=auth_failed')
        }
        if (!user) {
          return res.redirect(process.env.CLIENT_URL + '/login?error=no_user')
        }
        req.login(user, (loginErr) => {
          if (loginErr) {
            return res.redirect(process.env.CLIENT_URL + '/login?error=session_failed')
          }
          // Clear signup flag after successful login
          if (req.session) {
            req.session.isSignupFlow = false
          }
          // If this was a signup flow, redirect to signup page with success message
          if (isSignupFlow) {
            return res.redirect(process.env.CLIENT_URL + '/signup?signup=success')
          }
          // Otherwise, regular login - redirect to homepage
          return res.redirect(process.env.CLIENT_URL + '/?login=success')
        })
      })(req, res, next)
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

