import { Product } from '../models/Product.js';
import { Order, Booking } from '../models/BookingOrderAddress.js';
import { Offer } from '../models/Offer.js';
import { User } from '../models/User.js';
import { StoreSetting } from '../models/StoreSetting.js';
import { successResponse, errorResponse } from '../utils/responseHelper.js';
import { emitAdminEvent, emitRealtimeEvent } from '../socket.js';

const idFilter = (id) => {
  const filters = [{ id }, { slug: id }];
  if (/^[0-9a-fA-F]{24}$/.test(id)) filters.push({ _id: id });
  return { $or: filters };
};

const normalizeProduct = (doc) => {
  const product = doc.toObject ? doc.toObject() : doc;
  return {
    ...product,
    id: product.id || product._id?.toString(),
    collection: product.collection || product.category || 'Jewellery',
    status: product.status || 'Live',
    cost: product.cost || 0,
    image: product.image || product.images?.[0] || '',
    soldLast30: product.soldLast30 || 0
  };
};

const normalizeOrder = (doc) => {
  const order = doc.toObject ? doc.toObject() : doc;
  return {
    ...order,
    id: order.id || order._id?.toString(),
    date: order.date || order.placedDate || order.createdAt?.toISOString?.().slice(0, 10) || '',
    total: order.total ?? order.totalAmount ?? 0,
    items: (order.items || []).map((item) => ({
      ...item,
      qty: item.qty || item.quantity || 1
    }))
  };
};

const normalizeBooking = (doc) => {
  const booking = doc.toObject ? doc.toObject() : doc;
  return {
    ...booking,
    id: booking.id || booking._id?.toString(),
    client: booking.client || booking.customerName || 'Customer',
    service: booking.service || booking.title || booking.services?.map((service) => service.name).join(', ') || 'Beauty Service',
    price: booking.price ?? booking.totalAmount ?? 0,
    time: booking.time || booking.timeSlot || '',
    location: booking.locationDetails || booking.location || '',
    duration: booking.duration || 0
  };
};

const normalizeCoupon = (doc) => {
  const coupon = doc.toObject ? doc.toObject() : doc;
  return {
    ...coupon,
    id: coupon.id || coupon._id?.toString(),
    description: coupon.description || coupon.name,
    type: coupon.type || 'percent',
    value: coupon.value ?? coupon.discountPercent
  };
};

const getSettings = async () => {
  let settings = await StoreSetting.findOne({ key: 'main' }).lean();
  if (!settings) {
    settings = await StoreSetting.create({ key: 'main' });
    settings = settings.toObject();
  }
  const { _id, key, __v, createdAt, updatedAt, ...values } = settings;
  return values;
};

export const getDashboardData = async (req, res, next) => {
  try {
    const [products, orders, bookings, coupons, users, settings] = await Promise.all([
      Product.find().sort({ createdAt: -1 }).lean(),
      Order.find().sort({ createdAt: -1 }).lean(),
      Booking.find().sort({ createdAt: -1 }).lean(),
      Offer.find().sort({ createdAt: -1 }).lean(),
      User.find({ role: 'user' }).select('id name email phone tier rewardPoints createdAt').lean(),
      getSettings()
    ]);
    return successResponse(res, {
      products: products.map(normalizeProduct),
      orders: orders.map(normalizeOrder),
      appointments: bookings.map(normalizeBooking),
      coupons: coupons.map(normalizeCoupon),
      customers: users,
      settings
    });
  } catch (err) {
    return next(err);
  }
};

export const createAdminProduct = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    if (!payload.name || !Number.isFinite(Number(payload.price)) || Number(payload.price) <= 0) {
      return errorResponse(res, 'A product name and positive price are required', 400);
    }
    payload.category = payload.collection || payload.category || 'Jewellery';
    payload.categorySlug = payload.category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    payload.slug = payload.slug || payload.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    payload.id = payload.id || `prod_${Date.now()}`;
    payload.images = payload.images?.length ? payload.images : (payload.image ? [payload.image] : []);
    payload.description = payload.description || payload.name;
    const product = await Product.create(payload);
    const normalized = normalizeProduct(product);
    emitAdminEvent('product:created', normalized);
    emitRealtimeEvent('product:created', normalized);
    return successResponse(res, { product: normalized }, 'Product created', 201);
  } catch (err) {
    return next(err);
  }
};

export const updateAdminProduct = async (req, res, next) => {
  try {
    const updates = { ...req.body };
    if (updates.collection) {
      updates.category = updates.collection;
      updates.categorySlug = updates.collection.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }
    if (updates.image) updates.images = [updates.image];
    const product = await Product.findOneAndUpdate(idFilter(req.params.id), updates, {
      new: true,
      runValidators: true
    });
    if (!product) return errorResponse(res, 'Product not found', 404);
    const normalized = normalizeProduct(product);
    emitAdminEvent('product:updated', normalized);
    emitRealtimeEvent('product:updated', normalized);
    return successResponse(res, { product: normalized });
  } catch (err) {
    return next(err);
  }
};

export const deleteAdminProduct = async (req, res, next) => {
  try {
    const deleted = await Product.findOneAndDelete(idFilter(req.params.id));
    if (!deleted) return errorResponse(res, 'Product not found', 404);
    const product = normalizeProduct(deleted);
    emitAdminEvent('product:deleted', { id: product.id });
    emitRealtimeEvent('product:deleted', { id: product.id });
    return successResponse(res, { id: product.id });
  } catch (err) {
    return next(err);
  }
};

export const updateAdminOrder = async (req, res, next) => {
  try {
    const allowedStatuses = ['Processing', 'Packed', 'Shipped', 'Delivered', 'Cancelled'];
    if (!allowedStatuses.includes(req.body.status)) {
      return errorResponse(res, 'Invalid order status', 400);
    }
    const order = await Order.findOneAndUpdate(idFilter(req.params.id), { status: req.body.status }, {
      new: true,
      runValidators: true
    });
    if (!order) return errorResponse(res, 'Order not found', 404);
    const normalized = normalizeOrder(order);
    emitAdminEvent('order:updated', normalized);
    if (order.userId) {
      emitRealtimeEvent('order:updated', { id: normalized.id, status: normalized.status }, `user:${order.userId}`);
    }
    return successResponse(res, { order: normalized });
  } catch (err) {
    return next(err);
  }
};

export const createAdminAppointment = async (req, res, next) => {
  try {
    const { client, phone, service, price, date, time, duration, artist, location, notes, status } = req.body;
    if (!client?.trim() || !service?.trim() || !date) {
      return errorResponse(res, 'Client, service and date are required', 400);
    }
    const amount = Number(price) || 0;
    const booking = await Booking.create({
      id: `APT-${Date.now()}`,
      bookingId: `APT-${Date.now()}`,
      title: service,
      client: client.trim(),
      phone: phone || '',
      service,
      price: amount,
      date,
      time: time || '',
      timeSlot: time || '12:00',
      duration: Number(duration) || 0,
      artist: artist || 'Unassigned',
      location: location || 'At salon',
      locationDetails: location || 'At salon',
      notes: notes || '',
      services: [{ name: service, duration: `${Number(duration) || 0} Mins`, price: amount }],
      servicesSubtotal: amount,
      totalAmount: amount,
      status: status || 'Confirmed',
      canCancel: true
    });
    const normalized = normalizeBooking(booking);
    emitAdminEvent('booking:created', normalized);
    emitRealtimeEvent('booking:created', { id: normalized.id, bookingId: normalized.bookingId });
    return successResponse(res, { appointment: normalized }, 'Appointment created', 201);
  } catch (err) {
    return next(err);
  }
};

export const updateAdminAppointment = async (req, res, next) => {
  try {
    const allowedStatuses = ['Confirmed', 'Pending', 'Processing', 'Completed', 'Cancelled'];
    const updates = { ...req.body };
    if (updates.status && !allowedStatuses.includes(updates.status)) {
      return errorResponse(res, 'Invalid appointment status', 400);
    }
    if (updates.service) updates.title = updates.service;
    if (updates.price !== undefined) updates.totalAmount = Number(updates.price);
    if (updates.time) updates.timeSlot = updates.time;
    if (updates.location) updates.locationDetails = updates.location;
    const booking = await Booking.findOneAndUpdate(idFilter(req.params.id), updates, {
      new: true,
      runValidators: true
    });
    if (!booking) return errorResponse(res, 'Appointment not found', 404);
    const normalized = normalizeBooking(booking);
    emitAdminEvent('booking:updated', normalized);
    emitRealtimeEvent('booking:updated', { id: normalized.id, status: normalized.status });
    return successResponse(res, { appointment: normalized });
  } catch (err) {
    return next(err);
  }
};

export const deleteAdminAppointment = async (req, res, next) => {
  try {
    const booking = await Booking.findOneAndDelete(idFilter(req.params.id));
    if (!booking) return errorResponse(res, 'Appointment not found', 404);
    const normalized = normalizeBooking(booking);
    emitAdminEvent('booking:deleted', { id: normalized.id });
    emitRealtimeEvent('booking:deleted', { id: normalized.id });
    return successResponse(res, { id: normalized.id });
  } catch (err) {
    return next(err);
  }
};

export const createAdminCoupon = async (req, res, next) => {
  try {
    const { code, description, type = 'percent', value, minOrder, usageLimit, validTill, isActive } = req.body;
    const numericValue = Number(value);
    if (!code?.trim() || !description?.trim() || !Number.isFinite(numericValue) || numericValue <= 0) {
      return errorResponse(res, 'Coupon code, description and positive discount value are required', 400);
    }
    if (!['percent', 'flat'].includes(type)) return errorResponse(res, 'Invalid coupon type', 400);
    const coupon = await Offer.create({
      id: `CPN-${Date.now()}`,
      code: code.trim().toUpperCase(),
      name: description.trim(),
      description: description.trim(),
      type,
      value: numericValue,
      discountPercent: type === 'percent' ? numericValue : 0,
      minOrder: Number(minOrder) || 0,
      usageLimit: Number(usageLimit) || 0,
      validTill,
      isActive: isActive !== false
    });
    const normalized = normalizeCoupon(coupon);
    emitAdminEvent('coupon:created', normalized);
    emitRealtimeEvent('offer:created', normalized);
    return successResponse(res, { coupon: normalized }, 'Coupon created', 201);
  } catch (err) {
    return next(err);
  }
};

export const updateAdminCoupon = async (req, res, next) => {
  try {
    const coupon = await Offer.findOneAndUpdate(idFilter(req.params.id), req.body, {
      new: true,
      runValidators: true
    });
    if (!coupon) return errorResponse(res, 'Coupon not found', 404);
    const normalized = normalizeCoupon(coupon);
    emitAdminEvent('coupon:updated', normalized);
    emitRealtimeEvent('offer:updated', normalized);
    return successResponse(res, { coupon: normalized });
  } catch (err) {
    return next(err);
  }
};

export const deleteAdminCoupon = async (req, res, next) => {
  try {
    const coupon = await Offer.findOneAndDelete(idFilter(req.params.id));
    if (!coupon) return errorResponse(res, 'Coupon not found', 404);
    const normalized = normalizeCoupon(coupon);
    emitAdminEvent('coupon:deleted', { id: normalized.id });
    emitRealtimeEvent('offer:deleted', { id: normalized.id, code: normalized.code });
    return successResponse(res, { id: normalized.id });
  } catch (err) {
    return next(err);
  }
};

export const updateAdminSettings = async (req, res, next) => {
  try {
    const { storeName, lowStockThreshold, targetMargins } = req.body;
    const settings = await StoreSetting.findOneAndUpdate(
      { key: 'main' },
      {
        $set: {
          ...(storeName !== undefined && { storeName }),
          ...(lowStockThreshold !== undefined && { lowStockThreshold }),
          ...(targetMargins !== undefined && { targetMargins })
        }
      },
      { new: true, upsert: true, runValidators: true }
    ).lean();
    const { _id, key, __v, createdAt, updatedAt, ...values } = settings;
    emitAdminEvent('settings:updated', values);
    return successResponse(res, { settings: values });
  } catch (err) {
    return next(err);
  }
};

export const getAdminAnalytics = async (req, res, next) => {
  try {
    const days = Math.min(365, Math.max(7, Number.parseInt(req.query.days, 10) || 30));
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    const start = new Date(end);
    start.setDate(start.getDate() - days + 1);
    start.setHours(0, 0, 0, 0);
    const previousStart = new Date(start);
    previousStart.setDate(previousStart.getDate() - days);

    const [recentOrders, priorOrders, products] = await Promise.all([
      Order.find({ createdAt: { $gte: start, $lte: end }, status: { $ne: 'Cancelled' } }).lean(),
      Order.find({ createdAt: { $gte: previousStart, $lt: start }, status: { $ne: 'Cancelled' } }).lean(),
      Product.find().select('id name collection category').lean()
    ]);
    const sumRevenue = (orders) => orders.reduce((sum, order) => sum + Number(order.totalAmount || order.total || 0), 0);
    const revenue = sumRevenue(recentOrders);
    const previousRevenue = sumRevenue(priorOrders);
    const delta = (current, previous) => previous ? ((current - previous) / previous) * 100 : 0;
    const daily = Array.from({ length: days }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      const key = date.toISOString().slice(0, 10);
      const orders = recentOrders.filter((order) => order.createdAt?.toISOString?.().slice(0, 10) === key);
      return {
        date: key,
        label: date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        revenue: orders.reduce((sum, order) => sum + Number(order.totalAmount || order.total || 0), 0),
        orders: orders.length
      };
    });
    const productsById = new Map(products.map((product) => [product.id || product._id.toString(), product]));
    const collections = new Map();
    const sellers = new Map();
    recentOrders.forEach((order) => {
      (order.items || []).forEach((item) => {
        const quantity = Number(item.qty || item.quantity || 1);
        const product = productsById.get(item.productId);
        const name = item.name || product?.name || 'Product';
        const collection = product?.collection || product?.category || 'Other';
        const amount = Number(item.price || 0) * quantity;
        const currentCollection = collections.get(collection) || { name: collection, value: 0 };
        currentCollection.value += amount;
        collections.set(collection, currentCollection);
        const seller = sellers.get(item.productId || name) || { id: item.productId || name, name, collection, unitsSold: 0, revenue: 0 };
        seller.unitsSold += quantity;
        seller.revenue += amount;
        sellers.set(item.productId || name, seller);
      });
    });
    const ordersCount = recentOrders.length;
    const priorOrdersCount = priorOrders.length;
    const aov = ordersCount ? revenue / ordersCount : 0;
    const previousAov = priorOrdersCount ? previousRevenue / priorOrdersCount : 0;
    return successResponse(res, {
      days,
      revenue,
      previousRevenue,
      revenueDelta: delta(revenue, previousRevenue),
      orders: ordersCount,
      previousOrders: priorOrdersCount,
      ordersDelta: delta(ordersCount, priorOrdersCount),
      aov,
      previousAov,
      aovDelta: delta(aov, previousAov),
      chartData: daily,
      revenueByCollection: Array.from(collections.values()),
      topSellers: Array.from(sellers.values()).sort((a, b) => b.revenue - a.revenue).slice(0, 8)
    });
  } catch (err) {
    return next(err);
  }
};
