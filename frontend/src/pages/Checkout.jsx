import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, ShoppingBag, ShieldCheck, ChevronRight, Lock, Truck, CreditCard, Smartphone } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import PaymentGatewayModal from '../components/common/PaymentGatewayModal';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, totalAmount, coupon, clearCart } = useCart();
  const { user } = useAuth();

  // Delivery Address form / state matching APK
  const [deliveryAddress, setDeliveryAddress] = useState({
    fullName: 'Ananya Roy',
    phone: '+91 98765 43210',
    streetAddress: 'Flat 402, Rosewood Villa, Worli, Mumbai, Maharashtra - 400018'
  });

  // Payment Method selection
  const [paymentMethod, setPaymentMethod] = useState('UPI / GPay / PhonePe');

  // Gateway Modal & Order state
  const [isGatewayOpen, setIsGatewayOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [createdOrderDetails, setCreatedOrderDetails] = useState(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState('');

  const paymentOptions = [
    { label: 'UPI / GPay / PhonePe', type: 'Online Instant', icon: Smartphone },
    { label: 'Credit / Debit Card', type: 'Online Instant', icon: CreditCard },
    { label: 'Net Banking', type: 'Online Instant', icon: ShieldCheck },
    { label: 'Cash on Delivery', type: 'Doorstep Payment', icon: Truck }
  ];

  // Trigger Payment Gateway modal
  const handleInitiatePayment = () => {
    setIsGatewayOpen(true);
  };

  // Called when Payment Gateway finishes transaction or confirms COD
  const handlePaymentSuccess = async (paymentResult) => {
    setIsGatewayOpen(false);
    setIsPlacingOrder(true);

    const orderPayload = {
      items: items.map(i => ({
        productId: i.product?.id || i.product?._id,
        name: i.product?.name || 'Product',
        qty: i.quantity,
        variant: i.variant,
        size: i.size,
        price: (i.product?.price || 0) * i.quantity,
        image: i.product?.images?.[0]
      })),
      shippingAddress: `${deliveryAddress.fullName}, ${deliveryAddress.streetAddress}`,
      customer: user?.name,
      email: user?.email,
      phone: deliveryAddress.phone || user?.phone,
      paymentMethod: paymentResult.paymentMethod || paymentMethod,
      transactionId: paymentResult.transactionId || null,
      paymentStatus: paymentResult.paymentStatus || 'Processing',
      totalAmount,
      couponCode: coupon?.code || null
    };

    const res = await api.createOrder(orderPayload);
    setIsPlacingOrder(false);

    if (res && res.order) {
      setOrderError('');
      setCreatedOrderDetails({
        ...res.order,
        transactionId: paymentResult.transactionId,
        paymentStatus: paymentResult.paymentStatus
      });
      setIsSuccessModalOpen(true);
      clearCart();
    } else {
      setOrderError(res?.message || 'Order could not be saved. Please try again when the server is available.');
    }
  };

  return (
    <div className="mx-auto min-h-screen max-w-4xl bg-transparent px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="rounded-full p-1.5 text-stone-600 transition-colors hover:bg-stone-200"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <span className="section-eyebrow">Secure checkout</span>
          <h1 className="mt-2 font-serif text-3xl font-bold text-[#1C1917] sm:text-4xl">
            Checkout & Secure Payment
          </h1>
          <p className="mt-1 text-xs text-stone-500">Fast 256-Bit SSL Encrypted Checkout</p>
        </div>
      </div>

      <div className="space-y-6">
        {orderError && (
          <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            {orderError}
          </div>
        )}
        
        {/* 1. Delivery Address Card matching APK */}
        <div className="rounded-[1.75rem] border border-[#DFBC77]/40 bg-white p-5 shadow-[0_18px_32px_-28px_rgba(78,59,17,0.5)] space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-700">
              <span>Delivery Address</span>
            </h2>
            <span className="rounded-full border border-[#DFBC77]/40 bg-[#FCF9F2] px-2.5 py-0.5 text-[11px] font-semibold text-[#855F14]">
              Verified Location
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-[11px] text-stone-500 font-medium">Full Name</label>
              <input
                type="text"
                value={deliveryAddress.fullName}
                onChange={(e) => setDeliveryAddress({ ...deliveryAddress, fullName: e.target.value })}
                className="w-full mt-0.5 p-2.5 rounded-xl border border-stone-200 text-xs text-stone-800 bg-[#FCF9F2] focus:outline-none focus:border-[#C59B27]"
              />
            </div>

            <div>
              <label className="text-[11px] text-stone-500 font-medium">Phone Number</label>
              <input
                type="text"
                value={deliveryAddress.phone}
                onChange={(e) => setDeliveryAddress({ ...deliveryAddress, phone: e.target.value })}
                className="w-full mt-0.5 p-2.5 rounded-xl border border-stone-200 text-xs text-stone-800 bg-[#FCF9F2] focus:outline-none focus:border-[#C59B27]"
              />
            </div>

            <div>
              <label className="text-[11px] text-stone-500 font-medium">Complete Street Address</label>
              <textarea
                rows={2}
                value={deliveryAddress.streetAddress}
                onChange={(e) => setDeliveryAddress({ ...deliveryAddress, streetAddress: e.target.value })}
                className="w-full mt-0.5 p-2.5 rounded-xl border border-stone-200 text-xs text-stone-800 bg-[#FCF9F2] focus:outline-none focus:border-[#C59B27]"
              />
            </div>
          </div>
        </div>

        {/* 2. Payment Method Card (Online + COD) */}
        <div className="rounded-[1.75rem] border border-[#DFBC77]/40 bg-white p-5 shadow-[0_18px_32px_-28px_rgba(78,59,17,0.5)] space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-700">
              Select Payment Gateway / Option
            </h2>
            <div className="flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
              <ShieldCheck className="h-3.5 w-3.5" />
              100% Safe Payment
            </div>
          </div>

          <div className="space-y-2.5 pt-1">
            {paymentOptions.map((opt) => {
              const isSelected = paymentMethod === opt.label;
              const Icon = opt.icon;

              return (
                <div
                  key={opt.label}
                  onClick={() => setPaymentMethod(opt.label)}
                  className={`cursor-pointer rounded-xl p-3.5 border transition-all flex items-center justify-between text-xs font-medium ${
                    isSelected
                      ? 'bg-[#FAF3E8] border-[#C59B27] text-stone-900 shadow-sm ring-1 ring-[#C59B27]'
                      : 'bg-white border-stone-200 text-stone-600 hover:border-[#DFBC77]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-[#C59B27] text-white' : 'bg-stone-100 text-stone-500'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-stone-800 block">{opt.label}</span>
                      <span className="text-[10px] text-stone-500">{opt.type}</span>
                    </div>
                  </div>

                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    isSelected ? 'border-[#855F14] bg-[#855F14]' : 'border-stone-300'
                  }`}>
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Order Summary Card matching APK */}
        <div className="rounded-[1.75rem] border border-[#DFBC77]/40 bg-white p-5 shadow-[0_18px_32px_-28px_rgba(78,59,17,0.5)] space-y-3">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-700">
            Order Summary
          </h2>

          <div className="space-y-2 text-xs">
            {items.map((item, i) => (
              <div key={i} className="flex justify-between py-1.5 border-b border-stone-100 items-center">
                <div className="flex items-center gap-2">
                  {item.product?.images?.[0] && (
                    <img src={item.product.images[0]} alt="" className="w-8 h-8 object-cover rounded-md" />
                  )}
                  <span className="text-stone-700 font-medium">
                    {item.quantity}x {item.product?.name} ({item.variant})
                  </span>
                </div>
                <span className="font-bold text-stone-900">
                  ₹{((item.product?.price || 0) * item.quantity).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-between text-sm font-bold text-stone-900 pt-3">
            <span>Total Payable Amount</span>
            <span className="text-[#855F14] font-sans font-bold text-base">₹{totalAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* 4. Action Payment Gateway Trigger Button */}
        <button
          onClick={handleInitiatePayment}
          disabled={isPlacingOrder}
          className="btn-gold flex w-full items-center justify-center gap-2 rounded-[1.5rem] py-4 text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg hover:shadow-xl"
        >
          <Lock className="h-4 w-4" />
          <span>
            {paymentMethod === 'Cash on Delivery'
              ? `Confirm Cash on Delivery Order (₹${totalAmount.toLocaleString('en-IN')})`
              : `Proceed to Pay (₹${totalAmount.toLocaleString('en-IN')})`}
          </span>
          <ChevronRight className="h-4 w-4" />
        </button>

      </div>

      {/* ================= INTERACTIVE PAYMENT GATEWAY MODAL ================= */}
      <PaymentGatewayModal
        isOpen={isGatewayOpen}
        onClose={() => setIsGatewayOpen(false)}
        amount={totalAmount}
        paymentMethod={paymentMethod}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* ================= ORDER SUCCESS RECEIPT MODAL ================= */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center space-y-4 shadow-2xl border border-[#DFBC77]/50 animate-scale-in">
            
            <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-600 shadow-inner">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <h3 className="font-serif text-xl font-bold text-[#1C1917]">
              Order Confirmed!
            </h3>

            <div className="bg-[#FAF3E8] p-3 rounded-2xl border border-[#DFBC77]/40 space-y-1 text-left">
              <div className="flex justify-between text-xs">
                <span className="text-stone-500">Order ID:</span>
                <span className="font-bold text-[#855F14]">{createdOrderDetails?.orderId}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-stone-500">Payment Option:</span>
                <span className="font-semibold text-stone-800">{createdOrderDetails?.paymentMethod}</span>
              </div>
              {createdOrderDetails?.transactionId && (
                <div className="flex justify-between text-xs">
                  <span className="text-stone-500">Transaction Ref:</span>
                  <span className="font-mono text-[10px] text-stone-700">{createdOrderDetails.transactionId}</span>
                </div>
              )}
              <div className="flex justify-between text-xs pt-1 border-t border-amber-200">
                <span className="text-stone-500">Status:</span>
                <span className="font-bold text-emerald-700">
                  {createdOrderDetails?.paymentStatus || 'Processing'}
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Thank you for shopping with Nihara. Your luxury order receipt has been sent to your registered phone and email.
            </p>

            <button
              onClick={() => {
                setIsSuccessModalOpen(false);
                navigate('/orders');
              }}
              className="w-full btn-gold py-3 rounded-full text-xs uppercase tracking-wider font-bold shadow-md"
            >
              View My Orders
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
