import mongoose from 'mongoose'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import Admin from '../models/Admin.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../.env') })

async function listAdmins() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/Jerseylab')
    const admins = await Admin.find({}, { email: 1, name: 1, role: 1, createdAt: 1 })
    console.log('Admins:', admins)
    process.exit(0)
  } catch (error) {
    console.error('Failed to list admins:', error)
    process.exit(1)
  }
}

listAdmins()
