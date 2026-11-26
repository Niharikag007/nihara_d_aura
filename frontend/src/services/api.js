import { API_BASE_URL } from '../config/api.js';

const normalizeProduct = (product) => {
  if (!product || typeof product !== 'object') return product;
  const normalizedId = product.id || product._id?.toString();
  return normalizedId ? { ...product, id: normalizedId } : product;
};

const authRequestError = (error) => ({
  success: false,
  message: error instanceof TypeError
    ? `Unable to reach the authentication server at ${API_BASE_URL}. Check the API URL, server availability, and CORS settings.`
    : error.message || 'Authentication request failed. Please try again.'
});

const getAuthHeaders = () => {
  try {
    const stored = localStorage.getItem('nihara_auth');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed?.token) {
        return {
          'Authorization': `Bearer ${parsed.token}`,
          'x-user-role': parsed.user?.role || 'user'
        };
      }
    }
  } catch (e) {}
  return {};
};

// Safe request wrapper that requires the Express server/API.
async function request(endpoint, options = {}) {
  const authHeaders = getAuthHeaders();
  delete authHeaders['x-user-role'];
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...(options.headers || {})
    },
    ...options
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({ message: res.statusText }));
    const errorMessage = errData.message || errData.error || `HTTP ${res.status}: ${res.statusText || 'Server Error'}`;
    const error = new Error(errorMessage);
    error.status = res.status;
    error.statusCode = res.status;
    error.data = errData;
    throw error;
  }
  return await res.json();
}

export const api = {
  // Products
  async getProducts(params = {}) {
    const query = new URLSearchParams(params).toString();
    const serverRes = await request(`/products?${query}`);
    if (serverRes && Array.isArray(serverRes.data)) {
      return { ...serverRes, products: serverRes.data.map(normalizeProduct) };
    }
    throw new Error(serverRes?.message || 'Could not load products.');
  },

  async getProductById(id) {
    const serverRes = await request(`/products/${id}`);
    if (serverRes && serverRes.data) {
      return { ...serverRes, product: normalizeProduct(serverRes.data) };
    }
    throw new Error(serverRes?.message || 'Could not load product.');
  },

  // Categories
  async getCategories() {
    const serverRes = await request('/categories');
    if (serverRes && Array.isArray(serverRes.categories)) {
      return { ...serverRes, categories: serverRes.categories };
    }
    throw new Error(serverRes?.message || 'Could not load categories.');
  },

  async getOffers() {
    const serverRes = await request('/offers', {}, false);
    if (serverRes && Array.isArray(serverRes.offers)) return serverRes;
    throw new Error(serverRes?.message || 'Could not load active offers.');
  },

  async getCategoryBySlug(slug) {
    const serverRes = await request(`/categories/${slug}`);
    if (serverRes && serverRes.data) {
      return { ...serverRes, category: serverRes.data };
    }
    throw new Error(serverRes?.message || 'Could not load category.');
  },

  // Salon Services & Artists
  async getServices() {
    const serverRes = await request('/services');
    if (serverRes && Array.isArray(serverRes.data)) {
      return { ...serverRes, services: serverRes.data };
    }
    throw new Error(serverRes?.message || 'Could not load services.');
  },

  async getServiceById(id) {
    const serverRes = await request(`/services/${id}`);
    if (serverRes && serverRes.data) {
      return { ...serverRes, service: serverRes.data };
    }
    throw new Error(serverRes?.message || 'Could not load service.');
  },

  async getArtists() {
    const serverRes = await request('/artists');
    if (serverRes && Array.isArray(serverRes.data)) {
      return { ...serverRes, artists: serverRes.data };
    }
    throw new Error(serverRes?.message || 'Could not load artists.');
  },

  async getSalon() {
    const serverRes = await request('/salon');
    if (serverRes && serverRes.salon) return serverRes;
    throw new Error(serverRes?.message || 'Could not load salon.');
  },

  // Bookings
  async getBookings() {
    const serverRes = await request('/bookings');
    if (serverRes && serverRes.bookings) return serverRes;
    throw new Error(serverRes?.message || 'Could not load bookings.');
  },

  async createBooking(bookingData) {
    const serverRes = await request('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData)
    });
    if (serverRes && serverRes.booking) return serverRes;

    return serverRes || { success: false, message: 'Appointment could not be saved. Check your sign-in and backend connection.' };
  },

  async cancelBooking(bookingId) {
    const serverRes = await request(`/bookings/${bookingId}`, { method: 'DELETE' });
    if (serverRes) return serverRes;
    throw new Error(serverRes?.message || 'Could not cancel booking.');
  },

  // Cart
  async getCart() {
    const serverRes = await request('/cart', {}, false);
    if (serverRes && Array.isArray(serverRes.items)) return serverRes;
    throw new Error(serverRes?.message || 'Could not load your cart.');
  },

  async updateCartOnServer(items) {
    return await request('/cart', {
      method: 'PUT',
      body: JSON.stringify({ items })
    }, false);
  },

  // Wishlist
  async getWishlist() {
    const serverRes = await request('/profile/wishlist');
    if (serverRes && serverRes.wishlist) return serverRes;
    return { success: true, wishlist: [] };
  },

  async getMyWishlist() {
    const serverRes = await request('/profile/wishlist', {}, false);
    if (serverRes && Array.isArray(serverRes.wishlist)) return serverRes;
    throw new Error(serverRes?.message || 'Could not load your wishlist.');
  },

  async toggleWishlistOnServer(productId) {
    return await request(`/profile/wishlist/${productId}`, {
      method: 'POST'
    });
  },

  // Payment Gateway
  async getPaymentConfig() {
    return request('/payment/config');
  },

  async createRazorpayOrder(amount) {
    const serverRes = await request('/payment/create-order', {
      method: 'POST',
      body: JSON.stringify({ amount })
    });
    if (serverRes && serverRes.order) return serverRes;
    throw new Error(serverRes?.message || 'Could not create payment order.');
  },

  async verifyPayment(payload) {
    const serverRes = await request('/payment/verify', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    if (serverRes && serverRes.success) return serverRes;
    throw new Error(serverRes?.message || 'Could not verify payment.');
  },

  // Reviews
  async getReviews(productId) {
    const serverRes = await request(`/reviews?productId=${encodeURIComponent(productId)}`);
    if (serverRes && Array.isArray(serverRes.reviews)) return serverRes;
    throw new Error(serverRes?.message || 'Could not load reviews.');
  },

  async submitReview(productId, { rating, comment }) {
    const serverRes = await request('/reviews', {
      method: 'POST',
      body: JSON.stringify({ productId, rating, comment })
    });
    if (serverRes && serverRes.review) return serverRes;
    throw new Error(serverRes?.message || 'Could not save review.');
  },

  async deleteReview(reviewId) {
    const serverRes = await request(`/reviews/${reviewId}`, { method: 'DELETE' });
    if (serverRes) return serverRes;
    throw new Error(serverRes?.message || 'Could not delete review.');
  },

  // Orders
  async getOrders() {
    const serverRes = await request('/orders');
    if (serverRes && serverRes.orders) return serverRes;
    throw new Error(serverRes?.message || 'Could not load orders.');
  },

  async getMyOrders() {
    const serverRes = await request('/orders', {}, false);
    if (serverRes && Array.isArray(serverRes.orders)) return serverRes;
    throw new Error(serverRes?.message || 'Could not load your orders.');
  },

  async createOrder(orderData) {
    const serverRes = await request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
    if (serverRes && serverRes.order) return serverRes;

    return serverRes || { success: false, message: 'Order could not be saved. Check your sign-in and backend connection.' };
  },

  // Returns & Refunds
  async getReturns(type) {
    const query = type ? `?type=${encodeURIComponent(type)}` : '';
    return await request(`/returns${query}`, {}, false);
  },

  async getEligibleOrdersForReturn() {
    return await request('/returns/eligible-orders', {}, false);
  },

  async createReturn(payload) {
    return await request('/returns', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async cancelReturn(id) {
    return await request(`/returns/${id}/cancel`, {
      method: 'PATCH'
    });
  },

  // Profile & Addresses
  async getProfile() {
    const serverRes = await request('/profile', {}, false);
    if (serverRes && serverRes.user) return serverRes;
    throw new Error(serverRes?.message || 'Could not load your profile.');
  },

  async getCurrentUser() {
    const stored = JSON.parse(localStorage.getItem('nihara_auth') || 'null');
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: stored?.token ? { Authorization: `Bearer ${stored.token}` } : {}
    });
    const result = await response.json();
    if (!response.ok) {
      const error = new Error(result.message || 'Session validation failed');
      error.status = response.status;
      throw error;
    }
    if (result && typeof result === 'object' && typeof result.success !== 'boolean') {
      return { ...result, success: true };
    }
    return result;
  },

  async updateProfile(data) {
    const serverRes = await request('/profile/update', {
      method: 'PUT',
      body: JSON.stringify(data)
    }, false);
    if (serverRes && serverRes.user) return serverRes;
    throw new Error(serverRes?.message || 'Profile update failed.');
  },

  async uploadAvatar(file) {
    const authHeaders = getAuthHeaders();
    delete authHeaders['x-user-role'];
    const formData = new FormData();
    formData.append('avatar', file);

    const res = await fetch(`${API_BASE_URL}/profile/avatar`, {
      method: 'POST',
      headers: {
        ...authHeaders
      },
      body: formData
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(err.message || 'Avatar upload failed');
    }
    return await res.json();
  },

  async getAddresses() {
    const serverRes = await request('/profile/addresses');
    if (serverRes && serverRes.addresses) return serverRes;
    throw new Error(serverRes?.message || 'Could not load addresses.');
  },

  async addAddress(addressData) {
    const serverRes = await request('/profile/addresses', {
      method: 'POST',
      body: JSON.stringify(addressData)
    });
    if (serverRes && serverRes.address) return serverRes;
    throw new Error(serverRes?.message || 'Could not add address.');
  },

  async updateAddress(id, addressData) {
    const serverRes = await request(`/profile/addresses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(addressData)
    });
    if (serverRes && serverRes.address) return serverRes;
    throw new Error(serverRes?.message || 'Could not update address.');
  },

  async deleteAddress(id) {
    const serverRes = await request(`/profile/addresses/${id}`, {
      method: 'DELETE'
    });
    if (serverRes) return serverRes;
    throw new Error(serverRes?.message || 'Could not delete address.');
  },

  // Auth & Real OTP API
  async register(fullName, identifier) {
    try {
      const cleanEmail = identifier.trim().toLowerCase();
      const body = { fullName, email: cleanEmail };
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const result = await res.json();
      if (!result || typeof result !== 'object') {
        return { success: false, message: 'Authentication server returned an invalid response.' };
      }
      return {
        ...result,
        message: result.message || result.error,
        success: typeof result.success === 'boolean' ? result.success : res.ok
      };
    } catch (err) {
      return authRequestError(err);
    }
  },

  async login(identifier, password = '', role = 'user') {
    try {
      const cleanEmail = identifier.trim().toLowerCase();
      const body = { email: cleanEmail, password, role };
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const result = await res.json();
      if (!result || typeof result !== 'object') {
        return { success: false, message: 'Authentication server returned an invalid response.' };
      }
      return {
        ...result,
        message: result.message || result.error,
        success: typeof result.success === 'boolean' ? result.success : res.ok
      };
    } catch (err) {
      return authRequestError(err);
    }
  },

  async verifyOtp(email, otp) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const result = await res.json();
      if (!result || typeof result !== 'object') {
        return { success: false, message: 'Authentication server returned an invalid response.' };
      }
      return {
        ...result,
        message: result.message || result.error,
        success: typeof result.success === 'boolean' ? result.success : res.ok
      };
    } catch (err) {
      return authRequestError(err);
    }
  }
};
