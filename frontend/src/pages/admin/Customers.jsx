import React, { useState, useMemo } from 'react';
import {
  Users, Crown, ShoppingBag, Eye, Phone, Mail, MapPin,
  Calendar, IndianRupee, Search, Award
} from 'lucide-react';
import useAdminStore from '../../store/useAdminStore';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import StatusPill from '../../components/admin/StatusPill';
import { formatINR } from '../../utils/adminUtils';

export default function Customers() {
  const { darkMode, orders } = useAdminStore();

  const [tagFilter, setTagFilter] = useState('All'); // All | VIP | Repeat | New
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  // Aggregate customers from orders
  const customers = useMemo(() => {
    const map = {};

    orders.forEach(o => {
      const key = o.email || o.customer;
      if (!map[key]) {
        map[key] = {
          id: key,
          name: o.customer,
          email: o.email || '—',
          phone: o.phone || '—',
          orderCount: 0,
          totalSpent: 0,
          lastOrderDate: o.date,
          orders: [],
          shippingAddress: o.shippingAddress,
        };
      }

      map[key].orderCount += 1;
      map[key].totalSpent += o.total;
      map[key].orders.push(o);
      if (new Date(o.date) > new Date(map[key].lastOrderDate)) {
        map[key].lastOrderDate = o.date;
      }
    });

    return Object.values(map).map(c => {
      let tag = 'New';
      if (c.totalSpent >= 50000) tag = 'VIP';
      else if (c.orderCount > 1) tag = 'Repeat';

      return {
        ...c,
        tag,
      };
    });
  }, [orders]);

  const filteredCustomers = useMemo(() => {
    if (tagFilter === 'All') return customers;
    return customers.filter(c => c.tag === tagFilter);
  }, [customers, tagFilter]);

  const openCustomerProfile = (customer) => {
    setSelectedCustomer(customer);
    setDetailsModalOpen(true);
  };

  const columns = [
    {
      key: 'name',
      header: 'Customer',
      sortable: true,
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0"
            style={{
              background:
                row.tag === 'VIP'
                  ? 'linear-gradient(135deg, #d9b45b, #b58a2a)'
                  : darkMode ? '#2c2227' : '#f0ece7',
              color: row.tag === 'VIP' ? '#ffffff' : '#78716c',
            }}
          >
            {val.charAt(0)}
          </div>
          <div>
            <span className="font-semibold block text-stone-900 dark:text-white">
              {val}
            </span>
            <span className="text-[11px] text-stone-400 block">
              {row.email}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Phone',
      render: (val) => (
        <span className="text-xs font-mono text-stone-600 dark:text-stone-400">
          {val}
        </span>
      ),
    },
    {
      key: 'orderCount',
      header: 'Orders',
      sortable: true,
      render: (val) => (
        <span className="text-xs font-semibold text-stone-800 dark:text-stone-200">
          {val} order{val > 1 ? 's' : ''}
        </span>
      ),
    },
    {
      key: 'totalSpent',
      header: 'Total spent',
      sortable: true,
      render: (val) => (
        <span className="font-serif font-bold text-sm text-[#1e1519] dark:text-stone-100">
          {formatINR(val, { compact: false })}
        </span>
      ),
    },
    {
      key: 'lastOrderDate',
      header: 'Last order',
      sortable: true,
      render: (val) => (
        <span className="text-xs text-stone-500">
          {val}
        </span>
      ),
    },
    {
      key: 'tag',
      header: 'Client tier',
      sortable: true,
      render: (val) => <StatusPill status={val} size="xs" />,
    },
    {
      key: 'actions',
      header: '',
      render: (_, row) => (
        <button
          type="button"
          aria-label={`View history for ${row.name}`}
          onClick={() => openCustomerProfile(row)}
          className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-white/5 transition-colors"
        >
          <Eye className="w-4 h-4" />
        </button>
      ),
    },
  ];

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
            Customer relationships
          </h1>
          <p className={`text-xs sm:text-sm mt-0.5 ${darkMode ? 'text-stone-400' : 'text-stone-500'}`}>
            Aggregated client directory, lifetime value metrics, and VIP tiering
          </p>
        </div>
      </div>

      {/* ── Tier Filter Chips ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {['All', 'VIP', 'Repeat', 'New'].map(tier => (
          <button
            key={tier}
            onClick={() => setTagFilter(tier)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
              tagFilter === tier
                ? 'bg-[#1e1519] text-white border-[#1e1519] dark:bg-amber-600 dark:border-amber-600 shadow-sm'
                : darkMode
                ? 'bg-[#181416] border-white/10 text-stone-400 hover:text-white'
                : 'bg-white border-[#e9e3dd] text-stone-600 hover:text-stone-900 shadow-sm'
            }`}
          >
            {tier === 'VIP' ? 'VIP (₹50k+)' : tier}
          </button>
        ))}
      </div>

      {/* ── Customers Data Table ── */}
      <DataTable
        columns={columns}
        data={filteredCustomers}
        keyField="id"
        searchPlaceholder="Search customer name, email or phone..."
        searchKeys={['name', 'email', 'phone']}
        pageSize={10}
        emptyMessage="No customers found in this tier."
      />

      {/* ── Customer Profile & Order History Modal ── */}
      <Modal
        open={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        title={selectedCustomer?.name || 'Customer profile'}
        subtitle={`Client tier: ${selectedCustomer?.tag} • Lifetime value: ${formatINR(selectedCustomer?.totalSpent, { compact: false })}`}
      >
        {selectedCustomer && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                className={`p-4 rounded-xl border ${
                  darkMode ? 'bg-[#121010] border-white/10' : 'bg-stone-50 border-stone-200'
                }`}
              >
                <div className="flex items-center gap-2 text-xs font-bold text-stone-500 mb-2">
                  <Mail className="w-3.5 h-3.5" />
                  Contact info
                </div>
                <div className="text-xs text-stone-700 dark:text-stone-300">
                  Email: {selectedCustomer.email}
                </div>
                <div className="text-xs text-stone-700 dark:text-stone-300 mt-1">
                  Phone: {selectedCustomer.phone}
                </div>
              </div>

              <div
                className={`p-4 rounded-xl border ${
                  darkMode ? 'bg-[#121010] border-white/10' : 'bg-stone-50 border-stone-200'
                }`}
              >
                <div className="flex items-center gap-2 text-xs font-bold text-stone-500 mb-2">
                  <MapPin className="w-3.5 h-3.5" />
                  Primary address
                </div>
                <div className="text-xs text-stone-700 dark:text-stone-300">
                  {selectedCustomer.shippingAddress || '14 Silver Crest Road, Defence Colony, New Delhi'}
                </div>
              </div>
            </div>

            {/* Past orders */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
                Order history ({selectedCustomer.orders.length})
              </h4>
              <div className="divide-y divide-inherit border rounded-xl overflow-hidden">
                {selectedCustomer.orders.map((ord) => (
                  <div key={ord.id} className="p-3.5 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-stone-900 dark:text-white flex items-center gap-2">
                        <span>{ord.id}</span>
                        <StatusPill status={ord.status} size="xs" />
                      </div>
                      <div className="text-[11px] text-stone-400 mt-0.5">
                        {ord.date} • {ord.items.map(i => i.name).join(', ')}
                      </div>
                    </div>
                    <div className="font-serif font-bold text-sm text-[#b58a2a]">
                      {formatINR(ord.total, { compact: false })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setDetailsModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-stone-200 dark:bg-stone-800"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
