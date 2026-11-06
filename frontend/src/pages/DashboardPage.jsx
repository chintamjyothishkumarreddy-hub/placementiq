import React, { useState, useEffect, useCallback } from 'react';
import {
  Users,
  CheckCircle2,
  Briefcase,
  Award,
  TrendingUp,
  DollarSign,
  Building2,
  Calendar,
  RefreshCw,
  Filter,
  Layers,
  ShieldAlert,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Target,
  BarChart3,
  Star,
  ChevronRight,
  Flame,
  Clock,
  HelpCircle
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
  Cell,
  AreaChart,
  Area
} from 'recharts';
import api, { getErrorMessage } from '../api';
import { useAuth } from '../context/AuthContext';
import { PlacementIQEmblem } from '../components/Logo';
import { DashboardSkeleton } from '../components/LoadingSkeleton';
import ErrorState from '../components/ErrorState';

export default function DashboardPage({ onNavigate }) {
  const { user, role, showToast } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  // Filters
  const [academicYear, setAcademicYear] = useState('All');
  const [department, setDepartment] = useState('All');
  const [companyId, setCompanyId] = useState('All');
  const [graduationYear, setGraduationYear] = useState('All');

  // Chart Interactive View Modes
  const [deptChartMode, setDeptChartMode] = useState('volume'); // 'volume' | 'rate'

  const fetchStats = useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);
    setFetchError(null);

    try {
      const params = {};
      if (academicYear !== 'All') params.academic_year = academicYear;
      if (department !== 'All') params.department = department;
      if (companyId !== 'All') params.company_id = companyId;
      if (graduationYear !== 'All') params.graduation_year = graduationYear;

      const res = await api.get('/dashboard/stats', { params });
      setData(res.data);
      if (isManual) showToast('Campus metrics synchronized with live database', 'info');
    } catch (err) {
      const msg = getErrorMessage(err, 'Failed to load dashboard metrics');
      setFetchError(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [academicYear, department, companyId, graduationYear, showToast]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading && !data) {
    return <DashboardSkeleton />;
  }

  if (fetchError && !data) {
    return (
      <div className="apple-gloss-tile p-8 sm:p-12 rounded-[32px]">
        <ErrorState
          title="Dashboard Intelligence Unavailable"
          message={fetchError}
          onRetry={() => fetchStats()}
        />
      </div>
    );
  }

  const { kpis, charts, filter_options } = data || {};

  // Custom Glass Tooltip
  const CustomGlassTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="liquid-glass p-3.5 rounded-2xl shadow-2xl border border-black/10 dark:border-white/15 text-xs backdrop-blur-2xl">
          <p className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-2 pb-1 border-b border-black/5 dark:border-white/10 flex items-center justify-between gap-4">
            <span>{label}</span>
            <span className="text-[10px] text-[#86868b] font-normal">PlacementIQ</span>
          </p>
          <div className="space-y-1.5">
            {payload.map((item, i) => (
              <div key={i} className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-2 text-[#86868b] dark:text-[#a1a1a6]">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                    style={{ backgroundColor: item.color || item.fill }}
                  />
                  <span>{item.name}:</span>
                </span>
                <span className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
                  {typeof item.value === 'number' && item.name?.toLowerCase().includes('rate')
                    ? `${item.value}%`
                    : typeof item.value === 'number' && item.name?.toLowerCase().includes('ctc')
                    ? `₹${item.value} LPA`
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

  // Quick department chips list
  const quickDepts = ['All', ...(filter_options?.departments || []).slice(0, 5)];

  // Multiple offers index
  const multiOfferRatio = kpis?.total_placed > 0 ? (kpis?.total_offers / kpis?.total_placed).toFixed(2) : '1.00';

  return (
    <div className="space-y-6">
      {/* =========================================================================
          1. DYNAMIC CAMPUS INTELLIGENCE COMMAND BAR (Hero Spotlight)
      ========================================================================== */}
      <div className="apple-gloss-tile p-6 sm:p-8 rounded-[32px] relative overflow-hidden">
        {/* Ambient Chromatic Glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-[#0071e3]/20 via-[#af52de]/15 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-gradient-to-tr from-[#34c759]/15 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            {/* Status Pills Row */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 liquid-pill text-xs font-semibold text-[#34c759] shadow-xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34c759] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#34c759]" />
                </span>
                <span>Active Placement Season 2025–26</span>
              </div>

              <span className={`liquid-pill px-3 py-1 text-xs font-semibold tracking-wide ${
                role === 'admin'
                  ? 'text-purple-600 dark:text-purple-400'
                  : role === 'placement_officer'
                  ? 'text-[#0071e3] dark:text-[#2997ff]'
                  : 'text-[#86868b] dark:text-[#a1a1a6]'
              }`}>
                {role === 'admin' ? 'Executive Admin' : role === 'placement_officer' ? 'Placement Officer' : 'Viewer (Read-Only)'}
              </span>

              <span className="text-xs text-[#86868b] dark:text-[#a1a1a6] hidden sm:inline">
                • {user?.full_name || user?.username}
              </span>
            </div>

            {/* Headline Title */}
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7]">
                Placement <span className="apple-siri-gradient-text">Intelligence Studio</span>
              </h1>
              <p className="text-xs sm:text-sm text-[#86868b] dark:text-[#a1a1a6] mt-1.5 max-w-2xl leading-relaxed">
                Live recruitment telemetry, compensation distribution analytics, and institutional student eligibility metrics updated in real-time.
              </p>
            </div>
          </div>

          {/* Quick Action Dock */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {role === 'admin' && (
              <>
                <button
                  onClick={() => onNavigate && onNavigate('rules')}
                  className="apple-btn-secondary px-4 py-2.5 text-xs font-medium cursor-pointer flex items-center gap-2"
                >
                  <Target className="w-3.5 h-3.5 text-[#af52de]" />
                  <span>Cutoff Rules</span>
                </button>
                <button
                  onClick={() => onNavigate && onNavigate('enquiries')}
                  className="apple-btn-secondary px-4 py-2.5 text-xs font-medium cursor-pointer flex items-center gap-2"
                  title="Review institutional inquiries"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                  <span>Inquiries Desk</span>
                </button>
                <button
                  onClick={() => onNavigate && onNavigate('users')}
                  className="apple-btn-secondary px-4 py-2.5 text-xs font-medium cursor-pointer flex items-center gap-2"
                >
                  <Users className="w-3.5 h-3.5 text-[#0071e3]" />
                  <span>User Directory</span>
                </button>
              </>
            )}

            {role === 'placement_officer' && (
              <>
                <button
                  onClick={() => onNavigate && onNavigate('drives')}
                  className="apple-btn-secondary px-4 py-2.5 text-xs font-medium cursor-pointer flex items-center gap-2"
                >
                  <Briefcase className="w-3.5 h-3.5 text-[#0071e3]" />
                  <span>Drives Hub</span>
                </button>
                <button
                  onClick={() => onNavigate && onNavigate('offers')}
                  className="apple-btn-secondary px-4 py-2.5 text-xs font-medium cursor-pointer flex items-center gap-2"
                >
                  <Award className="w-3.5 h-3.5 text-[#34c759]" />
                  <span>Record Offers</span>
                </button>
              </>
            )}

            <button
              onClick={() => onNavigate && onNavigate('reports')}
              className="apple-btn-primary px-4 py-2.5 text-xs font-medium cursor-pointer flex items-center gap-2 shadow-md"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Full Analytics Brief</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-80" />
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. CONTROL CENTER FLOATING FILTER CAPSULE
      ========================================================================== */}
      <div className="liquid-glass rounded-[24px] p-4 sm:p-5 shadow-lg border border-black/[0.06] dark:border-white/[0.08]">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          
          {/* Quick Department Segmented Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 xl:pb-0 scrollbar-none">
            <span className="text-xs font-semibold text-[#86868b] dark:text-[#a1a1a6] flex items-center gap-1.5 shrink-0 mr-1">
              <Filter className="w-3.5 h-3.5 text-[#0071e3] dark:text-[#2997ff]" />
              <span>Scope:</span>
            </span>

            {quickDepts.map((d) => {
              const isSelected = department === d;
              return (
                <button
                  key={d}
                  onClick={() => setDepartment(d)}
                  className={`text-xs px-3.5 py-1.5 rounded-full transition-all shrink-0 cursor-pointer font-medium ${
                    isSelected
                      ? 'bg-[#0071e3] text-white shadow-sm font-semibold'
                      : 'bg-black/5 dark:bg-white/5 text-[#86868b] dark:text-[#a1a1a6] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7]'
                  }`}
                >
                  {d === 'All' ? 'All Cohorts' : d}
                </button>
              );
            })}
          </div>

          {/* Deep Dropdown Selectors */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Academic Year */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-[#86868b] dark:text-[#a1a1a6] font-medium">Batch:</span>
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="text-xs font-medium py-1.5 px-3 bg-white/70 dark:bg-white/10 border border-black/10 dark:border-white/10 rounded-xl focus:outline-hidden focus:border-[#0071e3] transition-colors cursor-pointer text-[#1d1d1f] dark:text-[#f5f5f7]"
              >
                <option value="All">All Batches</option>
                {filter_options?.academic_years?.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            {/* Graduation Year */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-[#86868b] dark:text-[#a1a1a6] font-medium">Class:</span>
              <select
                value={graduationYear}
                onChange={(e) => setGraduationYear(e.target.value)}
                className="text-xs font-medium py-1.5 px-3 bg-white/70 dark:bg-white/10 border border-black/10 dark:border-white/10 rounded-xl focus:outline-hidden focus:border-[#0071e3] transition-colors cursor-pointer text-[#1d1d1f] dark:text-[#f5f5f7]"
              >
                <option value="All">All Years</option>
                {filter_options?.graduation_years?.map((gy) => (
                  <option key={gy} value={gy}>{gy}</option>
                ))}
              </select>
            </div>

            {/* Recruiter */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-[#86868b] dark:text-[#a1a1a6] font-medium">Recruiter:</span>
              <select
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
                className="text-xs font-medium py-1.5 px-3 bg-white/70 dark:bg-white/10 border border-black/10 dark:border-white/10 rounded-xl focus:outline-hidden focus:border-[#0071e3] transition-colors cursor-pointer text-[#1d1d1f] dark:text-[#f5f5f7] max-w-[140px] truncate"
              >
                <option value="All">All Recruiters</option>
                {filter_options?.companies?.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Sync Database Button */}
            <button
              onClick={() => fetchStats(true)}
              disabled={refreshing}
              className="liquid-pill p-2 text-[#0071e3] dark:text-[#2997ff] hover:opacity-80 transition-opacity cursor-pointer shrink-0"
              title="Synchronize live database"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          3. BENTO GRID V2: ASYMMETRICAL SPOTLIGHTS
      ========================================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
        
        {/* Spotlight 1: Placement Velocity & Activity Ring (Col-span 4) */}
        <div className="lg:col-span-4 apple-gloss-tile p-6 rounded-[28px] flex flex-col justify-between group hover:border-[#34c759]/30 transition-all">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl liquid-pill flex items-center justify-center text-[#34c759] shadow-2xs">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">
                    Placement Velocity
                  </h3>
                  <span className="text-[11px] text-[#86868b] dark:text-[#a1a1a6]">
                    Eligible Cohort Conversion
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#34c759]/10 text-[#34c759] border border-[#34c759]/20">
                Peak Rate
              </span>
            </div>

            {/* Activity Ring Graphic */}
            <div className="flex items-center justify-center my-3">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="48"
                    className="stroke-black/5 dark:stroke-white/10"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="48"
                    stroke="url(#piqActivityGrad)"
                    strokeWidth="10"
                    strokeDasharray={2 * Math.PI * 48}
                    strokeDashoffset={2 * Math.PI * 48 * (1 - (kpis?.placement_rate_eligible || 0) / 100)}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient id="piqActivityGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#30d158" />
                      <stop offset="100%" stopColor="#0071e3" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-3xl font-bold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7]">
                    {kpis?.placement_rate_eligible ?? 0}%
                  </span>
                  <span className="text-[10px] font-semibold text-[#86868b] dark:text-[#a1a1a6] uppercase tracking-wider mt-0.5">
                    Converted
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Metric Comparison Capsule */}
          <div className="pt-3 border-t border-black/[0.06] dark:border-white/[0.08] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#86868b] dark:text-[#a1a1a6]">Placed / Eligible:</span>
              <span className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
                {kpis?.total_placed ?? 0} of {kpis?.total_eligible ?? 0} candidates
              </span>
            </div>
            {/* Visual Micro Progress Bar */}
            <div className="w-full bg-black/5 dark:bg-white/10 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#30d158] to-[#0071e3] h-full rounded-full transition-all duration-1000"
                style={{ width: `${Math.min(kpis?.placement_rate_eligible || 0, 100)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#86868b] pt-0.5">
              <span>Overall Cohort Rate:</span>
              <span className="font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">{kpis?.placement_rate_total ?? 0}%</span>
            </div>
          </div>
        </div>

        {/* Spotlight 2: Compensation Horizon & Salary Spectrum (Col-span 4) */}
        <div className="lg:col-span-4 apple-gloss-tile p-6 rounded-[28px] flex flex-col justify-between group hover:border-[#af52de]/30 transition-all">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl liquid-pill flex items-center justify-center text-[#af52de] shadow-2xs">
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">
                    Compensation Horizon
                  </h3>
                  <span className="text-[11px] text-[#86868b] dark:text-[#a1a1a6]">
                    Campus Package Spectrum
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#af52de]/10 text-[#af52de] border border-[#af52de]/20">
                INR LPA
              </span>
            </div>

            {/* Peak Package Big Stat */}
            <div className="my-2 p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-purple-500/5 to-transparent border border-amber-500/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-amber-700 dark:text-amber-400">
                  Peak Campus Offer
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300">
                  Top 1% Tier
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7] mt-1">
                ₹{kpis?.highest_salary ?? 0} <span className="text-sm font-semibold text-[#86868b]">LPA</span>
              </div>
            </div>

            {/* Average & Median Metrics Row */}
            <div className="grid grid-cols-2 gap-3 my-2">
              <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                <div className="text-[11px] text-[#86868b] dark:text-[#a1a1a6] font-medium">Mean Placed CTC</div>
                <div className="text-lg font-bold text-[#1d1d1f] dark:text-[#f5f5f7] mt-0.5">
                  ₹{kpis?.average_salary ?? 0} <span className="text-xs font-normal text-[#86868b]">LPA</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                <div className="text-[11px] text-[#86868b] dark:text-[#a1a1a6] font-medium">Median Benchmark</div>
                <div className="text-lg font-bold text-[#1d1d1f] dark:text-[#f5f5f7] mt-0.5">
                  ₹{kpis?.median_salary ?? 0} <span className="text-xs font-normal text-[#86868b]">LPA</span>
                </div>
              </div>
            </div>
          </div>

          {/* Salary Tier Spectrum Micro-Bar */}
          <div className="pt-3 border-t border-black/[0.06] dark:border-white/[0.08]">
            <div className="flex items-center justify-between text-[11px] text-[#86868b] mb-1.5">
              <span>Tier Distribution:</span>
              <span>5 Brackets Active</span>
            </div>
            <div className="flex h-2 rounded-full overflow-hidden gap-1 bg-black/5 dark:bg-white/10 p-0.5">
              <div className="bg-[#30b0c7] h-full rounded-xs w-[20%]" title="<4 LPA" />
              <div className="bg-[#0071e3] h-full rounded-xs w-[25%]" title="4-7 LPA" />
              <div className="bg-[#5856d6] h-full rounded-xs w-[30%]" title="7-12 LPA" />
              <div className="bg-[#af52de] h-full rounded-xs w-[15%]" title="12-20 LPA" />
              <div className="bg-[#ffd60a] h-full rounded-xs w-[10%]" title="20+ LPA" />
            </div>
          </div>
        </div>

        {/* Spotlight 3: Recruitment Partner Radar & Pipeline (Col-span 4) */}
        <div className="lg:col-span-4 apple-gloss-tile p-6 rounded-[28px] flex flex-col justify-between group hover:border-[#0071e3]/30 transition-all">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl liquid-pill flex items-center justify-center text-[#0071e3] dark:text-[#2997ff] shadow-2xs">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">
                    Recruitment Radar
                  </h3>
                  <span className="text-[11px] text-[#86868b] dark:text-[#a1a1a6]">
                    Active Drives & Pipeline
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-[#0071e3] dark:text-[#2997ff] border border-blue-500/20">
                {kpis?.active_drives ?? 0} Live Drives
              </span>
            </div>

            {/* Quick Metrics Capsule */}
            <div className="space-y-3 my-2">
              <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#0071e3]/10 text-[#0071e3] dark:text-[#2997ff] flex items-center justify-center">
                    <Briefcase className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
                      {kpis?.total_offers ?? 0} Total Job Offers
                    </div>
                    <div className="text-[10px] text-[#86868b]">
                      Released by {kpis?.total_companies ?? 0} enterprise recruiters
                    </div>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#86868b]" />
              </div>

              <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#34c759]/10 text-[#34c759] flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
                      {multiOfferRatio}x Offer Multiplier
                    </div>
                    <div className="text-[10px] text-[#86868b]">
                      Avg offers per placed candidate
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-[#34c759] bg-[#34c759]/10 px-2 py-0.5 rounded-full">
                  Healthy
                </span>
              </div>
            </div>
          </div>

          {/* Quick Direct Link to Drives */}
          <div className="pt-3 border-t border-black/[0.06] dark:border-white/[0.08]">
            <button
              onClick={() => onNavigate && onNavigate('drives')}
              className="w-full apple-btn-secondary py-2 text-xs font-medium cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Manage Campus Recruitment Drives</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* =========================================================================
          4. ESSENTIAL COHORT TILES (Compact 4-Pill Array)
      ========================================================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tile 1: Registered Pool */}
        <div className="apple-gloss-tile p-4 rounded-2xl flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl liquid-pill flex items-center justify-center text-[#0071e3] dark:text-[#2997ff] shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-medium text-[#86868b] dark:text-[#a1a1a6] truncate">
              Registered Cohort
            </div>
            <div className="text-xl sm:text-2xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">
              {kpis?.total_registered ?? 0}
            </div>
            <div className="text-[10px] text-[#86868b] truncate">Active student records</div>
          </div>
        </div>

        {/* Tile 2: Verified Eligible */}
        <div className="apple-gloss-tile p-4 rounded-2xl flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl liquid-pill flex items-center justify-center text-[#34c759] shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-medium text-[#86868b] dark:text-[#a1a1a6] truncate">
              Verified Eligible
            </div>
            <div className="text-xl sm:text-2xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">
              {kpis?.total_eligible ?? 0}
            </div>
            <div className="text-[10px] text-[#34c759] font-medium truncate">
              {Math.round(((kpis?.total_eligible || 0) / (kpis?.total_registered || 1)) * 100)}% compliance
            </div>
          </div>
        </div>

        {/* Tile 3: Placed Students */}
        <div className="apple-gloss-tile p-4 rounded-2xl flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl liquid-pill flex items-center justify-center text-[#af52de] shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-medium text-[#86868b] dark:text-[#a1a1a6] truncate">
              Total Placed
            </div>
            <div className="text-xl sm:text-2xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">
              {kpis?.total_placed ?? 0}
            </div>
            <div className="text-[10px] text-[#af52de] font-medium truncate">With verified offers</div>
          </div>
        </div>

        {/* Tile 4: Unplaced Eligible */}
        <div className="apple-gloss-tile p-4 rounded-2xl flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl liquid-pill flex items-center justify-center text-[#ff9500] shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-medium text-[#86868b] dark:text-[#a1a1a6] truncate">
              Awaiting Placement
            </div>
            <div className="text-xl sm:text-2xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">
              {kpis?.unplaced_eligible ?? 0}
            </div>
            <div className="text-[10px] text-[#ff9500] font-medium truncate">Eligible in pipeline</div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          5. INTERACTIVE BENTO VISUAL INTELLIGENCE CHARTS
      ========================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Chart 1: Department Performance Matrix (Interactive View Toggle) */}
        <div className="apple-bento-card p-6 rounded-[28px]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <h3 className="text-base font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">
                Department Cohort Performance
              </h3>
              <p className="text-xs text-[#86868b] dark:text-[#a1a1a6] mt-0.5">
                Total registered vs Eligible vs Placed across academic programs
              </p>
            </div>

            {/* Segmented Mode Control */}
            <div className="inline-flex p-1 rounded-xl bg-black/5 dark:bg-white/10 shrink-0 text-xs">
              <button
                onClick={() => setDeptChartMode('volume')}
                className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  deptChartMode === 'volume'
                    ? 'bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-[#f5f5f7] shadow-xs font-semibold'
                    : 'text-[#86868b]'
                }`}
              >
                Volume Count
              </button>
              <button
                onClick={() => setDeptChartMode('rate')}
                className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  deptChartMode === 'rate'
                    ? 'bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-[#f5f5f7] shadow-xs font-semibold'
                    : 'text-[#86868b]'
                }`}
              >
                Conversion %
              </button>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {deptChartMode === 'volume' ? (
                <BarChart data={charts?.department_stats || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.08} />
                  <XAxis dataKey="department" tick={{ fontSize: 11, fill: '#86868b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#86868b' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomGlassTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Bar dataKey="total" name="Total Students" fill="#86868b" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="eligible" name="Eligible" fill="#0071e3" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="placed" name="Placed" fill="#34c759" radius={[6, 6, 0, 0]} />
                </BarChart>
              ) : (
                <BarChart data={charts?.department_stats || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.08} />
                  <XAxis dataKey="department" tick={{ fontSize: 11, fill: '#86868b' }} axisLine={false} tickLine={false} />
                  <YAxis unit="%" tick={{ fontSize: 11, fill: '#86868b' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomGlassTooltip />} />
                  <Bar dataKey="placement_rate" name="Placement Conversion Rate" fill="#0071e3" radius={[6, 6, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Salary Package Distribution Histogram */}
        <div className="apple-bento-card p-6 rounded-[28px]">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">
                Salary Package Distribution (CTC)
              </h3>
              <p className="text-xs text-[#86868b] dark:text-[#a1a1a6] mt-0.5">
                Compensation frequency grouped by annual salary tiers
              </p>
            </div>
            <span className="text-xs font-semibold text-[#af52de] bg-[#af52de]/10 px-2.5 py-1 rounded-full border border-[#af52de]/20">
              LPA Brackets
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts?.salary_distribution || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="purpleBarGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#af52de" />
                    <stop offset="100%" stopColor="#5856d6" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.08} />
                <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#86868b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#86868b' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomGlassTooltip />} />
                <Bar dataKey="count" name="Placed Students" fill="url(#purpleBarGrad)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Top Hiring Enterprise Partners */}
        <div className="apple-bento-card p-6 rounded-[28px]">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">
                Top Hiring Partners & Intake
              </h3>
              <p className="text-xs text-[#86868b] dark:text-[#a1a1a6] mt-0.5">
                Number of student selections by enterprise recruiter
              </p>
            </div>
            <button
              onClick={() => onNavigate && onNavigate('companies')}
              className="text-xs font-medium text-[#0071e3] dark:text-[#2997ff] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={charts?.company_selections || []}
                margin={{ top: 5, right: 20, left: 35, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.08} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#86868b' }} axisLine={false} tickLine={false} />
                <YAxis
                  type="category"
                  dataKey="company"
                  tick={{ fontSize: 11, fill: '#86868b' }}
                  width={100}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomGlassTooltip />} />
                <Bar dataKey="selections" name="Selections" fill="#0071e3" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: CGPA Tiers vs Placement Outcome */}
        <div className="apple-bento-card p-6 rounded-[28px]">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">
                CGPA Academic Tier vs Placement
              </h3>
              <p className="text-xs text-[#86868b] dark:text-[#a1a1a6] mt-0.5">
                Placement conversion correlation across cumulative GPA bands
              </p>
            </div>
            <span className="text-xs font-semibold text-[#34c759] bg-[#34c759]/10 px-2.5 py-1 rounded-full border border-[#34c759]/20">
              GPA Correlation
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts?.cgpa_ranges || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.08} />
                <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#86868b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#86868b' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomGlassTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="placed" name="Placed" stackId="cgpa" fill="#34c759" radius={[0, 0, 0, 0]} />
                <Bar dataKey="unplaced" name="Unplaced" stackId="cgpa" fill="#86868b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 5: Eligibility Compliance Donut Ring with Center Counter */}
        <div className="apple-bento-card p-6 rounded-[28px]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">
                Placement Eligibility Compliance
              </h3>
              <p className="text-xs text-[#86868b] dark:text-[#a1a1a6] mt-0.5">
                Student criteria validation against current institutional rules
              </p>
            </div>
          </div>

          <div className="h-64 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts?.eligibility_breakdown || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="status"
                >
                  {(charts?.eligibility_breakdown || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomGlassTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>

            {/* Center Readout */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-6">
              <span className="text-2xl font-bold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7]">
                {kpis?.total_registered ?? 0}
              </span>
              <span className="text-[10px] text-[#86868b] uppercase tracking-wider font-semibold">
                Students
              </span>
            </div>
          </div>
        </div>

        {/* Chart 6: Historical Cohort Progression (Luminous Area Curve) */}
        <div className="apple-bento-card p-6 rounded-[28px]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">
                Batch Placement Progression
              </h3>
              <p className="text-xs text-[#86868b] dark:text-[#a1a1a6] mt-0.5">
                Graduation year historical trajectory and compensation growth
              </p>
            </div>
            <span className="text-xs font-semibold text-[#0071e3] dark:text-[#2997ff] bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
              Trajectory
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts?.year_trends || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="piqAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0071e3" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0071e3" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.08} />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#86868b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#86868b' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomGlassTooltip />} />
                <Area
                  type="monotone"
                  dataKey="placed"
                  name="Placed Students"
                  stroke="#0071e3"
                  strokeWidth={3}
                  fill="url(#piqAreaGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
