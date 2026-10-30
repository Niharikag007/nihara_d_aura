import { Booking } from '../models/BookingOrderAddress.js';
import { Service } from '../models/Service.js';
import { User } from '../models/User.js';
import { successResponse, errorResponse } from '../utils/responseHelper.js';
import { emitAdminEvent, emitRealtimeEvent } from '../socket.js';
import { hasScheduleConflict, timeToMinutes } from '../utils/bookingSchedule.js';

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
    if (!Array.isArray(serviceIds) || serviceIds.length === 0 || serviceIds.some((id) => typeof id !== 'string')) {
      return errorResponse(res, 'Choose at least one valid service', 400);
    }
    const uniqueServiceIds = [...new Set(serviceIds)];
    const selected = await Service.find({
      $or: [
        { id: { $in: uniqueServiceIds } },
        { _id: { $in: uniqueServiceIds.filter(id => id.match(/^[0-9a-fA-F]{24}$/)) } }
      ]
    });
    if (selected.length !== uniqueServiceIds.length) {
      return errorResponse(res, 'One or more selected services are no longer available', 400);
    }

    const subtotal = selected.reduce((sum, s) => sum + s.price, 0);
    const travel = locationType === 'home' ? 500 : 0;
    const appointmentDate = new Date(date || new Date());
    if (Number.isNaN(appointmentDate.getTime())) {
      return errorResponse(res, 'Choose a valid appointment date', 400);
    }
    const normalizedDate = appointmentDate.toISOString().slice(0, 10);
    if (timeToMinutes(timeSlot) === null) {
      return errorResponse(res, 'Choose a valid appointment time', 400);
    }
    const duration = selected.reduce((sum, service) => sum + (Number(service.durationMinutes) || 0), 0);
    const artist = artistName || 'Any Senior Specialist';
    const sameDayBookings = await Booking.find({
      date: { $regex: `^${normalizedDate}` },
      status: { $ne: 'Cancelled' }
    }).select('id date time timeSlot duration artist status');
    if (hasScheduleConflict(sameDayBookings, {
      date: normalizedDate,
      time: timeSlot,
      duration,
      artist
    })) {
      return errorResponse(res, 'That time overlaps with an existing appointment. Please choose another time.', 409);
    }
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
      duration,
      services: selected.map(s => ({ name: s.name, duration: `${s.durationMinutes} Mins`, price: s.price })),
      artist,
      date: normalizedDate,
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
