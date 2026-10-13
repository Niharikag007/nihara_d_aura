import { store } from '../services/storeService.js';
import { successResponse, errorResponse } from '../utils/responseHelper.js';
import { emitRealtimeEvent } from '../socket.js';

export const getOrders = (req, res, next) => {
  try {
    const orders = store.getOrders();
    return successResponse(res, { orders });
  } catch (err) {
    next(err);
  }
};

export const getOrderById = (req, res, next) => {
  try {
    const order = store.getOrderById(req.params.id);
    if (!order) return errorResponse(res, 'Order not found', 404);
    return successResponse(res, { order });
  } catch (err) {
    next(err);
  }
};

export const createOrder = (req, res, next) => {
  try {
    const order = store.createOrder(req.body);
    emitRealtimeEvent('order:created', order);
    return successResponse(res, { order }, 'Order Placed Successfully!', 201);
  } catch (err) {
    next(err);
  }
};
