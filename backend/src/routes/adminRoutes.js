import express from 'express';
import { protectAdmin } from '../middleware/authMiddleware.js';
import {
  getDashboardData,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  updateAdminOrder,
  createAdminAppointment,
  updateAdminAppointment,
  deleteAdminAppointment,
  createAdminCoupon,
  updateAdminCoupon,
  deleteAdminCoupon,
  updateAdminSettings,
  getAdminAnalytics
} from '../controllers/adminController.js';

const router = express.Router();

router.use(protectAdmin);
router.get('/dashboard', getDashboardData);
router.get('/analytics', getAdminAnalytics);
router.post('/products', createAdminProduct);
router.patch('/products/:id', updateAdminProduct);
router.delete('/products/:id', deleteAdminProduct);
router.patch('/orders/:id', updateAdminOrder);
router.post('/appointments', createAdminAppointment);
router.patch('/appointments/:id', updateAdminAppointment);
router.delete('/appointments/:id', deleteAdminAppointment);
router.post('/coupons', createAdminCoupon);
router.patch('/coupons/:id', updateAdminCoupon);
router.delete('/coupons/:id', deleteAdminCoupon);
router.put('/settings', updateAdminSettings);

export default router;
