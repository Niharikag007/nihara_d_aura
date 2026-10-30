import { Order } from '../models/BookingOrderAddress.js';
import { User } from '../models/User.js';
import { successResponse, errorResponse } from '../utils/responseHelper.js';
import { emitAdminEvent, emitRealtimeEvent } from '../socket.js';

const userQuery = (userId) => ({
  $or: [{ id: userId }, ...(userId.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: userId }] : [])]
});

export const getOrders = async (req, res, next) => {
  try {
    const filter = req.userRole === 'admin' ? {} : { userId: req.userId };
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    return successResponse(res, { orders });
  } catch (err) {
    return next(err);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const identifiers = [{ id }, { orderId: id }];
    if (/^[0-9a-fA-F]{24}$/.test(id)) identifiers.push({ _id: id });
    const query = { $or: identifiers };
    if (req.userRole !== 'admin') query.userId = req.userId;
    const order = await Order.findOne(query);
    if (!order) return errorResponse(res, 'Order not found', 404);
    return successResponse(res, { order });
  } catch (err) {
    return next(err);
  }
};

export const createOrder = async (req, res, next) => {
  try {
    const {
      items, shippingAddress, paymentMethod, totalAmount,
      customer, email, phone, couponCode, transactionId, paymentStatus
    } = req.body;
    if (!Array.isArray(items) || items.length === 0 || !shippingAddress) {
      return errorResponse(res, 'Order items and shipping address are required', 400);
    }

    const user = await User.findOne(userQuery(req.userId)).select('name email phone');
    const orderId = `NIH-${Math.floor(100000 + Math.random() * 900000)}`;
    const order = await Order.create({
      id: `ord_${Date.now()}`,
      orderId,
      placedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      date: new Date().toISOString(),
      userId: req.userId,
      customer: user?.name || customer || 'Customer',
      email: user?.email || email || '',
      phone: user?.phone || phone || '',
      status: 'Processing',
      totalAmount: Number(totalAmount) || 0,
      paymentMethod: paymentMethod || 'UPI / Online Payment',
      transactionId: transactionId || null,
      paymentStatus: paymentStatus || '',
      couponCode: couponCode || null,
      items: items.map((item) => ({
        ...item,
        qty: Number(item.qty || item.quantity) || 1,
        quantity: Number(item.qty || item.quantity) || 1
      })),
      shippingAddress: typeof shippingAddress === 'string'
        ? shippingAddress
        : `${shippingAddress?.streetAddress || ''}, ${shippingAddress?.city || ''}`
    });

    emitRealtimeEvent('order:created', { id: order.id, orderId: order.orderId }, `user:${order.userId}`);
    emitAdminEvent('order:created', order);
    return successResponse(res, { order }, 'Order Placed Successfully!', 201);
  } catch (err) {
    return next(err);
  }
};
