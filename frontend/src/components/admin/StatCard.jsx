import React from 'react';
import { cn, formatDelta } from '../../utils/adminUtils';

export default function StatCard({ label, value, delta, icon: Icon, iconBg, className }) {
  const d = formatDelta(delta);
  return (
    <div className={cn(
      'bg-white dark:bg-[#1a1717] rounded-[18px] border border-[#e9e3dd] dark:border-white/8 p-5 shadow-sm hover:shadow-md transition-shadow',
      className
    )}>
      <div className="flex items-start justify-between mb-3">
        <span className="text-[13px] font-medium text-stone-500 dark:text-stone-400" style={{ fontFamily: 'Manrope, sans-serif' }}>
          {label}
        </span>
        {Icon && (
          <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0', iconBg || 'bg-amber-50 dark:bg-amber-900/30')}>
            <Icon className="w-[18px] h-[18px] text-amber-600 dark:text-amber-400" />
          </div>
        )}
      </div>
      <div className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-white leading-tight" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
        {value}
      </div>
      {delta != null && (
        <div className={cn('text-xs font-semibold mt-1.5', d.className)} style={{ fontFamily: 'Manrope, sans-serif' }}>
          {d.text} vs previous period
        </div>
      )}
    </div>
  );
}
