import { mockData } from './mockData.js';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Safe request wrapper that tries the Express server first and falls back to mockData
async function request(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      ...options
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(err.message || 'Server error');
    }
    return await res.json();
  } catch (err) {
    console.warn(`[API Fallback] Request to ${endpoint} routed to offline mock store:`, err.message);
    return null; // Will trigger service fallback
  }
}

export const api = {
  // Products
  async getProducts(params = {}) {
    const query = new URLSearchParams(params).toString();
    const serverRes = await request(`/products?${query}`);
    if (serverRes && serverRes.products) return serverRes;

    // Fallback logic
    let products = [...mockData.products];
    if (params.category && params.category.toLowerCase() !== 'all') {
      products = products.filter(p => p.category.toLowerCase() === params.category.toLowerCase());
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      products = products.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    return { success: true, products, total: products.length };
  },

  async getProductById(id) {
    const serverRes = await request(`/products/${id}`);
    if (serverRes && serverRes.product) return serverRes;

    const product = mockData.products.find(p => p.id === id || p.slug === id);
    const related = mockData.products.filter(p => p.id !== id).slice(0, 4);
    return { success: true, product, related };
  },

  // Categories
  async getCategories() {
    const serverRes = await request('/categories');
    if (serverRes && serverRes.categories) return serverRes;
    return { success: true, categories: mockData.categories };
  },

  // Salon Services & Artists
  async getServices() {
    const serverRes = await request('/services');
    if (serverRes && serverRes.services) return serverRes;
    return { success: true, services: mockData.services };
  },

  async getArtists() {
    const serverRes = await request('/artists');
    if (serverRes && serverRes.artists) return serverRes;
    return { success: true, artists: mockData.artists };
  },

  async getSalon() {
    const serverRes = await request('/salon');
    if (serverRes && serverRes.salon) return serverRes;
    return { success: true, salon: mockData.salon };
  },

  // Bookings
  async getBookings() {
    const serverRes = await request('/bookings');
    if (serverRes && serverRes.bookings) return serverRes;
    return { success: true, bookings: mockData.bookings };
  },

  async createBooking(bookingData) {
    const serverRes = await request('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData)
    });
    if (serverRes && serverRes.booking) return serverRes;

    const ref = 'BK-' + Math.floor(100000 + Math.random() * 900000);
    const newBooking = {
      id: `bk_${Date.now()}`,
      bookingId: ref,
      title: 'Luxury Beauty Appointment',
      services: [],
      date: bookingData.date || 'Fri, Oct 16, 2026',
      timeSlot: bookingData.timeSlot || '01:00 PM',
      location: bookingData.locationType === 'home' ? 'At Home Service' : 'At Salon - Bandra Flagship Salon',
      address: bookingData.serviceAddress?.streetAddress || 'Flat 302, Royal Palms, Jubilee Hills, Hyderabad',
      artist: bookingData.artistName || 'Any Senior Specialist',
      totalAmount: 25500,
      status: 'Confirmed',
      canCancel: true
    };
    mockData.bookings.unshift(newBooking);
    return { success: true, booking: newBooking };
  },

  async cancelBooking(bookingId) {
    const serverRes = await request(`/bookings/${bookingId}`, { method: 'DELETE' });
    if (serverRes) return serverRes;

    const b = mockData.bookings.find(bk => bk.id === bookingId || bk.bookingId === bookingId);
    if (b) {
      b.status = 'Cancelled';
      b.canCancel = false;
    }
    return { success: true, message: 'Appointment Cancelled' };
  },

  // Cart
  async getCart() {
    const serverRes = await request('/cart');
    if (serverRes) return serverRes;
    return { success: true, items: [], subtotal: 0, totalAmount: 0, deliveryFee: 0 };
  },

  // Payment Gateway
  async createPaymentIntent(payload) {
    const serverRes = await request('/payment/create-intent', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    if (serverRes && serverRes.paymentIntent) return serverRes;

    return {
      success: true,
      paymentIntent: {
        intentId: 'pay_intent_' + Math.floor(10000000 + Math.random() * 90000000),
        amount: payload.amount,
        currency: 'INR',
        merchantName: 'Nihara D Aura Studio'
      }
    };
  },

  async verifyPayment(payload) {
    const serverRes = await request('/payment/verify', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    if (serverRes && serverRes.verification) return serverRes;

    const txnRef = payload.transactionId || 'TXN_' + Math.floor(100000000 + Math.random() * 900000000);
    return {
      success: true,
      verification: {
        success: true,
        transactionId: txnRef,
        paymentMethod: payload.paymentMethod || 'Online Payment Gateway',
        status: 'PAID'
      }
    };
  },

  // Orders
  async getOrders() {
    const serverRes = await request('/orders');
    if (serverRes && serverRes.orders) return serverRes;
    return { success: true, orders: mockData.orders };
  },

  async createOrder(orderData) {
    const serverRes = await request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
    if (serverRes && serverRes.order) return serverRes;

    const ref = 'NIH-' + Math.floor(100000 + Math.random() * 900000);
    const newOrder = {
      id: `ord_${Date.now()}`,
      orderId: ref,
      placedDate: 'Oct 1, 2026',
      status: 'Processing',
      totalAmount: orderData.totalAmount || 2499,
      paymentMethod: orderData.paymentMethod || 'UPI / GPay / PhonePe',
      transactionId: orderData.transactionId || null,
      paymentStatus: orderData.paymentStatus || (orderData.paymentMethod === 'Cash on Delivery' ? 'Pending (COD)' : 'Paid (Online Gateway)'),
      items: orderData.items || [],
      shippingAddress: typeof orderData.shippingAddress === 'string' ? orderData.shippingAddress : 'Flat 402, Rosewood Villa, Worli, Mumbai'
    };
    mockData.orders.unshift(newOrder);
    return { success: true, order: newOrder };
  },


  // Profile & Addresses
  async getProfile() {
    const serverRes = await request('/profile');
    if (serverRes && serverRes.user) return serverRes;
    return { success: true, user: mockData.users[0] };
  },

  async updateProfile(data) {
    const serverRes = await request('/profile/update', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    if (serverRes && serverRes.user) return serverRes;
    Object.assign(mockData.users[0], data);
    return { success: true, user: mockData.users[0] };
  },

  async getAddresses() {
    const serverRes = await request('/profile/addresses');
    if (serverRes && serverRes.addresses) return serverRes;
    return { success: true, addresses: mockData.addresses };
  },

  async addAddress(addressData) {
    const serverRes = await request('/profile/addresses', {
      method: 'POST',
      body: JSON.stringify(addressData)
    });
    if (serverRes && serverRes.address) return serverRes;
    const newAddr = {
      id: `addr_${Date.now()}`,
      isDefault: mockData.addresses.length === 0,
      ...addressData
    };
    mockData.addresses.push(newAddr);
    return { success: true, address: newAddr };
  },

  async updateAddress(id, addressData) {
    const serverRes = await request(`/profile/addresses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(addressData)
    });
    if (serverRes && serverRes.address) return serverRes;
    const idx = mockData.addresses.findIndex(a => a.id === id);
    if (idx !== -1) {
      if (addressData.isDefault) {
        mockData.addresses.forEach(a => a.isDefault = false);
      }
      mockData.addresses[idx] = { ...mockData.addresses[idx], ...addressData };
      return { success: true, address: mockData.addresses[idx] };
    }
    return { success: false, message: 'Address not found' };
  },

  async deleteAddress(id) {
    const serverRes = await request(`/profile/addresses/${id}`, {
      method: 'DELETE'
    });
    mockData.addresses = mockData.addresses.filter(a => a.id !== id);
    return { success: true };
  }
};
