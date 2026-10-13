import { store } from '../services/storeService.js';
import { successResponse, errorResponse } from '../utils/responseHelper.js';

export const getProfile = (req, res, next) => {
  try {
    const user = store.getUserProfile();
    return successResponse(res, { user });
  } catch (err) {
    next(err);
  }
};

export const updateProfile = (req, res, next) => {
  try {
    const updated = store.updateUserProfile(req.body);
    return successResponse(res, { user: updated }, 'Profile updated successfully');
  } catch (err) {
    next(err);
  }
};

export const getAddresses = (req, res, next) => {
  try {
    const addresses = store.getAddresses();
    return successResponse(res, { addresses });
  } catch (err) {
    next(err);
  }
};

export const addAddress = (req, res, next) => {
  try {
    const address = store.addAddress(req.body);
    return successResponse(res, { address }, 'Address saved', 201);
  } catch (err) {
    next(err);
  }
};

export const updateAddress = (req, res, next) => {
  try {
    const address = store.updateAddress(req.params.id, req.body);
    if (!address) return errorResponse(res, 'Address not found', 404);
    return successResponse(res, { address }, 'Address updated');
  } catch (err) {
    next(err);
  }
};

export const deleteAddress = (req, res, next) => {
  try {
    store.deleteAddress(req.params.id);
    return successResponse(res, {}, 'Address removed');
  } catch (err) {
    next(err);
  }
};

export const getWishlist = (req, res, next) => {
  try {
    const products = store.getWishlist();
    return successResponse(res, { products });
  } catch (err) {
    next(err);
  }
};

export const toggleWishlist = (req, res, next) => {
  try {
    const result = store.toggleWishlist(req.params.productId);
    return successResponse(res, result, result.inWishlist ? 'Saved to Wishlist' : 'Removed from Wishlist');
  } catch (err) {
    next(err);
  }
};
