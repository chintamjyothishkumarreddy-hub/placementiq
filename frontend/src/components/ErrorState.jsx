import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

/**
 * Universal ErrorState Component
 * Displays a non-intrusive, recoverable error state when API queries or views encounter exceptions.
 * Supports inline table row rendering (`asTableRow`) or full panel rendering.
 */
export default function ErrorState({
  title = 'Unable to Load Data',
  message = 'A connection or server error occurred while retrieving this data. Please verify your network and retry.',
  onRetry,
  retryLabel = 'Retry Connection',
  asTableRow = false,
  colSpan = 1,
  className = ''
}) {
  const content = (
    <div className={`flex flex-col items-center justify-center text-center p-8 sm:p-10 max-w-md mx-auto ${className}`}>
      {/* Alert Squircle Badge */}
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-[22px] bg-rose-500/10 dark:bg-rose-500/15 border border-rose-500/25 flex items-center justify-center text-rose-500 mb-4 shadow-sm">
        <AlertCircle className="w-7 h-7 sm:w-8 sm:h-8" />
      </div>

      {/* Typography */}
      <h3 className="text-base sm:text-lg font-bold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-[#86868b] dark:text-[#a1a1a6] mt-1.5 leading-relaxed max-w-sm">
        {message}
      </p>

      {/* Retry Action */}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="apple-btn-secondary mt-5 px-4.5 py-2 text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98] transition-all border-rose-500/20 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{retryLabel}</span>
        </button>
      )}
    </div>
  );

  if (asTableRow) {
    return (
      <tr>
        <td colSpan={colSpan} className="p-4 sm:p-8">
          {content}
        </td>
      </tr>
    );
  }

  return (
    <div className="apple-gloss-tile col-span-full w-full my-4 rounded-3xl border border-rose-500/20 overflow-hidden">
      {content}
    </div>
  );
}
