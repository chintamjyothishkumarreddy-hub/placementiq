import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, pages, total, limit, onPageChange }) {
  if (total === 0) return null;

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-3.5 px-3 font-mono text-xs text-slate-400 border-t border-white/[0.06]">
      <div className="flex items-center gap-1.5">
        <span className="text-slate-500">// SHOWING</span>
        <span className="font-semibold font-mono-num text-cyan-300 px-1 py-0.5 rounded bg-cyan-950/40 border border-cyan-500/20">{start}–{end}</span>
        <span className="text-slate-500">OF</span>
        <span className="font-semibold font-mono-num text-slate-200">{total}</span>
        <span className="text-slate-500">RECORDS</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="p-1.5 border border-white/[0.08] rounded-lg bg-slate-950/60 text-slate-300 hover:border-cyan-500/40 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
          aria-label="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="px-3 py-1 font-mono text-xs text-slate-300 bg-slate-900/60 border border-white/[0.06] rounded-md">
          PAGE <span className="text-cyan-400 font-semibold">{page}</span> / {pages || 1}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pages}
          className="p-1.5 border border-white/[0.08] rounded-lg bg-slate-950/60 text-slate-300 hover:border-cyan-500/40 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
          aria-label="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
