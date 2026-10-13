import express from 'express';
import { 
  getCart, 
  addToCart, 
  updateCartItem, 
  removeCartItem, 
  applyCoupon, 
  removeCoupon 
} from '../controllers/cartController.js';

const router = express.Router();

router.get('/', getCart);
router.post('/', addToCart);
router.put('/:productId', updateCartItem);
router.delete('/:productId', removeCartItem);
router.post('/apply-coupon', applyCoupon);
router.delete('/remove-coupon', removeCoupon);

export default router;
