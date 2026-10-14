import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import {
  TrendingUp, Package, ShoppingBag, AlertTriangle, Sparkles,
  ArrowRight, Plus, Tag, Calendar, ExternalLink, CheckCircle2,
  Clock, IndianRupee, Layers
} from 'lucide-react';
import useAdminStore from '../../store/useAdminStore';
import StatCard from '../../components/admin/StatCard';
import ChartCard from '../../components/admin/ChartCard';
import { formatINR, calcMargin, formatDelta } from '../../utils/adminUtils';
import { generateDailyRevenue, recentActivities } from '../../data/analytics';

const COLLECTION_COLORS = {
  Jewellery: '#b58a2a',
  Makeup: '#c4425e',
  Nails: '#7a4fd1',
  Candles: '#d9801a',
};

export default function Overview() {
  const navigate = useNavigate();
  const { darkMode, products, orders, appointments, settings } = useAdminStore();

  // 30-day revenue data
  const revenueData = useMemo(() => generateDailyRevenue(30), []);

  const totalRevenue30d = useMemo(() => {
    return revenueData.reduce((acc, curr) => acc + curr.revenue, 0);
  }, [revenueData]);

  // Inventory value
  const totalInventoryVal = useMemo(() => {
    return products.reduce((acc, p) => acc + (p.price * (p.stock || 0)), 0);
  }, [products]);

  const liveProductsCount = useMemo(() => {
    return products.filter(p => p.status === 'Live').length;
  }, [products]);

  const ordersToShip = useMemo(() => {
    return orders.filter(o => o.status === 'Processing');
  }, [orders]);

  // Inventory breakdown by collection
  const collectionBreakdown = useMemo(() => {
    const map = {};
    products.forEach(p => {
      const col = p.collection || 'Other';
      if (!map[col]) map[col] = { name: col, value: 0, count: 0, items: [] };
      map[col].value += (p.price * (p.stock || 0));
      map[col].count += (p.stock || 0);
      map[col].items.push(p);
    });
    return Object.values(map);
  }, [products]);

  // Generate Today's To-Do list
  const todoItems = useMemo(() => {
    const list = [];
    const lowStockThreshold = settings.lowStockThreshold || 5;

    // 1. Orders to ship
    if (ordersToShip.length > 0) {
      list.push({
        id: 'orders-ship',
        title: `${ordersToShip.length} order${ordersToShip.length > 1 ? 's' : ''} waiting to be shipped`,
        desc: 'Review and mark as Shipped once dispatched',
        priority: 'high',
        icon: ShoppingBag,
        color: '#c4425e',
        actionText: 'View orders',
        onClick: () => navigate('/admin/orders?status=Processing'),
      });
    }

    // 2. Bookings today/tomorrow
    const todayStr = '2026-10-14';
    const tomorrowStr = '2026-10-15';
    const upcomingBookings = appointments.filter(
      a => (a.date === todayStr || a.date === tomorrowStr) && a.status !== 'Cancelled'
    );
    if (upcomingBookings.length > 0) {
      list.push({
        id: 'bookings-near',
        title: `${upcomingBookings.length} salon booking${upcomingBookings.length > 1 ? 's' : ''} scheduled for today/tomorrow`,
        desc: 'Confirm stylists and preparation kits',
        priority: 'medium',
        icon: Calendar,
        color: '#b58a2a',
        actionText: 'View appointments',
        onClick: () => navigate('/admin/appointments'),
      });
    }

    // 3. Out of stock but live
    const oosLive = products.filter(p => p.status === 'Live' && (p.stock === 0 || p.stock == null));
    if (oosLive.length > 0) {
      list.push({
        id: 'oos-live',
        title: `${oosLive.length} product${oosLive.length > 1 ? 's' : ''} out of stock but marked Live`,
        desc: 'Restock immediately or move to Draft to prevent customer disappointment',
        priority: 'high',
        icon: AlertTriangle,
        color: '#c4425e',
        actionText: 'View out of stock',
        onClick: () => navigate('/admin/products?filter=out_of_stock'),
      });
    }

    // 4. Low stock products
    const lowStock = products.filter(p => p.status === 'Live' && p.stock > 0 && p.stock <= lowStockThreshold);
    if (lowStock.length > 0) {
      list.push({
        id: 'low-stock',
        title: `${lowStock.length} product${lowStock.length > 1 ? 's' : ''} below low-stock threshold (≤ ${lowStockThreshold})`,
        desc: 'Reorder from artisan suppliers',
        priority: 'medium',
        icon: Package,
        color: '#d9801a',
        actionText: 'Review stock',
        onClick: () => navigate('/admin/products?filter=low_stock'),
      });
    }

    // 5. Products with no sales in 30 days
    const noSales = products.filter(p => p.status === 'Live' && (p.soldLast30 === 0 || !p.soldLast30));
    if (noSales.length > 0) {
      list.push({
        id: 'no-sales',
        title: `${noSales.length} live products with zero sales in the last 30 days`,
        desc: 'Consider applying a 20% discount or running a promo spotlight',
        priority: 'low',
        icon: Tag,
        color: '#7a4fd1',
        actionText: 'Optimize pricing',
        onClick: () => navigate('/admin/products?filter=no_sales'),
      });
    }

    // 6. Products below target margin
    const targetMargins = settings.targetMargins || { Jewellery: 18, Makeup: 45, Nails: 55, Candles: 60 };
    const belowMargin = products.filter(p => {
      const margin = calcMargin(p.cost, p.price);
      const target = targetMargins[p.collection] || 25;
      return margin < target;
    });
    if (belowMargin.length > 0) {
      list.push({
        id: 'below-margin',
        title: `${belowMargin.length} products pricing below target collection margin`,
        desc: 'Review supplier costs or raise retail price',
        priority: 'low',
        icon: TrendingUp,
        color: '#d9801a',
        actionText: 'Check margins',
        onClick: () => navigate('/admin/products?filter=below_margin'),
      });
    }

    return list;
  }, [ordersToShip, appointments, products, settings, navigate]);

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            className={`text-2xl sm:text-3xl font-bold tracking-tight ${
              darkMode ? 'text-white' : 'text-[#1e1519]'
            }`}
            style={{ fontFamily: '"Cormorant Garamond", serif' }}
          >
            Executive overview
          </h1>
          <p className={`text-xs sm:text-sm mt-0.5 ${darkMode ? 'text-stone-400' : 'text-stone-500'}`}>
            Real-time operations pulse for Nihara D'Aura luxury store and salon
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors ${
              darkMode
                ? 'border-white/10 text-stone-300 hover:bg-white/5'
                : 'border-[#e9e3dd] text-stone-700 bg-white hover:bg-stone-50 shadow-sm'
            }`}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Live store
          </a>
          <button
            onClick={() => navigate('/admin/products')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #d9b45b, #b58a2a)' }}
          >
            <Plus className="w-4 h-4" />
            Add product
          </button>
        </div>
      </div>

      {/* ── Hero Card: 30-day revenue with gold area chart ── */}
      <div
        className="rounded-[18px] p-6 sm:p-7 text-white relative overflow-hidden shadow-lg border border-white/10"
        style={{
          background: 'linear-gradient(135deg, #1e1519 0%, #2c1a25 50%, #1e1519 100%)',
        }}
      >
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-md">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-medium mb-3 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" />
              Last 30 days performance
            </div>
            <div
              className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-2"
              style={{ fontFamily: '"Cormorant Garamond", serif' }}
            >
              {formatINR(totalRevenue30d, { compact: false })}
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-white/80">
              <span className="inline-flex items-center font-semibold text-emerald-400">
                <TrendingUp className="w-4 h-4 mr-1" />
                +18.4%
              </span>
              <span>vs previous 30 days (₹19,45,000)</span>
            </div>
            <p className="text-xs text-white/50 mt-3">
              Combined online jewellery & makeup orders plus salon bridal suite reservations.
            </p>
          </div>

          {/* Sparkline / Mini Area chart */}
          <div className="w-full lg:w-[460px] h-[130px] pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 5, right: 5, left: 5, bottom: 0 }}>
                <defs>
                  <linearGradient id="heroGoldGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d9b45b" stopOpacity={0.65} />
                    <stop offset="95%" stopColor="#b58a2a" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-[#1e1519] border border-amber-500/30 p-2.5 rounded-xl shadow-xl text-xs text-white">
                          <div className="text-stone-400">{d.date}</div>
                          <div className="font-bold text-amber-300 font-serif text-sm">
                            {formatINR(d.revenue, { compact: false })}
                          </div>
                          <div className="text-[10px] text-stone-400">{d.orders} orders</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#d9b45b"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#heroGoldGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── 3 Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total inventory valuation"
          value={formatINR(totalInventoryVal, { compact: true })}
          delta={14.2}
          icon={IndianRupee}
          iconBg="linear-gradient(135deg, #d9b45b, #b58a2a)"
        />
        <StatCard
          label="Live products in catalog"
          value={liveProductsCount}
          delta={6.5}
          icon={Package}
          iconBg="linear-gradient(135deg, #1d8f6a, #156d50)"
        />
        <StatCard
          label="Orders waiting to ship"
          value={ordersToShip.length}
          delta={ordersToShip.length > 3 ? -12 : 0}
          icon={ShoppingBag}
          iconBg="linear-gradient(135deg, #c4425e, #962a42)"
        />
      </div>

      {/* ── Main 2-Column Section: Today's To-Do & Inventory by Collection ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Today's To-Do list (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <ChartCard
            title="Today's to-do"
            subtitle={`${todoItems.length} operational tasks requiring your attention`}
            action={
              <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium">
                Auto-generated
              </span>
            }
          >
            <div className="space-y-2.5">
              {todoItems.length === 0 ? (
                <div className="text-center py-8 text-stone-400 text-sm">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  All caught up! No urgent to-do items right now.
                </div>
              ) : (
                todoItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={item.onClick}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3.5 group hover:border-[#b58a2a] focus:outline-none focus:ring-2 focus:ring-[#b58a2a] ${
                        darkMode
                          ? 'bg-[#121010] border-white/5 hover:bg-white/[0.03]'
                          : 'bg-[#faf9f7] border-stone-200/70 hover:bg-white'
                      }`}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{
                          backgroundColor: `${item.color}18`,
                          color: item.color,
                        }}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4
                            className={`text-xs sm:text-sm font-semibold truncate ${
                              darkMode ? 'text-white' : 'text-stone-900'
                            }`}
                          >
                            {item.title}
                          </h4>
                          <span
                            className="text-[11px] font-medium flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ color: item.color }}
                          >
                            {item.actionText}
                            <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                        <p className={`text-xs mt-0.5 ${darkMode ? 'text-stone-400' : 'text-stone-500'}`}>
                          {item.desc}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </ChartCard>

          {/* Quick Actions Panel */}
          <div
            className={`rounded-[18px] border p-5 transition-all shadow-sm ${
              darkMode ? 'bg-[#181416] border-white/10' : 'bg-white border-[#e9e3dd]'
            }`}
          >
            <h3
              className={`text-lg font-bold mb-3 ${darkMode ? 'text-white' : 'text-[#1e1519]'}`}
              style={{ fontFamily: '"Cormorant Garamond", serif' }}
            >
              Quick actions
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                onClick={() => navigate('/admin/products')}
                className={`p-3 rounded-xl border text-center transition-all hover:border-[#b58a2a] ${
                  darkMode ? 'bg-[#121010] border-white/5 hover:bg-white/5' : 'bg-[#faf9f7] border-stone-200 hover:bg-stone-50'
                }`}
              >
                <Plus className="w-5 h-5 mx-auto mb-1 text-[#b58a2a]" />
                <span className={`block text-xs font-medium ${darkMode ? 'text-stone-300' : 'text-stone-700'}`}>
                  New product
                </span>
              </button>
              <button
                onClick={() => navigate('/admin/coupons')}
                className={`p-3 rounded-xl border text-center transition-all hover:border-[#b58a2a] ${
                  darkMode ? 'bg-[#121010] border-white/5 hover:bg-white/5' : 'bg-[#faf9f7] border-stone-200 hover:bg-stone-50'
                }`}
              >
                <Tag className="w-5 h-5 mx-auto mb-1 text-[#c4425e]" />
                <span className={`block text-xs font-medium ${darkMode ? 'text-stone-300' : 'text-stone-700'}`}>
                  Create coupon
                </span>
              </button>
              <button
                onClick={() => navigate('/admin/appointments')}
                className={`p-3 rounded-xl border text-center transition-all hover:border-[#b58a2a] ${
                  darkMode ? 'bg-[#121010] border-white/5 hover:bg-white/5' : 'bg-[#faf9f7] border-stone-200 hover:bg-stone-50'
                }`}
              >
                <Calendar className="w-5 h-5 mx-auto mb-1 text-[#7a4fd1]" />
                <span className={`block text-xs font-medium ${darkMode ? 'text-stone-300' : 'text-stone-700'}`}>
                  Book salon
                </span>
              </button>
              <button
                onClick={() => navigate('/admin/playbook')}
                className={`p-3 rounded-xl border text-center transition-all hover:border-[#b58a2a] ${
                  darkMode ? 'bg-[#121010] border-white/5 hover:bg-white/5' : 'bg-[#faf9f7] border-stone-200 hover:bg-stone-50'
                }`}
              >
                <Sparkles className="w-5 h-5 mx-auto mb-1 text-[#1d8f6a]" />
                <span className={`block text-xs font-medium ${darkMode ? 'text-stone-300' : 'text-stone-700'}`}>
                  Daily playbook
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Inventory Value by Collection & Recent Activity (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Inventory by Collection */}
          <ChartCard
            title="Inventory by collection"
            subtitle="Valuation distribution and units across catalog"
          >
            {/* Stacked bar visual */}
            <div className="h-4 rounded-full overflow-hidden flex mb-5 bg-stone-200 dark:bg-stone-800">
              {collectionBreakdown.map((col) => {
                const pct = totalInventoryVal > 0 ? (col.value / totalInventoryVal) * 100 : 0;
                return (
                  <div
                    key={col.name}
                    style={{
                      width: `${pct}%`,
                      backgroundColor: COLLECTION_COLORS[col.name] || '#8884d8',
                    }}
                    title={`${col.name}: ${pct.toFixed(1)}%`}
                    className="h-full transition-all"
                  />
                );
              })}
            </div>

            {/* List breakdown */}
            <div className="space-y-3">
              {collectionBreakdown.map((col) => {
                const color = COLLECTION_COLORS[col.name] || '#8884d8';
                const pct = totalInventoryVal > 0 ? (col.value / totalInventoryVal) * 100 : 0;
                return (
                  <div
                    key={col.name}
                    className="flex items-center justify-between text-xs py-1 border-b border-inherit last:border-none"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: color }}
                      />
                      <div>
                        <span className={`font-semibold ${darkMode ? 'text-white' : 'text-stone-900'}`}>
                          {col.name}
                        </span>
                        <span className="text-stone-400 ml-1.5">
                          ({col.count} units)
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold font-serif text-sm ${darkMode ? 'text-white' : 'text-stone-900'}`}>
                        {formatINR(col.value, { compact: true })}
                      </div>
                      <div className="text-[10px] text-stone-400">
                        {pct.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ChartCard>

          {/* Recent Activity */}
          <ChartCard
            title="Recent activity"
            subtitle="Live feed of orders, bookings, and updates"
          >
            <div className="space-y-3.5">
              {recentActivities.slice(0, 5).map((act) => (
                <div key={act.id} className="flex items-start gap-3 text-xs">
                  <div
                    className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                    style={{
                      backgroundColor:
                        act.type === 'order'
                          ? '#1d8f6a'
                          : act.type === 'booking'
                          ? '#7a4fd1'
                          : act.type === 'coupon'
                          ? '#c4425e'
                          : '#b58a2a',
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium ${darkMode ? 'text-stone-200' : 'text-stone-800'}`}>
                      {act.title}
                    </p>
                    <p className={`text-[11px] truncate ${darkMode ? 'text-stone-400' : 'text-stone-500'}`}>
                      {act.subtitle}
                    </p>
                  </div>
                  <span className="text-[10px] text-stone-400 whitespace-nowrap">
                    {act.time}
                  </span>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  );
}
