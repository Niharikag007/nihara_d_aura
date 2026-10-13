import { store } from '../services/storeService.js';
import { successResponse, errorResponse } from '../utils/responseHelper.js';

export const getOffers = (req, res, next) => {
  try {
    const offers = store.getOffers();
    return successResponse(res, { offers, count: offers.length });
  } catch (err) {
    next(err);
  }
};

export const createOffer = (req, res, next) => {
  try {
    const { code, discountPercent } = req.body;
    if (!code || !discountPercent) {
      return errorResponse(res, 'Coupon code and discount percentage are required', 400);
    }
    const offer = store.addOffer(req.body);
    return successResponse(res, { offer, message: 'Offer created successfully' }, 201);
  } catch (err) {
    next(err);
  }
};

export const deleteOffer = (req, res, next) => {
  try {
    const deleted = store.deleteOffer(req.params.id);
    if (!deleted) return errorResponse(res, 'Offer not found', 404);
    return successResponse(res, { deleted, message: 'Offer removed successfully' });
  } catch (err) {
    next(err);
  }
};

export const toggleOffer = (req, res, next) => {
  try {
    const offer = store.toggleOffer(req.params.id);
    if (!offer) return errorResponse(res, 'Offer not found', 404);
    return successResponse(res, { offer, message: `Offer ${offer.isActive ? 'activated' : 'deactivated'} successfully` });
  } catch (err) {
    next(err);
  }
};
