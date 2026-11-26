import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck, 
  ChevronRight, 
  Lock, 
  CreditCard, 
  Truck, 
  Tag, 
  Phone, 
  MapPin, 
  Plus, 
  X, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import PaymentGatewayModal from '../components/common/PaymentGatewayModal';
import { getProductImage } from '../data/jewelleryCategories';

const createDeliveryAddress = (address, user) => ({
  fullName: address?.fullName || user?.fullName || user?.name || '',
  phone: address?.phone || user?.phone || user?.mobileNumber || '',
  streetAddress: address?.streetAddress || address?.street || '',
  area: address?.area || '',
  city: address?.city || '',
  state: address?.state || '',
  postalCode: address?.postalCode || address?.pincode || '',
  tag: address?.tag || address?.type || 'Home'
});

export default function Checkout() {
  const navigate = useNavigate();
  const { items, subtotal, discount, totalAmount, coupon, applyCoupon, removeCoupon, clearCart } = useCart();
  const { user } = useAuth();
  
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState(() => createDeliveryAddress(null, user));
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  // Gateway Modal & Order state
  const [isGatewayOpen, setIsGatewayOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [createdOrderDetails, setCreatedOrderDetails] = useState(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('ONLINE');
  const [paymentGateway, setPaymentGateway] = useState({ enabled: false, keyId: null });
  const [orderError, setOrderError] = useState('');
  const [addressError, setAddressError] = useState('');

  // Calculate estimated delivery date: 2 days from now (formatted as "Nov 28, 2026")
  const expectedDeliveryDate = useMemo(() => {
    const date = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }, []);

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

      if (savedAddresses.length === 0) {
        navigate('/addresses');
        return;
      }

      const preferredAddress = savedAddresses.find((address) => address.isDefault) || savedAddresses[0];
      if (preferredAddress) {
        setSelectedAddressId(String(preferredAddress.id || preferredAddress._id || ''));
        setDeliveryAddress(createDeliveryAddress(preferredAddress, user));
      } else {
        setDeliveryAddress(createDeliveryAddress(null, user));
      }
    }).catch((error) => {
      console.error('Failed to load checkout addresses:', error.message);
      if (active) {
        navigate('/addresses');
      }
    });
    return () => { active = false; };
  }, [user, navigate]);

  const handleInitiatePayment = () => {
    const requiredFields = ['fullName', 'phone', 'streetAddress', 'city', 'state', 'postalCode'];
    const missingField = requiredFields.some((field) => !deliveryAddress[field]?.trim());
    if (missingField) {
      setAddressError('Please complete all delivery address fields before continuing.');
      return;
    }
    setAddressError('');

    if (paymentMethod === 'COD') {
      placeOrder('COD');
    } else if (paymentMethod === 'ONLINE' || paymentGateway.enabled) {
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
      productId: i.product?.id || i.product?._id || i.productId,
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
        setOrderError(res?.message || 'Order could not be saved. Please try again.');
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
        theme: { color: '#C59B27' },
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

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponError('');
    const success = applyCoupon(couponInput.trim());
    if (success) {
      setIsCouponModalOpen(false);
      setCouponInput('');
    } else {
      setCouponError('Invalid or inactive coupon code.');
    }
  };

  return (
    <div className="min-h-screen bg-transparent px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl">
        
        {/* Top Header matching reference */}
        <div className="relative mb-6 flex items-center justify-center">
          <button
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="absolute left-0 rounded-full p-2 text-stone-700 transition hover:bg-stone-200/60"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-[#1C1917] sm:text-3xl">
            Checkout
          </h1>
        </div>

        {orderError && (
          <div role="alert" className="mb-5 flex items-start gap-2.5 rounded-2xl border border-rose-200 bg-rose-50/90 p-4 text-xs font-medium text-rose-800 shadow-xs">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
            <div className="flex-1">{orderError}</div>
          </div>
        )}

        <div className="space-y-4">
          
          {/* ================= 1. SHIPPING ADDRESS CARD ================= */}
          <div className="rounded-2xl border border-stone-200/90 bg-white p-5 shadow-xs transition hover:shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-base font-bold text-[#1C1917]">
                Shipping Address
              </h2>
              <button
                type="button"
                onClick={() => setIsAddressModalOpen(true)}
                className="text-xs font-semibold text-[#855F14] hover:text-[#C59B27] hover:underline"
              >
                Change
              </button>
            </div>

            <div className="mt-3">
              <span className="inline-block rounded-md bg-[#1C1917] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#DFBC77]">
                {deliveryAddress.tag || 'Home'}
              </span>
              <p className="mt-1.5 text-sm font-bold text-[#1C1917]">
                {deliveryAddress.fullName || user?.name || 'Customer'}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-stone-600">
                {[
                  deliveryAddress.streetAddress,
                  deliveryAddress.city,
                  deliveryAddress.state,
                  deliveryAddress.postalCode
                ].filter(Boolean).join(', ')}
              </p>
              {deliveryAddress.phone && (
                <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-stone-700">
                  <Phone className="h-3.5 w-3.5 text-stone-500" />
                  <span>{deliveryAddress.phone}</span>
                </p>
              )}
            </div>

            <div className="mt-4 border-t border-stone-100 pt-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
                <Truck className="h-4 w-4 text-emerald-700" />
                <span>Expected: {expectedDeliveryDate}</span>
              </div>
            </div>
            {addressError && <p className="mt-2 text-xs text-rose-600">{addressError}</p>}
          </div>

          {/* ================= 2. PAYMENT MODE CARD ================= */}
          <div className="rounded-2xl border border-stone-200/90 bg-white p-5 shadow-xs transition hover:shadow-sm">
            <h2 className="font-serif text-base font-bold text-[#1C1917] mb-3">
              Payment Mode
            </h2>

            <div className="space-y-3">
              {/* Online Payment Option */}
              <div
                onClick={() => setPaymentMethod('ONLINE')}
                className={`relative flex items-center justify-between rounded-2xl p-4 transition-all cursor-pointer ${
                  paymentMethod === 'ONLINE'
                    ? 'bg-[#1C1917] text-white border-2 border-[#C59B27] shadow-md'
                    : 'bg-white text-stone-800 border border-stone-200 hover:border-[#DFBC77]'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
                    paymentMethod === 'ONLINE' 
                      ? 'bg-gradient-to-br from-[#DFBC77] to-[#C59B27] text-[#1C1917]' 
                      : 'bg-stone-100 text-stone-600'
                  }`}>
                    <CreditCard className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className={`text-sm font-bold ${paymentMethod === 'ONLINE' ? 'text-white' : 'text-[#1C1917]'}`}>
                      Online Payment
                    </h3>
                    <p className={`text-xs ${paymentMethod === 'ONLINE' ? 'text-stone-300' : 'text-stone-500'}`}>
                      Pay full amount securely via UPI, Cards, NetBanking
                    </p>
                  </div>
                </div>

                <div className="shrink-0 pl-2">
                  <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition ${
                    paymentMethod === 'ONLINE' 
                      ? 'border-[#C59B27] bg-[#1C1917]' 
                      : 'border-stone-300 bg-transparent'
                  }`}>
                    {paymentMethod === 'ONLINE' && (
                      <div className="h-2.5 w-2.5 rounded-full bg-[#C59B27]" />
                    )}
                  </div>
                </div>
              </div>

              {/* Cash on Delivery Option */}
              <div className="relative pt-1.5">
                {/* Floating pill matching user screenshot */}
                <div className="absolute -top-1.5 right-6 z-10 rounded-full bg-[#855F14] px-2.5 py-0.5 text-[10px] font-bold text-white shadow-xs">
                  Pay ₹0 now. Rest on delivery
                </div>

                <div
                  onClick={() => setPaymentMethod('COD')}
                  className={`flex items-center justify-between rounded-2xl p-4 transition-all cursor-pointer ${
                    paymentMethod === 'COD'
                      ? 'bg-[#1C1917] text-white border-2 border-[#C59B27] shadow-md'
                      : 'bg-white text-stone-800 border border-stone-200 hover:border-[#DFBC77]'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <span className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
                      paymentMethod === 'COD' 
                        ? 'bg-gradient-to-br from-[#DFBC77] to-[#C59B27] text-[#1C1917]' 
                        : 'bg-stone-100 text-stone-600'
                    }`}>
                      <Truck className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className={`text-sm font-bold ${paymentMethod === 'COD' ? 'text-white' : 'text-[#1C1917]'}`}>
                        Cash on Delivery
                      </h3>
                      <p className={`text-xs ${paymentMethod === 'COD' ? 'text-stone-300' : 'text-stone-500'}`}>
                        Delivery + GST amount non-refundable
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0 pl-2 flex items-center gap-3">
                    <div>
                      <span className={`block text-sm font-bold ${paymentMethod === 'COD' ? 'text-white' : 'text-stone-900'}`}>
                        ₹0
                      </span>
                      <span className={`text-[10px] ${paymentMethod === 'COD' ? 'text-stone-300' : 'text-stone-400'}`}>
                        pay now
                      </span>
                    </div>
                    <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition ${
                      paymentMethod === 'COD' 
                        ? 'border-[#C59B27] bg-[#1C1917]' 
                        : 'border-stone-300 bg-transparent'
                    }`}>
                      {paymentMethod === 'COD' && (
                        <div className="h-2.5 w-2.5 rounded-full bg-[#C59B27]" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= 3. APPLY COUPON CARD ================= */}
          <div className="rounded-2xl border border-stone-200/90 bg-white p-5 shadow-xs transition hover:shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-base font-bold text-[#1C1917]">
                Apply Coupon
              </h2>
              {coupon ? (
                <button
                  type="button"
                  onClick={removeCoupon}
                  className="text-xs font-semibold text-rose-600 hover:underline"
                >
                  Remove
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsCouponModalOpen(true)}
                  className="text-xs font-semibold text-[#855F14] hover:text-[#C59B27] hover:underline"
                >
                  Change
                </button>
              )}
            </div>

            <div
              onClick={() => setIsCouponModalOpen(true)}
              className="mt-3 flex items-center justify-between rounded-xl border border-stone-200 bg-[#FCF9F2]/70 p-3.5 transition hover:border-[#DFBC77] cursor-pointer"
            >
              <div className="flex items-center gap-2.5 text-xs text-stone-700">
                <Tag className="h-4 w-4 text-[#855F14]" />
                <span className="font-medium">
                  {coupon ? `Coupon Applied: ${coupon.code}` : 'Select a coupon code'}
                </span>
                {coupon && (
                  <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800">
                    Saved ₹{discount}
                  </span>
                )}
              </div>
              <ChevronRight className="h-4 w-4 text-stone-400" />
            </div>
          </div>

          {/* ================= 4. ORDER SUMMARY CARD ================= */}
          <div className="rounded-2xl border border-stone-200/90 bg-white p-5 shadow-xs transition hover:shadow-sm">
            <h2 className="font-serif text-base font-bold text-[#1C1917] mb-3">
              Order Summary
            </h2>

            {/* Item Rows */}
            <div className="divide-y divide-stone-100">
              {items.map((item, i) => (
                <div key={i} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src={getProductImage(item.product)} 
                      alt="" 
                      className="h-12 w-12 rounded-xl object-cover border border-stone-100 bg-[#FAF7F2] shrink-0" 
                    />
                    <div>
                      <h4 className="text-xs font-semibold text-[#1C1917] line-clamp-1">
                        {item.product?.name}
                      </h4>
                      <div className="mt-1 flex items-center gap-2">
                        {item.variant && (
                          <span className="rounded-md border border-[#DFBC77]/50 bg-[#FCF9F2] px-1.5 py-0.5 text-[10px] font-medium text-[#855F14]">
                            {item.variant}
                          </span>
                        )}
                        <span className="text-[11px] text-stone-500">
                          Qty: {item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="block text-xs font-bold text-[#1C1917]">
                      ₹{((item.product?.price || 0) * item.quantity).toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-stone-400">
                      ₹{(item.product?.price || 0).toLocaleString('en-IN')} each
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="mt-3 border-t border-stone-100 pt-3 space-y-2 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span className="font-semibold text-stone-900">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Delivery Fee</span>
                <span className="font-bold text-emerald-700">FREE</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>GST</span>
                <span className="font-semibold text-stone-900">₹0</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Coupon Discount</span>
                  <span>-₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}
            </div>

            {/* Delivery Banner Pill */}
            <div className="mt-3.5 rounded-xl bg-emerald-50/80 border border-emerald-100/80 p-2.5 flex items-center gap-2 text-xs font-semibold text-emerald-800">
              <Truck className="h-4 w-4 text-emerald-700" />
              <span>Delivery by {expectedDeliveryDate}</span>
            </div>

            {/* Total Row */}
            <div className="mt-4 border-t border-stone-100 pt-3 flex items-center justify-between">
              <span className="text-sm font-bold text-[#1C1917]">Total Amount</span>
              <span className="font-serif text-xl font-bold text-[#1C1917]">
                ₹{totalAmount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* ================= 5. CTA BUTTON ================= */}
          <div className="pt-2">
            <button
              onClick={handleInitiatePayment}
              disabled={isPlacingOrder}
              className="w-full btn-gold py-4 rounded-2xl text-xs sm:text-sm font-bold tracking-wider flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-[0.99] transition-all cursor-pointer disabled:opacity-60"
            >
              <Lock className="h-4 w-4" />
              <span>
                {isPlacingOrder
                  ? 'Processing...'
                  : paymentMethod === 'COD'
                    ? `Place Order (COD ₹${totalAmount.toLocaleString('en-IN')})`
                    : `Pay ₹${totalAmount.toLocaleString('en-IN')} Online & Place Order`}
              </span>
            </button>
            <div className="mt-2.5 flex items-center justify-center gap-1.5 text-[11px] text-stone-500">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>100% Safe & Secure Payment Checkout</span>
            </div>
          </div>

        </div>

        {/* ================= ADDRESS SELECT MODAL ================= */}
        {isAddressModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-[#DFBC77]/50 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h3 className="font-serif text-lg font-bold text-[#1C1917]">
                  Select Delivery Address
                </h3>
                <button 
                  onClick={() => setIsAddressModalOpen(false)}
                  className="rounded-full p-1 text-stone-400 hover:text-stone-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {addresses.map((addr) => {
                  const id = String(addr.id || addr._id);
                  const isSelected = id === selectedAddressId;
                  return (
                    <div
                      key={id}
                      onClick={() => {
                        setSelectedAddressId(id);
                        setDeliveryAddress(createDeliveryAddress(addr, user));
                        setIsAddressModalOpen(false);
                      }}
                      className={`p-3.5 rounded-2xl border transition cursor-pointer text-left ${
                        isSelected 
                          ? 'border-[#C59B27] bg-[#FCF9F2]' 
                          : 'border-stone-200 hover:border-[#DFBC77]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-[#1C1917] text-[#DFBC77] px-2 py-0.5 rounded">
                          {addr.tag || addr.type || 'Address'}
                        </span>
                        {isSelected && <Check className="h-4 w-4 text-[#855F14]" />}
                      </div>
                      <p className="font-bold text-xs text-stone-900 mt-1">{addr.fullName || user?.name}</p>
                      <p className="text-[11px] text-stone-600 mt-0.5 leading-relaxed">
                        {[addr.streetAddress || addr.street, addr.city, addr.state, addr.postalCode || addr.pincode].filter(Boolean).join(', ')}
                      </p>
                      <p className="text-[11px] text-stone-700 mt-1">📞 {addr.phone || addr.mobileNumber}</p>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => {
                  setIsAddressModalOpen(false);
                  navigate('/addresses');
                }}
                className="w-full btn-gold-outline py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5"
              >
                <Plus className="h-4 w-4" />
                <span>Add / Manage Addresses</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= COUPON MODAL ================= */}
        {isCouponModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-[#DFBC77]/50 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h3 className="font-serif text-lg font-bold text-[#1C1917]">
                  Apply Coupon Code
                </h3>
                <button 
                  onClick={() => { setIsCouponModalOpen(false); setCouponError(''); }}
                  className="rounded-full p-1 text-stone-400 hover:text-stone-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleApplyCoupon} className="space-y-3">
                <div>
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="ENTER COUPON CODE"
                    className="w-full rounded-xl border border-stone-200 bg-[#FCF9F2] p-3 text-xs font-bold uppercase tracking-wider text-stone-800 placeholder-stone-400 focus:border-[#C59B27] focus:outline-none"
                  />
                  {couponError && <p className="mt-1 text-[11px] text-rose-600">{couponError}</p>}
                </div>

                <button
                  type="submit"
                  className="w-full btn-gold py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md"
                >
                  Apply Code
                </button>
              </form>
            </div>
          </div>
        )}

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
                Order Confirmed
              </h3>

              <div className="bg-[#FAF3E8] p-3.5 rounded-2xl border border-[#DFBC77]/40 space-y-1.5 text-left">
                <div className="flex justify-between text-xs">
                  <span className="text-stone-500">Order ID:</span>
                  <span className="font-bold text-[#855F14]">{createdOrderDetails?.orderId}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-stone-500">Payment Mode:</span>
                  <span className="font-semibold text-stone-800">{createdOrderDetails?.paymentMethod}</span>
                </div>
                <div className="flex justify-between text-xs pt-1 border-t border-amber-200">
                  <span className="text-stone-500">Status:</span>
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
                    : 'Your order is saved. Payment will remain pending until verified.'}
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
    </div>
  );
}
