import mongoose from 'mongoose';

const OfferSchema = new mongoose.Schema({
  id: { type: String },
  code: { type: String, required: true, uppercase: true, trim: true },
  name: { type: String, required: true },
  discountPercent: { type: Number, required: true },
  minOrder: { type: Number, default: 0 },
  validTill: { type: String, default: '2026-12-31' },
  isActive: { type: Boolean, default: true }
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

export const Offer = mongoose.models.Offer || mongoose.model('Offer', OfferSchema);
