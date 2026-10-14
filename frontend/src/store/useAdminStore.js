import { create } from 'zustand';
import productsData from '../data/products';
import ordersData from '../data/orders';
import appointmentsData from '../data/appointments';
import couponsData from '../data/coupons';

// ── Helpers ──
const load = (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch { return fallback; }
};
const save = (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} };

const DEFAULT_SETTINGS = {
  storeName: "Nihara D'Aura",
  lowStockThreshold: 5,
  targetMargins: { Jewellery: 18, Makeup: 45, Nails: 55, Candles: 60 },
};

const useAdminStore = create((set, get) => ({
  // ── Theme ──
  darkMode: load('nda_dark', false),
  toggleDark: () => set(s => {
    const next = !s.darkMode;
    save('nda_dark', next);
    return { darkMode: next };
  }),

  // ── Settings ──
  settings: load('nda_settings', DEFAULT_SETTINGS),
  updateSettings: (patch) => set(s => {
    const next = { ...s.settings, ...patch };
    save('nda_settings', next);
    return { settings: next };
  }),
  resetSettings: () => {
    save('nda_settings', DEFAULT_SETTINGS);
    set({ settings: DEFAULT_SETTINGS });
  },

  // ── Products ──
  products: load('nda_products', productsData),
  setProducts: (products) => { save('nda_products', products); set({ products }); },
  addProduct: (p) => set(s => {
    const id = `PRD-${String(s.products.length + 1).padStart(3, '0')}`;
    const next = [{ ...p, id, createdAt: new Date().toISOString().split('T')[0], soldLast30: 0 }, ...s.products];
    save('nda_products', next);
    return { products: next };
  }),
  updateProduct: (id, patch) => set(s => {
    const next = s.products.map(p => p.id === id ? { ...p, ...patch } : p);
    save('nda_products', next);
    return { products: next };
  }),
  deleteProduct: (id) => set(s => {
    const next = s.products.filter(p => p.id !== id);
    save('nda_products', next);
    return { products: next };
  }),
  bulkUpdateProducts: (ids, patch) => set(s => {
    const next = s.products.map(p => ids.includes(p.id) ? { ...p, ...patch } : p);
    save('nda_products', next);
    return { products: next };
  }),
  bulkDeleteProducts: (ids) => set(s => {
    const next = s.products.filter(p => !ids.includes(p.id));
    save('nda_products', next);
    return { products: next };
  }),

  // ── Orders ──
  orders: load('nda_orders', ordersData),
  setOrders: (orders) => { save('nda_orders', orders); set({ orders }); },
  updateOrderStatus: (id, status) => set(s => {
    const next = s.orders.map(o => o.id === id ? { ...o, status } : o);
    save('nda_orders', next);
    return { orders: next };
  }),

  // ── Appointments ──
  appointments: load('nda_appointments', appointmentsData),
  setAppointments: (appointments) => { save('nda_appointments', appointments); set({ appointments }); },
  addAppointment: (a) => set(s => {
    const id = `APT-${500 + s.appointments.length + 1}`;
    const next = [{ ...a, id }, ...s.appointments];
    save('nda_appointments', next);
    return { appointments: next };
  }),
  updateAppointment: (id, patch) => set(s => {
    const next = s.appointments.map(a => a.id === id ? { ...a, ...patch } : a);
    save('nda_appointments', next);
    return { appointments: next };
  }),
  deleteAppointment: (id) => set(s => {
    const next = s.appointments.filter(a => a.id !== id);
    save('nda_appointments', next);
    return { appointments: next };
  }),

  // ── Coupons ──
  coupons: load('nda_coupons', couponsData),
  setCoupons: (coupons) => { save('nda_coupons', coupons); set({ coupons }); },
  addCoupon: (c) => set(s => {
    const id = `CPN-${String(s.coupons.length + 1).padStart(2, '0')}`;
    const next = [{ ...c, id, usedCount: 0, createdAt: new Date().toISOString().split('T')[0] }, ...s.coupons];
    save('nda_coupons', next);
    return { coupons: next };
  }),
  toggleCoupon: (id) => set(s => {
    const next = s.coupons.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c);
    save('nda_coupons', next);
    return { coupons: next };
  }),
  deleteCoupon: (id) => set(s => {
    const next = s.coupons.filter(c => c.id !== id);
    save('nda_coupons', next);
    return { coupons: next };
  }),

  // ── Playbook checklist ──
  checklist: load('nda_checklist', { date: null, items: {} }),
  toggleChecklistItem: (key) => set(s => {
    const today = new Date().toISOString().split('T')[0];
    let items = s.checklist.date === today ? { ...s.checklist.items } : {};
    items[key] = !items[key];
    const next = { date: today, items };
    save('nda_checklist', next);
    return { checklist: next };
  }),

  // ── Toasts ──
  toasts: [],
  addToast: (toast) => set(s => ({
    toasts: [...s.toasts, { id: Date.now(), ...toast }],
  })),
  removeToast: (id) => set(s => ({
    toasts: s.toasts.filter(t => t.id !== id),
  })),

  // ── Reset all demo data ──
  resetAllData: () => {
    ['nda_products', 'nda_orders', 'nda_appointments', 'nda_coupons', 'nda_settings', 'nda_checklist'].forEach(k => localStorage.removeItem(k));
    set({
      products: productsData,
      orders: ordersData,
      appointments: appointmentsData,
      coupons: couponsData,
      settings: DEFAULT_SETTINGS,
      checklist: { date: null, items: {} },
    });
  },

  // ── Backup / Restore ──
  exportData: () => {
    const s = get();
    return JSON.stringify({
      products: s.products,
      orders: s.orders,
      appointments: s.appointments,
      coupons: s.coupons,
      settings: s.settings,
    }, null, 2);
  },
  importData: (json) => {
    try {
      const d = JSON.parse(json);
      if (d.products) { save('nda_products', d.products); }
      if (d.orders) { save('nda_orders', d.orders); }
      if (d.appointments) { save('nda_appointments', d.appointments); }
      if (d.coupons) { save('nda_coupons', d.coupons); }
      if (d.settings) { save('nda_settings', d.settings); }
      set({
        ...(d.products && { products: d.products }),
        ...(d.orders && { orders: d.orders }),
        ...(d.appointments && { appointments: d.appointments }),
        ...(d.coupons && { coupons: d.coupons }),
        ...(d.settings && { settings: d.settings }),
      });
      return true;
    } catch { return false; }
  },
}));

export default useAdminStore;
