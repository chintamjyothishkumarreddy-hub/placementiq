import React from 'react';
import { SearchX, RotateCcw, Plus } from 'lucide-react';

/**
 * Universal EmptyState Component
 * Displays polished, helpful guiding copy when zero results are found or lists are empty.
 * Supports both standalone card rendering and table row integration (`asTableRow`).
 */
export default function EmptyState({
  icon: Icon = SearchX,
  title = 'No Records Found',
  description = 'We could not find any records matching your current search parameters or filter criteria.',
  actionLabel,
  onAction,
  actionIcon: ActionIcon = Plus,
  resetLabel = 'Clear Filters',
  onReset,
  className = '',
  asTableRow = false,
  colSpan = 1
}) {
  const content = (
    <div className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 max-w-md mx-auto ${className}`}>
      {/* Icon Squircle Badge with Glow */}
      <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-[24px] liquid-pill flex items-center justify-center text-[#0071e3] dark:text-[#2997ff] mb-4.5 shadow-md relative group">
        <div className="absolute inset-0 rounded-[24px] bg-[#0071e3]/10 dark:bg-[#2997ff]/10 blur-xl opacity-75 group-hover:opacity-100 transition-opacity" />
        <Icon className="w-8 h-8 sm:w-9 sm:h-9 relative z-10 transition-transform group-hover:scale-110" />
      </div>

      {/* Typography */}
      <h3 className="text-base sm:text-lg font-bold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-[#86868b] dark:text-[#a1a1a6] mt-1.5 leading-relaxed max-w-sm">
        {description}
      </p>

      {/* Action / Reset Controls */}
      {(onReset || onAction) && (
        <div className="flex flex-wrap items-center justify-center gap-2.5 mt-5">
          {onReset && (
            <button
              type="button"
              onClick={onReset}
              className="apple-btn-secondary px-4 py-2 text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{resetLabel}</span>
            </button>
          )}

          {onAction && (
            <button
              type="button"
              onClick={onAction}
              className="apple-btn-primary px-4.5 py-2 text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md"
            >
              <ActionIcon className="w-3.5 h-3.5" />
              <span>{actionLabel}</span>
            </button>
          )}
        </div>
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
    <div className="apple-gloss-tile col-span-full w-full my-4 rounded-3xl border border-black/[0.06] dark:border-white/[0.08] overflow-hidden">
      {content}
    </div>
  );
}
