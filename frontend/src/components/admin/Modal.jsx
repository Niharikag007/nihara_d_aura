import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '../../utils/adminUtils';

export default function Modal({ open, onClose, title, subtitle, children, maxWidth = 'max-w-2xl' }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (!open) return;

    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.paddingRight = prevPaddingRight;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  if (!open || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-hidden overscroll-contain"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
      }}
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop - Full screen opaque dark overlay covering entire viewport */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-[2px] transition-opacity animate-fade-in"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
        }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className={cn(
        'relative z-10 w-full bg-white dark:bg-[#1a1717] rounded-2xl border border-[#e9e3dd] dark:border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] flex flex-col max-h-[90vh] animate-slide-up overscroll-contain',
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
        <div className="overflow-y-auto flex-1 px-6 py-5 overscroll-contain">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
