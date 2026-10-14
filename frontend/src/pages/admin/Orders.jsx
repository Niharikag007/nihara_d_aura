import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ShoppingBag, Search, Eye, Download, CheckCircle, Clock,
  Truck, XCircle, User, Phone, MapPin, CreditCard, ChevronRight
} from 'lucide-react';
import useAdminStore from '../../store/useAdminStore';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import StatusPill from '../../components/admin/StatusPill';
import { formatINR } from '../../utils/adminUtils';

const ORDER_STATUSES = ['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function Orders() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { darkMode, orders, updateOrderStatus, addToast } = useAdminStore();

  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  // Read URL query params (e.g. from Overview to-do link)
  useEffect(() => {
    const statusParam = searchParams.get('status');
    if (statusParam && ORDER_STATUSES.includes(statusParam)) {
      setStatusFilter(statusParam);
    }
  }, [searchParams]);

  // Counts by status
  const statusCounts = useMemo(() => {
    const counts = { All: orders.length };
    ORDER_STATUSES.forEach(st => {
      if (st !== 'All') {
        counts[st] = orders.filter(o => o.status === st).length;
      }
    });
    return counts;
  }, [orders]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    if (statusFilter === 'All') return orders;
    return orders.filter(o => o.status === statusFilter);
  }, [orders, statusFilter]);

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
    addToast({
      type: 'success',
      message: `Order ${orderId} status changed to ${newStatus}`,
    });
  };

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setDetailsModalOpen(true);
  };

  const columns = [
    {
      key: 'id',
      header: 'Order ID',
      sortable: true,
      render: (val, row) => (
        <div>
          <span className="font-mono font-bold text-xs text-[#b58a2a] block">
            {val}
          </span>
          <span className="text-[11px] text-stone-400">
            {row.date}
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
            {val}
          </span>
          <span className="text-[11px] text-stone-400 block">
            {row.phone || row.email}
          </span>
        </div>
      ),
    },
    {
      key: 'items',
      header: 'Items purchased',
      render: (val) => (
        <div className="max-w-[220px]">
          <span className="font-medium text-xs block truncate">
            {val.map(i => `${i.name} (×${i.qty})`).join(', ')}
          </span>
          <span className="text-[11px] text-stone-400">
            {val.reduce((a, c) => a + c.qty, 0)} total items
          </span>
        </div>
      ),
    },
    {
      key: 'total',
      header: 'Amount',
      sortable: true,
      render: (val) => (
        <span className="font-serif font-bold text-sm text-[#1e1519] dark:text-stone-100">
          {formatINR(val, { compact: false })}
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
        <button
          type="button"
          aria-label={`View details of order ${row.id}`}
          onClick={() => openOrderDetails(row)}
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
        title={`Order details • ${selectedOrder?.id}`}
        subtitle={`Placed on ${selectedOrder?.date} • Status: ${selectedOrder?.status}`}
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
                <div className="text-sm font-semibold">{selectedOrder.customer}</div>
                <div className="text-xs text-stone-500 mt-0.5">{selectedOrder.email}</div>
                <div className="text-xs text-stone-500">{selectedOrder.phone}</div>
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
                  {selectedOrder.shippingAddress || '14 Silver Crest Road, Defence Colony, New Delhi - 110024'}
                </div>
                <div className="mt-2 text-[11px] text-stone-500 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5" />
                  Payment: {selectedOrder.paymentMethod || 'UPI / NetBanking'}
                </div>
              </div>
            </div>

            {/* Line items list */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
                Order line items
              </h4>
              <div className="divide-y divide-inherit border rounded-xl overflow-hidden">
                {selectedOrder.items.map((item, idx) => (
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
            </div>

            {/* Total breakdown */}
            <div className="pt-3 border-t border-inherit flex flex-col items-end gap-1 text-xs">
              <div className="flex justify-between w-48 text-stone-500">
                <span>Subtotal:</span>
                <span>{formatINR(selectedOrder.total, { compact: false })}</span>
              </div>
              <div className="flex justify-between w-48 text-stone-500">
                <span>Shipping:</span>
                <span className="text-emerald-600 font-medium">Free (Luxury tier)</span>
              </div>
              <div className="flex justify-between w-48 text-sm font-bold pt-2 border-t border-inherit font-serif">
                <span>Total amount:</span>
                <span className="text-[#b58a2a]">{formatINR(selectedOrder.total, { compact: false })}</span>
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
                    setSelectedOrder(prev => ({ ...prev, status: e.target.value }));
                  }}
                  className="text-xs font-semibold py-1.5 px-3 rounded-lg border bg-stone-100 dark:bg-stone-800"
                >
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
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
