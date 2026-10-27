import mongoose from 'mongoose';

const OtpSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true, trim: true },
  otp: { type: String, required: true },
  fullName: { type: String, trim: true, default: '' },
  purpose: { type: String, enum: ['register', 'login'], default: 'login' },
  createdAt: { type: Date, default: Date.now, expires: 600 } // Auto-expires after 10 minutes
});

export const Otp = mongoose.models.Otp || mongoose.model('Otp', OtpSchema);
