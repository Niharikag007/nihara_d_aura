import { Category } from '../models/Category.js';
import { Product } from '../models/Product.js';
import { successResponse, errorResponse } from '../utils/responseHelper.js';

export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ createdAt: 1 });
    return successResponse(res, { categories });
  } catch (err) {
    next(err);
  }
};

export const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let category = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      category = await Category.findById(id);
    }
    if (!category) {
      category = await Category.findOne({ $or: [{ slug: id }, { id: id }] });
    }
    if (!category) return errorResponse(res, 'Category not found', 404);

    const products = await Product.find({
      $or: [
        { category: new RegExp(`^${category.name}$`, 'i') },
        { categorySlug: category.slug }
      ]
    });
    return successResponse(res, { category, products });
  } catch (err) {
    next(err);
  }
};
