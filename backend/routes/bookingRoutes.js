const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');
const { notifyNewBooking } = require('../utils/mailer');

router.use(auth);

router.get('/', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Sign in required' });
    }
    const bookings = await Booking.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      bookings: bookings.map(booking => ({
        id: booking._id,
        bookingId: `BK-${String(booking._id).slice(-8).toUpperCase()}`,
        createdAt: booking.createdAt,
        artist: booking.artist,
        date: booking.date,
        timeSlot: booking.time,
        location: booking.venue,
        totalAmount: booking.totalAmount,
        status: booking.status,
        canCancel: !['Cancelled', 'Completed'].includes(booking.status),
      })),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Could not load bookings' });
  }
});

router.post('/', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Sign in required' });
    }
    const selectedNames = (req.body.selectedServices || req.body.services || [])
      .map(service => service.name || service).join(', ');
    const booking = await Booking.create({
      userId: req.user._id,
      customerName: req.user.name,
      customerEmail: req.user.email,
      customerPhone: req.user.phone || req.body.phone || '',
      serviceType: selectedNames || req.body.serviceType || 'Salon service',
      artist: req.body.artistName || req.body.artist || 'Senior Stylist',
      venue: req.body.locationType === 'home' ? 'At Home' : 'Salon',
      date: req.body.selectedDate || req.body.date,
      time: req.body.timeSlot || req.body.time,
      status: 'Confirmed',
      notes: typeof req.body.serviceAddress === 'string'
        ? req.body.serviceAddress
        : req.body.notes,
      totalAmount: Number(req.body.totalPayable || req.body.totalAmount) || 0,
    });
    if (req.io) req.io.emit('booking:created', { id: booking._id });
    notifyNewBooking(booking, `BK-${String(booking._id).slice(-8).toUpperCase()}`);
    res.status(201).json({
      success: true,
      booking: {
        id: booking._id,
        bookingId: `BK-${String(booking._id).slice(-8).toUpperCase()}`,
        artist: booking.artist,
        date: booking.date,
        timeSlot: booking.time,
        location: booking.venue,
        totalAmount: booking.totalAmount,
        status: booking.status,
        canCancel: true,
      },
    });
  } catch (error) {
    console.error('Booking create error:', error);
    res.status(500).json({ success: false, message: 'Could not create booking' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Sign in required' });
    }
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { status: 'Cancelled', canCancel: false },
      { new: true }
    );
    if (!booking) return res.status(404).json({ success: false, message: 'Appointment not found' });
    if (req.io) req.io.emit('booking:cancelled', { id: booking._id });
    res.status(200).json({ success: true, message: 'Appointment Cancelled' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Could not cancel appointment' });
  }
});

module.exports = router;
