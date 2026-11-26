import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  HelpCircle, 
  Plus, 
  X, 
  Package, 
  RotateCcw, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  AlertCircle 
} from 'lucide-react';
import { api } from '../services/api';
import { useSocket } from '../context/SocketContext';
import { getProductImage } from '../data/jewelleryCategories';

export default function ReturnsAndRefunds() {
  const navigate = useNavigate();
  const { socket } = useSocket();

  const [activeTab, setActiveTab] = useState('refunds'); // 'refunds' | 'replacements'
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state for creating a new request
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eligibleOrders, setEligibleOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [requestReason, setRequestReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const fetchRequests = useCallback(async () => {
    try {
      const typeParam = activeTab === 'refunds' ? 'Refund' : 'Replacement';
      const res = await api.getReturns(typeParam);
      if (res && res.requests) {
        setRequests(res.requests);
      }
    } catch (err) {
      console.error('Failed to load return requests:', err);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    setLoading(true);
    fetchRequests();
  }, [fetchRequests]);

  // Real-time socket events
  useEffect(() => {
    if (!socket) return;
    const handleUpdate = () => fetchRequests();
    socket.on('return:created', handleUpdate);
    socket.on('return:updated', handleUpdate);
    return () => {
      socket.off('return:created', handleUpdate);
      socket.off('return:updated', handleUpdate);
    };
  }, [socket, fetchRequests]);

  const openCreateModal = async () => {
    setFormError('');
    setActionSuccess('');
    setRequestReason('');
    setIsModalOpen(true);
    try {
      const res = await api.getEligibleOrdersForReturn();
      if (res && res.orders) {
        setEligibleOrders(res.orders);
        if (res.orders.length > 0) {
          setSelectedOrderId(res.orders[0].id);
        }
      }
    } catch (err) {
      console.error('Error fetching eligible orders:', err);
      setFormError('Could not load eligible orders.');
    }
  };

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    if (!selectedOrderId) {
      setFormError('Please select an order.');
      return;
    }
    if (!requestReason.trim()) {
      setFormError('Please enter a reason for your request.');
      return;
    }

    setIsSubmitting(true);
    setFormError('');

    try {
      const currentOrder = eligibleOrders.find(o => String(o.id) === selectedOrderId);
      const payload = {
        orderId: selectedOrderId,
        type: activeTab === 'refunds' ? 'Refund' : 'Replacement',
        reason: requestReason.trim(),
        items: currentOrder?.items || [],
      };

      const res = await api.createReturn(payload);
      if (res && res.success) {
        setIsModalOpen(false);
        setActionSuccess('Your request has been submitted successfully.');
        fetchRequests();
        setTimeout(() => setActionSuccess(''), 4000);
      } else {
        setFormError(res?.message || 'Could not submit request. Please try again.');
      }
    } catch (err) {
      setFormError(err.message || 'Failed to submit request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelRequest = async (requestId) => {
    if (!window.confirm('Are you sure you want to cancel this request?')) return;
    try {
      const res = await api.cancelReturn(requestId);
      if (res && res.success) {
        fetchRequests();
      }
    } catch (err) {
      alert(err.message || 'Could not cancel request.');
    }
  };

  const getStatusBadge = (status) => {
    const s = (status || 'Pending').toUpperCase();
    if (s === 'COMPLETED' || s === 'APPROVED') {
      return (
        <span className="inline-block rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
          {s}
        </span>
      );
    }
    if (s === 'REJECTED' || s === 'CANCELLED') {
      return (
        <span className="inline-block rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-700">
          {s}
        </span>
      );
    }
    return (
      <span className="inline-block rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700">
        {s}
      </span>
    );
  };

  // Filter requests matching current active tab
  const displayedRequests = useMemo(() => {
    const targetType = activeTab === 'refunds' ? 'Refund' : 'Replacement';
    return requests.filter(r => (r.type || '').toLowerCase() === targetType.toLowerCase());
  }, [requests, activeTab]);

  return (
    <div className="min-h-screen bg-transparent">
      {/* Top Header Bar matching user screenshot */}
      <div className="border-b border-stone-200/80 bg-white/70 backdrop-blur-md">
        <div className="relative mx-auto flex max-w-4xl items-center justify-center px-4 py-4 sm:px-6">
          <button
            onClick={() => navigate('/profile')}
            aria-label="Go back to profile"
            className="absolute left-4 rounded-full p-2 text-stone-700 transition hover:bg-stone-100 cursor-pointer"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          
          <h1 className="font-serif text-2xl font-bold tracking-tight text-[#1C1917] sm:text-3xl">
            Returns & Refunds
          </h1>

          <button
            onClick={openCreateModal}
            className="absolute right-4 hidden sm:inline-flex items-center gap-1.5 rounded-full bg-[#1B4332] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#153427] transition-all cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Request</span>
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="mx-auto flex max-w-4xl justify-center gap-12 sm:gap-24 px-4 text-sm font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('refunds')}
            className={`relative py-3 transition-colors cursor-pointer ${
              activeTab === 'refunds'
                ? 'text-[#1B4332] font-bold'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <span>Refunds</span>
            {activeTab === 'refunds' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#1B4332]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('replacements')}
            className={`relative py-3 transition-colors cursor-pointer ${
              activeTab === 'replacements'
                ? 'text-[#1B4332] font-bold'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <span>Replacements</span>
            {activeTab === 'replacements' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#1B4332]" />
            )}
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {actionSuccess && (
        <div className="mx-auto max-w-xl mt-4 px-4">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        
        {loading ? (
          <div className="py-20 text-center text-xs text-stone-400">
            Loading {activeTab}...
          </div>
        ) : displayedRequests.length === 0 ? (
          
          /* Exact Minimalist Empty State matching screenshot */
          <div className="flex flex-col items-center justify-center py-28 sm:py-36">
            <div className="mb-4 flex h-24 w-16 flex-col items-center justify-between rounded-2xl border-2 border-stone-300 bg-white/40 p-2 shadow-2xs">
              <div className="h-1 w-5 rounded-full bg-stone-300" />
              <div className="flex flex-col items-center gap-1">
                <div className="h-5 w-1.5 rounded-full bg-stone-300" />
                <div className="h-1.5 w-1.5 rounded-full bg-stone-300" />
              </div>
              <div className="h-1 w-5 opacity-0" />
            </div>

            <p className="text-sm font-medium text-stone-500">
              {activeTab === 'refunds'
                ? 'No active refunds found'
                : 'No active replacements found'}
            </p>

            <button
              onClick={openCreateModal}
              className="mt-5 btn-gold-outline rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider cursor-pointer shadow-xs hover:shadow-sm"
            >
              Request a {activeTab === 'refunds' ? 'Refund' : 'Replacement'}
            </button>

            <div className="mt-8 flex items-center gap-2 text-xs text-stone-400">
              <HelpCircle className="h-4 w-4" />
              <span>
                Need help with a return or refund?{' '}
                <a
                  href="mailto:support@niharadaura.com"
                  className="text-[#855F14] underline hover:text-[#C59B27]"
                >
                  Contact Support
                </a>
              </span>
            </div>
          </div>

        ) : (

          /* Active Request Cards */
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                Active {activeTab === 'refunds' ? 'Refunds' : 'Replacements'} ({displayedRequests.length})
              </span>
              <button
                onClick={openCreateModal}
                className="btn-gold-outline rounded-full px-3.5 py-1 text-xs font-bold sm:hidden"
              >
                + New Request
              </button>
            </div>

            {displayedRequests.map((req) => (
              <div
                key={req.id}
                className="rounded-2xl border border-stone-200/90 bg-white p-5 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between gap-3 border-b border-stone-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-stone-900">
                        {req.orderIdentifier}
                      </span>
                      <span className="rounded bg-stone-100 px-2 py-0.5 text-[10px] font-bold uppercase text-stone-600">
                        {req.type}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-stone-400">
                      Requested on {new Date(req.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <div>{getStatusBadge(req.status)}</div>
                </div>

                {/* Items in Request */}
                <div className="space-y-2">
                  {(req.items || []).map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={item.image || getProductImage(item)}
                          alt=""
                          className="h-10 w-10 rounded-lg object-cover border border-stone-100 bg-[#FAF7F2]"
                        />
                        <div>
                          <span className="font-semibold text-stone-800 line-clamp-1">{item.name}</span>
                          <span className="text-[11px] text-stone-400">Qty: {item.quantity || item.qty || 1}</span>
                        </div>
                      </div>
                      <span className="font-bold text-stone-900">
                        ₹{(Number(item.price || 0) * Number(item.quantity || item.qty || 1)).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Reason & Notes */}
                <div className="rounded-xl bg-[#FCF9F2] p-3 text-xs space-y-1">
                  <div className="text-stone-700">
                    <span className="font-bold text-stone-900">Reason:</span> {req.reason}
                  </div>
                  {req.adminNotes && (
                    <div className="text-[#855F14] font-medium pt-1 border-t border-[#DFBC77]/30">
                      <span className="font-bold">Admin Update:</span> {req.adminNotes}
                    </div>
                  )}
                </div>

                {/* Actions & Refund Amount */}
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-[11px] text-stone-500 block">Estimated Amount</span>
                    <span className="font-serif text-sm font-bold text-[#1C1917]">
                      ₹{Number(req.refundAmount || 0).toLocaleString('en-IN')}
                    </span>
                  </div>

                  {req.canCancel && (
                    <button
                      onClick={() => handleCancelRequest(req.id)}
                      className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer"
                    >
                      Cancel Request
                    </button>
                  )}
                </div>

              </div>
            ))}
          </div>

        )}

      </div>

      {/* ================= MODAL: CREATE RETURN / REPLACEMENT ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-[#DFBC77]/50 space-y-4">
            
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-serif text-lg font-bold text-[#1C1917]">
                Request a {activeTab === 'refunds' ? 'Refund' : 'Replacement'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {formError && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateRequest} className="space-y-4">
              
              {/* Select Order */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-1">
                  Select Order
                </label>
                {eligibleOrders.length === 0 ? (
                  <p className="text-xs text-stone-500 bg-stone-50 p-3 rounded-xl border border-stone-200">
                    No eligible orders found to return.
                  </p>
                ) : (
                  <select
                    value={selectedOrderId}
                    onChange={(e) => setSelectedOrderId(e.target.value)}
                    className="w-full rounded-xl border border-stone-200 bg-[#FCF9F2] p-2.5 text-xs font-medium text-stone-800 focus:border-[#C59B27] focus:outline-none"
                  >
                    {eligibleOrders.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.orderId} — ₹{Number(o.totalAmount || 0).toLocaleString('en-IN')} ({new Date(o.createdAt).toLocaleDateString('en-GB')})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Request Type */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-1">
                  Request Type
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setActiveTab('refunds')}
                    className={`py-2 rounded-xl border transition ${
                      activeTab === 'refunds' 
                        ? 'border-[#C59B27] bg-[#FAF3E8] text-[#855F14]' 
                        : 'border-stone-200 text-stone-600 hover:border-[#DFBC77]'
                    }`}
                  >
                    Refund
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('replacements')}
                    className={`py-2 rounded-xl border transition ${
                      activeTab === 'replacements' 
                        ? 'border-[#C59B27] bg-[#FAF3E8] text-[#855F14]' 
                        : 'border-stone-200 text-stone-600 hover:border-[#DFBC77]'
                    }`}
                  >
                    Replacement
                  </button>
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-1">
                  Reason for Request
                </label>
                <textarea
                  rows={3}
                  required
                  value={requestReason}
                  onChange={(e) => setRequestReason(e.target.value)}
                  placeholder="Please describe the issue (e.g. size mismatch, damaged item, wrong product received)..."
                  className="w-full rounded-xl border border-stone-200 bg-[#FCF9F2] p-3 text-xs text-stone-800 focus:border-[#C59B27] focus:outline-none placeholder-stone-400"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting || eligibleOrders.length === 0}
                className="w-full btn-gold py-3 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? 'Submitting Request...' : 'Submit Request'}
              </button>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
