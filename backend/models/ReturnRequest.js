const mongoose = require('mongoose');

const returnRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  orderIdentifier: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['Refund', 'Replacement'],
    default: 'Refund',
    required: true,
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    name: String,
    price: Number,
    quantity: Number,
    variant: String,
    image: String,
  }],
  refundAmount: {
    type: Number,
    default: 0,
  },
  reason: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Processing', 'Completed', 'Rejected', 'Cancelled'],
    default: 'Pending',
  },
  adminNotes: {
    type: String,
    default: '',
  },
  resolvedAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('ReturnRequest', returnRequestSchema);
