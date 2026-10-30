import express from 'express';
import { getBookings, createBooking, cancelBooking } from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getBookings);
router.post('/', protect, createBooking);
router.delete('/:id', protect, cancelBooking);

export default router;
