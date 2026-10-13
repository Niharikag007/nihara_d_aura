import { store } from '../services/storeService.js';
import { successResponse, errorResponse } from '../utils/responseHelper.js';

export const getCategories = (req, res, next) => {
  try {
    const categories = store.getCategories();
    return successResponse(res, { categories });
  } catch (err) {
    next(err);
  }
};

export const getCategoryById = (req, res, next) => {
  try {
    const category = store.getCategoryById(req.params.id);
    if (!category) return errorResponse(res, 'Category not found', 404);
    const products = store.getProducts({ category: category.slug });
    return successResponse(res, { category, products });
  } catch (err) {
    next(err);
  }
};
