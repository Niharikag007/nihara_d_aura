import { Booking } from '../models/BookingOrderAddress.js';
import { Service } from '../models/Service.js';
import { successResponse, errorResponse } from '../utils/responseHelper.js';
import { emitRealtimeEvent } from '../socket.js';

export const getBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    return successResponse(res, { bookings });
  } catch (err) {
    next(err);
  }
};

export const createBooking = async (req, res, next) => {
  try {
    const { serviceIds, date, timeSlot, locationType, serviceAddress, artistName } = req.body;
    let selected = [];
    if (Array.isArray(serviceIds) && serviceIds.length > 0) {
      selected = await Service.find({
        $or: [
          { id: { $in: serviceIds } },
          { _id: { $in: serviceIds.filter(id => typeof id === 'string' && id.match(/^[0-9a-fA-F]{24}$/)) } }
        ]
      });
    }

    const subtotal = selected.reduce((sum, s) => sum + s.price, 0);
    const travel = locationType === 'home' ? 500 : 0;
    const ref = 'BK-' + Math.floor(100000 + Math.random() * 900000);

    const booking = await Booking.create({
      id: `bk_${Date.now()}`,
      bookingId: ref,
      title: selected.length > 1 ? `${selected[0].name} + ${selected.length - 1} more` : selected[0]?.name || 'Beauty Service',
      services: selected.map(s => ({ name: s.name, duration: `${s.durationMinutes} Mins`, price: s.price })),
      artist: artistName || 'Any Senior Specialist',
      date: date || 'Fri, Oct 16, 2026',
      timeSlot: timeSlot || '01:00 PM',
      location: locationType === 'home' ? 'At Home Service' : 'At Salon - NX One Tower',
      address: locationType === 'home' ? (serviceAddress?.streetAddress || 'Greater Noida (West), UP') : 'NX One Tower, Greater Noida',
      servicesSubtotal: subtotal,
      travelCharge: travel,
      totalAmount: subtotal + travel,
      status: 'Confirmed',
      canCancel: true
    });

    emitRealtimeEvent('booking:created', booking);
    return successResponse(res, { booking }, 'Appointment Confirmed', 201);
  } catch (err) {
    next(err);
  }
};

export const cancelBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    let query = { $or: [{ id }, { bookingId: id }] };
    if (typeof id === 'string' && id.match(/^[0-9a-fA-F]{24}$/)) {
      query = { $or: [{ _id: id }, { id }, { bookingId: id }] };
    }

    const booking = await Booking.findOneAndUpdate(
      query,
      { status: 'Cancelled', canCancel: false },
      { new: true }
    );
    if (!booking) return errorResponse(res, 'Booking not found', 404);

    emitRealtimeEvent('booking:cancelled', booking);
    return successResponse(res, { booking }, 'Appointment Cancelled');
  } catch (err) {
    next(err);
  }
};
