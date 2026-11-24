import { API_BASE_URL } from '../config/api.js';

async function request(path, options = {}, prefix = '/admin') {
  let session;
  try {
    session = JSON.parse(localStorage.getItem('nihara_auth') || 'null');
  } catch {
    throw new Error('Saved sign-in data is invalid');
  }
  if (!session?.token || session.user?.role !== 'admin') {
    throw new Error('Please sign in with an administrator account');
  }

  // Don't set Content-Type for FormData (let browser set it with boundary)
  const headers = {
    Authorization: `Bearer ${session.token}`,
    ...options.headers
  };

  // Only set Content-Type if not FormData
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE_URL}${prefix}${path}`, {
    ...options,
    headers
  });
  let result;
  try {
    result = await response.json();
  } catch {
    throw new Error(`Admin API returned an invalid response (${response.status})`);
  }
  if (!response.ok || result.success === false) {
    throw new Error(result.message || `Admin request failed (${response.status})`);
  }
  return result;
}

const json = (method, body) => ({ method, body: JSON.stringify(body) });

export const adminApi = {
  async getDashboard() {
    return request('/dashboard');
  },
  async createProduct(product) {
    // Handle FormData for file uploads
    if (product instanceof FormData) {
      return request('/products', { method: 'POST', body: product });
    }
    return request('/products', json('POST', product));
  },
  async updateProduct(id, patch) {
    // Handle FormData for file uploads
    if (patch instanceof FormData) {
      return request(`/products/${encodeURIComponent(id)}`, { method: 'PATCH', body: patch });
    }
    return request(`/products/${encodeURIComponent(id)}`, json('PATCH', patch));
  },
  async deleteProduct(id) {
    return request(`/products/${encodeURIComponent(id)}`, { method: 'DELETE' });
  },
  async updateOrder(id, patch) {
    return request(`/orders/${encodeURIComponent(id)}`, json('PATCH', patch));
  },
  async createAppointment(appointment) {
    return request('/appointments', json('POST', appointment));
  },
  async updateAppointment(id, patch) {
    return request(`/appointments/${encodeURIComponent(id)}`, json('PATCH', patch));
  },
  async deleteAppointment(id) {
    return request(`/appointments/${encodeURIComponent(id)}`, { method: 'DELETE' });
  },
  async createCoupon(coupon) {
    return request('/coupons', json('POST', coupon));
  },
  async updateCoupon(id, patch) {
    return request(`/coupons/${encodeURIComponent(id)}`, json('PATCH', patch));
  },
  async deleteCoupon(id) {
    return request(`/coupons/${encodeURIComponent(id)}`, { method: 'DELETE' });
  },
  async updateSettings(settings) {
    return request('/settings', json('PUT', settings));
  },
  async getAnalytics(days = 30) {
    return request(`/analytics?days=${days}`);
  },
  async getServices(category) {
    const query = category ? `?category=${encodeURIComponent(category)}` : '';
    return request(`/services${query}`);
  },
  async getCategories() {
    return request('/categories');
  },
  async createCategory(category) {
    return request('/categories', json('POST', category));
  },
  async updateCategory(id, patch) {
    return request(`/categories/${encodeURIComponent(id)}`, json('PATCH', patch));
  },
  async deleteCategory(id) {
    return request(`/categories/${encodeURIComponent(id)}`, { method: 'DELETE' });
  },
  async getInventoryAdjustments() {
    return request('/inventory/adjustments');
  },
  async adjustInventory(id, adjustment) {
    return request(`/inventory/${encodeURIComponent(id)}/adjustments`, json('POST', adjustment));
  },
  async createService(service) {
    return request('/services', json('POST', service));
  },
  async updateService(id, patch) {
    return request(`/services/${encodeURIComponent(id)}`, json('PATCH', patch));
  },
  async deleteService(id) {
    return request(`/services/${encodeURIComponent(id)}`, { method: 'DELETE' });
  },
  async getArtists() {
    const result = await request('', {}, '/artists');
    return {
      ...result,
      artists: (result.data || []).map((artist) => ({ ...artist, id: artist.id || artist._id }))
    };
  },
  async createArtist(artist) {
    const result = await request('', json('POST', artist), '/artists');
    const saved = result.data || result.artist || {};
    return { ...result, artist: { ...saved, id: saved.id || saved._id } };
  },
  async updateArtist(id, patch) {
    const result = await request(`/${encodeURIComponent(id)}`, json('PUT', patch), '/artists');
    const saved = result.data || result.artist || {};
    return { ...result, artist: { ...saved, id: saved.id || saved._id } };
  },
  async deleteArtist(id) {
    return request(`/${encodeURIComponent(id)}`, { method: 'DELETE' }, '/artists');
  },
  async getUsers() {
    return request('/users');
  },
  async updateUser(id, patch) {
    return request(`/users/${encodeURIComponent(id)}`, json('PATCH', patch));
  },
  async deleteUser(id) {
    return request(`/users/${encodeURIComponent(id)}`, { method: 'DELETE' });
  },
  async deleteOrder(id) {
    return request(`/orders/${encodeURIComponent(id)}`, { method: 'DELETE' });
  }
};

export default adminApi;
