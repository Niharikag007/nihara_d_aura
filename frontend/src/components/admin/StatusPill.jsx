import React from 'react';

const statusStyles = {
  // Orders & General
  'processing': { bg: 'rgba(217, 128, 26, 0.12)', text: '#d9801a', border: 'rgba(217, 128, 26, 0.25)' },
  'shipped': { bg: 'rgba(122, 79, 209, 0.12)', text: '#7a4fd1', border: 'rgba(122, 79, 209, 0.25)' },
  'delivered': { bg: 'rgba(29, 143, 106, 0.12)', text: '#1d8f6a', border: 'rgba(29, 143, 106, 0.25)' },
  'cancelled': { bg: 'rgba(196, 66, 94, 0.12)', text: '#c4425e', border: 'rgba(196, 66, 94, 0.25)' },

  // Appointments
  'confirmed': { bg: 'rgba(29, 143, 106, 0.12)', text: '#1d8f6a', border: 'rgba(29, 143, 106, 0.25)' },
  'completed': { bg: 'rgba(181, 138, 42, 0.12)', text: '#b58a2a', border: 'rgba(181, 138, 42, 0.25)' },
  'pending': { bg: 'rgba(217, 128, 26, 0.12)', text: '#d9801a', border: 'rgba(217, 128, 26, 0.25)' },

  // Products
  'live': { bg: 'rgba(29, 143, 106, 0.12)', text: '#1d8f6a', border: 'rgba(29, 143, 106, 0.25)' },
  'draft': { bg: 'rgba(150, 150, 150, 0.12)', text: '#78716c', border: 'rgba(150, 150, 150, 0.25)' },
  'low stock': { bg: 'rgba(217, 128, 26, 0.12)', text: '#d9801a', border: 'rgba(217, 128, 26, 0.25)' },
  'out of stock': { bg: 'rgba(196, 66, 94, 0.12)', text: '#c4425e', border: 'rgba(196, 66, 94, 0.25)' },

  // Customers
  'vip': { bg: 'linear-gradient(135deg, rgba(217, 180, 91, 0.2), rgba(181, 138, 42, 0.2))', text: '#b58a2a', border: 'rgba(181, 138, 42, 0.4)' },
  'repeat': { bg: 'rgba(122, 79, 209, 0.12)', text: '#7a4fd1', border: 'rgba(122, 79, 209, 0.25)' },
  'new': { bg: 'rgba(29, 143, 106, 0.12)', text: '#1d8f6a', border: 'rgba(29, 143, 106, 0.25)' },

  // Coupon
  'active': { bg: 'rgba(29, 143, 106, 0.12)', text: '#1d8f6a', border: 'rgba(29, 143, 106, 0.25)' },
  'inactive': { bg: 'rgba(150, 150, 150, 0.12)', text: '#78716c', border: 'rgba(150, 150, 150, 0.25)' },
};

export default function StatusPill({ status, label, size = 'sm' }) {
  if (!status) return null;
  const key = String(status).toLowerCase().trim();
  const style = statusStyles[key] || {
    bg: 'rgba(150, 150, 150, 0.12)',
    text: '#78716c',
    border: 'rgba(150, 150, 150, 0.25)',
  };

  const displayText = label || (status.charAt(0).toUpperCase() + status.slice(1).toLowerCase());
  const sizeClasses = size === 'xs'
    ? 'text-[11px] px-2 py-0.5'
    : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border transition-colors ${sizeClasses}`}
      style={{
        background: style.bg,
        color: style.text,
        borderColor: style.border,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full mr-1.5"
        style={{ backgroundColor: style.text }}
      />
      {displayText}
    </span>
  );
}
