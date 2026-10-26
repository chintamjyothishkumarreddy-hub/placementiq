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
    danger: "bg-rose-600/90 hover:bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.3)] border border-rose-500/30",
    primary: "bg-cyan-600/90 hover:bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)] border border-cyan-500/30",
    warning: "bg-amber-600/90 hover:bg-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.3)] border border-amber-500/30"
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md intel-card rounded-2xl shadow-2xl border border-white/[0.12] overflow-hidden transform transition-all">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/[0.05] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="editorial-kicker">// SECURITY DIRECTIVE // CONFIRMATION</div>
          <h3 className="text-xl font-editorial italic font-normal text-white mb-2">{title}</h3>
          <p className="text-xs font-sans text-slate-300 leading-relaxed">{message}</p>
        </div>
        <div className="bg-slate-950/80 px-6 py-4 flex items-center justify-end gap-3 border-t border-white/[0.06]">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 font-mono text-xs text-slate-400 hover:text-white hover:bg-white/[0.05] rounded-xl transition-colors cursor-pointer"
          >
            CANCEL
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 font-mono text-xs font-semibold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${btnColors[confirmVariant] || btnColors.primary}`}
          >
            {loading && <span className="animate-spin w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full" />}
            {confirmText.toUpperCase()}
          </button>
        </div>
      </div>
    </div>
  );
}
