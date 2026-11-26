const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');
const Service = require('../models/Service');
const Order = require('../models/Order');
const Booking = require('../models/Booking');
const Coupon = require('../models/Coupon');
const User = require('../models/User');
const ReturnRequest = require('../models/ReturnRequest');
const Setting = require('../models/Setting');
const InventoryAdjustment = require('../models/InventoryAdjustment');
const adminAuth = require('../middleware/adminAuth');
const upload = require('../middleware/upload');

// Middleware to ensure all routes require admin authentication
router.use(adminAuth);

// 1. Get Dashboard Data
router.get('/dashboard', async (req, res) => {
  try {
    const [products, orders, appointments, coupons, customers, services, categories, storedSettings] = await Promise.all([
      Product.find().sort({ createdAt: -1 }),
      Order.find().sort({ createdAt: -1 }),
      Booking.find().sort({ createdAt: -1 }),
      Coupon.find().sort({ createdAt: -1 }),
      User.find({ role: 'user' }).sort({ createdAt: -1 }),
      Service.find().sort({ createdAt: -1 }),
      Category.find().sort({ createdAt: -1 }),
      Setting.findOne({ key: 'store' }),
    ]);

    res.status(200).json({
      success: true,
      products: products.map(p => ({
        id: p._id,
        name: p.name,
        slug: p.slug,
        category: p.category,
        categorySlug: p.categorySlug,
        subcategory: p.subcategory,
        collection: p.productCollection || 'Jewellery',
        cost: p.cost || 0,
        price: p.price,
        originalPrice: p.originalPrice,
        discountPercent: p.discountPercent,
        rating: p.rating,
        reviewCount: p.reviewCount,
        images: p.images,
        image: p.image || (p.images && p.images[0]) || '',
        description: p.description,
        variants: p.variants,
        sizes: p.sizes,
        features: p.features,
        stock: p.stock,
        status: p.status || 'Live',
        soldLast30: p.soldLast30 || 0,
        isFeatured: p.isFeatured,
        isBestseller: p.isBestseller,
        createdAt: p.createdAt,
      })),
      orders: orders.map(o => ({
        id: o._id,
        userId: o.userId,
        customerName: o.customerName,
        customerEmail: o.customerEmail,
        customerPhone: o.customerPhone,
        items: o.items,
        totalAmount: o.totalAmount,
        status: o.status,
        paymentStatus: o.paymentStatus,
        paymentMethod: o.paymentMethod,
        shippingAddress: o.shippingAddress,
        trackingNumber: o.trackingNumber,
        carrier: o.carrier,
        createdAt: o.createdAt,
      })),
      appointments: appointments.map(a => ({
        id: a._id,
        userId: a.userId,
        customerName: a.customerName,
        customerEmail: a.customerEmail,
        customerPhone: a.customerPhone,
        serviceType: a.serviceType,
        artist: a.artist,
        venue: a.venue,
        date: a.date,
        time: a.time,
        status: a.status,
        createdAt: a.createdAt,
      })),
      coupons: coupons.map(c => ({
        id: c._id,
        code: c.code,
        discountType: c.discountType,
        discountValue: c.discountValue,
        minOrderValue: c.minOrderValue,
        maxDiscount: c.maxDiscount,
        validFrom: c.validFrom,
        validUntil: c.validUntil,
        isActive: c.isActive,
        createdAt: c.createdAt,
      })),
      customers: customers.map(c => ({
        id: c._id,
        name: c.name,
        email: c.email,
        phone: c.mobileNumber || c.phone || '',
        createdAt: c.createdAt,
      })),
      services: services.map(s => ({
        id: s._id,
        name: s.name,
        category: s.category,
        subcategory: s.subcategory,
        price: s.price,
        duration: s.duration,
        description: s.description,
        images: s.images,
        artists: s.artists,
        createdAt: s.createdAt,
      })),
      categories: categories.map(cat => ({
        id: cat._id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        banner: cat.banner,
        subcategories: cat.subcategories,
        createdAt: cat.createdAt,
      })),
      settings: {
        storeName: storedSettings?.storeName || "Nihara D'Aura",
        lowStockThreshold: storedSettings?.lowStockThreshold ?? 5,
        targetMargins: storedSettings?.targetMargins || { Jewellery: 18, Makeup: 45, Nails: 55, Candles: 60 },
        salonName: storedSettings?.salonName || "Nihara D'Aura Flagship Salon",
        salonAddress: storedSettings?.salonAddress || "423 A, 4th Floor, Tower 3, NX One Tower, Greater Noida (West), UP - 201306",
        salonPhone: storedSettings?.salonPhone || "+91 92660 59846",
        salonEmail: storedSettings?.salonEmail || "support@niharadaura.com",
        salonHours: storedSettings?.salonHours || "09:00 AM - 08:30 PM (Daily)",
        salonAmenities: storedSettings?.salonAmenities?.length
          ? storedSettings.salonAmenities
          : ["Valet Parking", "Complimentary Kashmiri Kahwa", "Private Bridal Suites", "Sterilized Tools"],
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ success: false, message: 'Error fetching dashboard data' });
  }
});

// 2. Products CRUD
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      products: products.map(p => ({
        id: p._id,
        name: p.name,
        slug: p.slug,
        category: p.category,
        categorySlug: p.categorySlug,
        subcategory: p.subcategory,
        collection: p.productCollection || 'Jewellery',
        cost: p.cost || 0,
        price: p.price,
        originalPrice: p.originalPrice,
        discountPercent: p.discountPercent,
        rating: p.rating,
        reviewCount: p.reviewCount,
        images: p.images,
        image: p.image || (p.images && p.images[0]) || '',
        description: p.description,
        variants: p.variants,
        sizes: p.sizes,
        features: p.features,
        stock: p.stock,
        status: p.status || 'Live',
        soldLast30: p.soldLast30 || 0,
        isFeatured: p.isFeatured,
        isBestseller: p.isBestseller,
        createdAt: p.createdAt,
      })),
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, message: 'Error fetching products' });
  }
});

router.post('/products', upload.single('image'), async (req, res) => {
  try {
    console.log('[DEBUG] POST /admin/products - Body:', req.body);
    console.log('[DEBUG] POST /admin/products - File:', req.file ? req.file.filename : 'No file');
    
    const productData = { ...req.body };

    // Handle FormData fields - convert strings to proper types
    if (productData.name) productData.name = String(productData.name);
    if (productData.cost) productData.cost = Number(productData.cost);
    if (productData.price) productData.price = Number(productData.price);
    if (productData.originalPrice !== undefined && productData.originalPrice !== '') productData.originalPrice = Number(productData.originalPrice);
    if (productData.discountPercent !== undefined && productData.discountPercent !== '') productData.discountPercent = Number(productData.discountPercent);

    // Auto-calculate discount or original price if one is provided
    if (productData.originalPrice && productData.price && productData.originalPrice > productData.price && !productData.discountPercent) {
      productData.discountPercent = Math.round(((productData.originalPrice - productData.price) / productData.originalPrice) * 100);
    }
    if (productData.discountPercent && productData.price && !productData.originalPrice) {
      productData.originalPrice = Math.round(productData.price / (1 - productData.discountPercent / 100));
    }

    if (productData.stock) productData.stock = Number(productData.stock);
    if (productData.status) productData.status = String(productData.status);
    if (productData.description) productData.description = String(productData.description);
    if (productData.category) productData.category = String(productData.category);
    if (productData.categorySlug) productData.categorySlug = String(productData.categorySlug);
    if (productData.subcategory) productData.subcategory = String(productData.subcategory);
    if (productData.productCollection) productData.productCollection = String(productData.productCollection);
    if (productData.slug) productData.slug = String(productData.slug);

    // If file was uploaded, add image URL
    if (req.file) {
      productData.image = `/uploads/${req.file.filename}`;
      console.log('[DEBUG] Image saved:', productData.image);
    }

    console.log('[DEBUG] Product data to save:', productData);

    const product = new Product(productData);
    const savedProduct = await product.save();

    console.log('[DEBUG] Product saved successfully:', savedProduct._id);

    // Emit socket event for real-time update
    if (req.io) {
      req.io.to('admin').emit('admin:data:changed', { type: 'product', action: 'create', data: savedProduct });
      req.io.emit('product:created', savedProduct);
    }

    // Construct full image URL for response
    const imageUrl = savedProduct.image ? `${req.protocol}://${req.get('host')}${savedProduct.image}` : '';

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: {
        id: savedProduct._id,
        name: savedProduct.name,
        slug: savedProduct.slug,
        category: savedProduct.category,
        categorySlug: savedProduct.categorySlug,
        subcategory: savedProduct.subcategory,
        collection: savedProduct.productCollection || 'Jewellery',
        cost: savedProduct.cost || 0,
        price: savedProduct.price,
        originalPrice: savedProduct.originalPrice,
        discountPercent: savedProduct.discountPercent,
        rating: savedProduct.rating,
        reviewCount: savedProduct.reviewCount,
        images: savedProduct.images,
        image: imageUrl || (savedProduct.images && savedProduct.images[0]) || '',
        description: savedProduct.description,
        variants: savedProduct.variants,
        sizes: savedProduct.sizes,
        features: savedProduct.features,
        stock: savedProduct.stock,
        status: savedProduct.status || 'Live',
        soldLast30: savedProduct.soldLast30 || 0,
        isFeatured: savedProduct.isFeatured,
        isBestseller: savedProduct.isBestseller,
        createdAt: savedProduct.createdAt,
      },
    });
  } catch (error) {
    console.error('[ERROR] Error creating product:', error);
    console.error('[ERROR] Error details:', error.message);
    res.status(500).json({ success: false, message: 'Error creating product: ' + error.message });
  }
});

router.patch('/products/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Handle FormData fields - convert strings to proper types
    if (updateData.name) updateData.name = String(updateData.name);
    if (updateData.cost) updateData.cost = Number(updateData.cost);
    if (updateData.price) updateData.price = Number(updateData.price);
    if (updateData.originalPrice !== undefined) updateData.originalPrice = Number(updateData.originalPrice) || 0;
    if (updateData.discountPercent !== undefined) updateData.discountPercent = Number(updateData.discountPercent) || 0;

    // Auto-calculate discount or original price if one is provided
    if (updateData.originalPrice && updateData.price && updateData.originalPrice > updateData.price && !updateData.discountPercent) {
      updateData.discountPercent = Math.round(((updateData.originalPrice - updateData.price) / updateData.originalPrice) * 100);
    }
    if (updateData.discountPercent && updateData.price && !updateData.originalPrice) {
      updateData.originalPrice = Math.round(updateData.price / (1 - updateData.discountPercent / 100));
    }

    if (updateData.stock) updateData.stock = Number(updateData.stock);
    if (updateData.status) updateData.status = String(updateData.status);
    if (updateData.description) updateData.description = String(updateData.description);
    if (updateData.category) updateData.category = String(updateData.category);
    if (updateData.categorySlug) updateData.categorySlug = String(updateData.categorySlug);
    if (updateData.subcategory) updateData.subcategory = String(updateData.subcategory);
    if (updateData.productCollection) updateData.productCollection = String(updateData.productCollection);
    if (updateData.slug) updateData.slug = String(updateData.slug);

    // If file was uploaded, add image URL
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    // Map 'collection' from frontend to 'productCollection' in database
    if (updateData.collection) {
      updateData.productCollection = updateData.collection;
      delete updateData.collection;
    }
    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Emit socket event for real-time update
    if (req.io) {
      req.io.to('admin').emit('admin:data:changed', { type: 'product', action: 'update', data: updatedProduct });
      req.io.emit('product:updated', updatedProduct);
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product: {
        id: updatedProduct._id,
        name: updatedProduct.name,
        slug: updatedProduct.slug,
        category: updatedProduct.category,
        categorySlug: updatedProduct.categorySlug,
        subcategory: updatedProduct.subcategory,
        collection: updatedProduct.productCollection || 'Jewellery',
        cost: updatedProduct.cost || 0,
        price: updatedProduct.price,
        originalPrice: updatedProduct.originalPrice,
        discountPercent: updatedProduct.discountPercent,
        rating: updatedProduct.rating,
        reviewCount: updatedProduct.reviewCount,
        images: updatedProduct.images,
        image: updatedProduct.image || (updatedProduct.images && updatedProduct.images[0]) || '',
        description: updatedProduct.description,
        variants: updatedProduct.variants,
        sizes: updatedProduct.sizes,
        features: updatedProduct.features,
        stock: updatedProduct.stock,
        status: updatedProduct.status || 'Live',
        soldLast30: updatedProduct.soldLast30 || 0,
        isFeatured: updatedProduct.isFeatured,
        isBestseller: updatedProduct.isBestseller,
        createdAt: updatedProduct.createdAt,
      },
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ success: false, message: 'Error updating product' });
  }
});

router.delete('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Emit socket event for real-time update
    if (req.io) {
      req.io.to('admin').emit('admin:data:changed', { type: 'product', action: 'delete', data: { id } });
      req.io.emit('product:deleted', { id });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ success: false, message: 'Error deleting product' });
  }
});

// 3. Categories CRUD
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      categories: categories.map(cat => ({
        id: cat._id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        banner: cat.banner,
        subcategories: cat.subcategories,
        createdAt: cat.createdAt,
      })),
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, message: 'Error fetching categories' });
  }
});

router.post('/categories', async (req, res) => {
  try {
    const categoryData = req.body;
    const category = new Category(categoryData);
    const savedCategory = await category.save();

    // Emit socket event
    if (req.io) {
      req.io.to('admin').emit('admin:data:changed', { type: 'category', action: 'create', data: savedCategory });
      req.io.emit('category:created', savedCategory);
    }

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      category: {
        id: savedCategory._id,
        ...savedCategory.toObject(),
      },
    });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ success: false, message: 'Error creating category' });
  }
});

router.patch('/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCategory = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedCategory) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // Emit socket event
    if (req.io) {
      req.io.to('admin').emit('admin:data:changed', { type: 'category', action: 'update', data: updatedCategory });
      req.io.emit('category:updated', updatedCategory);
    }

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      category: {
        id: updatedCategory._id,
        ...updatedCategory.toObject(),
      },
    });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ success: false, message: 'Error updating category' });
  }
});

router.delete('/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // Emit socket event
    if (req.io) {
      req.io.to('admin').emit('admin:data:changed', { type: 'category', action: 'delete', data: { id } });
      req.io.emit('category:deleted', { id });
    }

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ success: false, message: 'Error deleting category' });
  }
});

// 4. Services CRUD
router.get('/services', async (req, res) => {
  try {
    const { category } = req.query;
    const query = category ? { category } : {};
    const services = await Service.find(query).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      services: services.map(s => ({
        id: s._id,
        name: s.name,
        category: s.category,
        subcategory: s.subcategory,
        price: s.price,
        duration: s.duration,
        description: s.description,
        images: s.images,
        artists: s.artists,
        createdAt: s.createdAt,
      })),
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ success: false, message: 'Error fetching services' });
  }
});

router.post('/services', async (req, res) => {
  try {
    const serviceData = req.body;
    const service = new Service(serviceData);
    const savedService = await service.save();

    // Emit socket event
    if (req.io) {
      req.io.to('admin').emit('admin:data:changed', { type: 'service', action: 'create', data: savedService });
      req.io.emit('service:created', savedService);
    }

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      service: {
        id: savedService._id,
        ...savedService.toObject(),
      },
    });
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ success: false, message: 'Error creating service' });
  }
});

router.patch('/services/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedService = await Service.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedService) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    // Emit socket event
    if (req.io) {
      req.io.to('admin').emit('admin:data:changed', { type: 'service', action: 'update', data: updatedService });
      req.io.emit('service:updated', updatedService);
    }

    res.status(200).json({
      success: true,
      message: 'Service updated successfully',
      service: {
        id: updatedService._id,
        ...updatedService.toObject(),
      },
    });
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ success: false, message: 'Error updating service' });
  }
});

router.delete('/services/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedService = await Service.findByIdAndDelete(id);

    if (!deletedService) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    // Emit socket event
    if (req.io) {
      req.io.to('admin').emit('admin:data:changed', { type: 'service', action: 'delete', data: { id } });
      req.io.emit('service:deleted', { id });
    }

    res.status(200).json({
      success: true,
      message: 'Service deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ success: false, message: 'Error deleting service' });
  }
});

// 5. Orders
router.patch('/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedOrder = await Order.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Emit socket event
    if (req.io) {
      req.io.to('admin').emit('admin:data:changed', { type: 'order', action: 'update', data: updatedOrder });
      req.io.emit('order:updated', updatedOrder);
    }

    res.status(200).json({
      success: true,
      message: 'Order updated successfully',
      order: {
        id: updatedOrder._id,
        ...updatedOrder.toObject(),
      },
    });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ success: false, message: 'Error updating order' });
  }
});

router.delete('/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (req.io) {
      req.io.to('admin').emit('admin:data:changed', { type: 'order', action: 'delete', data: { id } });
      req.io.emit('order:deleted', { id });
    }

    res.status(200).json({
      success: true,
      message: 'Order deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ success: false, message: 'Error deleting order' });
  }
});

// 6. Appointments
router.post('/appointments', async (req, res) => {
  try {
    const appointmentData = req.body;
    const appointment = new Booking(appointmentData);
    const savedAppointment = await appointment.save();

    // Emit socket event
    if (req.io) {
      req.io.to('admin').emit('admin:data:changed', { type: 'appointment', action: 'create', data: savedAppointment });
      req.io.emit('booking:created', savedAppointment);
    }

    res.status(201).json({
      success: true,
      message: 'Appointment created successfully',
      appointment: {
        id: savedAppointment._id,
        ...savedAppointment.toObject(),
      },
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ success: false, message: 'Error creating appointment' });
  }
});

router.patch('/appointments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedAppointment = await Booking.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedAppointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Emit socket event
    if (req.io) {
      req.io.to('admin').emit('admin:data:changed', { type: 'appointment', action: 'update', data: updatedAppointment });
      req.io.emit('booking:updated', updatedAppointment);
      if (updatedAppointment.status === 'Cancelled') {
        req.io.emit('booking:cancelled', updatedAppointment);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Appointment updated successfully',
      appointment: {
        id: updatedAppointment._id,
        ...updatedAppointment.toObject(),
      },
    });
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ success: false, message: 'Error updating appointment' });
  }
});

router.delete('/appointments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAppointment = await Booking.findByIdAndDelete(id);

    if (!deletedAppointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Emit socket event
    if (req.io) {
      req.io.to('admin').emit('admin:data:changed', { type: 'appointment', action: 'delete', data: { id } });
      req.io.emit('booking:cancelled', { id });
    }

    res.status(200).json({
      success: true,
      message: 'Appointment deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ success: false, message: 'Error deleting appointment' });
  }
});

// 7. Coupons
router.post('/coupons', async (req, res) => {
  try {
    const couponData = req.body;
    const coupon = new Coupon(couponData);
    const savedCoupon = await coupon.save();

    // Emit socket event
    if (req.io) {
      req.io.to('admin').emit('admin:data:changed', { type: 'coupon', action: 'create', data: savedCoupon });
      req.io.emit('offer:created', savedCoupon);
    }

    res.status(201).json({
      success: true,
      message: 'Coupon created successfully',
      coupon: {
        id: savedCoupon._id,
        ...savedCoupon.toObject(),
      },
    });
  } catch (error) {
    console.error('Error creating coupon:', error);
    res.status(500).json({ success: false, message: 'Error creating coupon' });
  }
});

router.patch('/coupons/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCoupon = await Coupon.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedCoupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }

    // Emit socket event
    if (req.io) {
      req.io.to('admin').emit('admin:data:changed', { type: 'coupon', action: 'update', data: updatedCoupon });
      req.io.emit('offer:updated', updatedCoupon);
    }

    res.status(200).json({
      success: true,
      message: 'Coupon updated successfully',
      coupon: {
        id: updatedCoupon._id,
        ...updatedCoupon.toObject(),
      },
    });
  } catch (error) {
    console.error('Error updating coupon:', error);
    res.status(500).json({ success: false, message: 'Error updating coupon' });
  }
});

router.delete('/coupons/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCoupon = await Coupon.findByIdAndDelete(id);

    if (!deletedCoupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }

    // Emit socket event
    if (req.io) {
      req.io.to('admin').emit('admin:data:changed', { type: 'coupon', action: 'delete', data: { id } });
      req.io.emit('offer:deleted', { id });
    }

    res.status(200).json({
      success: true,
      message: 'Coupon deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting coupon:', error);
    res.status(500).json({ success: false, message: 'Error deleting coupon' });
  }
});

// 8. Settings
router.put('/settings', async (req, res) => {
  try {
    const defaults = {
      storeName: req.body.storeName || "Nihara D'Aura",
      lowStockThreshold: Number(req.body.lowStockThreshold ?? 5),
      targetMargins: req.body.targetMargins || { Jewellery: 18, Makeup: 45, Nails: 55, Candles: 60 },
      salonName: req.body.salonName || "Nihara D'Aura Flagship Salon",
      salonAddress: req.body.salonAddress || "423 A, 4th Floor, Tower 3, NX One Tower, Greater Noida (West), UP - 201306",
      salonPhone: req.body.salonPhone || "+91 92660 59846",
      salonEmail: req.body.salonEmail || "support@niharadaura.com",
      salonHours: req.body.salonHours || "09:00 AM - 08:30 PM (Daily)",
      salonAmenities: Array.isArray(req.body.salonAmenities)
        ? req.body.salonAmenities.map((item) => String(item).trim()).filter(Boolean)
        : ["Valet Parking", "Complimentary Kashmiri Kahwa", "Private Bridal Suites", "Sterilized Tools"],
    };
    const settings = await Setting.findOneAndUpdate(
      { key: 'store' },
      { key: 'store', ...defaults },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      settings: {
        storeName: settings.storeName,
        lowStockThreshold: settings.lowStockThreshold,
        targetMargins: settings.targetMargins,
        salonName: settings.salonName,
        salonAddress: settings.salonAddress,
        salonPhone: settings.salonPhone,
        salonEmail: settings.salonEmail,
        salonHours: settings.salonHours,
        salonAmenities: settings.salonAmenities,
      },
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ success: false, message: 'Error updating settings' });
  }
});

// 9. Analytics
router.get('/analytics', async (req, res) => {
  try {
    const requestedDays = Math.max(1, parseInt(req.query.days, 10) || 30);
    const days = requestedDays;
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    startDate.setDate(startDate.getDate() - days + 1);
    const previousStart = new Date(startDate);
    previousStart.setDate(previousStart.getDate() - days);

    const [orders, products, appointments] = await Promise.all([
      Order.find({ createdAt: { $gte: previousStart } }).populate('items.productId'),
      Product.find(),
      Booking.find({ createdAt: { $gte: startDate } }),
    ]);

    const currentOrders = orders.filter(order =>
      order.createdAt >= startDate && order.status !== 'Cancelled'
    );
    const previousOrders = orders.filter(order =>
      order.createdAt >= previousStart && order.createdAt < startDate && order.status !== 'Cancelled'
    );
    const revenue = currentOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const previousRevenue = previousOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const ordersCount = currentOrders.length;
    const previousOrdersCount = previousOrders.length;
    const aov = ordersCount ? revenue / ordersCount : 0;
    const previousAov = previousOrdersCount ? previousRevenue / previousOrdersCount : 0;
    const delta = (current, previous) => previous ? ((current - previous) / previous) * 100 : 0;

    const chartData = [];
    for (let offset = days - 1; offset >= 0; offset -= 1) {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - offset);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      const dayOrders = currentOrders.filter(order => {
        const createdAt = new Date(order.createdAt);
        return createdAt >= date && createdAt < nextDate;
      });
      chartData.push({
        date: date.toISOString().slice(0, 10),
        label: date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        revenue: dayOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0),
        orders: dayOrders.length,
      });
    }

    const productMap = new Map(products.map(product => [String(product._id), product]));
    const collectionRevenue = new Map();
    const topSellerMap = new Map();
    currentOrders.forEach(order => {
      (order.items || []).forEach(item => {
        const quantity = Number(item.quantity) || 1;
        const amount = Number(item.subtotal) || Number(item.price) * quantity || 0;
        const productId = String(item.productId?._id || item.productId || '');
        const product = productMap.get(productId);
        const collection = product?.productCollection || product?.category || 'Other';
        collectionRevenue.set(collection, (collectionRevenue.get(collection) || 0) + amount);

        const sellerKey = productId || item.name || 'unknown';
        const existing = topSellerMap.get(sellerKey) || {
          id: sellerKey,
          name: product?.name || item.name || 'Unknown product',
          collection,
          unitsSold: 0,
          revenue: 0,
        };
        existing.unitsSold += quantity;
        existing.revenue += amount;
        topSellerMap.set(sellerKey, existing);
      });
    });

    res.status(200).json({
      success: true,
      revenue,
      revenueDelta: delta(revenue, previousRevenue),
      orders: ordersCount,
      ordersDelta: delta(ordersCount, previousOrdersCount),
      aov,
      aovDelta: delta(aov, previousAov),
      chartData,
      revenueByCollection: Array.from(collectionRevenue, ([name, value]) => ({ name, value })),
      topSellers: Array.from(topSellerMap.values()).sort((a, b) =>
        b.revenue - a.revenue || b.unitsSold - a.unitsSold
      ).slice(0, 8),
      totalAppointments: appointments.length,
      totalProducts: products.length,
      period: { days, startDate },
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ success: false, message: 'Error fetching analytics' });
  }
});

// 10. Inventory Adjustments
router.get('/inventory/adjustments', async (req, res) => {
  try {
    const adjustments = await InventoryAdjustment.find()
      .sort({ createdAt: -1 })
      .limit(200);
    res.status(200).json({
      success: true,
      adjustments: adjustments.map(adjustment => ({
        id: adjustment._id,
        productId: adjustment.productId,
        productName: adjustment.productName,
        delta: adjustment.delta,
        previousStock: adjustment.previousStock,
        newStock: adjustment.newStock,
        reason: adjustment.reason,
        adjustedAt: adjustment.createdAt,
      })),
    });
  } catch (error) {
    console.error('Error fetching inventory adjustments:', error);
    res.status(500).json({ success: false, message: 'Error fetching inventory adjustments' });
  }
});

router.post('/inventory/:id/adjustments', async (req, res) => {
  try {
    const { id } = req.params;
    const { delta, reason } = req.body;
    const numericDelta = Number(delta);
    if (!Number.isFinite(numericDelta) || numericDelta === 0) {
      return res.status(400).json({ success: false, message: 'A non-zero numeric stock delta is required' });
    }
    if (!reason || !reason.trim()) {
      return res.status(400).json({ success: false, message: 'A reason is required for stock adjustment' });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const previousStock = product.stock || 0;
    product.stock = Math.max(0, previousStock + numericDelta);
    await product.save();
    await InventoryAdjustment.create({
      productId: product._id,
      productName: product.name,
      delta: numericDelta,
      previousStock,
      newStock: product.stock,
      reason: reason.trim(),
      adjustedBy: req.user._id,
    });

    // Emit socket event
    if (req.io) {
      req.io.to('admin').emit('admin:data:changed', { type: 'product', action: 'update', data: product });
      req.io.emit('product:updated', product);
    }

    res.status(200).json({
      success: true,
      message: 'Inventory adjusted successfully',
      product: {
        id: product._id,
        ...product.toObject(),
      },
    });
  } catch (error) {
    console.error('Error adjusting inventory:', error);
    res.status(500).json({ success: false, message: 'Error adjusting inventory' });
  }
});

// 11. Customer / User Management
const serializeUser = (u, stats) => ({
  id: u._id,
  name: u.fullName || u.name || '',
  email: u.email,
  phone: u.mobileNumber || u.phone || '',
  avatar: u.avatar || '',
  role: u.role || 'user',
  tier: u.tier || 'Royal Member',
  rewardPoints: u.rewardPoints || 0,
  isBlocked: Boolean(u.isBlocked),
  blockedReason: u.blockedReason || '',
  isVerified: Boolean(u.isVerified),
  orderCount: stats?.orderCount || 0,
  totalSpent: stats?.totalSpent || 0,
  createdAt: u.createdAt,
});

router.get('/users', async (req, res) => {
  try {
    const [users, orders] = await Promise.all([
      User.find().sort({ createdAt: -1 }),
      Order.find().select('userId totalAmount status'),
    ]);

    const statsMap = new Map();
    orders.forEach((order) => {
      if (!order.userId) return;
      const key = String(order.userId);
      const stats = statsMap.get(key) || { orderCount: 0, totalSpent: 0 };
      if (order.status !== 'Cancelled') {
        stats.orderCount += 1;
        stats.totalSpent += Number(order.totalAmount) || 0;
      }
      statsMap.set(key, stats);
    });

    res.status(200).json({
      success: true,
      users: users.map((u) => serializeUser(u, statsMap.get(String(u._id)))),
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Error fetching users' });
  }
});

router.patch('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isSelf = String(user._id) === String(req.user._id);
    const { role, isBlocked, blockedReason, name, fullName, phone, mobileNumber, tier, rewardPoints } = req.body;

    if (isSelf && (role !== undefined && role !== 'admin')) {
      return res.status(400).json({ success: false, message: 'You cannot remove your own admin role' });
    }
    if (isSelf && isBlocked === true) {
      return res.status(400).json({ success: false, message: 'You cannot block your own account' });
    }

    if (role !== undefined) {
      if (!['user', 'admin'].includes(role)) {
        return res.status(400).json({ success: false, message: 'Invalid role' });
      }
      user.role = role;
    }
    if (isBlocked !== undefined) {
      user.isBlocked = Boolean(isBlocked);
      if (!user.isBlocked) user.blockedReason = '';
    }
    if (blockedReason !== undefined) user.blockedReason = String(blockedReason || '');
    const resolvedName = fullName !== undefined ? fullName : name;
    if (resolvedName !== undefined) {
      user.fullName = resolvedName;
      user.name = resolvedName;
    }
    const resolvedPhone = mobileNumber !== undefined ? mobileNumber : phone;
    if (resolvedPhone !== undefined) {
      user.mobileNumber = resolvedPhone;
    }
    if (tier !== undefined) user.tier = tier;
    if (rewardPoints !== undefined) {
      const points = Number(rewardPoints);
      if (!Number.isFinite(points) || points < 0) {
        return res.status(400).json({ success: false, message: 'Reward points must be a non-negative number' });
      }
      user.rewardPoints = points;
    }

    await user.save();

    if (req.io) {
      req.io.to('admin').emit('admin:data:changed', { type: 'customer', action: 'update', data: serializeUser(user) });
    }

    res.status(200).json({ success: true, message: 'User updated successfully', user: serializeUser(user) });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ success: false, message: 'Error updating user' });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (String(user._id) === String(req.user._id)) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own account' });
    }
    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Admin accounts cannot be deleted from the customer panel' });
    }

    await User.findByIdAndDelete(id);

    if (req.io) {
      req.io.to('admin').emit('admin:data:changed', { type: 'customer', action: 'delete', data: { id } });
    }

    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, message: 'Error deleting user' });
  }
});

// 12. Return & Refund Management
router.get('/returns', async (req, res) => {
  try {
    const returns = await ReturnRequest.find()
      .sort({ createdAt: -1 })
      .populate('userId', 'name email mobileNumber phone')
      .populate('orderId', 'orderId totalAmount paymentMethod paymentStatus');

    res.status(200).json({
      success: true,
      returns: returns.map(item => ({
        id: item._id,
        orderId: item.orderId?._id,
        orderIdentifier: item.orderIdentifier || item.orderId?.orderId,
        user: item.userId,
        type: item.type,
        items: item.items,
        refundAmount: item.refundAmount,
        reason: item.reason,
        status: item.status,
        adminNotes: item.adminNotes,
        createdAt: item.createdAt,
        resolvedAt: item.resolvedAt,
      })),
    });
  } catch (error) {
    console.error('Error fetching admin returns:', error);
    res.status(500).json({ success: false, message: 'Could not load return requests' });
  }
});

router.patch('/returns/:id', async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const request = await ReturnRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Return request not found' });
    }

    if (status) request.status = status;
    if (adminNotes !== undefined) request.adminNotes = adminNotes;

    if (status === 'Completed' || status === 'Approved') {
      request.resolvedAt = new Date();
      // If refund is approved/completed, update order payment status
      if (request.type === 'Refund' && status === 'Completed') {
        await Order.findByIdAndUpdate(request.orderId, { paymentStatus: 'Refunded' });
      }
    }

    await request.save();

    if (req.io) {
      req.io.to('admin').emit('admin:data:changed', { type: 'return_request', action: 'update', data: request });
      req.io.emit('return:updated', request);
    }

    res.status(200).json({
      success: true,
      message: `Return request marked as ${request.status}`,
      request,
    });
  } catch (error) {
    console.error('Error updating return request:', error);
    res.status(500).json({ success: false, message: 'Could not update return request' });
  }
});

module.exports = router;
