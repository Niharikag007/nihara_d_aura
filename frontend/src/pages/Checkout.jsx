import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, ShieldCheck, ChevronRight, Lock, Smartphone, MapPin, Banknote, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import PaymentGatewayModal from '../components/common/PaymentGatewayModal';
import { getProductImage } from '../data/jewelleryCategories';

const createDeliveryAddress = (address, user) => ({
  fullName: address?.fullName || user?.fullName || user?.name || '',
  phone: address?.phone || user?.phone || user?.mobileNumber || '',
  streetAddress: address?.streetAddress || address?.street || '',
  city: address?.city || '',
  state: address?.state || '',
  postalCode: address?.postalCode || address?.pincode || ''
});

export default function Checkout() {
  const navigate = useNavigate();
  const { items, totalAmount, coupon, clearCart } = useCart();
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState(() => createDeliveryAddress(null, user));
  const [isUsingSavedAddress, setIsUsingSavedAddress] = useState(false);

  // Gateway Modal & Order state
  const [isGatewayOpen, setIsGatewayOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [createdOrderDetails, setCreatedOrderDetails] = useState(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [paymentGateway, setPaymentGateway] = useState({ enabled: false, keyId: null });
  const [orderError, setOrderError] = useState('');
  const [addressError, setAddressError] = useState('');

  useEffect(() => {
    api.getPaymentConfig()
      .then((res) => {
        if (res?.gatewayEnabled && res?.keyId) {
          setPaymentGateway({ enabled: true, keyId: res.keyId });
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    let active = true;
    api.getAddresses().then((res) => {
      if (!active) return;
      const savedAddresses = Array.isArray(res.addresses) ? res.addresses : [];
      setAddresses(savedAddresses);
      const preferredAddress = savedAddresses.find((address) => address.isDefault) || savedAddresses[0];
      if (preferredAddress) {
        setSelectedAddressId(String(preferredAddress.id || preferredAddress._id || ''));
        setDeliveryAddress(createDeliveryAddress(preferredAddress, user));
        setIsUsingSavedAddress(true);
      } else {
        setDeliveryAddress(createDeliveryAddress(null, user));
        setIsUsingSavedAddress(false);
      }
    }).catch((error) => {
      console.error('Failed to load checkout addresses:', error.message);
      if (active) setDeliveryAddress(createDeliveryAddress(null, user));
    });
    return () => { active = false; };
  }, [user]);

  const handleInitiatePayment = () => {
    const requiredFields = ['fullName', 'phone', 'streetAddress', 'city', 'state', 'postalCode'];
    const missingField = requiredFields.some((field) => !deliveryAddress[field]?.trim());
    if (missingField) {
      setAddressError('Please complete all delivery address fields before continuing.');
      return;
    }
    setAddressError('');
    // If using saved address and all fields are present, treat as valid
    if (paymentMethod === 'COD') {
      placeOrder('COD');
    } else if (paymentMethod === 'ONLINE') {
      placeOnlineOrder();
    } else {
      setIsGatewayOpen(true);
    }
  };

  const handleUpiSubmitted = () => {
    setIsGatewayOpen(false);
    placeOrder('UPI');
  };

  const buildOrderPayload = (method, razorpayOrderId) => ({
    items: items.map(i => ({
      productId: i.product?.id || i.product?._id,
      name: i.product?.name || 'Product',
      qty: i.quantity,
      variant: i.variant,
      size: i.size,
      price: (i.product?.price || 0) * i.quantity,
      image: getProductImage(i.product)
    })),
    shippingAddress: {
      fullName: deliveryAddress.fullName.trim(),
      phone: deliveryAddress.phone.trim(),
      street: deliveryAddress.streetAddress.trim(),
      city: deliveryAddress.city.trim(),
      state: deliveryAddress.state.trim(),
      pincode: deliveryAddress.postalCode.trim()
    },
    customer: deliveryAddress.fullName.trim(),
    email: user?.email,
    phone: deliveryAddress.phone.trim(),
    paymentMethod: method,
    paymentStatus: 'Pending',
    totalAmount,
    couponCode: coupon?.code || null,
    ...(razorpayOrderId ? { razorpayOrderId } : {})
  });

  const placeOrder = async (method) => {
    setIsPlacingOrder(true);
    setOrderError('');

    try {
      const res = await api.createOrder(buildOrderPayload(method));
      if (res?.order) {
        setCreatedOrderDetails({ ...res.order, paymentMethod: method, paymentStatus: 'Pending' });
        setIsSuccessModalOpen(true);
        clearCart();
      } else {
        setOrderError(res?.message || 'Order could not be saved. Please try again when the server is available.');
      }
    } catch (error) {
      console.error(`Failed to create ${method} order:`, error.message);
      setOrderError(error.message || 'Order could not be saved. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const loadRazorpayScript = () => new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve();
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Could not load the payment gateway. Check your connection and try again.'));
    document.body.appendChild(script);
  });

  const placeOnlineOrder = async () => {
    setIsPlacingOrder(true);
    setOrderError('');

    try {
      const { order: razorpayOrder } = await api.createRazorpayOrder(totalAmount);
      const res = await api.createOrder(buildOrderPayload('ONLINE', razorpayOrder.id));
      if (!res?.order) {
        throw new Error(res?.message || 'Order could not be saved. Please try again.');
      }
      const createdOrder = res.order;

      await loadRazorpayScript();
      const options = {
        key: paymentGateway.keyId,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency || 'INR',
        name: "Nihara D'Aura",
        description: `Order ${createdOrder.orderId || ''}`,
        order_id: razorpayOrder.id,
        prefill: {
          name: deliveryAddress.fullName.trim(),
          email: user?.email || '',
          contact: deliveryAddress.phone.trim(),
        },
        theme: { color: '#b58a2a' },
        handler: async (response) => {
          try {
            await api.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            setCreatedOrderDetails({ ...createdOrder, paymentMethod: 'ONLINE', paymentStatus: 'Paid' });
            setIsSuccessModalOpen(true);
            clearCart();
          } catch (verifyError) {
            setOrderError(verifyError.message || 'Payment was received but verification failed. Please contact support with your order ID.');
          }
        },
        modal: {
          ondismiss: () => {
            setOrderError('Payment was cancelled. Your order is saved with payment pending — you can complete payment later or choose another method.');
          },
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Online payment failed:', error.message);
      setOrderError(error.message || 'Online payment could not be started. Please try again.');
    } finally {
      setIsPlacingOrder(false);
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
          <p className="mt-1 text-xs text-stone-500">Pay securely using UPI</p>
        </div>
      </div>

      <div className="space-y-6">
        {orderError && (
          <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            {orderError}
          </div>
        )}
        
        {/* 1. Delivery Address */}
        <div className="rounded-[1.75rem] border border-[#DFBC77]/40 bg-white p-5 shadow-[0_18px_32px_-28px_rgba(78,59,17,0.5)] space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-700">
              <MapPin className="h-3.5 w-3.5" />
              <span>Delivery Address</span>
            </h2>
            {addresses.length > 0 && (
              <select
                aria-label="Choose a saved address"
                value={selectedAddressId}
                onChange={(event) => {
                  const address = addresses.find((item) => String(item.id || item._id) === event.target.value);
                  if (address) {
                    setSelectedAddressId(String(address.id || address._id));
                    setDeliveryAddress(createDeliveryAddress(address, user));
                    setIsUsingSavedAddress(true);
                  } else {
                    setIsUsingSavedAddress(false);
                  }
                }}
                className="max-w-[55%] rounded-lg border border-[#DFBC77]/50 bg-[#FCF9F2] px-2.5 py-1.5 text-xs text-stone-700"
              >
                {addresses.map((address) => (
                  <option key={address.id || address._id} value={String(address.id || address._id)}>
                    {address.tag || address.type || 'Saved address'}{address.isDefault ? ' (Default)' : ''}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-[11px] text-stone-500 font-medium">Full Name</label>
              <input
                type="text"
                value={deliveryAddress.fullName}
                required
                autoComplete="name"
                onChange={(e) => { setDeliveryAddress({ ...deliveryAddress, fullName: e.target.value }); setIsUsingSavedAddress(false); }}
                className="w-full mt-0.5 p-2.5 rounded-xl border border-stone-200 text-xs text-stone-800 bg-[#FCF9F2] focus:outline-none focus:border-[#C59B27]"
              />
            </div>

            <div>
              <label className="text-[11px] text-stone-500 font-medium">Phone Number</label>
              <input
                type="text"
                value={deliveryAddress.phone}
                required
                autoComplete="tel"
                onChange={(e) => { setDeliveryAddress({ ...deliveryAddress, phone: e.target.value }); setIsUsingSavedAddress(false); }}
                className="w-full mt-0.5 p-2.5 rounded-xl border border-stone-200 text-xs text-stone-800 bg-[#FCF9F2] focus:outline-none focus:border-[#C59B27]"
              />
            </div>

            <div>
              <label className="text-[11px] text-stone-500 font-medium">Complete Street Address</label>
              <textarea
                rows={2}
                value={deliveryAddress.streetAddress}
                required
                autoComplete="street-address"
                onChange={(e) => { setDeliveryAddress({ ...deliveryAddress, streetAddress: e.target.value }); setIsUsingSavedAddress(false); }}
                className="w-full mt-0.5 p-2.5 rounded-xl border border-stone-200 text-xs text-stone-800 bg-[#FCF9F2] focus:outline-none focus:border-[#C59B27]"
              />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                ['city', 'City'],
                ['state', 'State'],
                ['postalCode', 'PIN code']
              ].map(([field, label]) => (
                <div key={field}>
                  <label className="text-[11px] text-stone-500 font-medium">{label}</label>
                  <input
                    type="text"
                    value={deliveryAddress[field]}
                    required
                    autoComplete={field === 'postalCode' ? 'postal-code' : 'address-level2'}
                    onChange={(event) => { setDeliveryAddress({ ...deliveryAddress, [field]: event.target.value }); setIsUsingSavedAddress(false); }}
                    className="w-full mt-0.5 p-2.5 rounded-xl border border-stone-200 text-xs text-stone-800 bg-[#FCF9F2] focus:outline-none focus:border-[#C59B27]"
                  />
                </div>
              ))}
            </div>
            {addressError && <p role="alert" className="text-xs text-rose-700">{addressError}</p>}
          </div>
        </div>

        {/* 2. Payment Method */}
        <div className="rounded-[1.75rem] border border-[#DFBC77]/40 bg-white p-5 shadow-[0_18px_32px_-28px_rgba(78,59,17,0.5)] space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-700">
              Payment Method
            </h2>
            <div className="flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
              <ShieldCheck className="h-3.5 w-3.5" />
              Secure
            </div>
          </div>
          <div className={`grid grid-cols-1 gap-3 ${paymentGateway.enabled ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
            {paymentGateway.enabled && (
              <button
                type="button"
                onClick={() => setPaymentMethod('ONLINE')}
                className={`flex items-center gap-3 rounded-xl border p-3.5 text-left transition ${
                  paymentMethod === 'ONLINE'
                    ? 'border-[#C59B27] bg-[#FAF3E8]'
                    : 'border-stone-200 bg-[#FCF9F2] hover:border-[#DFBC77]'
                }`}
              >
                <span className={`flex h-9 w-9 items-center justify-center rounded-lg text-white ${paymentMethod === 'ONLINE' ? 'bg-[#C59B27]' : 'bg-stone-400'}`}>
                  <CreditCard className="h-4 w-4" />
                </span>
                <div>
                  <span className="block text-xs font-bold text-stone-800">Online Payment</span>
                  <span className="text-[10px] text-stone-500">UPI, cards, net banking</span>
                </div>
              </button>
            )}
            <button
              type="button"
              onClick={() => setPaymentMethod('UPI')}
              className={`flex items-center gap-3 rounded-xl border p-3.5 text-left transition ${
                paymentMethod === 'UPI'
                  ? 'border-[#C59B27] bg-[#FAF3E8]'
                  : 'border-stone-200 bg-[#FCF9F2] hover:border-[#DFBC77]'
              }`}
            >
              <span className={`flex h-9 w-9 items-center justify-center rounded-lg text-white ${paymentMethod === 'UPI' ? 'bg-[#C59B27]' : 'bg-stone-400'}`}>
                <Smartphone className="h-4 w-4" />
              </span>
              <div>
                <span className="block text-xs font-bold text-stone-800">UPI / GPay / PhonePe</span>
                <span className="text-[10px] text-stone-500">Pay from your UPI app</span>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('COD')}
              className={`flex items-center gap-3 rounded-xl border p-3.5 text-left transition ${
                paymentMethod === 'COD'
                  ? 'border-[#C59B27] bg-[#FAF3E8]'
                  : 'border-stone-200 bg-[#FCF9F2] hover:border-[#DFBC77]'
              }`}
            >
              <span className={`flex h-9 w-9 items-center justify-center rounded-lg text-white ${paymentMethod === 'COD' ? 'bg-[#C59B27]' : 'bg-stone-400'}`}>
                <Banknote className="h-4 w-4" />
              </span>
              <div>
                <span className="block text-xs font-bold text-stone-800">Cash on Delivery</span>
                <span className="text-[10px] text-stone-500">Pay when you receive</span>
              </div>
            </button>
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
                  {item.product && getProductImage(item.product) && (
                    <img src={getProductImage(item.product)} alt="" className="w-8 h-8 object-cover rounded-md" />
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
            {isPlacingOrder
              ? 'Processing...'
              : paymentMethod === 'COD'
                ? `Place Order (COD ₹${totalAmount.toLocaleString('en-IN')})`
                : paymentMethod === 'ONLINE'
                  ? `Pay Online (₹${totalAmount.toLocaleString('en-IN')})`
                  : `Continue with UPI (₹${totalAmount.toLocaleString('en-IN')})`}
          </span>
          <ChevronRight className="h-4 w-4" />
        </button>
        {paymentMethod === 'UPI' && (
          <p className="mt-2 text-center text-[10px] text-stone-400">
            UPI payment status is confirmed manually after verification
          </p>
        )}
        {paymentMethod === 'ONLINE' && (
          <p className="mt-2 text-center text-[10px] text-stone-400">
            Secure checkout powered by Razorpay — UPI, cards & net banking
          </p>
        )}

      </div>

      {/* ================= INTERACTIVE PAYMENT GATEWAY MODAL ================= */}
      <PaymentGatewayModal
        isOpen={isGatewayOpen}
        onClose={() => setIsGatewayOpen(false)}
        amount={totalAmount}
        onPaymentSubmitted={handleUpiSubmitted}
      />

      {/* ================= ORDER SUCCESS RECEIPT MODAL ================= */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center space-y-4 shadow-2xl border border-[#DFBC77]/50 animate-scale-in">
            
            <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-600 shadow-inner">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <h3 className="font-serif text-xl font-bold text-[#1C1917]">
              Order Received
            </h3>

            <div className="bg-[#FAF3E8] p-3 rounded-2xl border border-[#DFBC77]/40 space-y-1 text-left">
              <div className="flex justify-between text-xs">
                <span className="text-stone-500">Order ID:</span>
                <span className="font-bold text-[#855F14]">{createdOrderDetails?.orderId}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-stone-500">Payment Method:</span>
                <span className="font-semibold text-stone-800">{createdOrderDetails?.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-xs pt-1 border-t border-amber-200">
                <span className="text-stone-500">Payment:</span>
                <span className="font-bold text-amber-700">
                  {createdOrderDetails?.paymentMethod === 'COD'
                    ? 'Pay on delivery'
                    : createdOrderDetails?.paymentStatus === 'Paid'
                      ? 'Paid'
                      : createdOrderDetails?.paymentStatus || 'Pending verification'}
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              {createdOrderDetails?.paymentMethod === 'COD'
                ? 'Your order is confirmed. Please pay in cash when your order is delivered.'
                : createdOrderDetails?.paymentStatus === 'Paid'
                  ? 'Payment received successfully. Your order is confirmed and will be processed shortly.'
                  : 'Your order is saved. Payment will remain pending until your UPI transfer is verified.'}
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
