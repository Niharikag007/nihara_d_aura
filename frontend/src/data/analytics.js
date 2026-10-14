// Mock analytics / time-series data for Nihara D'Aura admin dashboard

export function generateDailyRevenue(days) {
  const data = [];
  const now = new Date('2026-10-14');
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dayOfWeek = d.getDay();
    // Weekends sell more jewellery
    const base = dayOfWeek === 0 || dayOfWeek === 6 ? 28000 : 18000;
    const variance = Math.round((Math.random() - 0.3) * base * 0.6);
    const revenue = Math.max(2000, base + variance);
    const orderCount = Math.max(1, Math.round(revenue / 4500) + Math.floor(Math.random() * 3));
    data.push({
      date: d.toISOString().split('T')[0],
      label: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      revenue,
      orders: orderCount,
      visitors: Math.round(orderCount * (15 + Math.random() * 25)),
      productViews: Math.round(orderCount * (8 + Math.random() * 12)),
      addToCart: Math.round(orderCount * (3 + Math.random() * 5)),
      checkouts: Math.round(orderCount * (1.5 + Math.random() * 2)),
    });
  }
  return data;
}

export const dailyData = generateDailyRevenue(90);

export function getMetricsForRange(days) {
  const slice = dailyData.slice(-days);
  const prevSlice = dailyData.slice(-days * 2, -days);

  const sum = (arr, key) => arr.reduce((a, r) => a + r[key], 0);
  const avg = (arr, key) => (arr.length ? sum(arr, key) / arr.length : 0);

  const revenue = sum(slice, 'revenue');
  const prevRevenue = sum(prevSlice, 'revenue');
  const orders = sum(slice, 'orders');
  const prevOrders = sum(prevSlice, 'orders');
  const aov = orders ? revenue / orders : 0;
  const prevAov = prevOrders ? prevRevenue / prevOrders : 0;
  const visitors = sum(slice, 'visitors');
  const prevVisitors = sum(prevSlice, 'visitors');
  const conversionRate = visitors ? (orders / visitors) * 100 : 0;
  const prevConversionRate = prevVisitors ? (prevOrders / prevVisitors) * 100 : 0;

  const delta = (cur, prev) => (prev ? ((cur - prev) / prev) * 100 : 0);

  return {
    revenue, prevRevenue, revenueDelta: delta(revenue, prevRevenue),
    orders, prevOrders, ordersDelta: delta(orders, prevOrders),
    aov, prevAov, aovDelta: delta(aov, prevAov),
    conversionRate, prevConversionRate, conversionDelta: delta(conversionRate, prevConversionRate),
    visitors, prevVisitors,
    funnel: {
      visitors: sum(slice, 'visitors'),
      productViews: sum(slice, 'productViews'),
      addToCart: sum(slice, 'addToCart'),
      checkouts: sum(slice, 'checkouts'),
      orders,
    },
    chartData: slice,
  };
}

export const revenueByCollection = [
  { name: 'Jewellery', value: 487600, color: '#b58a2a' },
  { name: 'Makeup', value: 189400, color: '#c4425e' },
  { name: 'Nails', value: 94200, color: '#7a4fd1' },
  { name: 'Candles', value: 67800, color: '#d9801a' },
];

export const topSellers = [
  { id: 'PRD-009', name: 'Glow velvet silk foundation', collection: 'Makeup', unitsSold: 38, revenue: 94962 },
  { id: 'PRD-010', name: 'Midnight satin lipstick', collection: 'Makeup', unitsSold: 54, revenue: 53946 },
  { id: 'PRD-014', name: 'Waterproof kajal duo pack', collection: 'Makeup', unitsSold: 45, revenue: 22455 },
  { id: 'PRD-019', name: 'Cuticle oil elixir (15 ml)', collection: 'Nails', unitsSold: 32, revenue: 12768 },
  { id: 'PRD-012', name: 'Rosé blush & highlighter duo', collection: 'Makeup', unitsSold: 27, revenue: 35073 },
  { id: 'PRD-003', name: '22K peacock jhumka earrings', collection: 'Jewellery', unitsSold: 22, revenue: 391600 },
  { id: 'PRD-025', name: 'Lavender room mist (200 ml)', collection: 'Candles', unitsSold: 22, revenue: 13178 },
  { id: 'PRD-018', name: 'French tip soft-gel extensions', collection: 'Nails', unitsSold: 21, revenue: 18879 },
];

export const trafficSources = [
  { source: 'Instagram', sessions: 4820, visitors: 4820, percentage: 42, conversion: '3.4%' },
  { source: 'Google search', sessions: 2640, visitors: 2640, percentage: 23, conversion: '4.8%' },
  { source: 'Direct', sessions: 1950, visitors: 1950, percentage: 17, conversion: '5.2%' },
  { source: 'WhatsApp referral', sessions: 1260, visitors: 1260, percentage: 11, conversion: '6.1%' },
  { source: 'Facebook', sessions: 810, visitors: 810, percentage: 7, conversion: '2.1%' },
];

export const recentActivities = [
  { id: 1, type: 'order', title: 'New order #ORD-10041', subtitle: 'Priya Sharma • ₹17,800', time: '2m ago' },
  { id: 2, type: 'booking', title: 'Salon booking #APT-501', subtitle: 'Ananya Verma assigned • Royal bridal glow', time: '18m ago' },
  { id: 3, type: 'order', title: 'New order #ORD-10040', subtitle: 'Meera Reddy • ₹8,499', time: '1h ago' },
  { id: 4, type: 'coupon', title: 'VIP voucher redeemed', subtitle: 'NIHARA10 applied on checkout', time: '2h ago' },
  { id: 5, type: 'stock', title: 'Low stock warning', subtitle: '22K gold peacock jhumka (2 units left)', time: '4h ago' },
];

export const recentActivity = [
  { id: 1, type: 'order', message: 'Priya Sharma placed an order for ₹17,800', time: '2 hours ago', icon: 'shopping-bag' },
  { id: 2, type: 'order', message: 'Ananya Verma placed an order for ₹5,997', time: '3 hours ago', icon: 'shopping-bag' },
  { id: 3, type: 'booking', message: 'Meera Reddy booked Celebrity glam makeup for Oct 15', time: '5 hours ago', icon: 'calendar' },
  { id: 4, type: 'stock', message: 'Waterproof kajal duo pack is now out of stock', time: '6 hours ago', icon: 'alert-triangle' },
  { id: 5, type: 'coupon', message: 'Coupon GLOW20 used 224 times (75% of limit)', time: '1 day ago', icon: 'tag' },
  { id: 6, type: 'order', message: 'Aarav Singhania placed an order for ₹24,500', time: '1 day ago', icon: 'shopping-bag' },
  { id: 7, type: 'review', message: 'New 5-star review on 22K Peacock Jhumka', time: '2 days ago', icon: 'star' },
];
