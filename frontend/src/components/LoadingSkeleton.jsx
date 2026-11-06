import React from 'react';

/**
 * Base Shimmer Skeleton Element
 */
export function Skeleton({ className = '', rounded = 'rounded-xl', ...props }) {
  return (
    <div
      className={`skeleton-shimmer ${rounded} ${className}`}
      {...props}
    />
  );
}

/**
 * Table Loading Skeleton
 * Generates rhythmic rows mimicking tabular placement records
 */
export function TableSkeleton({ rows = 6, columns = 8, className = '' }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rIdx) => (
        <tr
          key={rIdx}
          className="border-b border-black/[0.04] dark:border-white/[0.04] animate-pulse"
        >
          {Array.from({ length: columns }).map((_, cIdx) => (
            <td key={cIdx} className="p-3.5">
              <div className="flex items-center gap-2.5">
                {cIdx === 0 && (
                  <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                )}
                <div className="space-y-1.5 flex-1">
                  <Skeleton
                    className={`h-3.5 ${
                      cIdx === 0
                        ? 'w-24'
                        : cIdx === 1
                        ? 'w-32'
                        : cIdx === columns - 1
                        ? 'w-16 ml-auto'
                        : 'w-20'
                    }`}
                  />
                  {cIdx <= 1 && (
                    <Skeleton className="h-2.5 w-16 opacity-60" />
                  )}
                </div>
              </div>
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

/**
 * Card Grid Skeleton
 * Mimics company or drive bento cards with header, pills and metadata
 */
export function CardGridSkeleton({ count = 4, columnsClass = 'grid-cols-1 md:grid-cols-2' }) {
  return (
    <div className={`grid ${columnsClass} gap-5`}>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="apple-gloss-tile p-6 flex flex-col justify-between space-y-5 animate-pulse"
        >
          <div>
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3.5 flex-1">
                <Skeleton className="w-13 h-13 rounded-2xl shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/3 opacity-70" />
                </div>
              </div>
              <Skeleton className="h-6 w-18 rounded-full" />
            </div>

            <div className="space-y-2.5 my-4 p-3.5 bg-black/[0.02] dark:bg-white/[0.02] rounded-2xl border border-black/[0.04] dark:border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Skeleton className="w-3.5 h-3.5 rounded-full" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="w-3.5 h-3.5 rounded-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-black/[0.04] dark:border-white/[0.06] flex items-center justify-between">
            <Skeleton className="h-3.5 w-32" />
            <div className="flex items-center gap-1.5">
              <Skeleton className="w-7 h-7 rounded-lg" />
              <Skeleton className="w-7 h-7 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Stat Cards Skeleton
 * Mimics the KPI metric cards on Dashboard & Analytics views
 */
export function StatCardsSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4.5">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="apple-gloss-tile p-4 sm:p-5 rounded-2xl flex flex-col justify-between space-y-3 animate-pulse"
        >
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="w-7 h-7 rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-7 w-24" />
            <Skeleton className="h-2.5 w-32 opacity-70" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Composite Dashboard Skeleton
 */
export function DashboardSkeleton() {
  return (
    <div className="space-y-6 sm:space-y-8 animate-pulse">
      {/* Header bar skeleton */}
      <div className="apple-gloss-tile p-6 sm:p-8 rounded-[32px] space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-7 w-56 sm:w-80" />
            <Skeleton className="h-4 w-40 sm:w-60 opacity-70" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-24 rounded-full" />
            <Skeleton className="h-9 w-28 rounded-full" />
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <StatCardsSkeleton count={4} />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        <div className="apple-bento-card p-6 rounded-[28px] space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
        <div className="apple-bento-card p-6 rounded-[28px] space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

export default Skeleton;
