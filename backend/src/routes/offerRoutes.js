import express from 'express';
import { 
  getOffers, 
  createOffer, 
  deleteOffer, 
  toggleOffer 
} from '../controllers/offerController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route - Customers can view active promotional offers
router.get('/', getOffers);

// Admin-only routes - RBAC protected
router.post('/', protectAdmin, createOffer);
router.delete('/:id', protectAdmin, deleteOffer);
router.patch('/:id/toggle', protectAdmin, toggleOffer);

export default router;
