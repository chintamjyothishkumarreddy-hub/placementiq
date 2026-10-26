import React, { useState, useEffect } from 'react';
import {
  Users,
  CheckCircle,
  Briefcase,
  Award,
  TrendingUp,
  DollarSign,
  Building,
  Calendar,
  RefreshCw,
  Filter,
  Layers,
  ArrowUpRight,
  ShieldAlert,
  Sparkles,
  Activity,
  Compass
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
import {
  Users as UsersIcon,
  CheckCircle as CheckCircleIcon,
  Briefcase as BriefcaseIcon,
  Award as AwardIcon,
  TrendingUp as TrendingUpIcon,
  DollarSign as DollarSignIcon,
  Building as BuildingIcon,
  Calendar as CalendarIcon,
  RefreshCw as RefreshCwIcon,
  Filter as FilterIcon,
  Layers as LayersIcon,
  ShieldAlert as ShieldAlertIcon
} from 'lucide-react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage({ onNavigate }) {
  const { user, role, showToast } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters
  const [academicYear, setAcademicYear] = useState('All');
  const [department, setDepartment] = useState('All');
  const [companyId, setCompanyId] = useState('All');
  const [graduationYear, setGraduationYear] = useState('All');

  const fetchStats = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      const params = {};
      if (academicYear !== 'All') params.academic_year = academicYear;
      if (department !== 'All') params.department = department;
      if (companyId !== 'All') params.company_id = companyId;
      if (graduationYear !== 'All') params.graduation_year = graduationYear;

      const res = await api.get('/dashboard/stats', { params });
      setData(res.data);
      if (isManual) showToast('Intelligence telemetry refreshed from core database', 'info');
    } catch (err) {
      showToast('Telemetry acquisition failed', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [academicYear, department, companyId, graduationYear]);

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="relative">
          <div className="w-12 h-12 border-2 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin" />
          <div className="absolute inset-0 rounded-full blur-md bg-cyan-500/20" />
        </div>
        <div className="text-center">
          <span className="editorial-kicker text-[10px] text-cyan-400 block mb-1">
            INITIALIZING CORE TELEMETRY
          </span>
          <p className="font-editorial italic text-slate-300 text-sm">
            Calculating cohort placement intelligence models...
          </p>
        </div>
      </div>
    );
  }

  const { kpis, charts, filter_options } = data || {};

  const statCards = [
    {
      label: 'Registered Cohort',
      value: kpis?.total_registered ?? 0,
      sub: 'Total candidates enrolled',
      icon: UsersIcon,
      accent: 'border-t-cyan-500/80',
      badge: 'COHORT',
      glow: 'shadow-[0_0_15px_rgba(6,182,212,0.15)]'
    },
    {
      label: 'Eligible Candidates',
      value: kpis?.total_eligible ?? 0,
      sub: `${Math.round(((kpis?.total_eligible || 0) / (kpis?.total_registered || 1)) * 100)}% compliance rate`,
      icon: CheckCircleIcon,
      accent: 'border-t-emerald-500/80',
      badge: 'QUALIFIED',
      glow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]'
    },
    {
      label: 'Placed Students',
      value: kpis?.total_placed ?? 0,
      sub: 'Unique verified selections',
      icon: AwardIcon,
      accent: 'border-t-indigo-500/80',
      badge: 'ACCEPTED',
      glow: 'shadow-[0_0_15px_rgba(99,102,241,0.15)]'
    },
    {
      label: 'Unplaced Eligible',
      value: kpis?.unplaced_eligible ?? 0,
      sub: 'High-priority pipeline target',
      icon: ShieldAlertIcon,
      accent: 'border-t-amber-500/80',
      badge: 'PENDING',
      glow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]'
    },
    {
      label: 'Placement % (Eligible)',
      value: `${kpis?.placement_rate_eligible ?? 0}%`,
      sub: 'Success among eligible',
      icon: TrendingUpIcon,
      accent: 'border-t-teal-500/80',
      badge: 'EFFICIENCY',
      glow: 'shadow-[0_0_15px_rgba(20,184,166,0.15)]'
    },
    {
      label: 'Placement % (Cohort)',
      value: `${kpis?.placement_rate_total ?? 0}%`,
      sub: 'Across all registered',
      icon: LayersIcon,
      accent: 'border-t-sky-500/80',
      badge: 'OVERALL',
      glow: 'shadow-[0_0_15px_rgba(14,165,233,0.15)]'
    },
    {
      label: 'Peak Package (CTC)',
      value: `₹${kpis?.highest_salary ?? 0} LPA`,
      sub: 'Maximum campus offer',
      icon: DollarSignIcon,
      accent: 'border-t-purple-500/80',
      badge: 'APEX',
      glow: 'shadow-[0_0_15px_rgba(168,85,247,0.15)]'
    },
    {
      label: 'Average Placed CTC',
      value: `₹${kpis?.average_salary ?? 0} LPA`,
      sub: 'Mean remuneration package',
      icon: DollarSignIcon,
      accent: 'border-t-violet-500/80',
      badge: 'MEAN',
      glow: 'shadow-[0_0_15px_rgba(139,92,246,0.15)]'
    },
    {
      label: 'Median Placed CTC',
      value: `₹${kpis?.median_salary ?? 0} LPA`,
      sub: 'Middle remuneration value',
      icon: DollarSignIcon,
      accent: 'border-t-fuchsia-500/80',
      badge: 'MEDIAN',
      glow: 'shadow-[0_0_15px_rgba(217,70,239,0.15)]'
    },
    {
      label: 'Total Offer Letters',
      value: kpis?.total_offers ?? 0,
      sub: `Across ${kpis?.total_companies ?? 0} enterprises`,
      icon: BriefcaseIcon,
      accent: 'border-t-cyan-500/80',
      badge: 'LETTERS',
      glow: 'shadow-[0_0_15px_rgba(6,182,212,0.15)]'
    },
    {
      label: 'Hiring Partners',
      value: kpis?.total_companies ?? 0,
      sub: 'Active recruiting corporations',
      icon: BuildingIcon,
      accent: 'border-t-rose-500/80',
      badge: 'PARTNERS',
      glow: 'shadow-[0_0_15px_rgba(244,63,94,0.15)]'
    },
    {
      label: 'Active Drives',
      value: kpis?.active_drives ?? 0,
      sub: 'Scheduled & in recruitment',
      icon: CalendarIcon,
      accent: 'border-t-orange-500/80',
      badge: 'LIVE PIPELINE',
      glow: 'shadow-[0_0_15px_rgba(249,115,22,0.15)]'
    }
  ];

  return (
    <div className="space-y-7 animate-fade-in font-sans">
      {/* Editorial Masthead Hero Header */}
      <div className={`p-6 sm:p-8 rounded-3xl intel-card border relative overflow-hidden transition-all ${
        role === 'admin'
          ? 'border-purple-500/30'
          : role === 'placement_officer'
          ? 'border-cyan-500/30'
          : 'border-slate-700/60'
      }`}>
        {/* Subtle decorative glow */}
        <div className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-20 ${
          role === 'admin' ? 'bg-purple-600' : role === 'placement_officer' ? 'bg-cyan-500' : 'bg-slate-500'
        }`} />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-2.5">
              <span className="editorial-kicker text-[10px] text-cyan-400">
                <span className="phosphor-dot phosphor-dot-cyan"></span>
                <span>DOSSIER NO. 2026 // PLACEMENT INTELLIGENCE ARCHIVE</span>
              </span>
              <span className="text-slate-600 font-mono text-xs">|</span>
              <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-widest font-semibold border ${
                role === 'admin'
                  ? 'bg-purple-950/60 text-purple-300 border-purple-500/40'
                  : role === 'placement_officer'
                  ? 'bg-cyan-950/60 text-cyan-300 border-cyan-500/40'
                  : 'bg-slate-900/80 text-slate-300 border-slate-700'
              }`}>
                {role === 'admin' ? 'LVL-4 // ADMINISTRATOR' : role === 'placement_officer' ? 'LVL-3 // PLACEMENT OFFICER' : 'LVL-1 // INSTITUTIONAL VIEWER'}
              </span>
            </div>

            <h1 className="font-editorial text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-white leading-tight">
              {role === 'admin' ? (
                <>
                  Institutional Placement <span className="italic text-cyan-400">Intelligence</span> &amp; Governance Command
                </>
              ) : role === 'placement_officer' ? (
                <>
                  Recruitment Operations &amp; Candidate <span className="italic text-cyan-400">Pipeline</span> Terminal
                </>
              ) : (
                <>
                  Institutional Recruitment <span className="italic text-cyan-400">Dossier</span> &amp; Analytical Ledger
                </>
              )}
            </h1>

            <p className="font-editorial italic text-slate-300 text-sm sm:text-base mt-2 leading-relaxed">
              {role === 'admin'
                ? 'Full system sovereignty active. Direct authorization over staff credentials, dynamic eligibility algorithms, institutional cutoffs, and audit registers.'
                : role === 'placement_officer'
                ? 'Operational management active. Orchestrating campus recruitment drives, validating interview pipelines, recording corporate CTC packages, and generating analytical exports.'
                : 'Executive overview protocol. Inspecting real-time institutional metrics, department benchmark distributions, and verified recruiter records in read-only telemetry.'}
            </p>
          </div>

          {/* Quick Actions / Role Controls */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {role === 'admin' && (
              <>
                <button
                  onClick={() => onNavigate && onNavigate('users')}
                  className="px-4 py-2 bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 hover:text-white border border-white/[0.1] hover:border-purple-500/40 rounded-xl text-xs font-mono font-medium tracking-wider transition-all cursor-pointer"
                >
                  MANAGE USERS
                </button>
                <button
                  onClick={() => onNavigate && onNavigate('rules')}
                  className="px-4 py-2 bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 hover:text-white border border-white/[0.1] hover:border-cyan-500/40 rounded-xl text-xs font-mono font-medium tracking-wider transition-all cursor-pointer"
                >
                  CUTOFF RULES
                </button>
                <button
                  onClick={() => onNavigate && onNavigate('settings')}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600/30 to-indigo-600/30 hover:from-purple-600/40 hover:to-indigo-600/40 text-purple-200 border border-purple-500/40 rounded-xl text-xs font-mono font-medium tracking-wider transition-all cursor-pointer shadow-[0_0_15px_rgba(168,85,247,0.15)]"
                >
                  SYSTEM SETTINGS
                </button>
              </>
            )}
            {role === 'placement_officer' && (
              <>
                <button
                  onClick={() => onNavigate && onNavigate('drives')}
                  className="px-4 py-2 bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 hover:text-white border border-white/[0.1] hover:border-cyan-500/40 rounded-xl text-xs font-mono font-medium tracking-wider transition-all cursor-pointer"
                >
                  SCHEDULE DRIVE
                </button>
                <button
                  onClick={() => onNavigate && onNavigate('students')}
                  className="px-4 py-2 bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 hover:text-white border border-white/[0.1] hover:border-cyan-500/40 rounded-xl text-xs font-mono font-medium tracking-wider transition-all cursor-pointer"
                >
                  STUDENT REGISTER
                </button>
                <button
                  onClick={() => onNavigate && onNavigate('offers')}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-600/30 to-blue-600/30 hover:from-cyan-600/40 hover:to-blue-600/40 text-cyan-200 border border-cyan-500/40 rounded-xl text-xs font-mono font-medium tracking-wider transition-all cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                >
                  OFFERS LEDGER
                </button>
              </>
            )}
            {role === 'viewer' && (
              <>
                <button
                  onClick={() => onNavigate && onNavigate('analytics')}
                  className="px-4 py-2 bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 hover:text-white border border-white/[0.1] hover:border-cyan-500/40 rounded-xl text-xs font-mono font-medium tracking-wider transition-all cursor-pointer"
                >
                  FULL ANALYTICS
                </button>
                <button
                  onClick={() => onNavigate && onNavigate('reports')}
                  className="px-4 py-2 bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 hover:text-white border border-white/[0.1] hover:border-cyan-500/40 rounded-xl text-xs font-mono font-medium tracking-wider transition-all cursor-pointer"
                >
                  INTELLIGENCE REPORTS
                </button>
                <span className="px-3 py-1.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-[10px] font-mono text-slate-400">
                  READ-ONLY ACTIVE
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Intelligence Filter Terminal */}
      <div className="intel-card p-5 rounded-2xl border border-white/[0.08]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <FilterIcon className="w-4 h-4 text-cyan-400" />
            <span className="font-mono text-xs uppercase tracking-wider text-slate-200 font-semibold">
              Filter Query Parameters
            </span>
            <span className="text-slate-600 font-mono text-xs">•</span>
            <span className="text-[10px] font-mono text-cyan-400/80">LIVE SCOPE</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Department */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">DEPT:</span>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="text-xs font-mono py-1.5 px-3 bg-black/50 border border-white/10 rounded-xl text-slate-200 focus:outline-hidden focus:border-cyan-400"
              >
                <option value="All">All Departments</option>
                {filter_options?.departments?.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Academic Year */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">ACAD.YR:</span>
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="text-xs font-mono py-1.5 px-3 bg-black/50 border border-white/10 rounded-xl text-slate-200 focus:outline-hidden focus:border-cyan-400"
              >
                <option value="All">All Academic Years</option>
                {filter_options?.academic_years?.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            {/* Graduation Year */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">GRAD.YR:</span>
              <select
                value={graduationYear}
                onChange={(e) => setGraduationYear(e.target.value)}
                className="text-xs font-mono py-1.5 px-3 bg-black/50 border border-white/10 rounded-xl text-slate-200 focus:outline-hidden focus:border-cyan-400"
              >
                <option value="All">All Grad Years</option>
                {filter_options?.graduation_years?.map((gy) => (
                  <option key={gy} value={gy}>{gy}</option>
                ))}
              </select>
            </div>

            {/* Company */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">PARTNER:</span>
              <select
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
                className="text-xs font-mono py-1.5 px-3 bg-black/50 border border-white/10 rounded-xl text-slate-200 focus:outline-hidden focus:border-cyan-400 max-w-[150px] truncate"
              >
                <option value="All">All Companies</option>
                {filter_options?.companies?.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Refresh */}
            <button
              onClick={() => fetchStats(true)}
              disabled={refreshing}
              className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-white/[0.04] border border-white/10 rounded-xl transition-all cursor-pointer"
              title="Recalculate live telemetry"
            >
              <RefreshCwIcon className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-cyan-400' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* 12 High-Precision KPI Intelligence Metric Units */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="editorial-kicker text-[10px] text-cyan-400">
            <span>INDEX // RECRUITMENT METRIC TELEMETRY MATRIX</span>
          </div>
          <span className="text-[10px] font-mono text-slate-500">REALTIME SYNC</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3.5">
          {statCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className={`intel-card-interactive p-4 rounded-2xl border-t-2 ${card.accent} flex flex-col justify-between relative overflow-hidden`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-mono tracking-[0.2em] uppercase text-cyan-400/90 font-medium">
                      {card.badge}
                    </span>
                    <Icon className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <div className="text-xs font-medium text-slate-300 truncate mb-1">
                    {card.label}
                  </div>
                </div>

                <div className="mt-2">
                  <div className="font-mono-num text-2xl font-bold tracking-tight text-white">
                    {card.value}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 mt-1 truncate">
                    {card.sub}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Intelligence Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Department Performance */}
        <div className="intel-card p-6 rounded-3xl border border-white/[0.08]">
          <div className="flex items-center justify-between mb-5">
            <div>
              <span className="editorial-kicker text-[10px] text-cyan-400 mb-1 block">
                ANALYTICS // FIG. 01
              </span>
              <h3 className="font-editorial text-xl font-semibold text-white tracking-tight">
                Department Performance Ledger
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Total registered vs Eligible vs Placed candidate volume
              </p>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts?.department_stats || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 4" stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis dataKey="department" tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'JetBrains Mono' }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'JetBrains Mono' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(13, 18, 31, 0.95)',
                    borderColor: 'rgba(255, 255, 255, 0.12)',
                    borderRadius: '16px',
                    backdropFilter: 'blur(16px)',
                    fontFamily: 'JetBrains Mono',
                    color: '#f1f5f9'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px', fontFamily: 'JetBrains Mono' }} />
                <Bar dataKey="total" name="Total" fill="#475569" radius={[4, 4, 0, 0]} />
                <Bar dataKey="eligible" name="Eligible" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                <Bar dataKey="placed" name="Placed" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Salary Package Distribution */}
        <div className="intel-card p-6 rounded-3xl border border-white/[0.08]">
          <div className="flex items-center justify-between mb-5">
            <div>
              <span className="editorial-kicker text-[10px] text-cyan-400 mb-1 block">
                ANALYTICS // FIG. 02
              </span>
              <h3 className="font-editorial text-xl font-semibold text-white tracking-tight">
                Salary Package Distribution (LPA)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Frequency distribution across compensation brackets
              </p>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts?.salary_distribution || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 4" stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis dataKey="range" tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'JetBrains Mono' }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'JetBrains Mono' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(13, 18, 31, 0.95)',
                    borderColor: 'rgba(255, 255, 255, 0.12)',
                    borderRadius: '16px',
                    backdropFilter: 'blur(16px)',
                    fontFamily: 'JetBrains Mono',
                    color: '#f1f5f9'
                  }}
                />
                <Bar dataKey="count" name="Offers Extended" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Top Hiring Companies */}
        <div className="intel-card p-6 rounded-3xl border border-white/[0.08]">
          <div className="flex items-center justify-between mb-5">
            <div>
              <span className="editorial-kicker text-[10px] text-cyan-400 mb-1 block">
                ANALYTICS // FIG. 03
              </span>
              <h3 className="font-editorial text-xl font-semibold text-white tracking-tight">
                Recruiter Acquisition Matrix
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Candidate headcount by corporate hiring partner
              </p>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={charts?.company_selections || []} margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="2 4" stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'JetBrains Mono' }} />
                <YAxis type="category" dataKey="company" tick={{ fill: '#cbd5e1', fontSize: 11, fontFamily: 'JetBrains Mono' }} width={90} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(13, 18, 31, 0.95)',
                    borderColor: 'rgba(255, 255, 255, 0.12)',
                    borderRadius: '16px',
                    backdropFilter: 'blur(16px)',
                    fontFamily: 'JetBrains Mono',
                    color: '#f1f5f9'
                  }}
                />
                <Bar dataKey="selections" name="Selections" fill="#06b6d4" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: CGPA Ranges vs Placement */}
        <div className="intel-card p-6 rounded-3xl border border-white/[0.08]">
          <div className="flex items-center justify-between mb-5">
            <div>
              <span className="editorial-kicker text-[10px] text-cyan-400 mb-1 block">
                ANALYTICS // FIG. 04
              </span>
              <h3 className="font-editorial text-xl font-semibold text-white tracking-tight">
                Academic CGPA vs Conversion
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Placement success breakdown by score tiers
              </p>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts?.cgpa_ranges || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 4" stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis dataKey="range" tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'JetBrains Mono' }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'JetBrains Mono' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(13, 18, 31, 0.95)',
                    borderColor: 'rgba(255, 255, 255, 0.12)',
                    borderRadius: '16px',
                    backdropFilter: 'blur(16px)',
                    fontFamily: 'JetBrains Mono',
                    color: '#f1f5f9'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px', fontFamily: 'JetBrains Mono' }} />
                <Bar dataKey="placed" name="Placed" stackId="a" fill="#10b981" />
                <Bar dataKey="unplaced" name="Unplaced" stackId="a" fill="#334155" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 5: Placement Eligibility Breakdown (Donut) */}
        <div className="intel-card p-6 rounded-3xl border border-white/[0.08]">
          <div className="flex items-center justify-between mb-5">
            <div>
              <span className="editorial-kicker text-[10px] text-cyan-400 mb-1 block">
                ANALYTICS // FIG. 05
              </span>
              <h3 className="font-editorial text-xl font-semibold text-white tracking-tight">
                Eligibility Compliance Ratio
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Cohort standing against configured placement rules
              </p>
            </div>
          </div>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts?.eligibility_breakdown || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={62}
                  outerRadius={88}
                  paddingAngle={6}
                  dataKey="count"
                  nameKey="status"
                >
                  {(charts?.eligibility_breakdown || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(7, 9, 14, 0.8)" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(13, 18, 31, 0.95)',
                    borderColor: 'rgba(255, 255, 255, 0.12)',
                    borderRadius: '16px',
                    backdropFilter: 'blur(16px)',
                    fontFamily: 'JetBrains Mono',
                    color: '#f1f5f9'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'JetBrains Mono' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 6: Year Trends (Area) */}
        <div className="intel-card p-6 rounded-3xl border border-white/[0.08]">
          <div className="flex items-center justify-between mb-5">
            <div>
              <span className="editorial-kicker text-[10px] text-cyan-400 mb-1 block">
                ANALYTICS // FIG. 06
              </span>
              <h3 className="font-editorial text-xl font-semibold text-white tracking-tight">
                Historical Progression
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Longitudinal placement trajectory across academic cohorts
              </p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts?.year_trends || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPlaced" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="2 4" stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis dataKey="year" tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'JetBrains Mono' }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'JetBrains Mono' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(13, 18, 31, 0.95)',
                    borderColor: 'rgba(255, 255, 255, 0.12)',
                    borderRadius: '16px',
                    backdropFilter: 'blur(16px)',
                    fontFamily: 'JetBrains Mono',
                    color: '#f1f5f9'
                  }}
                />
                <Area type="monotone" dataKey="placed" name="Placed Students" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorPlaced)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
