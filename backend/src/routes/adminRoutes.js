import express from 'express';
import { protectAdmin } from '../middleware/authMiddleware.js';
import {
  getAdminServices,
  createAdminService,
  updateAdminService,
  deleteAdminService
} from '../controllers/adminServiceController.js';
import {
  getAdminCategories,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory
} from '../controllers/adminCategoryController.js';
import {
  getInventoryAdjustments,
  adjustInventory
} from '../controllers/adminInventoryController.js';
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
router.get('/services', getAdminServices);
router.post('/services', createAdminService);
router.patch('/services/:id', updateAdminService);
router.delete('/services/:id', deleteAdminService);
router.get('/categories', getAdminCategories);
router.post('/categories', createAdminCategory);
router.patch('/categories/:id', updateAdminCategory);
router.delete('/categories/:id', deleteAdminCategory);
router.get('/inventory/adjustments', getInventoryAdjustments);
router.post('/inventory/:id/adjustments', adjustInventory);
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
