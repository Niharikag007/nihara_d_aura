const express = require('express');
const router = express.Router();
const ReturnRequest = require('../models/ReturnRequest');
const Order = require('../models/Order');
const auth = require('../middleware/auth');

router.use(auth);

// GET /api/returns — Get current user's return & refund requests
router.get('/', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Sign in required' });
    }

    const filter = { userId: req.user._id };
    if (req.query.type) {
      const formattedType = req.query.type.charAt(0).toUpperCase() + req.query.type.slice(1).toLowerCase();
      if (['Refund', 'Replacement'].includes(formattedType)) {
        filter.type = formattedType;
      }
    }

    const requests = await ReturnRequest.find(filter)
      .sort({ createdAt: -1 })
      .populate('orderId', 'orderId createdAt totalAmount paymentMethod status');

    res.status(200).json({
      success: true,
      requests: requests.map(reqItem => ({
        id: reqItem._id,
        orderId: reqItem.orderId?._id || reqItem.orderId,
        orderIdentifier: reqItem.orderIdentifier || reqItem.orderId?.orderId || `ORD-${String(reqItem.orderId?._id || reqItem.orderId).slice(-8).toUpperCase()}`,
        type: reqItem.type,
        items: reqItem.items,
        refundAmount: reqItem.refundAmount,
        reason: reqItem.reason,
        status: reqItem.status,
        adminNotes: reqItem.adminNotes,
        createdAt: reqItem.createdAt,
        resolvedAt: reqItem.resolvedAt,
        canCancel: reqItem.status === 'Pending',
      })),
    });
  } catch (error) {
    console.error('Error fetching return requests:', error);
    res.status(500).json({ success: false, message: 'Could not load return requests' });
  }
});

// GET /api/returns/eligible-orders — Get user's orders eligible for return or replacement
router.get('/eligible-orders', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Sign in required' });
    }

    // Orders that are not cancelled or already refunded
    const orders = await Order.find({
      userId: req.user._id,
      status: { $ne: 'Cancelled' },
      paymentStatus: { $ne: 'Refunded' },
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders: orders.map(o => ({
        id: o._id,
        orderId: o.orderId || `ORD-${String(o._id).slice(-8).toUpperCase()}`,
        createdAt: o.createdAt,
        totalAmount: o.totalAmount,
        status: o.status,
        paymentStatus: o.paymentStatus,
        paymentMethod: o.paymentMethod,
        items: o.items,
      })),
    });
  } catch (error) {
    console.error('Error fetching eligible orders:', error);
    res.status(500).json({ success: false, message: 'Could not load eligible orders' });
  }
});

// POST /api/returns — Create a return or replacement request
router.post('/', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Sign in required' });
    }

    const { orderId, type = 'Refund', reason, items = [] } = req.body;

    if (!orderId) {
      return res.status(400).json({ success: false, message: 'A valid orderId is required' });
    }
    if (!reason || !reason.trim()) {
      return res.status(400).json({ success: false, message: 'Reason for return or replacement is required' });
    }

    const order = await Order.findOne({ _id: orderId, userId: req.user._id });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found or does not belong to user' });
    }

    const formattedType = type.toLowerCase() === 'replacement' ? 'Replacement' : 'Refund';

    // Calculate requested refund amount if items specified, else use order total
    let totalRefund = 0;
    if (items.length > 0) {
      totalRefund = items.reduce((acc, it) => acc + (Number(it.price || 0) * (Number(it.quantity || it.qty || 1))), 0);
    } else {
      totalRefund = order.totalAmount || 0;
    }

    const newRequest = await ReturnRequest.create({
      userId: req.user._id,
      orderId: order._id,
      orderIdentifier: order.orderId || `ORD-${String(order._id).slice(-8).toUpperCase()}`,
      type: formattedType,
      items: items.length > 0 ? items : order.items,
      refundAmount: totalRefund,
      reason: reason.trim(),
      status: 'Pending',
    });

    if (req.io) {
      req.io.to('admin').emit('admin:data:changed', { type: 'return_request', action: 'create', data: newRequest });
      req.io.emit('return:created', newRequest);
    }

    res.status(201).json({
      success: true,
      message: `${formattedType} request submitted successfully`,
      request: {
        id: newRequest._id,
        orderIdentifier: newRequest.orderIdentifier,
        type: newRequest.type,
        status: newRequest.status,
        refundAmount: newRequest.refundAmount,
        createdAt: newRequest.createdAt,
      },
    });
  } catch (error) {
    console.error('Error creating return request:', error);
    res.status(500).json({ success: false, message: 'Could not submit return request' });
  }
});

// PATCH /api/returns/:id/cancel — Cancel a pending return request
router.patch('/:id/cancel', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Sign in required' });
    }

    const request = await ReturnRequest.findOne({ _id: req.params.id, userId: req.user._id });
    if (!request) {
      return res.status(404).json({ success: false, message: 'Return request not found' });
    }

    if (request.status !== 'Pending') {
      return res.status(400).json({ success: false, message: `Cannot cancel a request that is already ${request.status}` });
    }

    request.status = 'Cancelled';
    await request.save();

    if (req.io) {
      req.io.to('admin').emit('admin:data:changed', { type: 'return_request', action: 'update', data: request });
      req.io.emit('return:updated', request);
    }

    res.status(200).json({
      success: true,
      message: 'Return request cancelled successfully',
      request,
    });
  } catch (error) {
    console.error('Error cancelling return request:', error);
    res.status(500).json({ success: false, message: 'Could not cancel return request' });
  }
});

module.exports = router;
