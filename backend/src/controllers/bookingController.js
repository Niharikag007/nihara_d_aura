import { Booking } from '../models/BookingOrderAddress.js';
import { Service } from '../models/Service.js';
import { User } from '../models/User.js';
import { successResponse, errorResponse } from '../utils/responseHelper.js';
import { emitAdminEvent, emitRealtimeEvent } from '../socket.js';

export const getBookings = async (req, res, next) => {
  try {
    const filter = req.userRole === 'admin' ? {} : { userId: req.userId };
    const bookings = await Booking.find(filter).sort({ createdAt: -1 });
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
    const user = await User.findOne({
      $or: [{ id: req.userId }, ...(req.userId.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: req.userId }] : [])]
    }).select('name email phone');

    const booking = await Booking.create({
      id: `bk_${Date.now()}`,
      bookingId: ref,
      userId: req.userId,
      client: user?.name || 'Customer',
      phone: user?.phone || '',
      customerEmail: user?.email || '',
      title: selected.length > 1 ? `${selected[0].name} + ${selected.length - 1} more` : selected[0]?.name || 'Beauty Service',
      service: selected.map((service) => service.name).join(', ') || 'Beauty Service',
      price: subtotal + travel,
      time: timeSlot || '',
      duration: selected.reduce((sum, service) => sum + (Number(service.durationMinutes) || 0), 0),
      services: selected.map(s => ({ name: s.name, duration: `${s.durationMinutes} Mins`, price: s.price })),
      artist: artistName || 'Any Senior Specialist',
      date: date || new Date().toISOString().slice(0, 10),
      timeSlot: timeSlot || '01:00 PM',
      location: locationType === 'home' ? 'At Home Service' : 'At Salon - NX One Tower',
      locationDetails: locationType === 'home' ? 'At Home Service' : 'At Salon - NX One Tower',
      address: locationType === 'home' ? (serviceAddress?.streetAddress || 'Greater Noida (West), UP') : 'NX One Tower, Greater Noida',
      servicesSubtotal: subtotal,
      travelCharge: travel,
      totalAmount: subtotal + travel,
      status: 'Confirmed',
      canCancel: true
    });

    emitRealtimeEvent('booking:created', { id: booking.id, bookingId: booking.bookingId }, `user:${booking.userId}`);
    emitAdminEvent('booking:created', booking);
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

    if (req.userRole !== 'admin') query.userId = req.userId;
    const booking = await Booking.findOneAndUpdate(
      query,
      { status: 'Cancelled', canCancel: false },
      { new: true }
    );
    if (!booking) return errorResponse(res, 'Booking not found', 404);

    emitRealtimeEvent('booking:cancelled', { id: booking.id, bookingId: booking.bookingId }, `user:${booking.userId}`);
    emitAdminEvent('booking:updated', booking);
    return successResponse(res, { booking }, 'Appointment Cancelled');
  } catch (err) {
    next(err);
  }
};
