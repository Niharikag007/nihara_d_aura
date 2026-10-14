import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  id: { type: String },
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true },
  category: { type: String, required: true },
  categorySlug: { type: String, required: true },
  subcategory: { type: String },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  discountPercent: { type: Number, default: 0 },
  rating: { type: Number, default: 4.8 },
  reviewCount: { type: Number, default: 0 },
  images: [{ type: String, required: true }],
  description: { type: String, required: true },
  variants: [{ type: String }],
  sizes: [{ type: String }],
  features: [{ type: String }],
  stock: { type: Number, default: 20 },
  isFeatured: { type: Boolean, default: false },
  isBestseller: { type: Boolean, default: false }
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

export const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
