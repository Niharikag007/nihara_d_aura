const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

async function request(path, options = {}) {
  let session;
  try {
    session = JSON.parse(localStorage.getItem('nihara_auth') || 'null');
  } catch {
    throw new Error('Saved sign-in data is invalid');
  }
  if (!session?.token || session.user?.role !== 'admin') {
    throw new Error('Please sign in with an administrator account');
  }

  const response = await fetch(`${API_BASE}/admin${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.token}`,
      ...options.headers
    }
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
    return request('/products', json('POST', product));
  },
  async updateProduct(id, patch) {
    return request(`/products/${encodeURIComponent(id)}`, json('PATCH', patch));
  },
  async deleteProduct(id) {
    return request(`/products/${encodeURIComponent(id)}`, { method: 'DELETE' });
  },
  async updateOrderStatus(id, status) {
    return request(`/orders/${encodeURIComponent(id)}`, json('PATCH', { status }));
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
  }
};

export default adminApi;
