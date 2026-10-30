import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  id: { type: String },
  bookingId: { type: String, required: true, unique: true },
  userId: { type: String, default: '' },
  title: { type: String, required: true },
  client: { type: String, default: 'Customer' },
  phone: { type: String, default: '' },
  service: { type: String, default: '' },
  price: { type: Number, default: 0 },
  time: { type: String, default: '' },
  duration: { type: Number, default: 0 },
  locationDetails: { type: String, default: '' },
  notes: { type: String, default: '' },
  customerEmail: { type: String, default: '' },
  services: [{
    name: String,
    duration: String,
    price: Number
  }],
  artist: { type: String, required: true },
  date: { type: String, required: true },
  timeSlot: { type: String, required: true },
  location: { type: String, required: true },
  address: { type: String },
  servicesSubtotal: { type: Number, required: true },
  travelCharge: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['Confirmed', 'Pending', 'Processing', 'Completed', 'Cancelled'], default: 'Confirmed' },
  canCancel: { type: Boolean, default: true }
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

export const Booking = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);

const OrderSchema = new mongoose.Schema({
  id: { type: String },
  orderId: { type: String, required: true, unique: true },
  placedDate: { type: String, required: true },
  customer: { type: String, default: 'Guest' },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  userId: { type: String, default: '' },
  date: { type: String, default: '' },
  total: { type: Number },
  couponCode: { type: String, default: null },
  transactionId: { type: String, default: null },
  paymentStatus: { type: String, default: '' },
  carrier: { type: String, default: '' },
  trackingNumber: { type: String, default: '' },
  shippedAt: { type: Date },
  status: { type: String, enum: ['Processing', 'Packed', 'Shipped', 'Delivered', 'Cancelled'], default: 'Processing' },
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, default: 'UPI / GPay / PhonePe' },
  items: [{
    productId: String,
    name: String,
    qty: { type: Number, default: 1 },
    quantity: { type: Number, default: 1 },
    variant: String,
    size: String,
    price: Number,
    image: String
  }],
  shippingAddress: { type: String, required: true }
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

export const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

const AddressSchema = new mongoose.Schema({
  id: { type: String },
  userId: { type: String },
  type: { type: String, default: 'Home' },
  isDefault: { type: Boolean, default: false },
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  streetAddress: { type: String, required: true },
  city: { type: String, default: 'Greater Noida' },
  state: { type: String, default: 'Uttar Pradesh' },
  postalCode: { type: String, default: '201306' }
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

export const Address = mongoose.models.Address || mongoose.model('Address', AddressSchema);
