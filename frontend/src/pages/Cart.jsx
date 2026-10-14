import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, X, Sparkles, Tag, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useOffers } from '../context/OffersContext';

export default function Cart() {
  const navigate = useNavigate();
  const { offers } = useOffers();
  const { 
    items, 
    subtotal, 
    discount, 
    totalAmount, 
    updateQuantity, 
    removeFromCart,
    coupon,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [promoCode, setPromoCode] = useState('');
  const [couponMessage, setCouponMessage] = useState('');

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!promoCode.trim()) return;
    const res = applyCoupon(promoCode);
    setCouponMessage(res.message);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center bg-transparent">
        <div className="w-20 h-20 rounded-full bg-[#FAF3E8] border border-[#DFBC77] flex items-center justify-center text-[#C59B27] mb-4 shadow-inner">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#1C1917]">
          Your Shopping Bag is Empty
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 mt-2 max-w-sm">
          Discover our luxury collections and add your favourites.
        </p>
        <Link
          to="/products"
          className="btn-gold mt-6 px-8 py-3 rounded-full text-xs uppercase tracking-wider font-bold shadow-md"
        >
          Explore Nihara Products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-1.5 rounded-full hover:bg-stone-200 text-stone-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-serif text-2xl font-bold text-[#1C1917]">
          Shopping Bag
        </h1>
      </div>

      <div className="space-y-6">
        
        {/* Cart Item Cards */}
        <div className="space-y-3">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-[#DFBC77]/40 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.product?.images?.[0] || '/hero-slide-1.jpg'}
                  alt={item.product?.name}
                  onError={(e) => { e.currentTarget.src = '/hero-slide-1.jpg'; }}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover bg-stone-100 border border-stone-200 flex-shrink-0"
                />
                <div>
                  <h3 className="font-serif text-sm sm:text-base font-bold text-[#1C1917]">
                    {item.product?.name}
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Variant: <span className="font-medium text-stone-800">{item.variant}</span> {item.size ? `• Size: ${item.size}` : ''}
                  </p>
                  <p className="text-sm font-bold text-[#1C1917] mt-1 sm:hidden">
                    ₹{((item.product?.price || 0) * item.quantity).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                <span className="hidden sm:block text-base font-bold text-[#1C1917]">
                  ₹{((item.product?.price || 0) * item.quantity).toLocaleString('en-IN')}
                </span>

                {/* Quantity Controls */}
                <div className="flex items-center border border-[#DFBC77]/50 rounded-xl overflow-hidden bg-[#FAF3E8]/60">
                  <button
                    onClick={() => updateQuantity(item.productId, item.variant, -1)}
                    className="px-3 py-1.5 text-xs text-[#855F14] hover:bg-[#EAD7AD] font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-bold text-stone-900">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.variant, 1)}
                    className="px-3 py-1.5 text-xs text-[#855F14] hover:bg-[#EAD7AD] font-bold"
                  >
                    +
                  </button>
                </div>

                {/* Delete button */}
                <button
                  onClick={() => removeFromCart(item.productId, item.variant)}
                  className="text-stone-300 hover:text-red-500 transition-colors p-1"
                  title="Remove from bag"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Promo Code / Voucher Card matching APK */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#DFBC77]/40 shadow-sm space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
            Promo Code / Voucher
          </label>
          <form onSubmit={handleApplyCoupon} className="flex gap-2">
            <input
              type="text"
              placeholder="Enter coupon code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-stone-300 text-xs uppercase tracking-wider focus:outline-none focus:border-[#C59B27] bg-[#FCF9F2]"
            />
            <button
              type="submit"
              className="btn-gold px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm"
            >
              Apply
            </button>
          </form>

          {/* Quick Clickable Active Coupons */}
          <div className="flex items-center flex-wrap gap-1.5 pt-1">
            <span className="text-[10px] text-stone-400 font-medium">Available Offers:</span>
            {offers.filter(o => o.isActive).map(o => (
              <button
                key={o.id}
                type="button"
                onClick={() => {
                  setPromoCode(o.code);
                  const res = applyCoupon(o.code);
                  setCouponMessage(res.message);
                }}
                className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 border border-amber-200 text-[#9E7318] hover:bg-amber-100 transition-colors"
                title={`Click to apply ${o.discountPercent}% OFF (Min ₹${o.minOrder})`}
              >
                {o.code} ({o.discountPercent}% OFF)
              </button>
            ))}
          </div>

          {couponMessage && (
            <p className="text-xs text-amber-800 font-medium pl-1">{couponMessage}</p>
          )}
          {coupon && (
            <div className="flex items-center justify-between bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 text-xs text-amber-900 mt-2">
              <span>Applied: <strong>{coupon.code}</strong> ({coupon.discountPercent}% OFF - {coupon.name})</span>
              <button type="button" onClick={removeCoupon} className="text-stone-400 hover:text-stone-700 text-xs font-semibold">Remove</button>
            </div>
          )}
        </div>

        {/* Price Breakdown Card matching APK */}
        <div className="bg-white rounded-2xl p-5 border border-[#DFBC77]/40 shadow-sm space-y-3 text-xs text-stone-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-semibold text-stone-900">₹{subtotal.toLocaleString('en-IN')}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-green-700">
              <span>Discount ({coupon?.code})</span>
              <span>-₹{discount.toLocaleString('en-IN')}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Delivery Fee</span>
            <span className="text-stone-900 font-bold">FREE</span>
          </div>
          <div className="flex justify-between text-base font-bold text-stone-900 pt-3 border-t border-stone-200">
            <span>Total Amount</span>
            <span className="text-[#855F14] font-sans font-bold text-lg">₹{totalAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Proceed to Checkout CTA */}
        <button
          onClick={() => navigate('/checkout')}
          className="w-full btn-gold py-3.5 rounded-2xl text-xs uppercase tracking-widest font-bold shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
        >
          <span>Proceed to Checkout</span>
          <ArrowRight className="w-4 h-4" />
        </button>

      </div>

    </div>
  );
}
