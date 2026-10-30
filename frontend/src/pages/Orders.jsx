import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, PackageCheck, ChevronRight, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import { useSocket } from '../context/SocketContext';

export default function Orders() {
  const navigate = useNavigate();
  const { socket } = useSocket();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await api.getOrders();
      if (res && res.orders) setOrders(res.orders);
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

  const getStatusBadge = (status) => {
    if (status === 'Delivered') {
      return (
        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          Delivered
        </span>
      );
    }
    if (status === 'Processing') {
      return (
        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
          Processing
        </span>
      );
    }
    return (
      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700">
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-transparent py-8 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/profile')}
            className="p-1.5 rounded-full hover:bg-stone-200 text-stone-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-serif text-2xl font-bold text-[#1C1917]">
            My Orders
          </h1>
        </div>

        <Link to="/cart" className="p-2 text-stone-600 hover:text-[#C59B27]">
          <ShoppingBag className="w-5 h-5" />
        </Link>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-16 text-center flex flex-col items-center justify-center gap-3 bg-white rounded-3xl border border-[#DFBC77]/30">
            <Loader2 className="w-8 h-8 animate-spin text-[#DFBC77]" />
            <p className="text-xs text-stone-500 font-serif italic">Loading your royal orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-stone-200">
            <PackageCheck className="w-12 h-12 text-[#DFBC77] mx-auto mb-3" />
            <h3 className="font-serif text-lg font-bold text-stone-900">No Orders Yet</h3>
            <p className="text-xs text-stone-500 mt-1">Explore our luxury catalogues and place your first royal order.</p>
            <Link to="/products" className="btn-gold inline-block mt-4 px-6 py-2 rounded-full text-xs font-bold">
              Shop Collections
            </Link>
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-[#DFBC77]/40 p-4 sm:p-5 shadow-sm space-y-3"
            >
              {/* Order Header */}
              <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                <div>
                  <span className="font-sans text-sm font-bold tracking-wider text-[#1C1917]">
                    {order.orderId}
                  </span>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    Placed on: {order.placedDate}
                  </p>
                </div>
                {getStatusBadge(order.status)}
              </div>

              {/* Items List */}
              <div className="space-y-2 py-1">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          onError={(e) => { e.currentTarget.src = '/hero-slide-1.jpg'; }}
                          className="w-10 h-10 rounded-lg object-cover border border-stone-200"
                        />
                      )}
                      <div>
                        <p className="font-medium text-stone-800">{item.name}</p>
                        {item.variant && (
                          <p className="text-[10px] text-stone-400">{item.variant}</p>
                        )}
                      </div>
                    </div>
                    <span className="font-bold text-stone-900">
                      ₹{item.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total Row */}
              <div className="flex items-center justify-between pt-2.5 border-t border-stone-100 text-xs">
                <span className="font-semibold text-stone-600">Total Amount Paid</span>
                <span className="font-sans font-bold text-sm text-[#1C1917]">
                  ₹{order.totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
