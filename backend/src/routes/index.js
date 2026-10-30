import express from 'express';
import authRoutes from './authRoutes.js';
import productRoutes from './productRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import serviceRoutes from './serviceRoutes.js';
import bookingRoutes from './bookingRoutes.js';
import orderRoutes from './orderRoutes.js';
import cartRoutes from './cartRoutes.js';
import profileRoutes from './profileRoutes.js';
import paymentRoutes from './paymentRoutes.js';
import offerRoutes from './offerRoutes.js';
import { getArtists, getSalon } from '../controllers/serviceController.js';
import adminRoutes from './adminRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/services', serviceRoutes);
router.use('/bookings', bookingRoutes);
router.use('/orders', orderRoutes);
router.use('/cart', cartRoutes);
router.use('/profile', profileRoutes);
router.use('/payment', paymentRoutes);
router.use('/offers', offerRoutes);
router.use('/admin', adminRoutes);


// Direct top-level helper endpoints
router.get('/artists', getArtists);
router.get('/salon', getSalon);
router.get('/addresses', (req, res, next) => {
  req.url = '/addresses';
  profileRoutes(req, res, next);
});
router.get('/wishlist', (req, res, next) => {
  req.url = '/wishlist';
  profileRoutes(req, res, next);
});

export default router;
