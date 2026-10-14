// API abstraction layer for Nihara D'Aura Admin Dashboard
// Allows swapping mock data layer with a real backend (e.g. Express / NestJS / Supabase)

import productsData from '../data/products';
import ordersData from '../data/orders';
import appointmentsData from '../data/appointments';
import couponsData from '../data/coupons';
import { generateDailyRevenue, revenueByCollection, topSellers, trafficSources, funnelData } from '../data/analytics';

const simulateLatency = (ms = 80) => new Promise(res => setTimeout(res, ms));

export const adminApi = {
  // ── Products ──
  async getProducts() {
    await simulateLatency();
    const stored = localStorage.getItem('nda_products');
    return stored ? JSON.parse(stored) : productsData;
  },
  async createProduct(product) {
    await simulateLatency();
    return product;
  },
  async updateProduct(id, patch) {
    await simulateLatency();
    return { id, ...patch };
  },
  async deleteProduct(id) {
    await simulateLatency();
    return { success: true, id };
  },

  // ── Orders ──
  async getOrders() {
    await simulateLatency();
    const stored = localStorage.getItem('nda_orders');
    return stored ? JSON.parse(stored) : ordersData;
  },
  async updateOrderStatus(id, status) {
    await simulateLatency();
    return { id, status };
  },

  // ── Appointments ──
  async getAppointments() {
    await simulateLatency();
    const stored = localStorage.getItem('nda_appointments');
    return stored ? JSON.parse(stored) : appointmentsData;
  },
  async createAppointment(appointment) {
    await simulateLatency();
    return appointment;
  },
  async updateAppointment(id, patch) {
    await simulateLatency();
    return { id, ...patch };
  },
  async deleteAppointment(id) {
    await simulateLatency();
    return { success: true, id };
  },

  // ── Coupons ──
  async getCoupons() {
    await simulateLatency();
    const stored = localStorage.getItem('nda_coupons');
    return stored ? JSON.parse(stored) : couponsData;
  },
  async createCoupon(coupon) {
    await simulateLatency();
    return coupon;
  },
  async toggleCoupon(id) {
    await simulateLatency();
    return { id };
  },
  async deleteCoupon(id) {
    await simulateLatency();
    return { success: true, id };
  },

  // ── Analytics ──
  async getAnalytics(days = 30) {
    await simulateLatency();
    return {
      dailyRevenue: generateDailyRevenue(days),
      revenueByCollection,
      topSellers,
      trafficSources,
      funnelData,
    };
  },
};

export default adminApi;
