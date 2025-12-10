import mongoose from 'mongoose'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import Category from '../models/Category.js'
import Admin from '../models/Admin.js'
import TeamwearInquiry from '../models/TeamwearInquiry.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../.env') })

// Local MongoDB connection string
const LOCAL_MONGODB_URI = 'mongodb://127.0.0.1:27017/Jerseylab'
// Atlas connection string from environment
const ATLAS_MONGODB_URI = process.env.MONGODB_URI

if (!ATLAS_MONGODB_URI || ATLAS_MONGODB_URI.includes('<') || ATLAS_MONGODB_URI.includes('YOUR_PASSWORD')) {
  console.error('❌ Error: MONGODB_URI in .env file is not configured properly.')
  console.error('Please update server/.env with your MongoDB Atlas connection string.')
  process.exit(1)
}

let localConnection = null
let atlasConnection = null

async function connectToLocal() {
  return new Promise((resolve, reject) => {
    try {
      localConnection = mongoose.createConnection(LOCAL_MONGODB_URI)
      localConnection.once('connected', () => {
        console.log('✅ Connected to local MongoDB')
        resolve(localConnection)
      })
      localConnection.once('error', (error) => {
        console.error('❌ Failed to connect to local MongoDB:', error.message)
        reject(error)
      })
    } catch (error) {
      reject(error)
    }
  })
}

async function connectToAtlas() {
  return new Promise((resolve, reject) => {
    try {
      atlasConnection = mongoose.createConnection(ATLAS_MONGODB_URI, {
        retryWrites: true,
        w: 'majority'
      })
      atlasConnection.once('connected', () => {
        console.log('✅ Connected to MongoDB Atlas')
        resolve(atlasConnection)
      })
      atlasConnection.once('error', (error) => {
        console.error('❌ Failed to connect to MongoDB Atlas:', error.message)
        reject(error)
      })
    } catch (error) {
      reject(error)
    }
  })
}

async function migrateCollection(collectionName, Model, localDb, atlasDb) {
  console.log(`\n📦 Migrating ${collectionName}...`)
  
  try {
    // Get all documents from local MongoDB
    const LocalModel = localDb.model(collectionName, Model.schema)
    const documents = await LocalModel.find({}).lean()
    
    if (documents.length === 0) {
      console.log(`   ⚠️  No documents found in local ${collectionName} collection`)
      return { migrated: 0, skipped: 0, errors: 0 }
    }
    
    console.log(`   Found ${documents.length} document(s) in local database`)
    
    // Insert into Atlas
    const AtlasModel = atlasDb.model(collectionName, Model.schema)
    let migrated = 0
    let skipped = 0
    let errors = 0
    
    for (const doc of documents) {
      try {
        // Remove _id to let MongoDB generate new ones, or keep existing _id
        // Check if document already exists (for idempotency)
        const existing = await AtlasModel.findById(doc._id)
        if (existing) {
          console.log(`   ⏭️  Skipping ${collectionName} document ${doc._id} (already exists)`)
          skipped++
          continue
        }
        
        // Create new document in Atlas
        await AtlasModel.create(doc)
        migrated++
        console.log(`   ✅ Migrated ${collectionName} document: ${doc._id || doc.key || doc.email || 'N/A'}`)
      } catch (error) {
        if (error.code === 11000) {
          // Duplicate key error
          console.log(`   ⏭️  Skipping duplicate ${collectionName} document`)
          skipped++
        } else {
          console.error(`   ❌ Error migrating ${collectionName} document:`, error.message)
          errors++
        }
      }
    }
    
    return { migrated, skipped, errors }
  } catch (error) {
    console.error(`   ❌ Error migrating ${collectionName}:`, error.message)
    return { migrated: 0, skipped: 0, errors: 1 }
  }
}

async function migrate() {
  console.log('🚀 Starting migration from local MongoDB to MongoDB Atlas...\n')
  
  try {
    // Connect to both databases
    const localDb = await connectToLocal()
    const atlasDb = await connectToAtlas()
    
    const results = {
      categories: { migrated: 0, skipped: 0, errors: 0 },
      admins: { migrated: 0, skipped: 0, errors: 0 },
      teamwearinquiries: { migrated: 0, skipped: 0, errors: 0 }
    }
    
    // Migrate each collection
    results.categories = await migrateCollection('categories', Category, localDb, atlasDb)
    results.admins = await migrateCollection('admins', Admin, localDb, atlasDb)
    results.teamwearinquiries = await migrateCollection('teamwearinquiries', TeamwearInquiry, localDb, atlasDb)
    
    // Print summary
    console.log('\n' + '='.repeat(50))
    console.log('📊 Migration Summary:')
    console.log('='.repeat(50))
    
    let totalMigrated = 0
    let totalSkipped = 0
    let totalErrors = 0
    
    for (const [collection, stats] of Object.entries(results)) {
      console.log(`\n${collection}:`)
      console.log(`   ✅ Migrated: ${stats.migrated}`)
      console.log(`   ⏭️  Skipped: ${stats.skipped}`)
      console.log(`   ❌ Errors: ${stats.errors}`)
      totalMigrated += stats.migrated
      totalSkipped += stats.skipped
      totalErrors += stats.errors
    }
    
    console.log('\n' + '='.repeat(50))
    console.log(`Total: ${totalMigrated} migrated, ${totalSkipped} skipped, ${totalErrors} errors`)
    console.log('='.repeat(50))
    
    if (totalErrors === 0) {
      console.log('\n✅ Migration completed successfully!')
    } else {
      console.log('\n⚠️  Migration completed with some errors. Please review the output above.')
    }
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message)
    process.exit(1)
  } finally {
    // Close connections
    if (localConnection) {
      await localConnection.close()
      console.log('\n🔌 Closed local MongoDB connection')
    }
    if (atlasConnection) {
      await atlasConnection.close()
      console.log('🔌 Closed MongoDB Atlas connection')
    }
    process.exit(0)
  }
}

// Run migration
migrate()

