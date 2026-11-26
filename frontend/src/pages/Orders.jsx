import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Package, 
  Calendar, 
  CheckCircle2, 
  ChevronRight, 
  ShoppingBag, 
  HelpCircle, 
  AlertCircle, 
  XCircle, 
  Truck, 
  MapPin, 
  Phone, 
  CreditCard, 
  ChevronLeft,
  Circle,
  Clock
} from 'lucide-react';
import { api } from '../services/api';
import { useSocket } from '../context/SocketContext';
import { ListCardSkeleton } from '../components/common/Skeleton';
import { getProductImage } from '../data/jewelleryCategories';

export default function Orders() {
  const navigate = useNavigate();
  const { id: routeOrderId } = useParams();
  const { socket } = useSocket();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const fetchOrders = useCallback(async () => {
    try {
      const res = await api.getOrders();
      if (res && res.orders) {
        setOrders(res.orders);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Real-time socket event listener for live placed orders
  useEffect(() => {
    if (!socket) return;
    socket.on('order:created', fetchOrders);
    socket.on('order:updated', fetchOrders);
    return () => {
      socket.off('order:created', fetchOrders);
      socket.off('order:updated', fetchOrders);
    };
  }, [socket, fetchOrders]);

  // Find currently selected order for the tracking view (either via URL param or empty)
  const selectedOrder = useMemo(() => {
    if (!routeOrderId) return null;
    return orders.find(o => String(o.id) === routeOrderId || String(o.orderId) === routeOrderId) || null;
  }, [orders, routeOrderId]);

  // Helper date formatters
  const formatDate = (dateString) => {
    if (!dateString) return 'Recent';
    const d = new Date(dateString);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatExpectedDate = (dateString) => {
    const base = dateString ? new Date(dateString) : new Date();
    const d = new Date(base.getTime() + 2 * 24 * 60 * 60 * 1000);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getDeliveryStatusBadge = (status) => {
    const s = (status || 'Pending').toUpperCase();
    if (s === 'CANCELLED') {
      return (
        <span className="inline-block rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-700">
          CANCELLED
        </span>
      );
    }
    if (s === 'DELIVERED') {
      return (
        <span className="inline-block rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
          DELIVERED
        </span>
      );
    }
    if (s === 'PROCESSING') {
      return (
        <span className="inline-block rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700">
          PROCESSING
        </span>
      );
    }
    if (s === 'SHIPPED') {
      return (
        <span className="inline-block rounded-full border border-sky-200 bg-sky-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sky-700">
          SHIPPED
        </span>
      );
    }
    return (
      <span className="inline-block rounded-full border border-stone-200 bg-stone-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-stone-700">
        {s}
      </span>
    );
  };

  const getPaymentStatusBadge = (order) => {
    const isOnlinePaid = order.paymentMethod === 'ONLINE' || order.paymentStatus === 'Paid';
    if (isOnlinePaid) {
      return (
        <span className="inline-block rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
          Online Paid
        </span>
      );
    }
    return (
      <span className="inline-block rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
        Cash on Delivery
      </span>
    );
  };

  // Pagination slice
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return orders.slice(start, start + pageSize);
  }, [orders, currentPage]);

  const totalPages = Math.ceil(orders.length / pageSize) || 1;

  // =========================================================================
  // VIEW 2: TRACK ORDER DETAILS PAGE (Matching User Screenshot 2)
  // =========================================================================
  if (selectedOrder) {
    const isCancelled = (selectedOrder.status || '').toUpperCase() === 'CANCELLED';
    const isDelivered = (selectedOrder.status || '').toUpperCase() === 'DELIVERED';
    const isShipped = (selectedOrder.status || '').toUpperCase() === 'SHIPPED';
    const isProcessing = (selectedOrder.status || '').toUpperCase() === 'PROCESSING' || isShipped || isDelivered;

    const shipping = selectedOrder.shippingAddress || {};
    const recipientName = selectedOrder.customerName || shipping.fullName || 'Valued Customer';
    const fullAddress = [
      shipping.street || shipping.streetAddress,
      shipping.area,
      shipping.city,
      shipping.state,
      shipping.pincode || shipping.postalCode
    ].filter(Boolean).join(', ');
    const phone = selectedOrder.customerPhone || shipping.phone || '';

    return (
      <div className="min-h-screen bg-transparent px-4 py-8 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        
        {/* Back Link */}
        <button
          onClick={() => navigate('/orders')}
          className="group inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-900 transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          <span>Back to Orders</span>
        </button>

        {/* Order Header */}
        <div className="mb-6">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1917]">
            Order <span className="font-mono text-xl sm:text-2xl text-stone-700">{selectedOrder.orderId || selectedOrder.id}</span>
          </h1>
          <p className="mt-1 text-xs text-stone-500">
            Placed on {formatDate(selectedOrder.createdAt)}
          </p>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Track Timeline, Items, Delivery Address */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Card 1: Track Order Timeline */}
            <div className="rounded-2xl border border-stone-200/90 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-5">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-emerald-800" />
                  <h2 className="font-serif text-base font-bold text-[#1C1917]">
                    Track Order
                  </h2>
                </div>
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                  Expected: {formatExpectedDate(selectedOrder.createdAt)}
                </div>
              </div>

              {/* Timeline Steps */}
              <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
                
                {/* Step 1: Order Placed */}
                <div className="relative">
                  <span className="absolute -left-6 top-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#1B4332] text-white ring-4 ring-white shadow-xs">
                    <CheckCircle2 className="h-4 w-4" />
                  </span>
                  <div className="ml-2">
                    <h3 className="text-xs font-bold text-stone-900">Order Placed</h3>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      {new Date(selectedOrder.createdAt || Date.now()).toISOString().split('T')[0]}
                    </p>
                  </div>
                </div>

                {/* Step 2: Processing */}
                <div className="relative">
                  <span className={`absolute -left-6 top-0.5 flex h-6 w-6 items-center justify-center rounded-full ring-4 ring-white shadow-xs ${
                    isProcessing && !isCancelled ? 'bg-[#1B4332] text-white' : 'bg-stone-200 text-stone-500'
                  }`}>
                    {isProcessing && !isCancelled ? <CheckCircle2 className="h-4 w-4" /> : <div className="h-2 w-2 rounded-full bg-stone-400" />}
                  </span>
                  <div className="ml-2">
                    <h3 className="text-xs font-bold text-stone-900">Processing</h3>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      {isCancelled ? 'Cancelled' : isProcessing ? 'Completed' : 'Pending'}
                    </p>
                  </div>
                </div>

                {/* Step 3: In Transit */}
                <div className="relative">
                  <span className={`absolute -left-6 top-0.5 flex h-6 w-6 items-center justify-center rounded-full ring-4 ring-white shadow-xs ${
                    isShipped && !isCancelled ? 'bg-[#1B4332] text-white' : 'bg-stone-200 text-stone-500'
                  }`}>
                    {isShipped && !isCancelled ? <CheckCircle2 className="h-4 w-4" /> : <div className="h-2 w-2 rounded-full bg-stone-400" />}
                  </span>
                  <div className="ml-2">
                    <h3 className="text-xs font-bold text-stone-900">In Transit</h3>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      {isCancelled ? 'Cancelled' : isShipped ? 'On the way' : 'Pending'}
                    </p>
                  </div>
                </div>

                {/* Step 4: Delivered */}
                <div className="relative">
                  <span className={`absolute -left-6 top-0.5 flex h-6 w-6 items-center justify-center rounded-full ring-4 ring-white shadow-xs ${
                    isDelivered && !isCancelled ? 'bg-[#1B4332] text-white' : 'bg-stone-200 text-stone-500'
                  }`}>
                    {isDelivered && !isCancelled ? <CheckCircle2 className="h-4 w-4" /> : <div className="h-2 w-2 rounded-full bg-stone-400" />}
                  </span>
                  <div className="ml-2">
                    <h3 className="text-xs font-bold text-stone-900">Delivered</h3>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      {isDelivered ? 'Delivered successfully' : formatExpectedDate(selectedOrder.createdAt)}
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Card 2: Items */}
            <div className="rounded-2xl border border-stone-200/90 bg-white p-5 shadow-xs">
              <h2 className="font-serif text-base font-bold text-[#1C1917] mb-3">
                Items
              </h2>
              <div className="divide-y divide-stone-100">
                {(selectedOrder.items || []).map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image || getProductImage(item)}
                        alt={item.name}
                        className="h-12 w-12 rounded-xl object-cover border border-stone-100 bg-[#FAF7F2] shrink-0"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-[#1C1917] line-clamp-1">
                          {item.name}
                        </h4>
                        <div className="mt-0.5 flex items-center gap-2">
                          {item.variant && (
                            <span className="rounded bg-[#FCF9F2] px-1.5 py-0.5 text-[10px] font-medium text-[#855F14] border border-[#DFBC77]/40">
                              {item.variant}
                            </span>
                          )}
                          <span className="text-[11px] text-stone-500">
                            Quantity: {item.quantity || item.qty || 1}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#1C1917]">
                      ₹{Number(item.price || item.subtotal || 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 3: Delivery Address */}
            <div className="rounded-2xl border border-stone-200/90 bg-white p-5 shadow-xs">
              <h2 className="font-serif text-base font-bold text-[#1C1917] mb-2">
                Delivery Address
              </h2>
              <p className="text-sm font-bold text-[#1C1917]">
                {recipientName}
              </p>
              <p className="mt-1 text-xs text-stone-600 leading-relaxed">
                {fullAddress || 'Address on file'}
              </p>
              {phone && (
                <p className="mt-1.5 text-xs text-stone-700 font-medium">
                  📞 {phone}
                </p>
              )}
            </div>

          </div>

          {/* Right Column: Payment Summary, Cancellation Notice, Need Help */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Payment Summary Card */}
            <div className="rounded-2xl border border-stone-200/90 bg-white p-5 shadow-xs space-y-3.5">
              <h2 className="font-serif text-base font-bold text-[#1C1917]">
                Payment Summary
              </h2>

              <div className="space-y-2 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Payment Mode</span>
                  <span className="font-semibold text-stone-900">
                    {selectedOrder.paymentMethod === 'ONLINE' ? 'Online Payment' : 'Cash on Delivery'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900">
                    ₹{Number(selectedOrder.totalAmount || 0).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-bold text-emerald-700">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span>GST</span>
                  <span className="font-semibold text-stone-900">₹0</span>
                </div>
              </div>

              {/* Total Amount Row */}
              <div className="flex items-center justify-between border-t border-stone-100 pt-3">
                <span className="font-bold text-sm text-[#1C1917]">Total Amount</span>
                <span className="font-serif text-2xl font-bold text-[#1C1917]">
                  ₹{Number(selectedOrder.totalAmount || 0).toLocaleString('en-IN')}
                </span>
              </div>

              {/* Payment Box */}
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 flex items-center justify-between text-xs font-bold text-emerald-800">
                <span>
                  {selectedOrder.paymentMethod === 'ONLINE' ? 'Paid in Full Online' : 'Cash on Delivery'}
                </span>
                <span>₹{Number(selectedOrder.totalAmount || 0).toLocaleString('en-IN')}</span>
              </div>

              {/* Order Status & Payment Status Rows */}
              <div className="space-y-2 pt-2 border-t border-stone-100 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Order Status</span>
                  {getDeliveryStatusBadge(selectedOrder.status)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Payment Status</span>
                  <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    selectedOrder.paymentStatus === 'Paid'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {selectedOrder.paymentStatus || 'Pending'}
                  </span>
                </div>
              </div>
            </div>

            {/* Cancellation Notice Banner (If Cancelled) */}
            {isCancelled && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-4 space-y-1.5 shadow-xs">
                <div className="flex items-center gap-2 text-rose-800 font-bold text-xs">
                  <XCircle className="h-4 w-4 text-rose-600 shrink-0" />
                  <span>This Order is Cancelled</span>
                </div>
                <p className="text-[11px] text-rose-700 leading-relaxed pl-6">
                  Your cancellation has been confirmed. No further actions or shipments are scheduled for this order.
                </p>
              </div>
            )}

            {/* Need Help Button */}
            <a
              href="https://wa.me/918004116370?text=Hi%2C%20I%20need%20help%20with%20my%20order"
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0F172A] py-3.5 text-xs font-bold text-white shadow-md hover:bg-black transition-all cursor-pointer"
            >
              <HelpCircle className="h-4 w-4" />
              <span>Need Help?</span>
            </a>

          </div>

        </div>

      </div>
    );
  }

  // =========================================================================
  // VIEW 1: MY ORDERS LIST TABLE (Matching User Screenshot 1)
  // =========================================================================
  return (
    <div className="min-h-screen bg-transparent px-4 py-8 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-serif text-3xl font-bold tracking-tight text-[#1C1917]">
              My Orders
            </h1>
            <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-emerald-100 px-2 text-xs font-bold text-emerald-800">
              {orders.length}
            </span>
          </div>
          <p className="mt-1 text-xs text-stone-500">
            Track and manage all your Nihara D'Aura shipments
          </p>
        </div>

        <Link
          to="/products"
          className="btn-gold-outline self-start sm:self-auto rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider shadow-xs hover:shadow-sm"
        >
          Order Now
        </Link>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs">
          <ListCardSkeleton count={3} />
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-3xl border border-stone-200/90 bg-white p-12 text-center shadow-xs">
          <Package className="h-12 w-12 text-[#DFBC77] mx-auto mb-3" />
          <h3 className="font-serif text-lg font-bold text-stone-900">No Orders Placed Yet</h3>
          <p className="mt-1 text-xs text-stone-500 max-w-md mx-auto">
            Discover our royal jewellery and aesthetic wellness collections to place your first luxury order.
          </p>
          <Link
            to="/products"
            className="btn-gold inline-flex items-center gap-2 mt-5 rounded-full px-7 py-2.5 text-xs font-bold uppercase tracking-wider"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Explore Catalogues</span>
          </Link>
        </div>
      ) : (
        <div className="rounded-3xl border border-stone-200/90 bg-white shadow-xs overflow-hidden">
          
          {/* Desktop Table View */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-100 bg-stone-50/70 text-[11px] font-bold uppercase tracking-wider text-stone-500">
                  <th className="py-4 px-6">ORDER IDENTIFIER</th>
                  <th className="py-4 px-6">DATE PLACED</th>
                  <th className="py-4 px-6">DELIVERY STATUS</th>
                  <th className="py-4 px-6">AMOUNT</th>
                  <th className="py-4 px-6 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs">
                {paginatedOrders.map((order) => {
                  const recipient = order.customerName || order.shippingAddress?.fullName || 'Customer';
                  return (
                    <tr key={order.id} className="hover:bg-stone-50/50 transition-colors">
                      
                      {/* 1. ORDER IDENTIFIER */}
                      <td className="py-4 px-6">
                        <div className="flex items-start gap-2.5">
                          <Package className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-mono font-bold text-xs text-stone-900 block">
                              {order.orderId || order.id}
                            </span>
                            <span className="text-[11px] text-stone-500 block mt-0.5">
                              Deliver to: {recipient}
                            </span>
                            <span className="text-[10px] text-stone-400 block">
                              {order.paymentMethod === 'ONLINE' ? 'Paid in full online' : 'Cash on delivery'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* 2. DATE PLACED */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5 text-stone-600 font-medium">
                          <Calendar className="h-3.5 w-3.5 text-stone-400" />
                          <span>{formatDate(order.createdAt)}</span>
                        </div>
                      </td>

                      {/* 3. DELIVERY STATUS */}
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <div>{getDeliveryStatusBadge(order.status)}</div>
                          <div>{getPaymentStatusBadge(order)}</div>
                        </div>
                      </td>

                      {/* 4. AMOUNT */}
                      <td className="py-4 px-6">
                        <div>
                          <span className="font-serif font-bold text-sm text-[#1C1917] block">
                            ₹{Number(order.totalAmount || 0).toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-stone-400 block">
                            {order.paymentMethod === 'ONLINE' ? 'Paid online' : 'Pay on delivery'}
                          </span>
                        </div>
                      </td>

                      {/* 5. ACTIONS */}
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => navigate(`/orders/${order.id}`)}
                          className="inline-flex items-center gap-1 rounded-xl bg-[#1B4332] px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#153427] transition-all cursor-pointer"
                        >
                          <span>Track Order</span>
                          <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table Footer with Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-stone-100 p-4 text-xs text-stone-500">
            <div>
              Showing <span className="font-bold text-stone-800">{(currentPage - 1) * pageSize + 1}</span> to{' '}
              <span className="font-bold text-stone-800">{Math.min(currentPage * pageSize, orders.length)}</span> of{' '}
              <span className="font-bold text-stone-800">{orders.length}</span> orders
            </div>

            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                className="flex items-center gap-0.5 rounded-lg border border-stone-200 px-2.5 py-1 text-xs font-medium hover:bg-stone-50 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span>Prev</span>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold transition ${
                    currentPage === page
                      ? 'bg-[#1B4332] text-white shadow-xs'
                      : 'border border-stone-200 hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                className="flex items-center gap-0.5 rounded-lg border border-stone-200 px-2.5 py-1 text-xs font-medium hover:bg-stone-50 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
              >
                <span>Next</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
