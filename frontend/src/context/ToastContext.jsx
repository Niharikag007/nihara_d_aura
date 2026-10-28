import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const value = useMemo(() => ({ showToast, removeToast }), [showToast, removeToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Toast notifications container matching APK pill toast */}
      <div className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 max-w-md w-full px-4 pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-full bg-[#1C1917]/95 text-white shadow-2xl backdrop-blur-md border border-[#C59B27]/40 text-sm font-medium animate-bounce-in"
          >
            <div className="flex items-center gap-2.5">
              {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#DFBC77]" />}
              {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-red-400" />}
              {toast.type === 'info' && <Info className="w-4 h-4 text-amber-300" />}
              <span>
                {typeof toast.message === 'object' && toast.message !== null
                  ? (toast.message.message || JSON.stringify(toast.message))
                  : String(toast.message || '')}
              </span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 hover:text-[#DFBC77] transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
