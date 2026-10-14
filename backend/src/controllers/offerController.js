import { Offer } from '../models/Offer.js';
import { successResponse, errorResponse } from '../utils/responseHelper.js';
import { emitRealtimeEvent } from '../socket.js';

export const getOffers = async (req, res, next) => {
  try {
    const offers = await Offer.find().sort({ createdAt: -1 });
    return successResponse(res, { offers, count: offers.length });
  } catch (err) {
    next(err);
  }
};

export const createOffer = async (req, res, next) => {
  try {
    const { code, discountPercent, name, minOrder, validTill, isActive } = req.body;
    if (!code || !discountPercent) {
      return errorResponse(res, 'Coupon code and discount percentage are required', 400);
    }
    const cleanCode = code.trim().toUpperCase();
    const offer = await Offer.create({
      id: `off_${Date.now()}`,
      code: cleanCode,
      name: name || `${cleanCode} Offer`,
      discountPercent: Number(discountPercent),
      minOrder: Number(minOrder || 0),
      validTill: validTill || '2026-12-31',
      isActive: isActive !== false
    });

    emitRealtimeEvent('offer:created', offer);
    return successResponse(res, { offer, message: 'Offer created successfully' }, 201);
  } catch (err) {
    next(err);
  }
};

export const deleteOffer = async (req, res, next) => {
  try {
    const { id } = req.params;
    let query = { $or: [{ id }, { code: (id || '').toUpperCase() }] };
    if (typeof id === 'string' && id.match(/^[0-9a-fA-F]{24}$/)) {
      query = { $or: [{ _id: id }, { id }, { code: id.toUpperCase() }] };
    }
    const deleted = await Offer.findOneAndDelete(query);
    if (!deleted) return errorResponse(res, 'Offer not found', 404);

    emitRealtimeEvent('offer:deleted', { id: deleted.id || deleted._id.toString(), code: deleted.code });
    return successResponse(res, { deleted, message: 'Offer removed successfully' });
  } catch (err) {
    next(err);
  }
};

export const toggleOffer = async (req, res, next) => {
  try {
    const { id } = req.params;
    let query = { $or: [{ id }, { code: (id || '').toUpperCase() }] };
    if (typeof id === 'string' && id.match(/^[0-9a-fA-F]{24}$/)) {
      query = { $or: [{ _id: id }, { id }, { code: id.toUpperCase() }] };
    }
    const offer = await Offer.findOne(query);
    if (!offer) return errorResponse(res, 'Offer not found', 404);

    offer.isActive = !offer.isActive;
    await offer.save();

    emitRealtimeEvent('offer:updated', offer);
    return successResponse(res, { offer, message: `Offer ${offer.isActive ? 'activated' : 'deactivated'} successfully` });
  } catch (err) {
    next(err);
  }
};
