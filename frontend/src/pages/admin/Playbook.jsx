import React, { useState } from 'react';
import {
  BookOpen, CheckSquare, Square, Calculator, Sparkles,
  HelpCircle, ShieldAlert, TrendingUp, Scissors, Flame,
  CheckCircle2, RotateCcw, AlertTriangle, ArrowRight
} from 'lucide-react';
import useAdminStore from '../../store/useAdminStore';
import ChartCard from '../../components/admin/ChartCard';
import { formatINR } from '../../utils/adminUtils';

const DEFAULT_CHECKLIST = [
  { id: 'orders', title: 'Fulfill & dispatch pending orders', desc: 'Process all pending shipments before carrier cutoff at 4 PM' },
  { id: 'salon', title: 'Confirm salon artist roster & kits', desc: 'Verify bridal suite reservations and equipment sterilization' },
  { id: 'low_stock', title: 'Review low stock catalog alerts', desc: 'Notify jewellery and cosmetic artisans for replenishment batches' },
  { id: 'unsold', title: 'Review 30-day unsold inventory list', desc: 'Mark sluggish items for 20% promotional discounts or archive' },
  { id: 'financials', title: 'Audit daily cash & UPI settlement', desc: 'Reconcile gateway deposits with dispatched order logs' },
];

export default function Playbook() {
  const {
    darkMode,
    checklist,
    toggleChecklistItem,
    settings,
  } = useAdminStore();

  const todayStr = new Date().toISOString().split('T')[0];
  const isToday = checklist.date === todayStr;
  const completedMap = isToday ? (checklist.items || {}) : {};

  const completedCount = DEFAULT_CHECKLIST.filter(item => completedMap[item.id]).length;
  const progressPct = Math.round((completedCount / DEFAULT_CHECKLIST.length) * 100);

  // Price Calculator State
  const [calcCollection, setCalcCollection] = useState('Jewellery');
  const [calcCost, setCalcCost] = useState('5000');

  const targetMargins = settings.targetMargins || { Jewellery: 18, Makeup: 45, Nails: 55, Candles: 60 };
  const marginPct = targetMargins[calcCollection] || 25;
  const costVal = parseFloat(calcCost) || 0;
  const suggestedPrice = costVal > 0 ? Math.round(costVal / (1 - marginPct / 100)) : 0;
  const grossProfit = suggestedPrice - costVal;

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
            Founder & manager playbook
          </h1>
          <p className={`text-xs sm:text-sm mt-0.5 ${darkMode ? 'text-stone-400' : 'text-stone-500'}`}>
            Daily operating cadence, pricing formula calculator, and inventory lifecycle rules
          </p>
        </div>
      </div>

      {/* ── 2 Columns: Daily Checklist & Pricing Calculator ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Daily Checklist (7 cols) */}
        <div className="lg:col-span-7">
          <ChartCard
            title="Daily operating routine"
            subtitle={`Auto-resets every morning • Completed ${completedCount} of ${DEFAULT_CHECKLIST.length} tasks`}
            action={
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                {progressPct}% completed
              </span>
            }
          >
            {/* Progress bar */}
            <div className="w-full h-2 rounded-full bg-stone-200 dark:bg-stone-800 mb-5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#d9b45b] to-[#b58a2a] transition-all duration-300 rounded-full"
                style={{ width: `${progressPct}%` }}
              />
            </div>

            <div className="space-y-3">
              {DEFAULT_CHECKLIST.map((task) => {
                const done = !!completedMap[task.id];
                return (
                  <button
                    key={task.id}
                    onClick={() => toggleChecklistItem(task.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3.5 ${
                      done
                        ? darkMode ? 'bg-[#181416]/50 border-white/5 opacity-60' : 'bg-stone-50/70 border-stone-200/50 opacity-60'
                        : darkMode ? 'bg-[#121010] border-white/10 hover:border-[#b58a2a]' : 'bg-[#faf9f7] border-stone-200 hover:bg-white hover:border-[#b58a2a]'
                    }`}
                  >
                    <div className="mt-0.5 text-[#b58a2a]">
                      {done ? (
                        <CheckSquare className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <Square className="w-5 h-5 text-stone-400" />
                      )}
                    </div>
                    <div>
                      <h4
                        className={`text-xs sm:text-sm font-semibold ${
                          done ? 'line-through text-stone-400' : darkMode ? 'text-white' : 'text-stone-900'
                        }`}
                      >
                        {task.title}
                      </h4>
                      <p className={`text-xs mt-0.5 ${darkMode ? 'text-stone-400' : 'text-stone-500'}`}>
                        {task.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </ChartCard>
        </div>

        {/* Right Column: Price Calculator by Collection (5 cols) */}
        <div className="lg:col-span-5">
          <ChartCard
            title="Collection margin & price calculator"
            subtitle="Calculates retail MSRP based on supplier cost and target margin"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-stone-700 dark:text-stone-300">
                  Select collection
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.keys(targetMargins).map((col) => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => setCalcCollection(col)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                        calcCollection === col
                          ? 'bg-[#b58a2a] text-white border-[#b58a2a] shadow-sm'
                          : darkMode
                          ? 'bg-[#121010] border-white/10 text-stone-300 hover:bg-white/5'
                          : 'bg-[#faf9f7] border-stone-200 text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <div>{col}</div>
                      <div className="text-[10px] opacity-80">Tgt: {targetMargins[col]}%</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-stone-700 dark:text-stone-300">
                  Artisan / Supplier cost (₹)
                </label>
                <input
                  type="number"
                  min="1"
                  value={calcCost}
                  onChange={(e) => setCalcCost(e.target.value)}
                  placeholder="e.g. 5000"
                  className={`w-full px-3.5 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-[#b58a2a] ${
                    darkMode ? 'bg-[#121010] border-white/10 text-white' : 'bg-white border-stone-200'
                  }`}
                />
              </div>

              {/* Formula readout */}
              <div
                className="p-4 rounded-xl border text-xs space-y-2"
                style={{
                  backgroundColor: darkMode ? '#1e1519' : '#fcf9f2',
                  borderColor: 'rgba(181, 138, 42, 0.3)',
                }}
              >
                <div className="text-stone-500 text-[11px]">
                  Formula: <code>Price = Cost ÷ (1 - Margin%)</code>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t border-inherit">
                  <span className="text-stone-600 dark:text-stone-400">Suggested retail price:</span>
                  <span className="font-serif font-bold text-xl text-[#b58a2a]">
                    {formatINR(suggestedPrice, { compact: false })}
                  </span>
                </div>
                <div className="flex justify-between items-baseline text-[11px] text-stone-500">
                  <span>Gross profit margin:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    +{formatINR(grossProfit, { compact: false })} ({marginPct}%)
                  </span>
                </div>
              </div>
            </div>
          </ChartCard>
        </div>
      </div>

      {/* ── Short Guide on Keep, Discount, Draft & Delete ── */}
      <div
        className={`rounded-[18px] border p-6 transition-all shadow-sm ${
          darkMode ? 'bg-[#181416] border-white/10' : 'bg-white border-[#e9e3dd]'
        }`}
      >
        <h3
          className={`text-xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-[#1e1519]'}`}
          style={{ fontFamily: '"Cormorant Garamond", serif' }}
        >
          Luxury inventory lifecycle framework
        </h3>
        <p className={`text-xs mb-6 ${darkMode ? 'text-stone-400' : 'text-stone-500'}`}>
          A disciplined strategy to keep cash flow strong and protect luxury brand equity
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* 1. KEEP */}
          <div
            className={`p-4 rounded-xl border flex flex-col justify-between ${
              darkMode ? 'bg-[#121010] border-emerald-500/20' : 'bg-emerald-50/50 border-emerald-200'
            }`}
          >
            <div>
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase mb-2">
                <CheckCircle2 className="w-4 h-4" />
                1. Keep & replenish
              </div>
              <h4 className="font-bold text-sm mb-1 text-stone-900 dark:text-white">
                Consistent sellers
              </h4>
              <p className="text-xs text-stone-600 dark:text-stone-400">
                Products selling 5+ units monthly with margin ≥ target. Maintain safe stock of 8–15 units.
              </p>
            </div>
            <div className="mt-4 text-[11px] font-semibold text-emerald-600">
              Rule: Reorder before stock hits ≤ 5
            </div>
          </div>

          {/* 2. DISCOUNT */}
          <div
            className={`p-4 rounded-xl border flex flex-col justify-between ${
              darkMode ? 'bg-[#121010] border-amber-500/20' : 'bg-amber-50/50 border-amber-200'
            }`}
          >
            <div>
              <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase mb-2">
                <TrendingUp className="w-4 h-4" />
                2. Discount (Cut 20%)
              </div>
              <h4 className="font-bold text-sm mb-1 text-stone-900 dark:text-white">
                Unsold in 30 days
              </h4>
              <p className="text-xs text-stone-600 dark:text-stone-400">
                If an item has 0 sales in 30 days, reduce retail price by 15–20% or feature in weekly email edit.
              </p>
            </div>
            <div className="mt-4 text-[11px] font-semibold text-amber-600">
              Rule: Give 14 days under promotional price
            </div>
          </div>

          {/* 3. DRAFT */}
          <div
            className={`p-4 rounded-xl border flex flex-col justify-between ${
              darkMode ? 'bg-[#121010] border-violet-500/20' : 'bg-purple-50/50 border-purple-200'
            }`}
          >
            <div>
              <div className="flex items-center gap-2 text-[#7a4fd1] font-bold text-xs uppercase mb-2">
                <Scissors className="w-4 h-4" />
                3. Move to draft
              </div>
              <h4 className="font-bold text-sm mb-1 text-stone-900 dark:text-white">
                Dormant & seasonal
              </h4>
              <p className="text-xs text-stone-600 dark:text-stone-400">
                If the item remains unsold after discount, take it off the live store to preserve brand prestige.
              </p>
            </div>
            <div className="mt-4 text-[11px] font-semibold text-[#7a4fd1]">
              Rule: Keep in showroom / offline VIP gifting
            </div>
          </div>

          {/* 4. DELETE */}
          <div
            className={`p-4 rounded-xl border flex flex-col justify-between ${
              darkMode ? 'bg-[#121010] border-rose-500/20' : 'bg-rose-50/50 border-rose-200'
            }`}
          >
            <div>
              <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase mb-2">
                <Flame className="w-4 h-4" />
                4. Delete & archive
              </div>
              <h4 className="font-bold text-sm mb-1 text-stone-900 dark:text-white">
                Discontinued SKU
              </h4>
              <p className="text-xs text-stone-600 dark:text-stone-400">
                Permanent purge of supplier line. Melt down precious metal scraps or bundle into sample giveaways.
              </p>
            </div>
            <div className="mt-4 text-[11px] font-semibold text-rose-600">
              Rule: Clean database to keep catalog fast
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
