import React, { useEffect, useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import { IndianRupee, ShoppingBag, Award, CalendarDays } from 'lucide-react';
import useAdminStore from '../../store/useAdminStore';
import adminApi from '../../api/adminApi';
import StatCard from '../../components/admin/StatCard';
import ChartCard from '../../components/admin/ChartCard';
import { formatINR } from '../../utils/adminUtils';

const COLORS = ['#b58a2a', '#c4425e', '#7a4fd1', '#d9801a', '#1d8f6a'];

export default function Analytics() {
  const darkMode = useAdminStore((state) => state.darkMode);
  const appointments = useAdminStore((state) => state.appointments);
  const [range, setRange] = useState(30);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    adminApi.getAnalytics(range).then((data) => {
      if (active) setAnalytics(data);
    }).catch((requestError) => {
      if (active) setError(requestError.message);
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [range]);

  const recentAppointments = appointments.filter((appointment) => {
    const date = new Date(appointment.date);
    const from = new Date();
    from.setDate(from.getDate() - range + 1);
    return !Number.isNaN(date.getTime()) && date >= from;
  }).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            className={`text-2xl sm:text-3xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-[#1e1519]'}`}
            style={{ fontFamily: '"Cormorant Garamond", serif' }}
          >
            Store analytics
          </h1>
          <p className={`text-xs sm:text-sm mt-0.5 ${darkMode ? 'text-stone-400' : 'text-stone-500'}`}>
            Actual order and appointment records stored in the database
          </p>
        </div>
        <div className={`inline-flex p-1 rounded-xl border ${darkMode ? 'bg-[#181416] border-white/10' : 'bg-white border-[#e9e3dd] shadow-sm'}`}>
          {[7, 30, 90].map((days) => (
            <button
              key={days}
              onClick={() => setRange(days)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                range === days ? 'bg-[#b58a2a] text-white shadow' : darkMode ? 'text-stone-400 hover:text-white' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Last {days} days
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          Could not load live analytics: {error}
        </div>
      )}

      {loading && !analytics ? (
        <div className="rounded-2xl border border-stone-200 bg-white p-8 text-center text-sm text-stone-500">
          Loading live analytics…
        </div>
      ) : analytics && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Gross order revenue" value={formatINR(analytics.revenue, { compact: false })} delta={analytics.revenueDelta} icon={IndianRupee} iconBg="linear-gradient(135deg, #d9b45b, #b58a2a)" />
            <StatCard label="Non-cancelled orders" value={analytics.orders} delta={analytics.ordersDelta} icon={ShoppingBag} iconBg="linear-gradient(135deg, #1d8f6a, #156d50)" />
            <StatCard label="Average order value" value={formatINR(analytics.aov, { compact: true })} delta={analytics.aovDelta} icon={Award} iconBg="linear-gradient(135deg, #7a4fd1, #532c9e)" />
            <StatCard label={`Appointments in last ${range} days`} value={recentAppointments} icon={CalendarDays} iconBg="linear-gradient(135deg, #c4425e, #962a42)" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7">
              <ChartCard title="Revenue trajectory" subtitle={`Actual order revenue over ${range} days`}>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analytics.chartData}>
                      <defs>
                        <linearGradient id="adminRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#b58a2a" stopOpacity={0.45} />
                          <stop offset="95%" stopColor="#b58a2a" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="label" stroke={darkMode ? '#78716c' : '#a8a29e'} tick={{ fontSize: 11 }} />
                      <YAxis stroke={darkMode ? '#78716c' : '#a8a29e'} tick={{ fontSize: 11 }} tickFormatter={(value) => `₹${Math.round(value / 1000)}k`} />
                      <Tooltip formatter={(value) => formatINR(value, { compact: false })} />
                      <Area type="monotone" dataKey="revenue" stroke="#b58a2a" strokeWidth={2} fill="url(#adminRevenueGradient)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>
            </div>
            <div className="lg:col-span-5">
              <ChartCard title="Daily order volume" subtitle={`Orders created over ${range} days`}>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.chartData}>
                      <XAxis dataKey="label" stroke={darkMode ? '#78716c' : '#a8a29e'} tick={{ fontSize: 10 }} interval={Math.ceil(range / 7)} />
                      <YAxis stroke={darkMode ? '#78716c' : '#a8a29e'} allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="orders" fill="#1d8f6a" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Revenue by collection" subtitle="Calculated from product line items in actual orders">
              {analytics.revenueByCollection.length ? (
                <div className="space-y-3">
                  {analytics.revenueByCollection.map((collection, index) => (
                    <div key={collection.name} className="flex items-center justify-between gap-3 text-sm">
                      <span className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                        {collection.name}
                      </span>
                      <strong>{formatINR(collection.value, { compact: false })}</strong>
                    </div>
                  ))}
                </div>
              ) : <p className="text-sm text-stone-500">No itemized order revenue recorded for this period.</p>}
            </ChartCard>

            <ChartCard title="Top selling products" subtitle="Ranked from order items in the selected period">
              {analytics.topSellers.length ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead><tr className="border-b border-inherit text-stone-400"><th className="py-2">Product</th><th className="py-2">Collection</th><th className="py-2 text-right">Units</th><th className="py-2 text-right">Revenue</th></tr></thead>
                    <tbody className="divide-y divide-inherit">
                      {analytics.topSellers.map((item) => (
                        <tr key={item.id}>
                          <td className="py-2 pr-2 font-medium">{item.name}</td>
                          <td className="py-2 text-stone-500">{item.collection}</td>
                          <td className="py-2 text-right">{item.unitsSold}</td>
                          <td className="py-2 text-right font-semibold">{formatINR(item.revenue)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : <p className="text-sm text-stone-500">No product sales recorded for this period.</p>}
            </ChartCard>
          </div>
        </>
      )}
    </div>
  );
}
