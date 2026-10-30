import { Category } from '../models/Category.js';
import { Product } from '../models/Product.js';
import { errorResponse, successResponse } from '../utils/responseHelper.js';
import { emitAdminEvent, emitRealtimeEvent } from '../socket.js';

const slugify = (value) => value
  .toLowerCase()
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)/g, '');

const validateCategory = (body, partial = false) => {
  const payload = {};
  const errors = {};
  const fields = ['name', 'image', 'description', 'subcategories'];

  for (const field of fields) {
    if (partial && !Object.hasOwn(body, field)) continue;
    if (!partial && !Object.hasOwn(body, field) && field !== 'description' && field !== 'subcategories') {
      errors[field] = `${field} is required`;
      continue;
    }

    const value = body[field];
    if (field === 'name' || field === 'description') {
      if (field === 'name' && (typeof value !== 'string' || !value.trim())) {
        errors[field] = 'Category name is required';
      } else if (typeof value === 'string' && value.trim().length > (field === 'name' ? 100 : 500)) {
        errors[field] = `${field} is too long`;
      } else if (typeof value === 'string') {
        payload[field] = value.trim();
      } else if (field === 'description' && !partial) {
        payload.description = '';
      } else if (field === 'description') {
        errors[field] = 'Description must be text';
      }
    } else if (field === 'image') {
      const image = typeof value === 'string' ? value.trim() : '';
      const sitePath = image.startsWith('/') && !image.startsWith('//');
      let secureRemoteUrl = false;
      if (/^https:\/\//i.test(image)) {
        try {
          secureRemoteUrl = Boolean(new URL(image).hostname);
        } catch {
          secureRemoteUrl = false;
        }
      }
      if (!image || image.length > 500 || (!sitePath && !secureRemoteUrl)) {
        errors.image = 'Use an HTTPS image URL or a site-relative image path';
      } else {
        payload.image = image;
      }
    } else if (field === 'subcategories') {
      const subcategories = value === undefined && !partial ? [] : value;
      if (!Array.isArray(subcategories) || subcategories.length > 30
        || subcategories.some((item) => typeof item !== 'string' || !item.trim() || item.trim().length > 80)) {
        errors.subcategories = 'Add up to 30 non-empty subcategories (80 characters each)';
      } else {
        payload.subcategories = [...new Set(subcategories.map((item) => item.trim()))];
      }
    }
  }

  return { payload, errors };
};

const categoryFilter = (id) => ({
  $or: [{ id }, { slug: id }, ...( /^[0-9a-fA-F]{24}$/.test(id) ? [{ _id: id }] : [])]
});

const publishCategoryChange = (event, data) => {
  emitAdminEvent(event, data);
  emitRealtimeEvent('category:updated', { action: event, ...data });
};

export const getAdminCategories = async (req, res, next) => {
  try {
    const [categories, counts] = await Promise.all([
      Category.find().sort({ createdAt: 1 }).lean(),
      Product.aggregate([{ $group: { _id: '$categorySlug', count: { $sum: 1 } } }])
    ]);
    const countBySlug = new Map(counts.map((entry) => [entry._id, entry.count]));
    return successResponse(res, {
      categories: categories.map((category) => ({
        ...category,
        id: category.id || category._id?.toString(),
        itemCount: countBySlug.get(category.slug) || 0
      }))
    });
  } catch (error) {
    return next(error);
  }
};

export const createAdminCategory = async (req, res, next) => {
  try {
    const { payload, errors } = validateCategory(req.body || {});
    if (Object.keys(errors).length) return errorResponse(res, 'Please correct the category details', 400, errors);
    const slug = slugify(payload.name);
    if (!slug) return errorResponse(res, 'Enter a category name containing letters or numbers', 400);
    if (await Category.exists({ slug })) return errorResponse(res, 'A category with this name already exists', 409);

    const category = await Category.create({
      ...payload,
      id: `cat_${slug.replace(/-/g, '_')}`,
      slug,
      itemCount: 0
    });
    const result = { ...category.toObject(), id: category.id || category._id.toString() };
    publishCategoryChange('category:created', result);
    return successResponse(res, { category: result }, 'Category created', 201);
  } catch (error) {
    if (error.code === 11000) return errorResponse(res, 'A category with this name already exists', 409);
    return next(error);
  }
};

export const updateAdminCategory = async (req, res, next) => {
  try {
    const { payload, errors } = validateCategory(req.body || {}, true);
    if (Object.keys(errors).length) return errorResponse(res, 'Please correct the category details', 400, errors);
    if (!Object.keys(payload).length) return errorResponse(res, 'Provide at least one category field to update', 400);

    const category = await Category.findOne(categoryFilter(req.params.id));
    if (!category) return errorResponse(res, 'Category not found', 404);
    const oldName = category.name;
    const oldSlug = category.slug;
    if (payload.name && payload.name !== oldName) {
      const newSlug = slugify(payload.name);
      if (!newSlug) return errorResponse(res, 'Enter a category name containing letters or numbers', 400);
      if (await Category.exists({ slug: newSlug, _id: { $ne: category._id } })) {
        return errorResponse(res, 'A category with this name already exists', 409);
      }
      payload.slug = newSlug;
      await Product.updateMany(
        { $or: [{ category: oldName }, { categorySlug: oldSlug }] },
        { $set: { category: payload.name, categorySlug: newSlug, collection: payload.name } }
      );
    }
    Object.assign(category, payload);
    await category.save();
    const result = {
      ...category.toObject(),
      id: category.id || category._id.toString(),
      itemCount: await Product.countDocuments({ categorySlug: category.slug })
    };
    publishCategoryChange('category:updated', result);
    return successResponse(res, { category: result }, 'Category updated');
  } catch (error) {
    if (error.code === 11000) return errorResponse(res, 'A category with this name already exists', 409);
    return next(error);
  }
};

export const deleteAdminCategory = async (req, res, next) => {
  try {
    const category = await Category.findOne(categoryFilter(req.params.id));
    if (!category) return errorResponse(res, 'Category not found', 404);
    const productCount = await Product.countDocuments({
      $or: [{ category: category.name }, { categorySlug: category.slug }]
    });
    if (productCount > 0) {
      return errorResponse(res, `Move or delete its ${productCount} products before deleting this category`, 409);
    }
    await category.deleteOne();
    const id = category.id || category._id.toString();
    publishCategoryChange('category:deleted', { id, slug: category.slug });
    return successResponse(res, { id }, 'Category deleted');
  } catch (error) {
    return next(error);
  }
};
