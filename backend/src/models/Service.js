import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema({
  id: { type: String },
  name: { type: String, required: true, trim: true, maxlength: 120 },
  slug: { type: String, required: true, trim: true },
  category: { type: String, required: true, enum: ['Makeup', 'Salon', 'Nails', 'Jewellery & Styling', 'Jewelry & Styling'] },
  price: { type: Number, required: true, min: 1 },
  durationMinutes: { type: Number, required: true, min: 1 },
  rating: { type: Number, default: 4.9, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0, min: 0 },
  image: { type: String, required: true },
  description: { type: String, required: true, trim: true, maxlength: 1200 },
  inclusions: [{ type: String, trim: true, maxlength: 160 }]
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret.id || ret._id.toString();
      return ret;
    }
  }
});

export const Service = mongoose.models.Service || mongoose.model('Service', ServiceSchema);

const ArtistSchema = new mongoose.Schema({
  id: { type: String },
  name: { type: String, required: true },
  title: { type: String, required: true },
  specialization: [{ type: String }],
  rating: { type: Number, default: 4.9 },
  avatar: { type: String, required: true }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret.id || ret._id.toString();
      return ret;
    }
  }
});

export const Artist = mongoose.models.Artist || mongoose.model('Artist', ArtistSchema);
