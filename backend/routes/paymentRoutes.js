const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const auth = require('../middleware/auth');
const Order = require('../models/Order');

function getRazorpay() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return { razorpay: null, keyId: null, keySecret: null };

  try {
    const Razorpay = require('razorpay');
    return {
      razorpay: new Razorpay({ key_id: keyId, key_secret: keySecret }),
      keyId,
      keySecret
    };
  } catch (error) {
    console.error('Failed to initialize Razorpay:', error.message);
    return { razorpay: null, keyId: null, keySecret: null };
  }
}

// Public: Returns whether a real gateway is configured so the frontend can show/hide options
router.get('/config', (req, res) => {
  const { razorpay, keyId } = getRazorpay();
  res.status(200).json({
    success: true,
    gatewayEnabled: Boolean(razorpay && keyId),
    keyId: razorpay ? keyId : null,
  });
});

router.use(auth);

function requireUser(req, res) {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Sign in required' });
    return false;
  }
  return true;
}

// Create a Razorpay order for the given amount (INR)
router.post('/create-order', async (req, res) => {
  if (!requireUser(req, res)) return;
  const { razorpay } = getRazorpay();
  if (!razorpay) {
    return res.status(503).json({
      success: false,
      message: 'Online payment gateway is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.'
    });
  }

  const amountInr = Number(req.body.amount);
  if (!Number.isFinite(amountInr) || amountInr <= 0) {
    return res.status(400).json({ success: false, message: 'A valid amount is required' });
  }

  try {
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amountInr * 100), // paise
      currency: 'INR',
      receipt: `nda_${Date.now()}`,
      notes: { userId: String(req.user._id) },
    });

    res.status(201).json({
      success: true,
      order: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      },
    });
  } catch (error) {
    console.error('Razorpay order creation failed:', error.message);
    res.status(502).json({ success: false, message: 'Could not create payment order. Please try again.' });
  }
});

// Verify Razorpay payment signature and mark the linked order as Paid
router.post('/verify', async (req, res) => {
  if (!requireUser(req, res)) return;
  const { keySecret } = getRazorpay();
  if (!keySecret) {
    return res.status(503).json({ success: false, message: 'Payment verification is not configured.' });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ success: false, message: 'Missing payment verification fields' });
  }

  const expectedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ success: false, message: 'Payment signature verification failed' });
  }

  const order = await Order.findOne({ razorpayOrderId: razorpay_order_id, userId: req.user._id });
  if (!order) {
    return res.status(404).json({ success: false, message: 'No matching order found for this payment' });
  }

  order.paymentStatus = 'Paid';
  order.razorpayPaymentId = razorpay_payment_id;
  await order.save();

  if (req.io) req.io.emit('order:updated', order);

  res.status(200).json({
    success: true,
    message: 'Payment verified successfully',
    order: {
      id: order._id,
      orderId: `ORD-${String(order._id).slice(-8).toUpperCase()}`,
      paymentStatus: order.paymentStatus,
    },
  });
});

module.exports = router;
