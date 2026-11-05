import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, pages, total, limit, onPageChange }) {
  if (total === 0) return null;

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 text-xs sm:text-sm text-[#86868b] dark:text-[#a1a1a6] font-sans">
      <div>
        Showing <span className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">{start}</span> to{' '}
        <span className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">{end}</span> of{' '}
        <span className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">{total}</span> records
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="p-2 liquid-pill text-[#1d1d1f] dark:text-[#f5f5f7] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-opacity"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="px-3 py-1 font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">
          Page {page} of {pages || 1}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pages}
          className="p-2 liquid-pill text-[#1d1d1f] dark:text-[#f5f5f7] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-opacity"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
