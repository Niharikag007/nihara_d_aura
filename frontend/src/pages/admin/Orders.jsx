import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ShoppingBag, Search, Eye, Download, CheckCircle, Clock,
  Truck, XCircle, User, Phone, MapPin, CreditCard, ChevronRight, Trash2
} from 'lucide-react';
import useAdminStore from '../../store/useAdminStore';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import StatusPill from '../../components/admin/StatusPill';
import { formatINR } from '../../utils/adminUtils';

const ORDER_STATUSES = ['All', 'Processing', 'Packed', 'Shipped', 'Delivered', 'Cancelled'];
const PAYMENT_STATUSES = ['Pending', 'Paid', 'Failed', 'Refunded'];

const orderDisplayId = (order) => order.orderId || `ORD-${String(order.id).slice(-8).toUpperCase()}`;
const orderDate = (order) => order.date || (order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN') : '—');
const orderCustomer = (order) => order.customer || order.customerName || 'Guest';
const orderEmail = (order) => order.email || order.customerEmail || '';
const orderPhone = (order) => order.phone || order.customerPhone || '';
const orderTotal = (order) => order.total ?? order.totalAmount ?? 0;
const orderItems = (order) => (order.items || []).map((item) => ({
  ...item,
  qty: item.qty ?? item.quantity ?? 1,
  price: item.price ?? 0,
}));
const formatAddress = (address) => {
  if (!address) return '';
  if (typeof address === 'string') return address;
  return [address.street, address.city, address.state, address.pincode || address.postalCode, address.country]
    .filter(Boolean)
    .join(', ');
};

export default function Orders() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { darkMode, orders, updateOrderStatus, updateOrderDetails, deleteOrder, addToast } = useAdminStore();

  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [fulfillmentForm, setFulfillmentForm] = useState({ carrier: '', trackingNumber: '', paymentStatus: '' });
  const [savingFulfillment, setSavingFulfillment] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);

  // Read URL query params (e.g. from Overview to-do link)
  useEffect(() => {
    const statusParam = searchParams.get('status');
    if (statusParam && ORDER_STATUSES.includes(statusParam)) {
      setStatusFilter(statusParam);
    }
  }, [searchParams]);

  // Orders with derived display fields so search/sort work on real API shape
  const displayOrders = useMemo(() => orders.map((order) => ({
    ...order,
    customer: orderCustomer(order),
    phone: orderPhone(order),
    email: orderEmail(order),
    total: orderTotal(order),
    date: orderDate(order),
  })), [orders]);

  // Counts by status
  const statusCounts = useMemo(() => {
    const counts = { All: displayOrders.length };
    ORDER_STATUSES.forEach(st => {
      if (st !== 'All') {
        counts[st] = displayOrders.filter(o => o.status === st).length;
      }
    });
    return counts;
  }, [displayOrders]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    if (statusFilter === 'All') return displayOrders;
    return displayOrders.filter(o => o.status === statusFilter);
  }, [displayOrders, statusFilter]);

  const handleStatusChange = async (orderId, newStatus) => {
    const updated = await updateOrderStatus(orderId, newStatus);
    if (updated) {
      if (selectedOrder?.id === orderId) setSelectedOrder(updated.order);
      addToast({
        type: 'success',
        message: `Order ${orderId} status changed to ${newStatus}`,
      });
    }
  };

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setFulfillmentForm({
      carrier: order.carrier || '',
      trackingNumber: order.trackingNumber || '',
      paymentStatus: PAYMENT_STATUSES.includes(order.paymentStatus) ? order.paymentStatus : 'Pending'
    });
    setDetailsModalOpen(true);
  };

  const confirmDeleteOrder = async () => {
    if (!pendingDelete) return;
    const deleted = await deleteOrder(pendingDelete.id);
    if (deleted) {
      addToast({ type: 'success', message: `Order ${orderDisplayId(pendingDelete)} deleted` });
      if (selectedOrder?.id === pendingDelete.id) setDetailsModalOpen(false);
    }
    setPendingDelete(null);
  };

  const saveFulfillment = async () => {
    setSavingFulfillment(true);
    const updated = await updateOrderDetails(selectedOrder.id, fulfillmentForm);
    setSavingFulfillment(false);
    if (!updated) return;
    setSelectedOrder(updated.order);
    addToast({ type: 'success', message: `Fulfillment details saved for ${selectedOrder.orderId || selectedOrder.id}` });
  };

  const columns = [
    {
      key: 'id',
      header: 'Order ID',
      sortable: true,
      render: (val, row) => (
        <div>
          <span className="font-mono font-bold text-xs text-[#b58a2a] block">
            {orderDisplayId(row)}
          </span>
          <span className="text-[11px] text-stone-400">
            {orderDate(row)}
          </span>
        </div>
      ),
    },
    {
      key: 'customer',
      header: 'Customer',
      sortable: true,
      render: (val, row) => (
        <div>
          <span className="font-semibold block text-stone-900 dark:text-white">
            {orderCustomer(row)}
          </span>
          <span className="text-[11px] text-stone-400 block">
            {orderPhone(row) || orderEmail(row)}
          </span>
        </div>
      ),
    },
    {
      key: 'items',
      header: 'Items purchased',
      render: (_, row) => {
        const items = orderItems(row);
        return (
          <div className="max-w-[220px]">
            <span className="font-medium text-xs block truncate">
              {items.map(i => `${i.name} (×${i.qty})`).join(', ')}
            </span>
            <span className="text-[11px] text-stone-400">
              {items.reduce((a, c) => a + c.qty, 0)} total items
            </span>
          </div>
        );
      },
    },
    {
      key: 'total',
      header: 'Amount',
      sortable: true,
      render: (_, row) => (
        <span className="font-serif font-bold text-sm text-[#1e1519] dark:text-stone-100">
          {formatINR(orderTotal(row), { compact: false })}
        </span>
      ),
    },
    {
      key: 'paymentMethod',
      header: 'Payment',
      render: (val) => (
        <span className="text-xs text-stone-600 dark:text-stone-400">
          {val || 'Prepaid UPI'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Fulfillment status',
      sortable: true,
      render: (val, row) => (
        <div className="flex items-center gap-2">
          <StatusPill status={val} size="xs" />
          <select
            value={val}
            onChange={(e) => handleStatusChange(row.id, e.target.value)}
            className={`text-[11px] font-medium py-1 px-2 rounded-lg border focus:outline-none focus:ring-1 focus:ring-[#b58a2a] cursor-pointer ${
              darkMode
                ? 'bg-[#181416] border-white/10 text-stone-300'
                : 'bg-stone-50 border-stone-200 text-stone-700'
            }`}
          >
            <option value="Processing">Processing</option>
            <option value="Packed">Packed</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label={`View details of order ${orderDisplayId(row)}`}
            onClick={() => openOrderDetails(row)}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-white/5 transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            type="button"
            aria-label={`Delete order ${orderDisplayId(row)}`}
            onClick={() => setPendingDelete(row)}
            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
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
            Orders & shipments
          </h1>
          <p className={`text-xs sm:text-sm mt-0.5 ${darkMode ? 'text-stone-400' : 'text-stone-500'}`}>
            Track customer orders, manage shipments, and view customer invoices
          </p>
        </div>
      </div>

      {/* ── Status Chips with Counts ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {ORDER_STATUSES.map(st => {
          const count = statusCounts[st] || 0;
          const isActive = statusFilter === st;
          return (
            <button
              key={st}
              onClick={() => {
                setStatusFilter(st);
                if (st === 'All') setSearchParams({});
                else setSearchParams({ status: st });
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border flex items-center gap-2 ${
                isActive
                  ? 'bg-[#1e1519] text-white border-[#1e1519] dark:bg-amber-600 dark:border-amber-600 shadow-sm'
                  : darkMode
                  ? 'bg-[#181416] border-white/10 text-stone-400 hover:text-white'
                  : 'bg-white border-[#e9e3dd] text-stone-600 hover:text-stone-900 shadow-sm'
              }`}
            >
              <span>{st}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : st === 'Processing' && count > 0
                    ? 'bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400'
                    : 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Orders Data Table ── */}
      <DataTable
        columns={columns}
        data={filteredOrders}
        keyField="id"
        searchPlaceholder="Search order ID, customer name or phone..."
        searchKeys={['id', 'customer', 'phone', 'email']}
        pageSize={10}
        emptyMessage="No orders found for this status."
      />

      {/* ── Order Details Modal ── */}
      <Modal
        open={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        title={`Order details • ${selectedOrder ? orderDisplayId(selectedOrder) : ''}`}
        subtitle={`Placed on ${selectedOrder ? orderDate(selectedOrder) : ''} • Status: ${selectedOrder?.status}`}
      >
        {selectedOrder && (
          <div className="space-y-6">
            {/* Customer & Shipping Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                className={`p-4 rounded-xl border ${
                  darkMode ? 'bg-[#121010] border-white/10' : 'bg-stone-50 border-stone-200'
                }`}
              >
                <div className="flex items-center gap-2 text-xs font-bold text-stone-500 mb-2">
                  <User className="w-3.5 h-3.5" />
                  Customer details
                </div>
                <div className="text-sm font-semibold">{orderCustomer(selectedOrder)}</div>
                <div className="text-xs text-stone-500 mt-0.5">{orderEmail(selectedOrder)}</div>
                <div className="text-xs text-stone-500">{orderPhone(selectedOrder)}</div>
              </div>

              <div
                className={`p-4 rounded-xl border ${
                  darkMode ? 'bg-[#121010] border-white/10' : 'bg-stone-50 border-stone-200'
                }`}
              >
                <div className="flex items-center gap-2 text-xs font-bold text-stone-500 mb-2">
                  <MapPin className="w-3.5 h-3.5" />
                  Delivery address
                </div>
                <div className="text-xs text-stone-700 dark:text-stone-300">
                  {formatAddress(selectedOrder.shippingAddress) || '14 Silver Crest Road, Defence Colony, New Delhi - 110024'}
                </div>
                <div className="mt-2 text-[11px] text-stone-500 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5" />
                  Payment: {selectedOrder.paymentMethod || 'UPI / NetBanking'}
                </div>
                <div className="mt-1 text-[11px] text-stone-500">
                Payment status: {selectedOrder.paymentStatus || 'Not recorded'}
                </div>
                {selectedOrder.trackingNumber && (
                <div className="mt-1 text-[11px] text-stone-500">
                  Tracking: {selectedOrder.carrier ? `${selectedOrder.carrier} · ` : ''}{selectedOrder.trackingNumber}
                </div>
                )}
              </div>
            </div>

            {/* Line items list */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
                Order line items
              </h4>
              <div className="divide-y divide-inherit border rounded-xl overflow-hidden">
                {orderItems(selectedOrder).map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-stone-900 dark:text-white">
                        {item.name}
                      </div>
                      <div className="text-[11px] text-stone-400">
                        SKU: {item.productId} • Qty: {item.qty}
                      </div>
                    </div>
                    <div className="font-serif font-bold text-sm">
                      {formatINR(item.price * item.qty, { compact: false })}
                    </div>
                  </div>
                ))}
              </div>
              {selectedOrder?.paymentMethod === 'COD' && selectedOrder?.paymentStatus !== 'Paid' && selectedOrder?.paymentStatus !== 'Refunded' && (
                <p className="mt-2 text-[11px] text-amber-600">
                  COD order — collect payment on delivery, then mark payment as Paid.
                </p>
              )}
            </div>

            <section className={`space-y-3 rounded-xl border p-4 ${darkMode ? 'border-white/10 bg-[#121010]' : 'border-stone-200 bg-stone-50'}`}>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">Shipment & payment controls</h4>
              <div className="grid gap-3 sm:grid-cols-3">
                <label className="text-xs font-semibold">
                  <span className="mb-1 block">Carrier</span>
                  <input value={fulfillmentForm.carrier} maxLength={120} onChange={(event) => setFulfillmentForm((form) => ({ ...form, carrier: event.target.value }))} placeholder="Courier partner" className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs dark:border-white/10 dark:bg-[#181416] dark:text-white" />
                </label>
                <label className="text-xs font-semibold">
                  <span className="mb-1 block">Tracking number</span>
                  <input value={fulfillmentForm.trackingNumber} maxLength={120} onChange={(event) => setFulfillmentForm((form) => ({ ...form, trackingNumber: event.target.value }))} placeholder="Shipment reference" className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs dark:border-white/10 dark:bg-[#181416] dark:text-white" />
                </label>
                <label className="text-xs font-semibold">
                  <span className="mb-1 block">Payment status</span>
                  <select value={fulfillmentForm.paymentStatus} onChange={(event) => setFulfillmentForm((form) => ({ ...form, paymentStatus: event.target.value }))} className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs dark:border-white/10 dark:bg-[#181416] dark:text-white">
                    {PAYMENT_STATUSES.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="flex justify-end">
                <button type="button" onClick={saveFulfillment} disabled={savingFulfillment} className="rounded-lg bg-[#b58a2a] px-4 py-2 text-xs font-semibold text-white disabled:opacity-60">
                  {savingFulfillment ? 'Saving…' : 'Save fulfillment details'}
                </button>
              </div>
            </section>

            {/* Total breakdown */}
            <div className="pt-3 border-t border-inherit flex flex-col items-end gap-1 text-xs">
              <div className="flex justify-between w-48 text-stone-500">
                <span>Subtotal:</span>
                <span>{formatINR(orderTotal(selectedOrder), { compact: false })}</span>
              </div>
              <div className="flex justify-between w-48 text-stone-500">
                <span>Shipping:</span>
                <span className="text-emerald-600 font-medium">Free (Luxury tier)</span>
              </div>
              <div className="flex justify-between w-48 text-sm font-bold pt-2 border-t border-inherit font-serif">
                <span>Total amount:</span>
                <span className="text-[#b58a2a]">{formatINR(orderTotal(selectedOrder), { compact: false })}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-between items-center pt-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-500">Quick status:</span>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => {
                    handleStatusChange(selectedOrder.id, e.target.value);
                  }}
                  className="text-xs font-semibold py-1.5 px-3 rounded-lg border bg-stone-100 dark:bg-stone-800"
                >
                  <option value="Processing">Processing</option>
                  <option value="Packed">Packed</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPendingDelete(selectedOrder)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-rose-600 border border-rose-200 hover:bg-rose-50 dark:border-rose-900/40 dark:hover:bg-rose-950/30"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete order
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

      {/* ── Delete Order Confirmation ── */}
      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDeleteOrder}
        title={`Delete order ${pendingDelete ? orderDisplayId(pendingDelete) : ''}?`}
        message="This permanently removes the order record. This cannot be undone."
        confirmText="Delete order"
      />
    </div>
  );
}
