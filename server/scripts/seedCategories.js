import mongoose from 'mongoose'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import Category from '../models/Category.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../.env') })

const seedData = [
  {
    key: 'professionalAthletes',
    title: 'Professional Athletes',
    description: 'International jerseys straight from overseas pros.',
    heroImage: '',
    status: 'active',
    products: [
      {
        title: 'LeBron International Jersey',
        description: 'Limited run jersey straight from overseas play.',
        price: 140,
        inventory: 25,
        imageUrl: '',
        featured: true
      },
      {
        title: 'Kawhi Tokyo Edition',
        description: 'Alternate jersey from the Tokyo showcase.',
        price: 135,
        inventory: 18,
        imageUrl: ''
      }
    ]
  },
  {
    key: 'influencers',
    title: 'Influencers',
    description: 'Drops with HoopDreams and the creators shaping the culture.',
    status: 'coming-soon',
    products: []
  },
  {
    key: 'highSchoolAthletes',
    title: 'High School Athletes',
    description: 'High school phenoms and their signature jerseys.',
    status: 'coming-soon',
    products: []
  },
  {
    key: 'teamwear',
    title: 'Teamwear',
    description: 'Custom team kits built with the Jerzey Lab studio.',
    status: 'active',
    products: []
  }
]

async function seedCategories() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/Jerseylab', {
      retryWrites: true,
      w: 'majority'
    })
    for (const cat of seedData) {
      await Category.findOneAndUpdate(
        { key: cat.key },
        cat,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      )
    }
    console.log('Categories seeded successfully.')
    process.exit(0)
  } catch (error) {
    console.error('Failed to seed categories:', error)
    process.exit(1)
  }
}

seedCategories()
