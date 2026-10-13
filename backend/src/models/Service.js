import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  durationMinutes: { type: Number, required: true },
  rating: { type: Number, default: 4.9 },
  reviewCount: { type: Number, default: 0 },
  image: { type: String, required: true },
  description: { type: String, required: true },
  inclusions: [{ type: String }]
}, { timestamps: true });

export const Service = mongoose.models.Service || mongoose.model('Service', ServiceSchema);

const ArtistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  specialization: [{ type: String }],
  rating: { type: Number, default: 4.9 },
  avatar: { type: String, required: true }
}, { timestamps: true });

export const Artist = mongoose.models.Artist || mongoose.model('Artist', ArtistSchema);
