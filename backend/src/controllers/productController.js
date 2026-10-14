import { Product } from '../models/Product.js';
import { successResponse, errorResponse } from '../utils/responseHelper.js';
import { emitRealtimeEvent } from '../socket.js';

export const getProducts = async (req, res, next) => {
  try {
    const { category, subcategory, search, sort, minPrice, maxPrice } = req.query;
    const filter = {};

    if (category && category.toLowerCase() !== 'all') {
      filter.$or = [
        { category: new RegExp(`^${category}$`, 'i') },
        { categorySlug: category.toLowerCase() }
      ];
    }

    if (subcategory && !subcategory.toLowerCase().startsWith('all')) {
      filter.subcategory = new RegExp(`^${subcategory}$`, 'i');
    }

    if (search) {
      const q = search.trim();
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    let query = Product.find(filter);
    if (sort === 'price-low') query = query.sort({ price: 1 });
    else if (sort === 'price-high') query = query.sort({ price: -1 });
    else if (sort === 'rating') query = query.sort({ rating: -1 });
    else query = query.sort({ createdAt: -1 });

    const products = await query.exec();
    return successResponse(res, { products, total: products.length, count: products.length });
  } catch (err) {
    next(err);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let product = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id);
    }
    if (!product) {
      product = await Product.findOne({ $or: [{ slug: id }, { id: id }] });
    }
    if (!product) return errorResponse(res, 'Product not found', 404);

    const related = await Product.find({
      _id: { $ne: product._id },
      category: product.category
    }).limit(4);

    return successResponse(res, { product, related });
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    if (!req.body.name || !req.body.price) {
      return errorResponse(res, 'Product name and price are required', 400);
    }
    const slug = req.body.slug || req.body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const id = req.body.id || `prod_${Date.now()}`;
    const product = await Product.create({
      ...req.body,
      id,
      slug,
      categorySlug: (req.body.category || 'jewellery').toLowerCase()
    });

    // Real-time broadcast to all connected clients
    emitRealtimeEvent('product:created', product);

    return successResponse(res, { product, message: 'Product created successfully in MongoDB' }, 201);
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    let query = { $or: [{ slug: id }, { id: id }] };
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      query = { $or: [{ _id: id }, { slug: id }, { id: id }] };
    }

    const product = await Product.findOneAndUpdate(query, req.body, { new: true });
    if (!product) return errorResponse(res, 'Product not found', 404);

    // Real-time broadcast to all connected clients
    emitRealtimeEvent('product:updated', product);

    return successResponse(res, { product, message: 'Product updated successfully in MongoDB' });
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    let query = { $or: [{ slug: id }, { id: id }] };
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      query = { $or: [{ _id: id }, { slug: id }, { id: id }] };
    }

    const deleted = await Product.findOneAndDelete(query);
    if (!deleted) return errorResponse(res, 'Product not found', 404);

    // Real-time broadcast
    const deletedId = deleted.id || deleted._id.toString();
    emitRealtimeEvent('product:deleted', { id: deletedId });

    return successResponse(res, { deleted, message: 'Product deleted successfully from MongoDB' });
  } catch (err) {
    next(err);
  }
};
