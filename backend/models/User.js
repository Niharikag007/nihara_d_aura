const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    trim: true,
  },
  name: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  mobileNumber: {
    type: String,
    trim: true,
  },
  avatar: {
    type: String,
    default: '',
  },
  password: {
    type: String,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  tier: {
    type: String,
    default: 'Royal Member',
  },
  rewardPoints: {
    type: Number,
    default: 0,
  },
  addresses: [{
    id: { type: String, default: () => `addr_${Date.now()}` },
    fullName: String,
    phone: String,
    street: String,
    area: String,
    city: String,
    state: String,
    pincode: String,
    tag: { type: String, default: 'Home' },
    isDefault: { type: Boolean, default: false }
  }],
  wishlist: [{
    type: String
  }],
  cart: [{
    productId: String,
    quantity: { type: Number, default: 1 },
    variant: String,
    size: String
  }],
  isVerified: {
    type: Boolean,
    default: false,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  blockedReason: {
    type: String,
    default: '',
  },
  otp: {
    type: String,
  },
  otpExpires: {
    type: Date,
    expires: 600, // MongoDB TTL index: automatically deletes document field or clears after 10 mins (600s)
  }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

// Virtual 'phone' to support legacy code while only saving 'mobileNumber' in MongoDB
userSchema.virtual('phone').get(function() {
  return this.mobileNumber || '';
}).set(function(val) {
  this.mobileNumber = val;
});

// Sync name <-> fullName and map phone -> mobileNumber before validation
userSchema.pre('validate', function() {
  if (this.name && !this.fullName) {
    this.fullName = this.name;
  }
  if (this.fullName && !this.name) {
    this.name = this.fullName;
  }
  if (this.phone && !this.mobileNumber) {
    this.mobileNumber = this.phone;
  }
});

module.exports = mongoose.model('User', userSchema);
