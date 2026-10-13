import { store } from '../services/storeService.js';
import { successResponse, errorResponse } from '../utils/responseHelper.js';

export const getProducts = (req, res, next) => {
  try {
    const products = store.getProducts(req.query);
    return successResponse(res, { products, total: products.length, count: products.length });
  } catch (err) {
    next(err);
  }
};

export const getProductById = (req, res, next) => {
  try {
    const product = store.getProductById(req.params.id);
    if (!product) return errorResponse(res, 'Product not found', 404);
    const related = store.getRelatedProducts(product);
    return successResponse(res, { product, related });
  } catch (err) {
    next(err);
  }
};

export const createProduct = (req, res, next) => {
  try {
    if (!req.body.name || !req.body.price) {
      return errorResponse(res, 'Product name and price are required', 400);
    }
    const product = store.addProduct(req.body);
    return successResponse(res, { product, message: 'Product created successfully' }, 201);
  } catch (err) {
    next(err);
  }
};

export const updateProduct = (req, res, next) => {
  try {
    const product = store.updateProduct(req.params.id, req.body);
    if (!product) return errorResponse(res, 'Product not found', 404);
    return successResponse(res, { product, message: 'Product updated successfully' });
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = (req, res, next) => {
  try {
    const deleted = store.deleteProduct(req.params.id);
    if (!deleted) return errorResponse(res, 'Product not found', 404);
    return successResponse(res, { deleted, message: 'Product deleted successfully' });
  } catch (err) {
    next(err);
  }
};
