import React, { useState } from 'react';
import {
  Tag, Plus, Trash2, Copy, Check, Calendar, Percent,
  IndianRupee, Sparkles, ShieldCheck
} from 'lucide-react';
import useAdminStore from '../../store/useAdminStore';
import Modal from '../../components/admin/Modal';
import StatusPill from '../../components/admin/StatusPill';
import { formatINR } from '../../utils/adminUtils';

export default function Coupons() {
  const {
    darkMode,
    coupons,
    addCoupon,
    toggleCoupon,
    deleteCoupon,
    addToast,
  } = useAdminStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);

  const [formData, setFormData] = useState({
    code: '',
    description: '',
    type: 'percent', // percent | flat
    value: '',
    minOrder: '1999',
    usageLimit: '100',
    validTill: '2026-12-31',
    isActive: true,
  });
  const [errors, setErrors] = useState({});

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    addToast({ type: 'info', message: `Copied promo code "${code}"` });
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleToggle = (id, code, currentActive) => {
    toggleCoupon(id);
    addToast({
      type: 'info',
      message: `Coupon "${code}" marked as ${!currentActive ? 'Active' : 'Inactive'}`,
    });
  };

  const handleDelete = (id, code) => {
    deleteCoupon(id);
    addToast({ type: 'success', message: `Deleted coupon "${code}"` });
  };

  const handleCreateCoupon = (e) => {
    e.preventDefault();
    const newErrors = {};
    const cleanCode = formData.code.trim().toUpperCase();

    if (!cleanCode) {
      newErrors.code = 'Promo code is required';
    } else if (coupons.some(c => c.code.toUpperCase() === cleanCode)) {
      newErrors.code = 'This promo code already exists. Use a unique code.';
    }

    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.value || parseFloat(formData.value) <= 0) newErrors.value = 'Enter a valid discount amount';
    if (!formData.minOrder || parseFloat(formData.minOrder) < 0) newErrors.minOrder = 'Enter valid min order';
    if (!formData.usageLimit || parseInt(formData.usageLimit, 10) <= 0) newErrors.usageLimit = 'Enter usage limit';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    addCoupon({
      code: cleanCode,
      description: formData.description.trim(),
      type: formData.type,
      value: parseFloat(formData.value),
      minOrder: parseFloat(formData.minOrder),
      usageLimit: parseInt(formData.usageLimit, 10),
      validTill: formData.validTill,
      isActive: formData.isActive,
    });

    addToast({ type: 'success', message: `Created VIP coupon "${cleanCode}"` });
    setModalOpen(false);
  };

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
            VIP coupons & promotions
          </h1>
          <p className={`text-xs sm:text-sm mt-0.5 ${darkMode ? 'text-stone-400' : 'text-stone-500'}`}>
            Configure bespoke discount vouchers, bridal codes, and redemption limits
          </p>
        </div>
        <button
          onClick={() => {
            setFormData({
              code: '',
              description: '',
              type: 'percent',
              value: '',
              minOrder: '1999',
              usageLimit: '100',
              validTill: '2026-12-31',
              isActive: true,
            });
            setErrors({});
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-sm transition-opacity hover:opacity-90 self-start sm:self-auto"
          style={{ background: 'linear-gradient(135deg, #d9b45b, #b58a2a)' }}
        >
          <Plus className="w-4 h-4" />
          Create coupon
        </button>
      </div>

      {/* ── Coupon Cards Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {coupons.map((coupon) => {
          const usedPct = coupon.usageLimit > 0
            ? Math.min(100, Math.round((coupon.usedCount / coupon.usageLimit) * 100))
            : 0;

          return (
            <div
              key={coupon.id}
              className={`rounded-[18px] border p-5 transition-all relative overflow-hidden flex flex-col justify-between shadow-sm ${
                coupon.isActive
                  ? darkMode ? 'bg-[#181416] border-white/10' : 'bg-white border-[#e9e3dd]'
                  : darkMode ? 'bg-[#121010] border-white/5 opacity-60' : 'bg-stone-50 border-stone-200 opacity-60'
              }`}
            >
              <div>
                {/* Header: Code & Toggle */}
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="font-mono font-bold text-sm tracking-wider px-2.5 py-1 rounded-lg border flex items-center gap-1.5"
                      style={{
                        backgroundColor: darkMode ? '#1e1519' : '#fcf9f2',
                        borderColor: '#b58a2a',
                        color: '#b58a2a',
                      }}
                    >
                      <Tag className="w-3.5 h-3.5" />
                      {coupon.code}
                    </span>
                    <button
                      type="button"
                      aria-label={`Copy coupon code ${coupon.code}`}
                      onClick={() => handleCopy(coupon.code)}
                      className="p-1 rounded-md text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
                    >
                      {copiedCode === coupon.code ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Active Toggle Switch */}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={coupon.isActive}
                      onChange={() => handleToggle(coupon.id, coupon.code, coupon.isActive)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#1d8f6a]" />
                  </label>
                </div>

                {/* Description & Value */}
                <p className="text-xs text-stone-600 dark:text-stone-400 mb-2">
                  {coupon.description}
                </p>

                <div className="text-xl font-bold font-serif mb-4 text-[#1e1519] dark:text-white">
                  {coupon.type === 'percent'
                    ? `${coupon.value}% off`
                    : `₹${coupon.value.toLocaleString('en-IN')} flat off`}
                  <span className="text-xs font-normal font-sans text-stone-400 ml-2">
                    (Min. order {formatINR(coupon.minOrder)})
                  </span>
                </div>

                {/* Usage Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-[11px] text-stone-500 mb-1">
                    <span>Usage: {coupon.usedCount} of {coupon.usageLimit} redeemed</span>
                    <span className="font-semibold">{usedPct}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-stone-200 dark:bg-stone-800 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${usedPct}%`,
                        backgroundColor: usedPct > 80 ? '#c4425e' : '#b58a2a',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-inherit flex items-center justify-between text-[11px] text-stone-400">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Valid till {coupon.validTill}</span>
                </div>
                <button
                  type="button"
                  aria-label={`Delete coupon ${coupon.code}`}
                  onClick={() => handleDelete(coupon.id, coupon.code)}
                  className="p-1 rounded-md text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Create Coupon Modal ── */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create VIP promo code"
        subtitle="Set up discount parameters, minimum basket thresholds, and redemption caps"
      >
        <form onSubmit={handleCreateCoupon} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1 text-stone-700 dark:text-stone-300">
              Promo code (uppercase, unique) *
            </label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData(p => ({ ...p, code: e.target.value.toUpperCase() }))}
              placeholder="e.g. FESTIVE25"
              className={`w-full px-3.5 py-2 rounded-xl text-xs font-mono font-bold uppercase border focus:outline-none focus:ring-2 focus:ring-[#b58a2a] ${
                darkMode ? 'bg-[#121010] border-white/10 text-white' : 'bg-white border-stone-200'
              }`}
            />
            {errors.code && <p className="text-[11px] text-rose-500 mt-1">{errors.code}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-stone-700 dark:text-stone-300">
              Description *
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
              placeholder="e.g. 25% off festive bridal jewellery"
              className={`w-full px-3.5 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-[#b58a2a] ${
                darkMode ? 'bg-[#121010] border-white/10 text-white' : 'bg-white border-stone-200'
              }`}
            />
            {errors.description && <p className="text-[11px] text-rose-500 mt-1">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1 text-stone-700 dark:text-stone-300">
                Discount type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(p => ({ ...p, type: e.target.value }))}
                className={`w-full px-3.5 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-[#b58a2a] ${
                  darkMode ? 'bg-[#121010] border-white/10 text-white' : 'bg-white border-stone-200'
                }`}
              >
                <option value="percent">Percentage discount (%)</option>
                <option value="flat">Flat discount (₹)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-stone-700 dark:text-stone-300">
                {formData.type === 'percent' ? 'Discount percentage (%) *' : 'Flat amount (₹) *'}
              </label>
              <input
                type="number"
                min="1"
                max={formData.type === 'percent' ? 100 : undefined}
                value={formData.value}
                onChange={(e) => setFormData(p => ({ ...p, value: e.target.value }))}
                placeholder={formData.type === 'percent' ? '15' : '1000'}
                className={`w-full px-3.5 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-[#b58a2a] ${
                  darkMode ? 'bg-[#121010] border-white/10 text-white' : 'bg-white border-stone-200'
                }`}
              />
              {errors.value && <p className="text-[11px] text-rose-500 mt-1">{errors.value}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1 text-stone-700 dark:text-stone-300">
                Min. order value (₹)
              </label>
              <input
                type="number"
                min="0"
                value={formData.minOrder}
                onChange={(e) => setFormData(p => ({ ...p, minOrder: e.target.value }))}
                className={`w-full px-3.5 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-[#b58a2a] ${
                  darkMode ? 'bg-[#121010] border-white/10 text-white' : 'bg-white border-stone-200'
                }`}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-stone-700 dark:text-stone-300">
                Usage limit (redeems)
              </label>
              <input
                type="number"
                min="1"
                value={formData.usageLimit}
                onChange={(e) => setFormData(p => ({ ...p, usageLimit: e.target.value }))}
                className={`w-full px-3.5 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-[#b58a2a] ${
                  darkMode ? 'bg-[#121010] border-white/10 text-white' : 'bg-white border-stone-200'
                }`}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-stone-700 dark:text-stone-300">
                Valid till
              </label>
              <input
                type="date"
                value={formData.validTill}
                onChange={(e) => setFormData(p => ({ ...p, validTill: e.target.value }))}
                className={`w-full px-3.5 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-[#b58a2a] ${
                  darkMode ? 'bg-[#121010] border-white/10 text-white' : 'bg-white border-stone-200'
                }`}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-inherit">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold border border-stone-300 dark:border-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold text-white shadow-sm hover:opacity-90 transition-opacity"
              style={{ background: 'linear-gradient(135deg, #d9b45b, #b58a2a)' }}
            >
              Create voucher
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
