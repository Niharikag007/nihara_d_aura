import React from 'react';
import useAdminStore from '../../store/useAdminStore';

export default function ChartCard({
  title,
  subtitle,
  children,
  action,
  className = '',
}) {
  const darkMode = useAdminStore(s => s.darkMode);

  return (
    <div
      className={`rounded-[18px] border p-5 sm:p-6 transition-all duration-200 shadow-sm ${
        darkMode ? 'bg-[#181416] border-white/10' : 'bg-white border-[#e9e3dd]'
      } ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          {title && (
            <h3
              className={`text-lg sm:text-xl font-bold tracking-tight ${
                darkMode ? 'text-white' : 'text-[#1e1519]'
              }`}
              style={{ fontFamily: '"Cormorant Garamond", serif' }}
            >
              {title}
            </h3>
          )}
          {subtitle && (
            <p
              className={`text-xs sm:text-sm mt-0.5 ${
                darkMode ? 'text-stone-400' : 'text-stone-500'
              }`}
              style={{ fontFamily: 'Manrope, sans-serif' }}
            >
              {subtitle}
            </p>
          )}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
      <div>{children}</div>
    </div>
  );
}
