import React, { useEffect } from 'react';
import { CheckCircle, AlertTriangle, Info, X, Undo2 } from 'lucide-react';
import useAdminStore from '../../store/useAdminStore';

const icons = {
  success: CheckCircle,
  error: AlertTriangle,
  info: Info,
  warning: AlertTriangle,
};

const colors = {
  success: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300',
  error: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300',
  info: 'bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800 text-sky-800 dark:text-sky-300',
  warning: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300',
};

function Toast({ toast }) {
  const removeToast = useAdminStore(s => s.removeToast);
  const Icon = icons[toast.type] || Info;
  const colorClass = colors[toast.type] || colors.info;
  const duration = toast.duration || 5000;

  useEffect(() => {
    const timer = setTimeout(() => removeToast(toast.id), duration);
    return () => clearTimeout(timer);
  }, [toast.id, duration, removeToast]);

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg animate-slide-up ${colorClass}`}
      style={{ fontFamily: 'Manrope, sans-serif' }}
      role="alert"
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span className="text-sm font-medium flex-1">{toast.message}</span>
      {toast.onUndo && (
        <button
          onClick={() => { toast.onUndo(); removeToast(toast.id); }}
          className="flex items-center gap-1 text-xs font-bold underline hover:no-underline"
          aria-label="Undo action"
        >
          <Undo2 className="w-3.5 h-3.5" /> Undo
        </button>
      )}
      <button
        onClick={() => removeToast(toast.id)}
        className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function ToastContainer() {
  const toasts = useAdminStore(s => s.toasts);
  if (!toasts.length) return null;
  return (
    <div className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-[200] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className="pointer-events-auto">
          <Toast toast={t} />
        </div>
      ))}
    </div>
  );
}
