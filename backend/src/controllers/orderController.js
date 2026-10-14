import { Order } from '../models/BookingOrderAddress.js';
import { successResponse, errorResponse } from '../utils/responseHelper.js';
import { emitRealtimeEvent } from '../socket.js';

export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    return successResponse(res, { orders });
  } catch (err) {
    next(err);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let query = { $or: [{ id }, { orderId: id }] };
    if (typeof id === 'string' && id.match(/^[0-9a-fA-F]{24}$/)) {
      query = { $or: [{ _id: id }, { id }, { orderId: id }] };
    }
    const order = await Order.findOne(query);
    if (!order) return errorResponse(res, 'Order not found', 404);
    return successResponse(res, { order });
  } catch (err) {
    next(err);
  }
};

export const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod, totalAmount } = req.body;
    const ref = 'NIH-' + Math.floor(100000 + Math.random() * 900000);
    const order = await Order.create({
      id: `ord_${Date.now()}`,
      orderId: ref,
      placedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Processing',
      totalAmount: Number(totalAmount) || 0,
      paymentMethod: paymentMethod || 'UPI / Online Payment',
      items: Array.isArray(items) ? items : [],
      shippingAddress: typeof shippingAddress === 'string' ? shippingAddress : `${shippingAddress?.streetAddress || ''}, ${shippingAddress?.city || ''}`
    });

    emitRealtimeEvent('order:created', order);
    return successResponse(res, { order }, 'Order Placed Successfully!', 201);
  } catch (err) {
    next(err);
  }
};
