import { store } from '../services/storeService.js';
import { successResponse, errorResponse } from '../utils/responseHelper.js';
import { emitRealtimeEvent } from '../socket.js';

export const getBookings = (req, res, next) => {
  try {
    const bookings = store.getBookings();
    return successResponse(res, { bookings });
  } catch (err) {
    next(err);
  }
};

export const createBooking = (req, res, next) => {
  try {
    const booking = store.createBooking(req.body);
    emitRealtimeEvent('booking:created', booking);
    return successResponse(res, { booking }, 'Appointment Confirmed', 201);
  } catch (err) {
    next(err);
  }
};

export const cancelBooking = (req, res, next) => {
  try {
    const booking = store.cancelBooking(req.params.id);
    if (!booking) return errorResponse(res, 'Booking not found', 404);
    emitRealtimeEvent('booking:cancelled', booking);
    return successResponse(res, { booking }, 'Appointment Cancelled');
  } catch (err) {
    next(err);
  }
};
