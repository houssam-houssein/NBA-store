import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  googleId: { type: String, unique: true, sparse: true }, // Sparse index allows null values
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  name: { type: String, required: true },
  password: { type: String }, // Hashed password (optional, for email/password login)
  picture: { type: String }, // Google profile picture URL
  provider: { type: String, default: 'google' }, // OAuth provider
  hasSignedUp: { type: Boolean, default: false }, // Whether user has completed signup
  isVerified: { type: Boolean, default: false }, // Whether user email is verified
  lastLogin: { type: Date, default: Date.now },
  loginCount: { type: Number, default: 1 }
}, { timestamps: true })

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Method to compare password
userSchema.methods.comparePassword = function (candidatePassword) {
  if (!this.password) return false
  return bcrypt.compare(candidatePassword, this.password)
}

// Note: Indexes are automatically created by unique: true, so we don't need to add them manually

const User = mongoose.model('User', userSchema)
export default User

