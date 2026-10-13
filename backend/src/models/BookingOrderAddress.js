import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  bookingId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
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
  status: { type: String, enum: ['Confirmed', 'Processing', 'Completed', 'Cancelled'], default: 'Confirmed' },
  canCancel: { type: Boolean, default: true }
}, { timestamps: true });

export const Booking = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);

const OrderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  placedDate: { type: String, required: true },
  status: { type: String, enum: ['Processing', 'Packed', 'Shipped', 'Delivered', 'Cancelled'], default: 'Processing' },
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, default: 'UPI / GPay / PhonePe' },
  items: [{
    name: String,
    variant: String,
    size: String,
    price: Number,
    image: String
  }],
  shippingAddress: { type: String, required: true }
}, { timestamps: true });

export const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

const AddressSchema = new mongoose.Schema({
  type: { type: String, default: 'Home' },
  isDefault: { type: Boolean, default: false },
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  streetAddress: { type: String, required: true },
  city: { type: String, default: 'Mumbai' },
  state: { type: String, default: 'Maharashtra' },
  postalCode: { type: String }
}, { timestamps: true });

export const Address = mongoose.models.Address || mongoose.model('Address', AddressSchema);
