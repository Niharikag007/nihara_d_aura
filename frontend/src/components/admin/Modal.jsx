import React from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/adminUtils';

export default function Modal({ open, onClose, title, subtitle, children, maxWidth = 'max-w-2xl' }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Panel */}
      <div className={cn(
        'relative w-full bg-white dark:bg-[#1a1717] rounded-2xl border border-[#e9e3dd] dark:border-white/10 shadow-2xl flex flex-col max-h-[90vh] animate-slide-up',
        maxWidth
      )}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e9e3dd] dark:border-white/8 flex-shrink-0">
          <div>
            <h2 className="font-serif text-lg font-bold text-stone-900 dark:text-white" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5" style={{ fontFamily: 'Manrope, sans-serif' }}>
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 px-6 py-5">
          {children}
        </div>
      </div>
    </div>
  );
}
