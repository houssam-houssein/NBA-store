import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, default: 0 },
  currency: { type: String, default: 'USD' },
  status: { type: String, enum: ['active', 'coming-soon', 'archived'], default: 'active' },
  inventory: { type: Number, default: 0 },
  imageUrl: { type: String },
  featured: { type: Boolean, default: false },
  metadata: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true })

const categorySchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String },
  heroImage: { type: String },
  status: { type: String, enum: ['active', 'coming-soon'], default: 'active' },
  products: [productSchema]
}, { timestamps: true })

const Category = mongoose.model('Category', categorySchema)
export default Category
