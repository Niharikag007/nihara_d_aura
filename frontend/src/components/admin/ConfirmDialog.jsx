import React from 'react';
import Modal from './Modal';
import { AlertTriangle } from 'lucide-react';
import useAdminStore from '../../store/useAdminStore';

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  danger = true,
}) {
  const darkMode = useAdminStore(s => s.darkMode);

  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-md">
      <div className="text-center pt-2 pb-1">
        <div
          className="mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4"
          style={{
            backgroundColor: danger ? 'rgba(196, 66, 94, 0.12)' : 'rgba(181, 138, 42, 0.12)',
            color: danger ? '#c4425e' : '#b58a2a',
          }}
        >
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3
          className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-[#1e1519]'}`}
          style={{ fontFamily: '"Cormorant Garamond", serif' }}
        >
          {title}
        </h3>
        <p className={`text-xs sm:text-sm mb-6 ${darkMode ? 'text-stone-300' : 'text-stone-600'}`}>
          {message}
        </p>
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-colors ${
              darkMode
                ? 'border-white/10 text-stone-300 hover:bg-white/5'
                : 'border-stone-300 text-stone-700 hover:bg-stone-100'
            }`}
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm?.();
              onClose?.();
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white transition-opacity hover:opacity-90 shadow-sm"
            style={{
              backgroundColor: danger ? '#c4425e' : '#b58a2a',
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
