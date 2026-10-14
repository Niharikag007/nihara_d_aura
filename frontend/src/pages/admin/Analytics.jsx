import React, { useState, useMemo } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  TrendingUp, TrendingDown, IndianRupee, ShoppingBag, Users,
  Percent, ArrowRight, Lightbulb, Compass, Award, ExternalLink
} from 'lucide-react';
import useAdminStore from '../../store/useAdminStore';
import StatCard from '../../components/admin/StatCard';
import ChartCard from '../../components/admin/ChartCard';
import { formatINR } from '../../utils/adminUtils';
import { getMetricsForRange, revenueByCollection, topSellers, trafficSources } from '../../data/analytics';

const COLLECTION_COLORS = ['#b58a2a', '#c4425e', '#7a4fd1', '#d9801a'];

export default function Analytics() {
  const { darkMode } = useAdminStore();
  const [range, setRange] = useState(30); // 7 | 30 | 90

  const metrics = useMemo(() => getMetricsForRange(range), [range]);

  // Funnel calculations
  const funnelSteps = useMemo(() => {
    const f = metrics.funnel;
    const base = f.visitors || 1;
    return [
      { name: 'Visitors', count: f.visitors, pct: 100 },
      { name: 'Product views', count: f.productViews, pct: Math.round((f.productViews / base) * 100) },
      { name: 'Add to cart', count: f.addToCart, pct: Math.round((f.addToCart / base) * 100) },
      { name: 'Initiated checkout', count: f.checkouts, pct: Math.round((f.checkouts / base) * 100) },
      { name: 'Completed orders', count: f.orders, pct: Math.round((f.orders / base) * 100) },
    ];
  }, [metrics]);

  return (
    <div className="space-y-6">
      {/* ── Page Header & Range Switcher ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            className={`text-2xl sm:text-3xl font-bold tracking-tight ${
              darkMode ? 'text-white' : 'text-[#1e1519]'
            }`}
            style={{ fontFamily: '"Cormorant Garamond", serif' }}
          >
            Store analytics
          </h1>
          <p className={`text-xs sm:text-sm mt-0.5 ${darkMode ? 'text-stone-400' : 'text-stone-500'}`}>
            Financial reporting, customer conversion funnel, and performance insights
          </p>
        </div>

        {/* 7/30/90 Day Range Toggle */}
        <div
          className={`inline-flex p-1 rounded-xl border ${
            darkMode ? 'bg-[#181416] border-white/10' : 'bg-white border-[#e9e3dd] shadow-sm'
          }`}
        >
          {[7, 30, 90].map((days) => (
            <button
              key={days}
              onClick={() => setRange(days)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                range === days
                  ? 'bg-[#b58a2a] text-white shadow'
                  : darkMode
                  ? 'text-stone-400 hover:text-white'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Last {days} days
            </button>
          ))}
        </div>
      </div>

      {/* ── 4 KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Gross revenue"
          value={formatINR(metrics.revenue, { compact: false })}
          delta={metrics.revenueDelta}
          icon={IndianRupee}
          iconBg="linear-gradient(135deg, #d9b45b, #b58a2a)"
        />
        <StatCard
          label="Total orders"
          value={metrics.orders}
          delta={metrics.ordersDelta}
          icon={ShoppingBag}
          iconBg="linear-gradient(135deg, #1d8f6a, #156d50)"
        />
        <StatCard
          label="Average order value"
          value={formatINR(metrics.aov, { compact: true })}
          delta={metrics.aovDelta}
          icon={Award}
          iconBg="linear-gradient(135deg, #7a4fd1, #532c9e)"
        />
        <StatCard
          label="Conversion rate"
          value={`${metrics.conversionRate.toFixed(2)}%`}
          delta={metrics.conversionDelta}
          icon={Percent}
          iconBg="linear-gradient(135deg, #c4425e, #962a42)"
        />
      </div>

      {/* ── Revenue Area Chart & Orders Bar Chart ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Revenue Area Chart (7 cols) */}
        <div className="lg:col-span-7">
          <ChartCard
            title="Revenue trajectory"
            subtitle={`Daily revenue over selected ${range} days`}
          >
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={metrics.chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="analyticsGoldGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#b58a2a" stopOpacity={0.45} />
                      <stop offset="95%" stopColor="#b58a2a" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="label"
                    stroke={darkMode ? '#78716c' : '#a8a29e'}
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                  />
                  <YAxis
                    stroke={darkMode ? '#78716c' : '#a8a29e'}
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    tickFormatter={(v) => `₹${v >= 1000 ? `${Math.round(v / 1000)}k` : v}`}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-[#1e1519] border border-amber-500/30 p-2.5 rounded-xl shadow-xl text-xs text-white">
                            <div className="text-stone-400">{d.label} ({d.date})</div>
                            <div className="font-bold text-amber-300 font-serif text-sm">
                              {formatINR(d.revenue, { compact: false })}
                            </div>
                            <div className="text-stone-300">{d.orders} orders</div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#b58a2a"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#analyticsGoldGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {/* Orders Bar Chart (5 cols) */}
        <div className="lg:col-span-5">
          <ChartCard
            title="Daily orders volume"
            subtitle={`Order frequency across ${range} days`}
          >
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis
                    dataKey="label"
                    stroke={darkMode ? '#78716c' : '#a8a29e'}
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                    interval={Math.ceil(range / 7)}
                  />
                  <YAxis
                    stroke={darkMode ? '#78716c' : '#a8a29e'}
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-[#1e1519] border border-white/10 p-2.5 rounded-xl text-xs text-white">
                            <div className="text-stone-400">{d.date}</div>
                            <div className="font-bold text-white text-sm">
                              {d.orders} orders
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="orders" fill="#1d8f6a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      </div>

      {/* ── Shopper Funnel & Collection Donut ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Shopper Funnel (7 cols) */}
        <div className="lg:col-span-7">
          <ChartCard
            title="Shopper conversion funnel"
            subtitle="Step-by-step buyer dropoff and engagement"
          >
            <div className="space-y-3.5">
              {funnelSteps.map((step, idx) => (
                <div key={step.name}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className={`font-semibold ${darkMode ? 'text-white' : 'text-stone-800'}`}>
                      {step.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${darkMode ? 'text-stone-200' : 'text-stone-900'}`}>
                        {step.count.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[11px] text-stone-400">
                        ({step.pct}%)
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-3 rounded-full bg-stone-200 dark:bg-stone-800 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${step.pct}%`,
                        background:
                          idx === 0
                            ? '#7a4fd1'
                            : idx === 1
                            ? '#3b82f6'
                            : idx === 2
                            ? '#d9801a'
                            : idx === 3
                            ? '#b58a2a'
                            : '#1d8f6a',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        {/* Collection Donut (5 cols) */}
        <div className="lg:col-span-5">
          <ChartCard
            title="Revenue by collection"
            subtitle="Distribution of sales across lines"
          >
            <div className="h-[210px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenueByCollection}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {revenueByCollection.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLLECTION_COLORS[index % COLLECTION_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val) => [formatINR(val, { compact: false }), 'Revenue']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-inherit text-xs">
              {revenueByCollection.map((c, i) => (
                <div key={c.name} className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: COLLECTION_COLORS[i % COLLECTION_COLORS.length] }}
                  />
                  <span className={`truncate ${darkMode ? 'text-stone-300' : 'text-stone-700'}`}>{c.name}</span>
                  <span className="ml-auto font-bold font-serif text-[13px]">{formatINR(c.value, { compact: true })}</span>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>
      </div>

      {/* ── Top Sellers & Traffic Sources ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top Sellers Table (7 cols) */}
        <div className="lg:col-span-7">
          <ChartCard
            title="Top selling products"
            subtitle="High-volume catalog items ranked by units sold"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-inherit text-stone-400 font-semibold">
                    <th className="py-2.5 px-3">Product</th>
                    <th className="py-2.5 px-3">Collection</th>
                    <th className="py-2.5 px-3 text-right">Units sold</th>
                    <th className="py-2.5 px-3 text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-inherit">
                  {topSellers.map((item) => (
                    <tr key={item.id} className={darkMode ? 'hover:bg-white/[0.02]' : 'hover:bg-stone-50'}>
                      <td className="py-2.5 px-3 font-medium">{item.name}</td>
                      <td className="py-2.5 px-3 text-stone-400">{item.collection}</td>
                      <td className="py-2.5 px-3 text-right font-bold">{item.unitsSold}</td>
                      <td className="py-2.5 px-3 text-right font-serif font-bold text-amber-600 dark:text-amber-400">
                        {formatINR(item.revenue, { compact: true })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ChartCard>
        </div>

        {/* Traffic Sources & Insights (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <ChartCard
            title="Acquisition traffic"
            subtitle="Visitor channels and conversion efficiency"
          >
            <div className="space-y-3">
              {trafficSources.map((source) => (
                <div key={source.source} className="flex items-center justify-between text-xs">
                  <div>
                    <span className={`font-semibold ${darkMode ? 'text-white' : 'text-stone-900'}`}>
                      {source.source}
                    </span>
                    <div className="text-[11px] text-stone-400">
                      {source.visitors.toLocaleString('en-IN')} visitors
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {source.conversion} conv.
                    </span>
                    <div className="w-24 h-1.5 rounded-full bg-stone-200 dark:bg-stone-800 mt-1 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${parseFloat(source.conversion) * 15}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>

          {/* Auto-generated What To Do Next Insights */}
          <div
            className="rounded-[18px] border p-5 relative overflow-hidden"
            style={{
              background: darkMode
                ? 'linear-gradient(135deg, rgba(181, 138, 42, 0.1), rgba(30, 21, 25, 0.6))'
                : 'linear-gradient(135deg, #fbf7ee, #f5efe2)',
              borderColor: 'rgba(181, 138, 42, 0.3)',
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5 text-[#b58a2a]" />
              <h3
                className={`text-base font-bold ${darkMode ? 'text-amber-200' : 'text-[#1e1519]'}`}
                style={{ fontFamily: '"Cormorant Garamond", serif' }}
              >
                Algorithmic insights & advice
              </h3>
            </div>
            <ul className="space-y-2 text-xs text-stone-700 dark:text-stone-300">
              <li className="flex items-start gap-2">
                <span className="text-[#b58a2a] font-bold">•</span>
                <span>
                  <strong>Best selling weekday:</strong> Saturday and Sunday account for 44% of bridal jewellery volume. Schedule weekend flash promotions.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#b58a2a] font-bold">•</span>
                <span>
                  <strong>Hero collection:</strong> Makeup yields 48.2% gross margin, surpassing candles. Bundle foundation with velvet lipstick.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#b58a2a] font-bold">•</span>
                <span>
                  <strong>VIP retention:</strong> Repeat customers spend an average of ₹18,400 per order. Launch a private preview tier.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
