import { initialData } from '../data/initialData.js';

// Central in-memory repository with real-time operations
class StoreService {
  constructor() {
    this.db = JSON.parse(JSON.stringify(initialData));
    this.currentUser = { ...this.db.users[0] };
    this.userCart = {
      items: [
        {
          productId: "prod_foundation",
          product: this.db.products.find(p => p.id === "prod_foundation"),
          quantity: 1,
          variant: "Warm Ivory",
          size: "30 ml"
        }
      ],
      coupon: null
    };
    this.userWishlist = ["prod_foundation", "prod_earrings", "prod_candle"];
  }

  // Products
  getProducts(query = {}) {
    let filtered = [...this.db.products];
    const { category, subcategory, search, sort, minPrice, maxPrice } = query;

    if (category && category.toLowerCase() !== 'all') {
      filtered = filtered.filter(p => 
        p.category.toLowerCase() === category.toLowerCase() ||
        p.categorySlug === category.toLowerCase()
      );
    }
    if (subcategory && !subcategory.toLowerCase().startsWith('all')) {
      filtered = filtered.filter(p => 
        p.subcategory && p.subcategory.toLowerCase() === subcategory.toLowerCase()
      );
    }
    if (search) {
      const q = search.toLowerCase().trim();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }
    if (minPrice) filtered = filtered.filter(p => p.price >= Number(minPrice));
    if (maxPrice) filtered = filtered.filter(p => p.price <= Number(maxPrice));

    if (sort === 'price-low') filtered.sort((a, b) => a.price - b.price);
    else if (sort === 'price-high') filtered.sort((a, b) => b.price - a.price);
    else if (sort === 'rating') filtered.sort((a, b) => b.rating - a.rating);

    return filtered;
  }

  getProductById(id) {
    return this.db.products.find(p => p.id === id || p.slug === id);
  }

  getRelatedProducts(product) {
    return this.db.products.filter(p => p.id !== product.id && p.category === product.category).slice(0, 4);
  }

  addProduct(productData) {
    const id = productData.id || `prod_${Date.now()}`;
    const slug = productData.slug || (productData.name || 'product')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    const newProduct = {
      id,
      slug,
      name: productData.name,
      category: productData.category || 'Jewellery',
      categorySlug: (productData.category || 'jewellery').toLowerCase(),
      subcategory: productData.subcategory || 'All',
      price: Number(productData.price) || 0,
      originalPrice: Number(productData.originalPrice || productData.price) || 0,
      discountPercent: productData.discountPercent || (productData.originalPrice && productData.price ? Math.round(((productData.originalPrice - productData.price) / productData.originalPrice) * 100) : 0),
      rating: Number(productData.rating) || 5.0,
      reviewCount: Number(productData.reviewCount) || 1,
      isFeatured: !!productData.isFeatured,
      isBestseller: !!productData.isBestseller,
      images: Array.isArray(productData.images) && productData.images.length > 0
        ? productData.images
        : [productData.image || "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=85"],
      description: productData.description || "",
      variants: Array.isArray(productData.variants) ? productData.variants : ["Standard"],
      sizes: Array.isArray(productData.sizes) ? productData.sizes : ["Standard"],
      features: Array.isArray(productData.features) ? productData.features : ["100% Authentic Luxury"],
      stock: Number(productData.stock) || 15,
      createdAt: new Date().toISOString()
    };

    this.db.products.unshift(newProduct);
    this.persist();
    return newProduct;
  }

  updateProduct(id, updateData) {
    const index = this.db.products.findIndex(p => p.id === id || p.slug === id);
    if (index === -1) return null;
    this.db.products[index] = { ...this.db.products[index], ...updateData };
    this.persist();
    return this.db.products[index];
  }

  deleteProduct(id) {
    const index = this.db.products.findIndex(p => p.id === id || p.slug === id);
    if (index === -1) return null;
    const removed = this.db.products.splice(index, 1);
    this.persist();
    return removed[0];
  }

  // Offers & Coupons
  getOffers() {
    if (!this.db.offers || !Array.isArray(this.db.offers)) {
      this.db.offers = [
        {
          id: "off_1",
          code: "NIHARA10",
          name: "Royal 10% Welcome Offer",
          discountPercent: 10,
          minOrder: 1999,
          validTill: "2026-12-31",
          isActive: true
        },
        {
          id: "off_2",
          code: "GLOW20",
          name: "Festive Glow 20% Offer",
          discountPercent: 20,
          minOrder: 3999,
          validTill: "2026-11-30",
          isActive: true
        },
        {
          id: "off_3",
          code: "AURA30",
          name: "Haute Luxury VIP Offer",
          discountPercent: 30,
          minOrder: 9999,
          validTill: "2026-12-31",
          isActive: true
        },
        {
          id: "off_4",
          code: "BRIDAL15",
          name: "Bridal Suite Special Offer",
          discountPercent: 15,
          minOrder: 4999,
          validTill: "2026-12-31",
          isActive: true
        }
      ];
    }
    return this.db.offers;
  }

  addOffer(offerData) {
    this.getOffers();
    const newOffer = {
      id: offerData.id || `off_${Date.now()}`,
      code: (offerData.code || '').trim().toUpperCase(),
      name: offerData.name || `${offerData.code} Offer`,
      discountPercent: Number(offerData.discountPercent) || 10,
      minOrder: Number(offerData.minOrder || 0),
      validTill: offerData.validTill || "2026-12-31",
      isActive: offerData.isActive !== false,
      createdAt: new Date().toISOString()
    };
    this.db.offers.unshift(newOffer);
    this.persist();
    return newOffer;
  }

  deleteOffer(idOrCode) {
    this.getOffers();
    const index = this.db.offers.findIndex(
      o => o.id === idOrCode || o.code.toUpperCase() === idOrCode.toUpperCase()
    );
    if (index === -1) return null;
    const removed = this.db.offers.splice(index, 1);
    this.persist();
    return removed[0];
  }

  toggleOffer(idOrCode) {
    this.getOffers();
    const offer = this.db.offers.find(
      o => o.id === idOrCode || o.code.toUpperCase() === idOrCode.toUpperCase()
    );
    if (!offer) return null;
    offer.isActive = !offer.isActive;
    this.persist();
    return offer;
  }

  persist() {
    try {
      import('fs').then(fs => {
        import('path').then(path => {
          const liveStorePath = path.resolve('src/data/liveStore.json');
          fs.writeFileSync(liveStorePath, JSON.stringify(this.db, null, 2), 'utf8');
        });
      });
    } catch (e) {
      // Ignore background persist errors
    }
  }

  // Categories
  getCategories() {
    return this.db.categories;
  }

  getCategoryById(id) {
    return this.db.categories.find(c => c.id === id || c.slug === id);
  }

  // Salon Services & Artists
  getServices() {
    return this.db.services;
  }

  getServiceById(id) {
    return this.db.services.find(s => s.id === id || s.slug === id);
  }

  getArtists() {
    return this.db.artists;
  }

  getSalon() {
    return this.db.salon;
  }

  // Bookings
  getBookings() {
    return this.db.bookings;
  }

  createBooking(payload) {
    const { serviceIds, date, timeSlot, locationType, serviceAddress, artistName } = payload;
    const selected = this.db.services.filter(s => serviceIds?.includes(s.id));
    const subtotal = selected.reduce((sum, s) => sum + s.price, 0);
    const travel = locationType === 'home' ? 500 : 0;
    const ref = 'BK-' + Math.floor(100000 + Math.random() * 900000);

    const booking = {
      id: `bk_${Date.now()}`,
      bookingId: ref,
      title: selected.length > 1 ? `${selected[0].name} + ${selected.length - 1} more` : selected[0]?.name || 'Beauty Service',
      services: selected.map(s => ({ name: s.name, duration: `${s.durationMinutes} Mins`, price: s.price })),
      artist: artistName || 'Any Senior Specialist',
      date: date || 'Fri, Oct 16, 2026',
      timeSlot: timeSlot || '01:00 PM',
      location: locationType === 'home' ? 'At Home Service' : 'At Salon - Bandra Flagship Salon',
      address: locationType === 'home' ? (serviceAddress?.streetAddress || 'Flat 302, Royal Palms, Jubilee Hills, Hyderabad') : 'Bandra Flagship Salon, Mumbai',
      servicesSubtotal: subtotal,
      travelCharge: travel,
      totalAmount: subtotal + travel,
      status: 'Confirmed',
      canCancel: true,
      createdAt: new Date().toISOString()
    };

    this.db.bookings.unshift(booking);
    return booking;
  }

  cancelBooking(id) {
    const booking = this.db.bookings.find(b => b.id === id || b.bookingId === id);
    if (booking) {
      booking.status = 'Cancelled';
      booking.canCancel = false;
      return booking;
    }
    return null;
  }

  // Orders
  getOrders() {
    return this.db.orders;
  }

  getOrderById(id) {
    return this.db.orders.find(o => o.id === id || o.orderId === id);
  }

  createOrder(payload) {
    const { items, shippingAddress, paymentMethod, totalAmount } = payload;
    const ref = 'NIH-' + Math.floor(100000 + Math.random() * 900000);
    const order = {
      id: `ord_${Date.now()}`,
      orderId: ref,
      placedDate: 'Oct 1, 2026',
      status: 'Processing',
      totalAmount: totalAmount || 2499,
      paymentMethod: paymentMethod || 'UPI / GPay / PhonePe',
      items: items && items.length > 0 ? items : [
        {
          name: '1x Glow Velvet Silk Foundation',
          variant: 'Warm Ivory',
          size: '30 ml',
          price: 2499,
          image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348'
        }
      ],
      shippingAddress: typeof shippingAddress === 'string' ? shippingAddress : `${shippingAddress?.fullName || 'Ananya Roy'}, ${shippingAddress?.streetAddress || 'Flat 402, Rosewood Villa, Worli, Mumbai'}`
    };

    this.db.orders.unshift(order);
    this.userCart.items = [];
    this.userCart.coupon = null;
    return order;
  }

  // Cart
  getCart() {
    const subtotal = this.userCart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const discount = this.userCart.coupon ? Math.round((subtotal * this.userCart.coupon.discountPercent) / 100) : 0;
    return {
      items: this.userCart.items,
      subtotal,
      deliveryFee: 0,
      discount,
      coupon: this.userCart.coupon,
      totalAmount: Math.max(0, subtotal - discount)
    };
  }

  addToCart(productId, quantity = 1, variant = 'Default', size = 'Standard') {
    const product = this.getProductById(productId);
    if (!product) return null;

    const existing = this.userCart.items.find(i => i.productId === productId && i.variant === variant);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.userCart.items.push({ productId, product, quantity, variant, size });
    }
    return this.getCart();
  }

  updateCartQuantity(productId, quantity, variant) {
    const item = this.userCart.items.find(i => i.productId === productId && (variant ? i.variant === variant : true));
    if (item) {
      if (quantity <= 0) {
        this.userCart.items = this.userCart.items.filter(i => i !== item);
      } else {
        item.quantity = quantity;
      }
    }
    return this.getCart();
  }

  removeFromCart(productId, variant) {
    this.userCart.items = this.userCart.items.filter(i => !(i.productId === productId && (variant ? i.variant === variant : true)));
    return this.getCart();
  }

  applyCoupon(code) {
    const coupon = this.db.coupons.find(c => c.code.toUpperCase() === code?.trim().toUpperCase());
    if (coupon) {
      this.userCart.coupon = coupon;
      return { success: true, coupon };
    }
    return { success: false };
  }

  removeCoupon() {
    this.userCart.coupon = null;
    return this.getCart();
  }

  // Wishlist
  getWishlist() {
    return this.db.products.filter(p => this.userWishlist.includes(p.id));
  }

  toggleWishlist(productId) {
    if (this.userWishlist.includes(productId)) {
      this.userWishlist = this.userWishlist.filter(id => id !== productId);
      return { inWishlist: false, items: this.getWishlist() };
    } else {
      this.userWishlist.push(productId);
      return { inWishlist: true, items: this.getWishlist() };
    }
  }

  // Profile & Addresses
  getUserProfile() {
    return this.currentUser;
  }

  updateUserProfile(data) {
    Object.assign(this.currentUser, data);
    return this.currentUser;
  }

  getAddresses() {
    return this.db.addresses;
  }

  addAddress(addressData) {
    const newAddr = {
      id: `addr_${Date.now()}`,
      isDefault: this.db.addresses.length === 0,
      ...addressData
    };
    this.db.addresses.push(newAddr);
    return newAddr;
  }

  updateAddress(id, addressData) {
    const idx = this.db.addresses.findIndex(a => a.id === id);
    if (idx !== -1) {
      if (addressData.isDefault) {
        this.db.addresses.forEach(a => a.isDefault = false);
      }
      this.db.addresses[idx] = { ...this.db.addresses[idx], ...addressData };
      return this.db.addresses[idx];
    }
    return null;
  }

  deleteAddress(id) {
    this.db.addresses = this.db.addresses.filter(a => a.id !== id);
    return true;
  }
}

export const store = new StoreService();
