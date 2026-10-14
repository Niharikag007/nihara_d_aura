import { User } from '../models/User.js';
import { Address } from '../models/BookingOrderAddress.js';
import { Product } from '../models/Product.js';
import { successResponse, errorResponse } from '../utils/responseHelper.js';

export const getProfile = async (req, res, next) => {
  try {
    let user = await User.findOne();
    if (!user) {
      user = await User.create({
        id: 'usr_amit_kumar',
        name: 'Amit Kumar',
        email: 'amitky2056@gmail.com',
        phone: '+91 8004116370',
        tier: 'Royal Elite',
        rewardPoints: 450,
        wishlist: []
      });
    }
    return successResponse(res, { user });
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    let user = await User.findOne();
    if (!user) {
      user = await User.create(req.body);
    } else {
      Object.assign(user, req.body);
      await user.save();
    }
    return successResponse(res, { user }, 'Profile updated successfully in MongoDB');
  } catch (err) {
    next(err);
  }
};

export const getAddresses = async (req, res, next) => {
  try {
    const addresses = await Address.find().sort({ createdAt: -1 });
    return successResponse(res, { addresses });
  } catch (err) {
    next(err);
  }
};

export const addAddress = async (req, res, next) => {
  try {
    const address = await Address.create({
      ...req.body,
      id: `addr_${Date.now()}`
    });
    return successResponse(res, { address }, 'Address saved to MongoDB', 201);
  } catch (err) {
    next(err);
  }
};

export const updateAddress = async (req, res, next) => {
  try {
    const { id } = req.params;
    let query = { $or: [{ id }] };
    if (typeof id === 'string' && id.match(/^[0-9a-fA-F]{24}$/)) {
      query = { $or: [{ _id: id }, { id }] };
    }
    const address = await Address.findOneAndUpdate(query, req.body, { new: true });
    if (!address) return errorResponse(res, 'Address not found', 404);
    return successResponse(res, { address }, 'Address updated in MongoDB');
  } catch (err) {
    next(err);
  }
};

export const deleteAddress = async (req, res, next) => {
  try {
    const { id } = req.params;
    let query = { $or: [{ id }] };
    if (typeof id === 'string' && id.match(/^[0-9a-fA-F]{24}$/)) {
      query = { $or: [{ _id: id }, { id }] };
    }
    await Address.findOneAndDelete(query);
    return successResponse(res, {}, 'Address removed from MongoDB');
  } catch (err) {
    next(err);
  }
};

export const getWishlist = async (req, res, next) => {
  try {
    const user = await User.findOne();
    const wishlistIds = user?.wishlist || [];
    const products = await Product.find({
      $or: [
        { id: { $in: wishlistIds } },
        { _id: { $in: wishlistIds.filter(id => typeof id === 'string' && id.match(/^[0-9a-fA-F]{24}$/)) } }
      ]
    });
    return successResponse(res, { products });
  } catch (err) {
    next(err);
  }
};

export const toggleWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;
    let user = await User.findOne();
    if (!user) {
      user = await User.create({
        id: 'usr_amit_kumar',
        name: 'Amit Kumar',
        email: 'amitky2056@gmail.com',
        phone: '+91 8004116370',
        wishlist: []
      });
    }

    const currentWishlist = user.wishlist || [];
    const index = currentWishlist.indexOf(productId);
    let inWishlist = false;

    if (index > -1) {
      currentWishlist.splice(index, 1);
      inWishlist = false;
    } else {
      currentWishlist.push(productId);
      inWishlist = true;
    }

    user.wishlist = currentWishlist;
    await user.save();

    return successResponse(res, { inWishlist, wishlist: user.wishlist }, inWishlist ? 'Saved to Wishlist' : 'Removed from Wishlist');
  } catch (err) {
    next(err);
  }
};
