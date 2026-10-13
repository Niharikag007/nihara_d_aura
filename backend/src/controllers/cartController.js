import { store } from '../services/storeService.js';
import { successResponse, errorResponse } from '../utils/responseHelper.js';

export const getCart = (req, res, next) => {
  try {
    const cart = store.getCart();
    return successResponse(res, cart);
  } catch (err) {
    next(err);
  }
};

export const addToCart = (req, res, next) => {
  try {
    const { productId, quantity, variant, size } = req.body;
    const cart = store.addToCart(productId, quantity, variant, size);
    if (!cart) return errorResponse(res, 'Product not found', 404);
    return successResponse(res, cart, 'Item added to shopping bag');
  } catch (err) {
    next(err);
  }
};

export const updateCartItem = (req, res, next) => {
  try {
    const { quantity, variant } = req.body;
    const cart = store.updateCartQuantity(req.params.productId, quantity, variant);
    return successResponse(res, cart);
  } catch (err) {
    next(err);
  }
};

export const removeCartItem = (req, res, next) => {
  try {
    const { variant } = req.query;
    const cart = store.removeFromCart(req.params.productId, variant);
    return successResponse(res, cart, 'Item removed from bag');
  } catch (err) {
    next(err);
  }
};

export const applyCoupon = (req, res, next) => {
  try {
    const result = store.applyCoupon(req.body.code);
    if (result.success) {
      return successResponse(res, { coupon: result.coupon }, `Coupon ${result.coupon.code} applied!`);
    }
    return errorResponse(res, 'Invalid coupon code. Try NIHARA10 or GLOW20', 400);
  } catch (err) {
    next(err);
  }
};

export const removeCoupon = (req, res, next) => {
  try {
    const cart = store.removeCoupon();
    return successResponse(res, cart, 'Coupon removed');
  } catch (err) {
    next(err);
  }
};
