import { Product } from '../models/Product.js';
import { errorResponse, successResponse } from '../utils/responseHelper.js';
import { emitAdminEvent, emitRealtimeEvent } from '../socket.js';

const productFilter = (id) => ({
  $or: [{ id }, { slug: id }, ...( /^[0-9a-fA-F]{24}$/.test(id) ? [{ _id: id }] : [])]
});

export const getInventoryAdjustments = async (req, res, next) => {
  try {
    const products = await Product.find({ stockHistory: { $exists: true, $ne: [] } })
      .select('+stockHistory id name')
      .lean();
    const adjustments = products.flatMap((product) => (product.stockHistory || []).map((entry) => ({
      ...entry,
      productId: product.id || product._id.toString(),
      productName: product.name
    })))
      .sort((a, b) => new Date(b.adjustedAt) - new Date(a.adjustedAt))
      .slice(0, 200);
    return successResponse(res, { adjustments });
  } catch (error) {
    return next(error);
  }
};

export const adjustInventory = async (req, res, next) => {
  try {
    const delta = Number(req.body?.delta);
    const reason = typeof req.body?.reason === 'string' ? req.body.reason.trim() : '';
    if (!Number.isSafeInteger(delta) || delta === 0) {
      return errorResponse(res, 'Stock change must be a non-zero whole number', 400);
    }
    if (!reason || reason.length > 160) {
      return errorResponse(res, 'A reason of 1–160 characters is required', 400);
    }

    const filter = productFilter(req.params.id);
    if (delta < 0) filter.stock = { $gte: Math.abs(delta) };
    const newStockExpression = { $add: [{ $ifNull: ['$stock', 0] }, delta] };
    const product = await Product.findOneAndUpdate(
      filter,
      [{
        $set: {
          stock: newStockExpression,
          stockHistory: {
            $slice: [
              {
                $concatArrays: [
                  { $ifNull: ['$stockHistory', []] },
                  [{
                    delta,
                    previousStock: { $ifNull: ['$stock', 0] },
                    newStock: newStockExpression,
                    reason,
                    adjustedBy: req.userEmail,
                    adjustedAt: '$$NOW'
                  }]
                ]
              },
              -50
            ]
          }
        }
      }],
      { new: true }
    );
    if (!product) {
      const exists = await Product.exists(productFilter(req.params.id));
      return exists
        ? errorResponse(res, 'Stock cannot be reduced below zero', 409)
        : errorResponse(res, 'Product not found', 404);
    }

    const normalized = product.toObject();
    normalized.id = normalized.id || normalized._id.toString();
    delete normalized.stockHistory;
    const previousStock = normalized.stock - delta;
    const newStock = normalized.stock;
    emitAdminEvent('product:updated', normalized);
    emitRealtimeEvent('product:updated', normalized);
    emitAdminEvent('inventory:adjusted', { productId: normalized.id, delta, reason, previousStock, newStock });
    return successResponse(res, { product: normalized }, 'Stock adjusted');
  } catch (error) {
    return next(error);
  }
};
