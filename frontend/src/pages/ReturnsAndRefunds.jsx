import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, HelpCircle } from 'lucide-react';
import { api } from '../services/api';

export default function ReturnsAndRefunds() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('refunds'); // 'refunds' | 'replacements'
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api.getOrders()
      .then((res) => {
        if (active && res?.orders) {
          setOrders(res.orders);
        }
      })
      .catch((err) => {
        console.error('Failed to load orders for returns/refunds:', err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  // Filter for any active refund or replacement requests
  const refundItems = orders.filter(
    (o) => (o.status || '').toUpperCase() === 'CANCELLED' || (o.paymentStatus || '').toUpperCase() === 'REFUNDED'
  );
  const replacementItems = orders.filter(
    (o) => (o.status || '').toUpperCase() === 'REPLACEMENT'
  );

  return (
    <div className="min-h-screen bg-transparent">
      {/* Top Header Bar */}
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
        </div>

        {/* Tab Switcher matching user screenshot */}
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

      {/* Main Content Area: Centered Minimalist Empty State matching user screenshot */}
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-center px-4 py-32 sm:py-40">
        
        {/* Stroke device/ticket outline with exclamation point */}
        <div className="mb-4 flex h-24 w-16 flex-col items-center justify-between rounded-2xl border-2 border-stone-300 bg-white/40 p-2 shadow-2xs">
          {/* Top notch */}
          <div className="h-1 w-5 rounded-full bg-stone-300" />
          
          {/* Centered exclamation mark */}
          <div className="flex flex-col items-center gap-1">
            <div className="h-5 w-1.5 rounded-full bg-stone-300" />
            <div className="h-1.5 w-1.5 rounded-full bg-stone-300" />
          </div>

          {/* Bottom spacer */}
          <div className="h-1 w-5 opacity-0" />
        </div>

        {/* Status text */}
        <p className="text-sm font-medium text-stone-500">
          {activeTab === 'refunds'
            ? 'No active refunds found'
            : 'No active replacements found'}
        </p>

        {/* Subtle Help / Policy Link */}
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
    </div>
  );
}
