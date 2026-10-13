import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Smartphone, 
  CreditCard, 
  Building2, 
  Truck, 
  QrCode, 
  Check, 
  Lock, 
  Sparkles, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export default function PaymentGatewayModal({ 
  isOpen, 
  onClose, 
  amount, 
  paymentMethod, 
  onPaymentSuccess 
}) {
  const [activeTab, setActiveTab] = useState(
    paymentMethod === 'Cash on Delivery' ? 'cod' : 'upi'
  );
  const [upiApp, setUpiApp] = useState('gpay');
  const [upiId, setUpiId] = useState('');
  
  // Card state
  const [cardNumber, setCardNumber] = useState('4532 8921 4012 9012');
  const [cardHolder, setCardHolder] = useState('Ananya Roy');
  const [cardExpiry, setCardExpiry] = useState('10/28');
  const [cardCvv, setCardCvv] = useState('892');

  // Selected Bank for Netbanking
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // Processing & OTP Step
  const [isProcessing, setIsProcessing] = useState(false);
  const [showOtpStep, setShowOtpStep] = useState(false);
  const [otpValue, setOtpValue] = useState('123456');

  if (!isOpen) return null;

  const handleProcessPayment = (e) => {
    if (e) e.preventDefault();

    // If card payment, ask for 3D Secure OTP first
    if (activeTab === 'card' && !showOtpStep) {
      setShowOtpStep(true);
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const randomTxnId = 'TXN_' + Math.floor(100000000 + Math.random() * 900000000);
      
      let finalMethod = 'Online Payment';
      if (activeTab === 'upi') finalMethod = `UPI (${upiApp.toUpperCase()})`;
      else if (activeTab === 'card') finalMethod = 'Credit/Debit Card';
      else if (activeTab === 'netbanking') finalMethod = `Net Banking (${selectedBank})`;
      else if (activeTab === 'cod') finalMethod = 'Cash on Delivery';

      onPaymentSuccess({
        transactionId: activeTab === 'cod' ? null : randomTxnId,
        paymentMethod: finalMethod,
        paymentStatus: activeTab === 'cod' ? 'Pending (COD)' : 'Paid (Online Gateway)'
      });
    }, 2000);
  };

  const popularBanks = [
    { name: 'HDFC Bank', code: 'HDFC' },
    { name: 'ICICI Bank', code: 'ICICI' },
    { name: 'State Bank of India', code: 'SBI' },
    { name: 'Axis Bank', code: 'AXIS' },
    { name: 'Kotak Mahindra', code: 'KOTAK' },
    { name: 'Punjab National Bank', code: 'PNB' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#DFBC77]/50 my-auto animate-scale-in">
        
        {/* Gateway Header */}
        <div className="bg-gradient-to-r from-[#2A1F17] via-[#4A3828] to-[#1F1710] text-white p-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-mono tracking-widest uppercase text-amber-200">
              NIHARA SECURE PAYMENT GATEWAY
            </span>
          </div>

          <div className="mt-3 flex items-baseline justify-between">
            <div>
              <p className="text-xs text-stone-300 font-light">Payable Amount</p>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                ₹{amount?.toLocaleString('en-IN')}
              </h2>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-300 text-xs font-medium bg-white/10 px-3 py-1 rounded-full border border-white/20">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              256-Bit SSL Encrypted
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-200 bg-stone-50 overflow-x-auto scrollbar-none">
          <button
            onClick={() => { setActiveTab('upi'); setShowOtpStep(false); }}
            className={`flex-1 py-3 px-3 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'upi'
                ? 'border-[#C59B27] text-[#855F14] bg-white'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>UPI / QR</span>
          </button>

          <button
            onClick={() => { setActiveTab('card'); setShowOtpStep(false); }}
            className={`flex-1 py-3 px-3 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'card'
                ? 'border-[#C59B27] text-[#855F14] bg-white'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Card</span>
          </button>

          <button
            onClick={() => { setActiveTab('netbanking'); setShowOtpStep(false); }}
            className={`flex-1 py-3 px-3 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'netbanking'
                ? 'border-[#C59B27] text-[#855F14] bg-white'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Net Banking</span>
          </button>

          <button
            onClick={() => { setActiveTab('cod'); setShowOtpStep(false); }}
            className={`flex-1 py-3 px-3 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'cod'
                ? 'border-[#C59B27] text-[#855F14] bg-white'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>COD</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5">
          
          {/* 1. UPI / QR TAB */}
          {activeTab === 'upi' && (
            <div className="space-y-4">
              
              <div className="text-center bg-[#FAF3E8] p-4 rounded-2xl border border-[#DFBC77]/40 space-y-2">
                <div className="w-12 h-12 bg-white rounded-xl shadow-md flex items-center justify-center mx-auto text-[#C59B27]">
                  <QrCode className="w-7 h-7" />
                </div>
                <h4 className="text-xs font-bold text-stone-800">Scan & Pay Instant UPI QR</h4>
                <p className="text-[11px] text-stone-500">Scan using Google Pay, PhonePe, Paytm or any BHIM UPI app</p>
                <div className="inline-block px-3 py-1 bg-white rounded-lg text-xs font-mono font-bold text-[#855F14] border border-[#DFBC77]/50 shadow-sm">
                  VPA: nihara.aura@icici
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-2">Select Preferred UPI App</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'gpay', label: 'Google Pay', color: 'bg-blue-50 text-blue-700 border-blue-200' },
                    { id: 'phonepe', label: 'PhonePe', color: 'bg-purple-50 text-purple-700 border-purple-200' },
                    { id: 'paytm', label: 'Paytm', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
                    { id: 'bhim', label: 'BHIM UPI', color: 'bg-amber-50 text-amber-700 border-amber-200' }
                  ].map((app) => (
                    <button
                      key={app.id}
                      type="button"
                      onClick={() => setUpiApp(app.id)}
                      className={`p-2.5 rounded-xl border text-center font-semibold text-[11px] transition-all flex flex-col items-center gap-1 ${
                        upiApp === app.id
                          ? 'border-[#C59B27] bg-[#FCF9F2] shadow-sm ring-1 ring-[#C59B27]'
                          : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                      }`}
                    >
                      <Smartphone className="w-4 h-4 text-[#855F14]" />
                      <span>{app.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-stone-600 block mb-1">Or Enter Virtual Payment Address (VPA)</label>
                <input
                  type="text"
                  placeholder="e.g. mobile@upi or username@okaxis"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full p-3 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#C59B27] bg-[#FCF9F2]"
                />
              </div>

            </div>
          )}

          {/* 2. CREDIT / DEBIT CARD TAB */}
          {activeTab === 'card' && (
            <div className="space-y-4">
              
              {!showOtpStep ? (
                <>
                  <div>
                    <label className="text-[11px] text-stone-500 font-medium block">Card Number</label>
                    <div className="relative mt-1">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4532 XXXX XXXX 0000"
                        className="w-full p-3 pl-10 rounded-xl border border-stone-200 text-xs font-mono font-semibold text-stone-800 bg-[#FCF9F2] focus:outline-none focus:border-[#C59B27]"
                      />
                      <CreditCard className="w-4 h-4 absolute left-3 top-3.5 text-stone-400" />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-stone-500 font-medium block">Cardholder Name</label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      placeholder="Name on card"
                      className="w-full mt-1 p-3 rounded-xl border border-stone-200 text-xs text-stone-800 bg-[#FCF9F2] focus:outline-none focus:border-[#C59B27]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-stone-500 font-medium block">Expiry Date</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full mt-1 p-3 rounded-xl border border-stone-200 text-xs font-mono text-stone-800 bg-[#FCF9F2] focus:outline-none focus:border-[#C59B27]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-stone-500 font-medium block">CVV / CVC</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="•••"
                        className="w-full mt-1 p-3 rounded-xl border border-stone-200 text-xs font-mono text-stone-800 bg-[#FCF9F2] focus:outline-none focus:border-[#C59B27]"
                      />
                    </div>
                  </div>
                </>
              ) : (
                /* 3D Secure OTP Step */
                <div className="bg-[#FCF9F2] border border-[#DFBC77]/60 p-5 rounded-2xl text-center space-y-3">
                  <div className="w-10 h-10 bg-amber-100 text-[#855F14] rounded-full flex items-center justify-center mx-auto">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-bold text-stone-800">3D Secure Card Verification</h4>
                  <p className="text-[11px] text-stone-500">
                    An OTP has been sent to your registered mobile ending in <strong className="text-stone-800">**4370</strong>
                  </p>
                  <input
                    type="text"
                    value={otpValue}
                    onChange={(e) => setOtpValue(e.target.value)}
                    maxLength={6}
                    className="w-40 mx-auto text-center tracking-widest text-lg font-mono font-bold p-2.5 rounded-xl border border-[#C59B27] bg-white focus:outline-none"
                  />
                  <p className="text-[10px] text-stone-400">Default Demo OTP: 123456</p>
                </div>
              )}

            </div>
          )}

          {/* 3. NET BANKING TAB */}
          {activeTab === 'netbanking' && (
            <div className="space-y-4">
              <label className="text-xs font-bold text-stone-700 block">Select Your Bank</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {popularBanks.map((bank) => (
                  <button
                    key={bank.code}
                    type="button"
                    onClick={() => setSelectedBank(bank.name)}
                    className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all flex items-center gap-2 ${
                      selectedBank === bank.name
                        ? 'border-[#C59B27] bg-[#FCF9F2] text-[#855F14] ring-1 ring-[#C59B27]'
                        : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span className="truncate">{bank.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 4. CASH ON DELIVERY TAB */}
          {activeTab === 'cod' && (
            <div className="bg-[#FCF9F2] border border-[#DFBC77]/60 p-5 rounded-2xl space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 text-[#855F14] flex items-center justify-center flex-shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900">Cash / UPI on Delivery</h4>
                  <p className="text-[11px] text-stone-600">Pay at your doorstep when your luxury parcel arrives.</p>
                </div>
              </div>
              
              <div className="border-t border-[#DFBC77]/30 pt-3 text-[11px] text-stone-600 space-y-1">
                <div className="flex justify-between font-semibold text-stone-800">
                  <span>COD Convenience Charge:</span>
                  <span className="text-emerald-700 font-bold">FREE (₹0)</span>
                </div>
                <p className="text-[10px] text-stone-500">
                  Delivery executive accepts Cash, GPay, PhonePe, Paytm, and Card payments at your doorstep.
                </p>
              </div>
            </div>
          )}

          {/* Action Submit Button */}
          <div className="mt-6 pt-3 border-t border-stone-100">
            <button
              onClick={handleProcessPayment}
              disabled={isProcessing}
              className="w-full btn-gold py-4 rounded-2xl text-xs uppercase tracking-widest font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing Encrypted Payment...</span>
                </>
              ) : (
                <>
                  <span>
                    {activeTab === 'cod' 
                      ? `Confirm COD Order (₹${amount?.toLocaleString('en-IN')})` 
                      : `Pay ₹${amount?.toLocaleString('en-IN')} Securely`}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
