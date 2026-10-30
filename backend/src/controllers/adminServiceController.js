import { randomUUID } from 'node:crypto';
import { Service } from '../models/Service.js';
import { errorResponse, successResponse } from '../utils/responseHelper.js';
import { emitAdminEvent, emitRealtimeEvent } from '../socket.js';
import { normalizeService, normalizeServiceCategory } from '../utils/serviceUtils.js';

const slugify = (value) => value
  .toLowerCase()
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)/g, '');

const allowedFields = new Set([
  'name',
  'slug',
  'category',
  'price',
  'durationMinutes',
  'image',
  'description',
  'inclusions'
]);

const validateService = (body, partial = false) => {
  const payload = {};
  const errors = {};
  const fields = ['name', 'category', 'price', 'durationMinutes', 'image', 'description', 'inclusions', 'slug'];

  for (const field of fields) {
    if (partial && !Object.hasOwn(body, field)) continue;
    if (!partial && !Object.hasOwn(body, field) && !['slug', 'inclusions'].includes(field)) {
      errors[field] = `${field} is required`;
      continue;
    }
    if (!partial && field === 'inclusions' && !Object.hasOwn(body, field)) {
      payload.inclusions = [];
      continue;
    }

    const value = body[field];
    if (field === 'name' || field === 'description') {
      if (typeof value !== 'string' || !value.trim()) errors[field] = `${field} is required`;
      else if (value.trim().length > (field === 'name' ? 120 : 1200)) errors[field] = `${field} is too long`;
      else payload[field] = value.trim();
    } else if (field === 'category') {
      if (!['Makeup', 'Salon'].includes(value)) errors[field] = 'Category must be Makeup or Salon';
      else payload[field] = value;
    } else if (field === 'price' || field === 'durationMinutes') {
      const number = Number(value);
      if (!Number.isFinite(number) || number <= 0 || (field === 'durationMinutes' && !Number.isInteger(number))) {
        errors[field] = field === 'price' ? 'Enter a positive price' : 'Duration must be a positive whole number';
      } else {
        payload[field] = number;
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
      if (!image || value.length > 500 || (!sitePath && !secureRemoteUrl)) {
        errors[field] = 'Use an HTTPS image URL or a site-relative image path';
      } else {
        payload[field] = image;
      }
    } else if (field === 'inclusions') {
      if (!Array.isArray(value) || value.length > 12 || value.some((entry) => typeof entry !== 'string' || !entry.trim() || entry.trim().length > 160)) {
        errors[field] = 'Add up to 12 non-empty inclusions (160 characters each)';
      } else {
        payload[field] = value.map((entry) => entry.trim());
      }
    } else if (field === 'slug' && value !== undefined) {
      if (typeof value !== 'string' || !slugify(value)) errors.slug = 'Enter a valid service slug';
      else payload.slug = slugify(value);
    }
  }

  if (!partial && !payload.slug && payload.name) payload.slug = slugify(payload.name) || `service-${randomUUID().slice(0, 8)}`;
  if (partial && payload.name && !Object.hasOwn(payload, 'slug')) payload.slug = slugify(payload.name);
  return { payload, errors };
};

const serviceFilter = (id) => ({
  $or: [{ id }, { slug: id }, ...( /^[0-9a-fA-F]{24}$/.test(id) ? [{ _id: id }] : [])]
});

const publishServiceChange = (event, data) => {
  emitAdminEvent(event, data);
  emitRealtimeEvent('service:updated', { action: event, ...data });
};

export const getAdminServices = async (req, res, next) => {
  try {
    const category = req.query.category ? normalizeServiceCategory(req.query.category) : null;
    if (category && !['Makeup', 'Salon'].includes(category)) {
      return errorResponse(res, 'Category must be Makeup or Salon', 400);
    }
    const filter = category === 'Makeup'
      ? { category: 'Makeup' }
      : category === 'Salon'
        ? { category: { $in: ['Salon', 'Nails', 'Jewellery & Styling', 'Jewelry & Styling'] } }
        : {};
    const services = (await Service.find(filter).sort({ createdAt: -1 })).map(normalizeService);
    return successResponse(res, { services });
  } catch (error) {
    return next(error);
  }
};

export const createAdminService = async (req, res, next) => {
  try {
    const { payload, errors } = validateService(req.body || {});
    if (Object.keys(errors).length) return errorResponse(res, 'Please correct the service details', 400, errors);
    if (await Service.exists({ slug: payload.slug })) return errorResponse(res, 'A service with this name already exists', 409);

    const service = await Service.create({
      ...payload,
      id: `srv_${randomUUID().replace(/-/g, '').slice(0, 16)}`,
      rating: 5,
      reviewCount: 0
    });
    const normalized = normalizeService(service);
    publishServiceChange('service:created', normalized);
    return successResponse(res, { service: normalized }, 'Service created', 201);
  } catch (error) {
    if (error.code === 11000) return errorResponse(res, 'A service with this name already exists', 409);
    return next(error);
  }
};

export const updateAdminService = async (req, res, next) => {
  try {
    const updates = Object.fromEntries(
      Object.entries(req.body || {}).filter(([field]) => allowedFields.has(field))
    );
    if (!Object.keys(updates).length) return errorResponse(res, 'Provide at least one service field to update', 400);
    const { payload, errors } = validateService(updates, true);
    if (Object.keys(errors).length) return errorResponse(res, 'Please correct the service details', 400, errors);

    if (payload.slug) {
      const matches = await Service.find({ slug: payload.slug }).select('id').lean();
      if (matches.some((existing) => existing.id !== req.params.id && existing._id.toString() !== req.params.id)) {
        return errorResponse(res, 'A service with this name already exists', 409);
      }
    }

    const service = await Service.findOneAndUpdate(serviceFilter(req.params.id), payload, {
      new: true,
      runValidators: true
    });
    if (!service) return errorResponse(res, 'Service not found', 404);
    const normalized = normalizeService(service);
    publishServiceChange('service:updated', normalized);
    return successResponse(res, { service: normalized }, 'Service updated');
  } catch (error) {
    if (error.code === 11000) return errorResponse(res, 'A service with this name already exists', 409);
    return next(error);
  }
};

export const deleteAdminService = async (req, res, next) => {
  try {
    const deleted = await Service.findOneAndDelete(serviceFilter(req.params.id));
    if (!deleted) return errorResponse(res, 'Service not found', 404);
    const service = normalizeService(deleted);
    publishServiceChange('service:deleted', { id: service.id, category: service.category });
    return successResponse(res, { id: service.id }, 'Service deleted');
  } catch (error) {
    return next(error);
  }
};
