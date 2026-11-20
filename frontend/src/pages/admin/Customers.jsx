import React, { useEffect, useMemo, useState } from 'react';
import {
  ShoppingBag, Eye, Mail, MapPin,
  Pencil, Trash2, Ban, ShieldCheck, LoaderCircle
} from 'lucide-react';
import useAdminStore from '../../store/useAdminStore';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { formatINR } from '../../utils/adminUtils';

const EMPTY_FORM = {
  name: '',
  phone: '',
  tier: 'Royal Member',
  rewardPoints: '0',
  role: 'user',
  isBlocked: false,
  blockedReason: ''
};

const orderDate = (order) => order.createdAt || order.date || '';
const orderTotal = (order) => Number(order.totalAmount ?? order.total) || 0;
const orderCustomerEmail = (order) => order.customerEmail || order.email || '';

export default function Customers() {
  const { darkMode, users, orders, loading, loadUsers, updateUser, deleteUser, addToast } = useAdminStore();

  const [statusFilter, setStatusFilter] = useState('All'); // All | Active | Blocked | Admins
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Per-user order stats + history, matched by userId first then email
  const orderStats = useMemo(() => {
    const map = new Map();
    const ensure = (key) => {
      if (!map.has(key)) map.set(key, { orderCount: 0, totalSpent: 0, orders: [] });
      return map.get(key);
    };
    orders.forEach((order) => {
      const keys = [order.userId && String(order.userId), orderCustomerEmail(order)].filter(Boolean);
      keys.forEach((key) => {
        const stats = ensure(key);
        stats.orderCount += 1;
        stats.totalSpent += orderTotal(order);
        stats.orders.push(order);
      });
    });
    return map;
  }, [orders]);

  const customers = useMemo(() => users.map((user) => {
    const stats = orderStats.get(String(user.id)) || orderStats.get(user.email) || { orderCount: 0, totalSpent: 0, orders: [] };
    return {
      ...user,
      orderCount: stats.orderCount,
      totalSpent: stats.totalSpent,
      customerOrders: stats.orders
    };
  }), [users, orderStats]);

  const filteredCustomers = useMemo(() => customers
    .filter((customer) => {
      if (statusFilter === 'Active') return !customer.isBlocked && customer.role !== 'admin';
      if (statusFilter === 'Blocked') return customer.isBlocked;
      if (statusFilter === 'Admins') return customer.role === 'admin';
      return true;
    }),
  [customers, statusFilter]);

  const openDetails = (customer) => {
    setSelectedCustomer(customer);
    setDetailsModalOpen(true);
  };

  const openEdit = (customer) => {
    setEditing(customer);
    setForm({
      name: customer.name || '',
      phone: customer.phone || '',
      tier: customer.tier || 'Royal Member',
      rewardPoints: String(customer.rewardPoints ?? 0),
      role: customer.role || 'user',
      isBlocked: Boolean(customer.isBlocked),
      blockedReason: customer.blockedReason || ''
    });
    setErrors({});
    setEditModalOpen(true);
  };

  const saveUser = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = 'Enter the customer name.';
    if (form.isBlocked && !form.blockedReason.trim()) nextErrors.blockedReason = 'Add a reason for blocking this account.';
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    const payload = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      tier: form.tier.trim() || 'Royal Member',
      rewardPoints: Number(form.rewardPoints) || 0,
      role: form.role,
      isBlocked: form.isBlocked,
      blockedReason: form.isBlocked ? form.blockedReason.trim() : ''
    };
    setSaving(true);
    const saved = await updateUser(editing.id, payload);
    setSaving(false);
    if (!saved) return;

    addToast({ type: 'success', message: `Updated “${payload.name}”` });
    setEditModalOpen(false);
    if (selectedCustomer?.id === editing.id) setSelectedCustomer(saved.user || { ...selectedCustomer, ...payload });
  };

  const toggleBlock = async (customer) => {
    const blocking = !customer.isBlocked;
    const reason = blocking ? window.prompt(`Reason for blocking ${customer.name || customer.email}:`, '') : '';
    if (blocking && reason === null) return;
    const saved = await updateUser(customer.id, {
      isBlocked: blocking,
      blockedReason: blocking ? (reason || 'Blocked by admin') : ''
    });
    if (saved) {
      addToast({ type: 'success', message: blocking ? `Blocked “${customer.name || customer.email}”` : `Unblocked “${customer.name || customer.email}”` });
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    const deleted = await deleteUser(pendingDelete.id);
    if (deleted) addToast({ type: 'success', message: `Deleted “${pendingDelete.name || pendingDelete.email}”` });
    setPendingDelete(null);
    setDetailsModalOpen(false);
  };

  const columns = [
    {
      key: 'name',
      header: 'Customer',
      sortable: true,
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 overflow-hidden"
            style={{
              background: row.role === 'admin'
                ? 'linear-gradient(135deg, #d9b45b, #b58a2a)'
                : darkMode ? '#2c2227' : '#f0ece7',
              color: row.role === 'admin' ? '#ffffff' : '#78716c',
            }}
          >
            {row.avatar
              ? <img src={row.avatar} alt="" className="h-full w-full object-cover" />
              : (val || row.email || '?').charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <span className="font-semibold block text-stone-900 dark:text-white truncate">
              {val || '—'}
              {row.role === 'admin' && <ShieldCheck className="inline w-3.5 h-3.5 ml-1 text-[#b58a2a]" />}
            </span>
            <span className="text-[11px] text-stone-400 block truncate">
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
          {val || '—'}
        </span>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      sortable: true,
      render: (val) => (
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
          val === 'admin'
            ? 'border-[#dfbc77] bg-[#fcf8ee] text-[#8d681b]'
            : 'border-stone-200 bg-stone-50 text-stone-500 dark:border-white/10 dark:bg-white/5 dark:text-stone-400'
        }`}>
          {val === 'admin' ? 'Admin' : 'Customer'}
        </span>
      ),
    },
    {
      key: 'isBlocked',
      header: 'Status',
      sortable: true,
      render: (val) => (
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
          val
            ? 'border-rose-200 bg-rose-50 text-rose-600'
            : 'border-emerald-200 bg-emerald-50 text-emerald-700'
        }`}>
          {val ? 'Blocked' : 'Active'}
        </span>
      ),
    },
    {
      key: 'orderCount',
      header: 'Orders',
      sortable: true,
      render: (val) => (
        <span className="text-xs font-semibold text-stone-800 dark:text-stone-200">
          {val} order{val === 1 ? '' : 's'}
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
      key: 'createdAt',
      header: 'Joined',
      sortable: true,
      render: (val) => (
        <span className="text-xs text-stone-500">
          {val ? new Date(val).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label={`View ${row.name || row.email}`}
            onClick={() => openDetails(row)}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-white/5 transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            type="button"
            aria-label={`Edit ${row.name || row.email}`}
            onClick={() => openEdit(row)}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-white/5 transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </button>
          {row.role !== 'admin' && (
            <>
              <button
                type="button"
                aria-label={row.isBlocked ? `Unblock ${row.name || row.email}` : `Block ${row.name || row.email}`}
                onClick={() => toggleBlock(row)}
                className={`p-1.5 rounded-lg transition-colors ${
                  row.isBlocked
                    ? 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
                    : 'text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30'
                }`}
              >
                <Ban className="w-4 h-4" />
              </button>
              <button
                type="button"
                aria-label={`Delete ${row.name || row.email}`}
                onClick={() => setPendingDelete(row)}
                className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  const surface = darkMode ? 'bg-[#1a1717] border-white/10' : 'bg-white border-[#e7dfd1]';
  const heading = darkMode ? 'text-white' : 'text-[#241b18]';
  const muted = darkMode ? 'text-stone-400' : 'text-stone-500';

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            className={`text-2xl sm:text-3xl font-bold tracking-tight ${heading}`}
            style={{ fontFamily: '"Cormorant Garamond", serif' }}
          >
            Customer directory
          </h1>
          <p className={`text-xs sm:text-sm mt-0.5 ${muted}`}>
            Manage accounts, roles, access, and review order history
          </p>
        </div>
      </div>

      {/* ── Filter Chips ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {['All', 'Active', 'Blocked', 'Admins'].map((tier) => (
          <button
            key={tier}
            onClick={() => setStatusFilter(tier)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
              statusFilter === tier
                ? 'bg-[#1e1519] text-white border-[#1e1519] dark:bg-amber-600 dark:border-amber-600 shadow-sm'
                : darkMode
                ? 'bg-[#181416] border-white/10 text-stone-400 hover:text-white'
                : 'bg-white border-[#e9e3dd] text-stone-600 hover:text-stone-900 shadow-sm'
            }`}
          >
            {tier}
          </button>
        ))}
      </div>

      {/* ── Customers Data Table ── */}
      <DataTable
        columns={columns}
        data={filteredCustomers}
        keyField="id"
        searchPlaceholder="Search name, email or phone..."
        searchKeys={['name', 'email', 'phone']}
        pageSize={10}
        emptyMessage={loading ? 'Loading customers…' : 'No customers found.'}
      />

      {/* ── Edit Customer Modal ── */}
      <Modal
        open={editModalOpen}
        onClose={() => !saving && setEditModalOpen(false)}
        title={`Edit ${editing?.name || editing?.email || 'customer'}`}
        subtitle="Update account details, role, and access."
      >
        <form className="space-y-4" onSubmit={saveUser} noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-200">
              Full name
              <input
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                maxLength={120}
                className="mt-1.5 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-800 outline-none transition focus:border-[#b58a2a] focus:ring-2 focus:ring-[#b58a2a]/20 dark:border-white/10 dark:bg-black/20 dark:text-white"
              />
              {errors.name && <span role="alert" className="mt-1 block text-[11px] font-medium text-rose-600">{errors.name}</span>}
            </label>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-200">
              Phone
              <input
                value={form.phone}
                onChange={(event) => setForm({ ...form, phone: event.target.value })}
                maxLength={20}
                className="mt-1.5 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-800 outline-none transition focus:border-[#b58a2a] focus:ring-2 focus:ring-[#b58a2a]/20 dark:border-white/10 dark:bg-black/20 dark:text-white"
              />
            </label>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-200">
              Tier
              <input
                value={form.tier}
                onChange={(event) => setForm({ ...form, tier: event.target.value })}
                maxLength={60}
                className="mt-1.5 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-800 outline-none transition focus:border-[#b58a2a] focus:ring-2 focus:ring-[#b58a2a]/20 dark:border-white/10 dark:bg-black/20 dark:text-white"
              />
            </label>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-200">
              Reward points
              <input
                type="number"
                min="0"
                step="1"
                value={form.rewardPoints}
                onChange={(event) => setForm({ ...form, rewardPoints: event.target.value })}
                className="mt-1.5 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-800 outline-none transition focus:border-[#b58a2a] focus:ring-2 focus:ring-[#b58a2a]/20 dark:border-white/10 dark:bg-black/20 dark:text-white"
              />
            </label>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-200">
              Role
              <select
                value={form.role}
                onChange={(event) => setForm({ ...form, role: event.target.value })}
                className="mt-1.5 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-800 outline-none transition focus:border-[#b58a2a] focus:ring-2 focus:ring-[#b58a2a]/20 dark:border-white/10 dark:bg-black/20 dark:text-white"
              >
                <option value="user">Customer</option>
                <option value="admin">Admin</option>
              </select>
            </label>
            <label className="flex items-end gap-2 pb-1 text-xs font-semibold text-stone-700 dark:text-stone-200">
              <input
                type="checkbox"
                checked={form.isBlocked}
                onChange={(event) => setForm({ ...form, isBlocked: event.target.checked })}
                className="h-4 w-4 accent-[#b58a2a]"
              />
              Block this account
            </label>
          </div>
          {form.isBlocked && (
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-200">
              Block reason
              <input
                value={form.blockedReason}
                onChange={(event) => setForm({ ...form, blockedReason: event.target.value })}
                maxLength={200}
                placeholder="e.g. Suspicious order activity"
                className="mt-1.5 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-800 outline-none transition focus:border-[#b58a2a] focus:ring-2 focus:ring-[#b58a2a]/20 dark:border-white/10 dark:bg-black/20 dark:text-white"
              />
              {errors.blockedReason && <span role="alert" className="mt-1 block text-[11px] font-medium text-rose-600">{errors.blockedReason}</span>}
            </label>
          )}
          <div className="flex justify-end gap-2 border-t border-stone-100 pt-4 dark:border-white/10">
            <button type="button" onClick={() => setEditModalOpen(false)} disabled={saving} className="rounded-xl border border-stone-200 px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-50 disabled:opacity-50 dark:border-white/10 dark:text-stone-300 dark:hover:bg-white/5">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-[#b58a2a] px-4 py-2 text-sm font-semibold text-white hover:bg-[#9d751e] disabled:cursor-wait disabled:opacity-60">
              {saving && <LoaderCircle className="h-4 w-4 animate-spin" />}
              Save changes
            </button>
          </div>
        </form>
      </Modal>

      {/* ── Customer Profile & Order History Modal ── */}
      <Modal
        open={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        title={selectedCustomer?.name || selectedCustomer?.email || 'Customer profile'}
        subtitle={`Lifetime value: ${formatINR(selectedCustomer?.totalSpent, { compact: false })} • ${selectedCustomer?.orderCount || 0} orders`}
      >
        {selectedCustomer && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className={`p-4 rounded-xl border ${surface}`}>
                <div className="flex items-center gap-2 text-xs font-bold text-stone-500 mb-2">
                  <Mail className="w-3.5 h-3.5" />
                  Contact info
                </div>
                <div className="text-xs text-stone-700 dark:text-stone-300 break-all">
                  Email: {selectedCustomer.email || '—'}
                </div>
                <div className="text-xs text-stone-700 dark:text-stone-300 mt-1">
                  Phone: {selectedCustomer.phone || '—'}
                </div>
                <div className="text-xs text-stone-700 dark:text-stone-300 mt-1">
                  Role: {selectedCustomer.role === 'admin' ? 'Admin' : 'Customer'}
                  {selectedCustomer.isBlocked && <span className="ml-2 font-bold text-rose-600">(Blocked)</span>}
                </div>
                {selectedCustomer.isBlocked && selectedCustomer.blockedReason && (
                  <div className="text-[11px] text-rose-500 mt-1">Reason: {selectedCustomer.blockedReason}</div>
                )}
              </div>

              <div className={`p-4 rounded-xl border ${surface}`}>
                <div className="flex items-center gap-2 text-xs font-bold text-stone-500 mb-2">
                  <MapPin className="w-3.5 h-3.5" />
                  Account
                </div>
                <div className="text-xs text-stone-700 dark:text-stone-300">
                  Tier: {selectedCustomer.tier || 'Royal Member'}
                </div>
                <div className="text-xs text-stone-700 dark:text-stone-300 mt-1">
                  Reward points: {selectedCustomer.rewardPoints || 0}
                </div>
                <div className="text-xs text-stone-700 dark:text-stone-300 mt-1">
                  Joined: {selectedCustomer.createdAt ? new Date(selectedCustomer.createdAt).toLocaleDateString('en-IN') : '—'}
                </div>
              </div>
            </div>

            {/* Past orders */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
                Order history ({(selectedCustomer.customerOrders || []).length})
              </h4>
              {(selectedCustomer.customerOrders || []).length === 0 ? (
                <div className={`rounded-xl border p-4 text-center text-xs ${muted}`}>
                  <ShoppingBag className="mx-auto mb-2 h-5 w-5 opacity-50" />
                  No orders yet for this customer.
                </div>
              ) : (
                <div className={`divide-y rounded-xl overflow-hidden border ${darkMode ? 'border-white/10 divide-white/10' : 'border-stone-200 divide-stone-100'}`}>
                  {selectedCustomer.customerOrders.map((ord) => (
                    <div key={ord.id} className="p-3.5 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-semibold text-stone-900 dark:text-white flex items-center gap-2">
                          <span>ORD-{String(ord.id).slice(-8).toUpperCase()}</span>
                          <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                            ord.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700' :
                            ord.status === 'Cancelled' ? 'bg-rose-50 text-rose-600' :
                            'bg-amber-50 text-amber-700'
                          }`}>{ord.status}</span>
                        </div>
                        <div className="text-[11px] text-stone-400 mt-0.5">
                          {orderDate(ord) ? new Date(orderDate(ord)).toLocaleDateString('en-IN') : '—'}
                          {' • '}
                          {(ord.items || []).map((i) => i.name).join(', ') || 'Items'}
                        </div>
                      </div>
                      <div className="font-serif font-bold text-sm text-[#b58a2a]">
                        {formatINR(orderTotal(ord), { compact: false })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-between gap-2">
              {selectedCustomer.role !== 'admin' && (
                <button
                  type="button"
                  onClick={() => {
                    const customer = selectedCustomer;
                    setDetailsModalOpen(false);
                    toggleBlock(customer);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    selectedCustomer.isBlocked
                      ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                      : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                  }`}
                >
                  {selectedCustomer.isBlocked ? 'Unblock account' : 'Block account'}
                </button>
              )}
              <div className="flex gap-2 ml-auto">
                <button
                  type="button"
                  onClick={() => {
                    const customer = selectedCustomer;
                    setDetailsModalOpen(false);
                    openEdit(customer);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-stone-200 dark:bg-stone-800"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setDetailsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-stone-200 dark:bg-stone-800"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Delete Confirmation ── */}
      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
        title={`Delete “${pendingDelete?.name || pendingDelete?.email || 'customer'}”?`}
        message="This permanently removes the account. Order history placed by this customer is kept for records. This cannot be undone."
        confirmText="Delete customer"
      />
    </div>
  );
}
