// Mock product data for Nihara D'Aura admin dashboard
// Collections: Jewellery (target margin 18%), Makeup (45%), Nails (55%), Candles (60%)

const products = [
  // ── JEWELLERY ──
  { id: 'PRD-001', name: 'Nihara 18K rose-gold choker', collection: 'Jewellery', sku: 'JWL-RGC-001', cost: 20100, price: 24500, stock: 7, status: 'Live', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400', soldLast30: 12, createdAt: '2026-06-15' },
  { id: 'PRD-002', name: 'Luminary diamond tennis choker', collection: 'Jewellery', sku: 'JWL-DTC-002', cost: 27000, price: 32900, stock: 4, status: 'Live', image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=400', soldLast30: 8, createdAt: '2026-05-20' },
  { id: 'PRD-003', name: '22K peacock jhumka earrings', collection: 'Jewellery', sku: 'JWL-PJE-003', cost: 14500, price: 17800, stock: 15, status: 'Live', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400', soldLast30: 22, createdAt: '2026-04-10' },
  { id: 'PRD-004', name: 'Bridal kundan haar set', collection: 'Jewellery', sku: 'JWL-BKH-004', cost: 38000, price: 46500, stock: 2, status: 'Live', image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400', soldLast30: 3, createdAt: '2026-07-01' },
  { id: 'PRD-005', name: 'Temple gold bangle pair', collection: 'Jewellery', sku: 'JWL-TGB-005', cost: 22000, price: 26800, stock: 9, status: 'Live', image: 'https://images.unsplash.com/photo-1610694955371-d4a3e0ce4b52?w=400', soldLast30: 6, createdAt: '2026-03-22' },
  { id: 'PRD-006', name: '24K gold pendant locket', collection: 'Jewellery', sku: 'JWL-GPL-006', cost: 8200, price: 10000, stock: 0, status: 'Live', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400', soldLast30: 0, createdAt: '2026-08-05' },
  { id: 'PRD-007', name: 'Polki diamond cocktail ring', collection: 'Jewellery', sku: 'JWL-PDR-007', cost: 12500, price: 15200, stock: 11, status: 'Live', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400', soldLast30: 14, createdAt: '2026-02-14' },
  { id: 'PRD-008', name: 'Antique gold nose pin set', collection: 'Jewellery', sku: 'JWL-ANP-008', cost: 3400, price: 4200, stock: 25, status: 'Draft', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400', soldLast30: 0, createdAt: '2026-09-10' },

  // ── MAKEUP ──
  { id: 'PRD-009', name: 'Glow velvet silk foundation', collection: 'Makeup', sku: 'MKP-GVF-009', cost: 1375, price: 2499, stock: 42, status: 'Live', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400', soldLast30: 38, createdAt: '2026-01-18' },
  { id: 'PRD-010', name: 'Midnight satin lipstick', collection: 'Makeup', sku: 'MKP-MSL-010', cost: 550, price: 999, stock: 65, status: 'Live', image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400', soldLast30: 54, createdAt: '2026-02-22' },
  { id: 'PRD-011', name: 'Royal shimmer eyeshadow palette', collection: 'Makeup', sku: 'MKP-RSE-011', cost: 825, price: 1499, stock: 28, status: 'Live', image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400', soldLast30: 19, createdAt: '2026-04-05' },
  { id: 'PRD-012', name: 'Rosé blush & highlighter duo', collection: 'Makeup', sku: 'MKP-RBH-012', cost: 700, price: 1299, stock: 34, status: 'Live', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400', soldLast30: 27, createdAt: '2026-05-12' },
  { id: 'PRD-013', name: 'Bridal matte lip set (4 shades)', collection: 'Makeup', sku: 'MKP-BML-013', cost: 1200, price: 2199, stock: 18, status: 'Live', image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400', soldLast30: 11, createdAt: '2026-06-30' },
  { id: 'PRD-014', name: 'Waterproof kajal duo pack', collection: 'Makeup', sku: 'MKP-WKD-014', cost: 280, price: 499, stock: 0, status: 'Live', image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400', soldLast30: 45, createdAt: '2026-03-15' },
  { id: 'PRD-015', name: 'Setting spray – dewy finish', collection: 'Makeup', sku: 'MKP-SSD-015', cost: 440, price: 799, stock: 3, status: 'Live', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400', soldLast30: 0, createdAt: '2026-08-20' },

  // ── NAILS ──
  { id: 'PRD-016', name: 'Rose quartz gel press-on kit', collection: 'Nails', sku: 'NAL-RQG-016', cost: 520, price: 1199, stock: 30, status: 'Live', image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=400', soldLast30: 16, createdAt: '2026-03-05' },
  { id: 'PRD-017', name: 'Chrome mirror nail art set', collection: 'Nails', sku: 'NAL-CMA-017', cost: 680, price: 1499, stock: 22, status: 'Live', image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=400', soldLast30: 9, createdAt: '2026-04-18' },
  { id: 'PRD-018', name: 'French tip soft-gel extensions', collection: 'Nails', sku: 'NAL-FTG-018', cost: 400, price: 899, stock: 40, status: 'Live', image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=400', soldLast30: 21, createdAt: '2026-05-25' },
  { id: 'PRD-019', name: 'Cuticle oil elixir (15 ml)', collection: 'Nails', sku: 'NAL-COE-019', cost: 180, price: 399, stock: 55, status: 'Live', image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=400', soldLast30: 32, createdAt: '2026-01-08' },
  { id: 'PRD-020', name: 'Bridal ombré press-on set', collection: 'Nails', sku: 'NAL-BOP-020', cost: 750, price: 1699, stock: 12, status: 'Live', image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=400', soldLast30: 5, createdAt: '2026-07-14' },
  { id: 'PRD-021', name: 'Holographic glitter set', collection: 'Nails', sku: 'NAL-HGS-021', cost: 350, price: 749, stock: 0, status: 'Draft', image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=400', soldLast30: 0, createdAt: '2026-09-01' },

  // ── CANDLES ──
  { id: 'PRD-022', name: 'Jasmine & amber soy candle', collection: 'Candles', sku: 'CND-JAS-022', cost: 480, price: 1199, stock: 20, status: 'Live', image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=400', soldLast30: 18, createdAt: '2026-02-28' },
  { id: 'PRD-023', name: 'Royal mogra reed diffuser', collection: 'Candles', sku: 'CND-RMR-023', cost: 520, price: 1299, stock: 14, status: 'Live', image: 'https://images.unsplash.com/photo-1605651202774-7d573fd3f12d?w=400', soldLast30: 10, createdAt: '2026-03-15' },
  { id: 'PRD-024', name: 'Sandalwood luxury wax melts', collection: 'Candles', sku: 'CND-SLW-024', cost: 320, price: 799, stock: 35, status: 'Live', image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=400', soldLast30: 14, createdAt: '2026-04-20' },
  { id: 'PRD-025', name: 'Lavender room mist (200 ml)', collection: 'Candles', sku: 'CND-LRM-025', cost: 240, price: 599, stock: 48, status: 'Live', image: 'https://images.unsplash.com/photo-1605651202774-7d573fd3f12d?w=400', soldLast30: 22, createdAt: '2026-05-10' },
  { id: 'PRD-026', name: 'Rose petal pillar candle set', collection: 'Candles', sku: 'CND-RPC-026', cost: 600, price: 1499, stock: 8, status: 'Live', image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=400', soldLast30: 7, createdAt: '2026-06-18' },
  { id: 'PRD-027', name: 'Oud & saffron jar candle', collection: 'Candles', sku: 'CND-OSJ-027', cost: 550, price: 1399, stock: 5, status: 'Live', image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=400', soldLast30: 0, createdAt: '2026-08-25' },
];

export default products;
