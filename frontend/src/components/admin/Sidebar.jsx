import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, BarChart3, Package, ShoppingBag, CalendarDays, Scissors, Layers, Boxes,
  Tag, Users, BookOpen, Settings, Moon, Sun, ChevronLeft, Sparkles
} from 'lucide-react';
import useAdminStore from '../../store/useAdminStore';

const navGroups = [
  {
    label: 'Run the store',
    items: [
      { to: '/admin', icon: LayoutDashboard, label: 'Overview', end: true },
      { to: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
    ],
  },
  {
    label: 'Manage',
    items: [
      { to: '/admin/products', icon: Package, label: 'Products', badgeKey: 'products' },
      { to: '/admin/categories', icon: Layers, label: 'Categories', badgeKey: 'categories' },
      { to: '/admin/inventory', icon: Boxes, label: 'Inventory', badgeKey: 'lowStock' },
      { to: '/admin/services', icon: Scissors, label: 'Services', badgeKey: 'services' },
      { to: '/admin/orders', icon: ShoppingBag, label: 'Orders', badgeKey: 'ordersToShip' },
      { to: '/admin/appointments', icon: CalendarDays, label: 'Appointments', badgeKey: 'upcoming' },
      { to: '/admin/coupons', icon: Tag, label: 'Coupons', badgeKey: 'activeCoupons' },
      { to: '/admin/customers', icon: Users, label: 'Customers' },
    ],
  },
  {
    label: 'Help',
    items: [
      { to: '/admin/playbook', icon: BookOpen, label: 'Playbook' },
      { to: '/admin/settings', icon: Settings, label: 'Settings' },
    ],
  },
];

export default function Sidebar({ collapsed, onCollapse }) {
  const { darkMode, toggleDark, products, categories, services, orders, appointments, coupons, settings } = useAdminStore();

  const badges = {
    products: products.length,
    categories: categories.length,
    lowStock: products.filter((product) => product.stock <= (settings.lowStockThreshold || 5)).length,
    services: services.length,
    ordersToShip: orders.filter(o => o.status === 'Processing').length,
    upcoming: appointments.filter(a => a.status === 'Confirmed' || a.status === 'Pending').length,
    activeCoupons: coupons.filter(c => c.isActive).length,
  };

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside
        className={`hidden lg:flex flex-col fixed left-0 top-0 bottom-0 z-40 transition-all duration-300 ${
          collapsed ? 'w-[72px]' : 'w-[252px]'
        }`}
        style={{ backgroundColor: darkMode ? '#0f0d0e' : '#1e1519' }}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-white/8 flex-shrink-0">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #d9b45b, #b58a2a)' }}>
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="font-serif font-bold text-white text-sm tracking-tight truncate" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
                Nihara D'Aura
              </div>
              <div className="text-[10px] text-white/40 font-medium" style={{ fontFamily: 'Manrope, sans-serif' }}>
                Admin console
              </div>
            </div>
          )}
          <button
            onClick={() => onCollapse?.(!collapsed)}
            className="ml-auto p-1.5 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronLeft className={`w-4 h-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Nav groups */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-6 scrollbar-none">
          {navGroups.map((group) => (
            <div key={group.label}>
              {!collapsed && (
                <div className="px-3 mb-2 text-[10px] font-semibold tracking-wider text-white/30 uppercase" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  {group.label}
                </div>
              )}
              <div className="space-y-0.5">
                {group.items.map(({ to, icon: Icon, label, badgeKey, end }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    className={({ isActive }) =>
                      `group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/50 ${
                        isActive
                          ? 'text-white shadow-lg'
                          : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                      }`
                    }
                    style={({ isActive }) =>
                      isActive ? { background: 'linear-gradient(135deg, #d9b45b, #b58a2a)', fontFamily: 'Manrope, sans-serif' } : { fontFamily: 'Manrope, sans-serif' }
                    }
                  >
                    <Icon className="w-[18px] h-[18px] flex-shrink-0" />
                    {!collapsed && <span className="truncate">{label}</span>}
                    {!collapsed && badgeKey && badges[badgeKey] > 0 && (
                      <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-md min-w-[20px] text-center ${
                        badgeKey === 'ordersToShip'
                          ? 'bg-rose-500/90 text-white'
                          : 'bg-white/15 text-white/70'
                      }`}>
                        {badges[badgeKey]}
                      </span>
                    )}
                    {collapsed && badgeKey && badges[badgeKey] > 0 && (
                      <span className={`absolute -top-0.5 -right-0.5 text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full ${
                        badgeKey === 'ordersToShip'
                          ? 'bg-rose-500 text-white'
                          : 'bg-white/20 text-white/70'
                      }`}>
                        {badges[badgeKey]}
                      </span>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Theme toggle */}
        <div className="px-3 py-3 border-t border-white/8 flex-shrink-0">
          <button
            onClick={toggleDark}
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-white/50 hover:text-white/80 hover:bg-white/5 transition-all w-full focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            style={{ fontFamily: 'Manrope, sans-serif' }}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
            {!collapsed && <span>{darkMode ? 'Light mode' : 'Dark mode'}</span>}
          </button>
        </div>
      </aside>

      {/* ── Mobile bottom nav ── */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t flex overflow-x-auto scrollbar-none safe-bottom"
        style={{
          backgroundColor: darkMode ? '#0f0d0e' : '#1e1519',
          borderColor: 'rgba(255,255,255,0.08)',
        }}
      >
        {navGroups.flatMap(g => g.items).map(({ to, icon: Icon, label, badgeKey, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `relative flex flex-col items-center gap-0.5 px-3 py-2 flex-shrink-0 text-[10px] font-medium transition-colors focus:outline-none ${
                isActive ? 'text-amber-400' : 'text-white/40'
              }`
            }
            style={{ fontFamily: 'Manrope, sans-serif' }}
          >
            <Icon className="w-5 h-5" />
            <span className="whitespace-nowrap">{label}</span>
            {badgeKey && badges[badgeKey] > 0 && (
              <span className={`absolute top-0.5 right-1 text-[8px] font-bold w-3.5 h-3.5 flex items-center justify-center rounded-full ${
                badgeKey === 'ordersToShip' ? 'bg-rose-500 text-white' : 'bg-white/20 text-white/70'
              }`}>
                {badges[badgeKey]}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
    </>
  );
}
