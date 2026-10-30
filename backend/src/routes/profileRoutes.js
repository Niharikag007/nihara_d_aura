import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { 
  getProfile, 
  updateProfile, 
  getAddresses, 
  addAddress, 
  updateAddress, 
  deleteAddress,
  getWishlist,
  toggleWishlist
} from '../controllers/profileController.js';

const router = express.Router();

router.use(protect);
router.get('/', getProfile);
router.put('/update', updateProfile);

router.get('/addresses', getAddresses);
router.post('/addresses', addAddress);
router.put('/addresses/:id', updateAddress);
router.delete('/addresses/:id', deleteAddress);

router.get('/wishlist', getWishlist);
router.post('/wishlist/:productId', toggleWishlist);

export default router;
