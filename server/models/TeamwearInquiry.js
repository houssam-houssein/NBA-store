import mongoose from 'mongoose'

const teamwearInquirySchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true },
  description: { type: String, required: true },
  designFile: { type: String }, // Store file path or base64 data URL
  fileName: { type: String }, // Original file name
  status: { type: String, enum: ['pending', 'in-progress', 'completed', 'cancelled'], default: 'pending' },
  notes: { type: String } // Admin notes
}, { timestamps: true })

const TeamwearInquiry = mongoose.model('TeamwearInquiry', teamwearInquirySchema)
export default TeamwearInquiry

