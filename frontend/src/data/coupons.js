// Mock coupons data for Nihara D'Aura admin

const coupons = [
  { id: 'CPN-01', code: 'NIHARA10', description: '10% off on all orders', type: 'percent', value: 10, minOrder: 1999, usageLimit: 500, usedCount: 187, isActive: true, validTill: '2026-12-31', createdAt: '2026-01-01' },
  { id: 'CPN-02', code: 'GLOW20', description: '20% off on makeup products', type: 'percent', value: 20, minOrder: 999, usageLimit: 300, usedCount: 224, isActive: true, validTill: '2026-11-30', createdAt: '2026-03-15' },
  { id: 'CPN-03', code: 'AURA30', description: '30% off for VIP customers', type: 'percent', value: 30, minOrder: 9999, usageLimit: 50, usedCount: 12, isActive: true, validTill: '2026-12-31', createdAt: '2026-06-01' },
  { id: 'CPN-04', code: 'BRIDAL15', description: '15% off on bridal jewellery', type: 'percent', value: 15, minOrder: 4999, usageLimit: 200, usedCount: 89, isActive: true, validTill: '2026-12-31', createdAt: '2026-04-10' },
  { id: 'CPN-05', code: 'FLAT500', description: '₹500 off on orders above ₹3,999', type: 'flat', value: 500, minOrder: 3999, usageLimit: 1000, usedCount: 456, isActive: true, validTill: '2026-12-31', createdAt: '2026-02-20' },
  { id: 'CPN-06', code: 'WELCOME', description: '₹200 off – first order only', type: 'flat', value: 200, minOrder: 999, usageLimit: 9999, usedCount: 1842, isActive: false, validTill: '2026-09-30', createdAt: '2025-12-01' },
];

export default coupons;
