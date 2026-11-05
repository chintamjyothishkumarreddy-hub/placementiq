import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({
  isOpen,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  confirmVariant = "danger", // danger, primary, warning
  onConfirm,
  onClose,
  loading = false
}) {
  if (!isOpen) return null;

  const btnColors = {
    danger: "bg-[#ff3b30] hover:bg-[#e03126] text-white shadow-sm shadow-rose-500/20",
    primary: "apple-btn-primary",
    warning: "bg-[#ff9500] hover:bg-[#e08400] text-white shadow-sm shadow-amber-500/20"
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fade-in font-sans">
      <div className="w-full max-w-md liquid-glass rounded-[28px] shadow-2xl overflow-hidden transform transition-all border border-white/60 dark:border-white/10 animate-modal-pop">
        <div className="p-6 sm:p-7">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-full liquid-pill flex items-center justify-center text-[#ff3b30] shadow-xs">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <h3 className="text-lg font-bold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight mb-2">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-[#86868b] dark:text-[#a1a1a6] leading-relaxed">
            {message}
          </p>
        </div>
        <div className="px-6 sm:p-7 pt-0 pb-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="apple-btn-secondary px-4 py-2 text-xs sm:text-sm font-medium cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-full transition-all flex items-center gap-2 cursor-pointer ${btnColors[confirmVariant] || btnColors.primary}`}
          >
            {loading && <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
