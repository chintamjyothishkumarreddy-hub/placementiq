import React, { useState, useEffect, useCallback } from 'react';
import {
  BarChart3,
  TrendingUp,
  PieChart as PieIcon,
  Award,
  Layers,
  DollarSign,
  ArrowUpRight,
  Filter,
  RefreshCw,
  Sparkles,
  Target,
  GraduationCap,
  ShieldCheck,
  ChevronRight,
  Flame,
  Star
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import api, { getErrorMessage } from '../api';
import { useAuth } from '../context/AuthContext';
import { PlacementIQEmblem } from '../components/Logo';
import { DashboardSkeleton } from '../components/LoadingSkeleton';
import ErrorState from '../components/ErrorState';

export default function AnalyticsPage() {
  const { showToast } = useAuth();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [academicYear, setAcademicYear] = useState('All');

  const fetchReport = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const params = {};
      if (academicYear !== 'All') params.academic_year = academicYear;
      const res = await api.get('/reports/comprehensive-summary', { params });
      setReport(res.data);
    } catch (err) {
      const msg = getErrorMessage(err, 'Error loading analytics reports');
      setFetchError(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  }, [academicYear, showToast]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  if (loading && !report) {
    return <DashboardSkeleton />;
  }

  if (fetchError && !report) {
    return (
      <div className="apple-gloss-tile p-8 sm:p-12 rounded-[32px]">
        <ErrorState
          title="Analytics Engine Unavailable"
          message={fetchError}
          onRetry={fetchReport}
        />
      </div>
    );
  }

  const { overview, departments, tiers, cgpa_impact } = report || {};

  const TIER_COLORS = ['#af52de', '#0071e3', '#30d158', '#ff9f0a'];

  const CustomGlassTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="liquid-glass p-3.5 rounded-2xl shadow-2xl border border-black/10 dark:border-white/15 text-xs backdrop-blur-2xl">
          <p className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-1.5 pb-1 border-b border-black/5 dark:border-white/10 flex items-center justify-between gap-4">
            <span>{label}</span>
            <span className="text-[10px] text-[#86868b]">Analytics</span>
          </p>
          <div className="space-y-1">
            {payload.map((item, i) => (
              <div key={i} className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-2 text-[#86868b] dark:text-[#a1a1a6]">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color || item.fill }} />
                  <span>{item.name}:</span>
                </span>
                <span className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
                  {typeof item.value === 'number' && item.name?.toLowerCase().includes('rate')
                    ? `${item.value}%`
                    : item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Studio Hero Command Bar */}
      <div className="apple-gloss-tile p-6 sm:p-8 rounded-[32px] relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-[#0071e3]/20 via-[#af52de]/15 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 liquid-pill text-xs font-semibold text-[#0071e3] dark:text-[#2997ff] shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Multivariate Predictive Intelligence</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7]">
              Placement <span className="apple-siri-gradient-text">Analytics Engine</span>
            </h1>

            <p className="text-xs sm:text-sm text-[#86868b] dark:text-[#a1a1a6] max-w-2xl leading-relaxed">
              Deep cohort modeling, tier-based compensation breakdowns, and direct academic score correlation analysis.
            </p>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-[#86868b] dark:text-[#a1a1a6] font-medium">Batch:</span>
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="text-xs font-medium py-2 px-3.5 bg-white/70 dark:bg-white/10 border border-black/10 dark:border-white/10 rounded-xl focus:outline-hidden focus:border-[#0071e3] transition-colors cursor-pointer text-[#1d1d1f] dark:text-[#f5f5f7]"
              >
                <option value="All">All Batches</option>
                <option value="2024-2025">2024-2025</option>
                <option value="2023-2024">2023-2024</option>
              </select>
            </div>

            <button
              onClick={fetchReport}
              className="liquid-pill p-2.5 text-[#0071e3] dark:text-[#2997ff] hover:opacity-80 transition-opacity cursor-pointer shrink-0"
              title="Refresh Analytics Models"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 4 Bento Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="apple-gloss-tile p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[#86868b] dark:text-[#a1a1a6]">Cohort Placed</span>
            <div className="w-8 h-8 rounded-xl liquid-pill flex items-center justify-center text-[#34c759]">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7]">
              {overview?.placed_students} <span className="text-sm font-normal text-[#86868b]">/ {overview?.total_students}</span>
            </div>
            <div className="text-[11px] font-semibold text-[#34c759] mt-1">
              {overview?.overall_rate}% Overall Cohort Rate
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="apple-gloss-tile p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[#86868b] dark:text-[#a1a1a6]">Eligible Conversion</span>
            <div className="w-8 h-8 rounded-xl liquid-pill flex items-center justify-center text-[#0071e3] dark:text-[#2997ff]">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0071e3] dark:text-[#2997ff]">
              {overview?.eligible_rate}%
            </div>
            <div className="text-[11px] text-[#86868b] mt-1">
              {overview?.placed_students} of {overview?.eligible_students} eligible placed
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="apple-gloss-tile p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[#86868b] dark:text-[#a1a1a6]">Mean Compensation</span>
            <div className="w-8 h-8 rounded-xl liquid-pill flex items-center justify-center text-[#af52de]">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7]">
              ₹{overview?.avg_ctc} <span className="text-sm font-normal text-[#86868b]">LPA</span>
            </div>
            <div className="text-[11px] text-[#86868b] mt-1">
              Average across accepted offers
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="apple-gloss-tile p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[#86868b] dark:text-[#a1a1a6]">Peak Campus Offer</span>
            <div className="w-8 h-8 rounded-xl liquid-pill flex items-center justify-center text-[#ff9f0a]">
              <Star className="w-4 h-4 fill-current" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#ff9f0a]">
              ₹{overview?.highest_ctc} <span className="text-sm font-normal text-[#86868b]">LPA</span>
            </div>
            <div className="text-[11px] text-[#86868b] mt-1">
              Top campus placement package
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compensation Tier Breakdown */}
        <div className="apple-bento-card p-6 rounded-[28px]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">
                Compensation Tier Breakdown
              </h3>
              <p className="text-xs text-[#86868b] dark:text-[#a1a1a6] mt-0.5">
                Tier 1 (&gt;15 LPA), Tier 2 (8-15 LPA), Tier 3 (4-8 LPA), Tier 4 (&lt;4 LPA)
              </p>
            </div>
          </div>

          <div className="h-64 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tiers || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="tier"
                >
                  {(tiers || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={TIER_COLORS[index % TIER_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomGlassTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-6">
              <span className="text-xl font-bold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7]">
                {overview?.placed_students ?? 0}
              </span>
              <span className="text-[9px] text-[#86868b] uppercase tracking-wider font-semibold">
                Offers
              </span>
            </div>
          </div>
        </div>

        {/* CGPA Bracket Placement Rate */}
        <div className="apple-bento-card p-6 rounded-[28px]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">
                CGPA Tier vs Placement Rate (%)
              </h3>
              <p className="text-xs text-[#86868b] dark:text-[#a1a1a6] mt-0.5">
                Direct correlation between academic CGPA tiers and recruitment conversion
              </p>
            </div>
            <span className="text-xs font-semibold text-[#0071e3] dark:text-[#2997ff] bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
              GPA Impact
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cgpa_impact || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.08} />
                <XAxis dataKey="bracket" tick={{ fontSize: 11, fill: '#86868b' }} axisLine={false} tickLine={false} />
                <YAxis unit="%" tick={{ fontSize: 11, fill: '#86868b' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomGlassTooltip />} />
                <Bar dataKey="placement_rate" name="Placement Rate (%)" fill="#0071e3" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Branch-wise Comparative Glass Table */}
      <div className="apple-glass-table-container rounded-[28px] overflow-hidden">
        <div className="p-6 border-b border-black/[0.06] dark:border-white/[0.08]">
          <h3 className="text-base font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">
            Branch-wise Comparative Analysis
          </h3>
          <p className="text-xs text-[#86868b] dark:text-[#a1a1a6] mt-0.5">
            Full department metrics including eligible placement rate, peak offer, and average CTC.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-black/[0.02] dark:bg-white/[0.03] border-b border-black/[0.06] dark:border-white/[0.08] text-[#86868b] font-semibold uppercase tracking-wider text-[11px]">
                <th className="p-3.5 pl-6">Department</th>
                <th className="p-3.5 text-center">Cohort Size</th>
                <th className="p-3.5 text-center">Eligible Students</th>
                <th className="p-3.5 text-center">Placed Students</th>
                <th className="p-3.5 text-center">Eligible Placement %</th>
                <th className="p-3.5 text-right">Highest CTC</th>
                <th className="p-3.5 text-right">Average CTC</th>
                <th className="p-3.5 text-right pr-6">Median CTC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.04] dark:divide-white/[0.04] font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">
              {departments?.map((dept) => (
                <tr key={dept.department} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.03] transition-colors">
                  <td className="p-3.5 pl-6 font-semibold">{dept.department}</td>
                  <td className="p-3.5 text-center text-[#86868b]">{dept.total_students}</td>
                  <td className="p-3.5 text-center">{dept.eligible_students}</td>
                  <td className="p-3.5 text-center font-bold text-[#34c759]">{dept.placed_students}</td>
                  <td className="p-3.5 text-center">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#0071e3]/10 text-[#0071e3] dark:text-[#2997ff]">
                      {dept.eligible_placement_rate}%
                    </span>
                  </td>
                  <td className="p-3.5 text-right font-bold text-[#af52de]">
                    ₹{dept.highest_ctc} LPA
                  </td>
                  <td className="p-3.5 text-right">₹{dept.average_ctc} LPA</td>
                  <td className="p-3.5 text-right pr-6 text-[#86868b]">₹{dept.median_ctc} LPA</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
