import mongoose from 'mongoose'
import dotenv from 'dotenv'
import readline from 'readline'
import path from 'path'
import { fileURLToPath } from 'url'
import Admin from '../models/Admin.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../.env') })

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const question = (query) => new Promise(resolve => rl.question(query, resolve))

async function createAdmin() {
  try {
    const email = await question('Admin email: ')
    const password = await question('Admin password: ')
    const name = await question('Admin name (optional): ')

    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/Jerseylab', {
      retryWrites: true,
      w: 'majority'
    })

    const existing = await Admin.findOne({ email })
    if (existing) {
      console.log('Admin already exists with that email.')
      process.exit(0)
    }

    const admin = await Admin.create({
      email,
      password,
      name: name || 'JerseyLab Owner'
    })

    console.log('Admin created:', { email: admin.email, name: admin.name })
    process.exit(0)
  } catch (error) {
    console.error('Failed to create admin:', error)
    process.exit(1)
  }
}

createAdmin()
