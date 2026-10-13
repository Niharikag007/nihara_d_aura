import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, required: true, trim: true },
  password: { type: String, select: false },
  avatar: { type: String, default: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d' },
  tier: { type: String, enum: ['Silver', 'Gold', 'Royal Elite'], default: 'Royal Elite' },
  rewardPoints: { type: Number, default: 450 }
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model('User', UserSchema);
