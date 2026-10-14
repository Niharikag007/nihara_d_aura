import mongoose from 'mongoose';

const CartItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  variant: { type: String },
  size: { type: String }
});

const CartSchema = new mongoose.Schema({
  userId: { type: String, default: 'usr_amit_kumar' },
  items: [CartItemSchema],
  coupon: {
    code: String,
    discountPercent: Number
  }
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

export const Cart = mongoose.models.Cart || mongoose.model('Cart', CartSchema);
