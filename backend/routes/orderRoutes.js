const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');
const { notifyNewOrder } = require('../utils/mailer');

router.use(auth);

router.get('/', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Sign in required' });
    }
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      orders: orders.map(order => ({
        id: order._id,
        orderId: order.orderId || `ORD-${String(order._id).slice(-8).toUpperCase()}`,
        createdAt: order.createdAt,
        items: order.items,
        shippingAddress: order.shippingAddress,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        paymentMethod: order.paymentMethod,
        totalAmount: order.totalAmount,
        status: order.status,
        paymentStatus: order.paymentStatus,
        trackingNumber: order.trackingNumber,
      })),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Could not load orders' });
  }
});

router.post('/', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Sign in required' });
    }
    const paymentMethod = ['UPI', 'COD', 'ONLINE'].includes(req.body.paymentMethod)
      ? req.body.paymentMethod
      : null;
    if (!paymentMethod) {
      return res.status(400).json({ success: false, message: 'paymentMethod must be UPI or COD' });
    }
    const items = (req.body.items || []).map(item => ({
      productId: mongoose.Types.ObjectId.isValid(item.productId) ? item.productId : undefined,
      name: item.name,
      price: Number(item.price) || 0,
      quantity: Number(item.qty || item.quantity) || 1,
      subtotal: Number(item.price) || 0,
    }));
    const generatedOrderId = `ORD-${Date.now().toString().slice(-6)}${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
    const order = await Order.create({
      orderId: generatedOrderId,
      userId: req.user._id,
      customerName: req.body.customer || req.user.name,
      customerEmail: req.body.email || req.user.email,
      customerPhone: req.body.mobileNumber || req.body.phone || req.user.mobileNumber || req.user.phone || '',
      items,
      totalAmount: Number(req.body.totalAmount) || 0,
      status: 'Pending',
      paymentStatus: 'Pending',
      paymentMethod,
      razorpayOrderId: typeof req.body.razorpayOrderId === 'string' ? req.body.razorpayOrderId : undefined,
      shippingAddress: typeof req.body.shippingAddress === 'string'
        ? { street: req.body.shippingAddress }
        : req.body.shippingAddress,
      notes: req.body.couponCode ? `Coupon: ${req.body.couponCode}` : '',
    });
    if (req.io) req.io.emit('order:created', { id: order._id });
    notifyNewOrder(order, `ORD-${String(order._id).slice(-8).toUpperCase()}`);
    res.status(201).json({
      success: true,
      order: {
        id: order._id,
        orderId: `ORD-${String(order._id).slice(-8).toUpperCase()}`,
        createdAt: order.createdAt,
        items: order.items,
        shippingAddress: order.shippingAddress,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        totalAmount: order.totalAmount,
        status: order.status,
      },
    });
  } catch (error) {
    console.error('Order create error:', error);
    res.status(500).json({ success: false, message: 'Could not create order' });
  }
});

router.patch('/:id', async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Sign in required' });
  }
  res.status(403).json({ success: false, message: 'Use the admin dashboard to update orders' });
});

module.exports = router;
