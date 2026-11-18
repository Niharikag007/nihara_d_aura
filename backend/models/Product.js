const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  categorySlug: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  subcategory: {
    type: String,
    trim: true,
  },
  // Admin-specific fields (use productCollection instead of collection to avoid reserved keyword)
  productCollection: {
    type: String,
    enum: ['Jewellery', 'Makeup', 'Nails', 'Candles'],
    default: 'Jewellery',
  },
  cost: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['Live', 'Draft'],
    default: 'Live',
  },
  soldLast30: {
    type: Number,
    default: 0,
  },
  image: {
    type: String,
  },
  // Pricing
  price: {
    type: Number,
    required: true,
  },
  originalPrice: {
    type: Number,
  },
  discountPercent: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 5,
  },
  reviewCount: {
    type: Number,
    default: 0,
  },
  images: [{
    type: String,
  }],
  description: {
    type: String,
    default: '',
  },
  variants: [{
    type: String,
  }],
  sizes: [{
    type: String,
  }],
  features: [{
    type: String,
  }],
  stock: {
    type: Number,
    default: 0,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  isBestseller: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
