import React from 'react';
import { ArrowRight, Lock, Smartphone, X } from 'lucide-react';

export default function PaymentGatewayModal({ isOpen, onClose, amount, onPaymentSubmitted }) {
  const merchantVpa = import.meta.env.VITE_UPI_ID?.trim();
  if (!isOpen) return null;

  const upiLink = merchantVpa
    ? `upi://pay?${new URLSearchParams({
      pa: merchantVpa,
      pn: "Nihara D'Aura",
      am: Number(amount || 0).toFixed(2),
      cu: 'INR',
      tn: "Nihara D'Aura order"
    }).toString()}`
    : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-3 backdrop-blur-md animate-fade-in sm:p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="upi-payment-title"
        className="my-auto w-full max-w-md overflow-hidden rounded-3xl border border-[#DFBC77]/50 bg-white shadow-2xl animate-scale-in"
      >
        <div className="relative bg-gradient-to-r from-[#2A1F17] via-[#4A3828] to-[#1F1710] p-5 text-white">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-1.5 text-white transition-colors hover:bg-white/20"
            aria-label="Close UPI payment"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2 text-amber-200">
            <Smartphone className="h-4 w-4" />
            <span className="text-[11px] font-semibold uppercase tracking-widest">UPI Payment</span>
          </div>
          <h2 id="upi-payment-title" className="mt-3 font-serif text-2xl font-bold">
            ₹{Number(amount || 0).toLocaleString('en-IN')}
          </h2>
          <p className="mt-1 text-xs text-stone-300">Pay using your UPI app</p>
        </div>

        <div className="space-y-4 p-5">
          {merchantVpa ? (
            <>
              <div className="rounded-2xl border border-[#DFBC77]/50 bg-[#FAF3E8] p-4 text-center">
                <p className="text-xs text-stone-600">Pay to</p>
                <p className="mt-1 break-all font-mono text-sm font-bold text-[#855F14]">{merchantVpa}</p>
              </div>
              <a
                href={upiLink}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#C59B27] px-4 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-[#A87D17]"
              >
                <Smartphone className="h-4 w-4" />
                Open UPI App
                <ArrowRight className="h-4 w-4" />
              </a>
              <p className="text-center text-[11px] leading-relaxed text-stone-500">
                Complete the payment in your UPI app, then return here. Your order will be saved with payment pending until the transfer is verified.
              </p>
              <button
                type="button"
                onClick={onPaymentSubmitted}
                className="w-full rounded-xl border border-[#DFBC77] bg-white px-4 py-3 text-xs font-bold text-[#855F14] transition hover:bg-[#FCF9F2]"
              >
                I have completed the UPI payment
              </button>
            </>
          ) : (
            <div role="alert" className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
              UPI payments are not configured yet. Add your business UPI ID as <code className="font-mono font-bold">VITE_UPI_ID</code> to the frontend environment, then rebuild and deploy.
            </div>
          )}

          <div className="flex items-center justify-center gap-1.5 text-[10px] text-stone-400">
            <Lock className="h-3 w-3" />
            UPI payment status is not confirmed automatically
          </div>
        </div>
      </div>
    </div>
  );
}
