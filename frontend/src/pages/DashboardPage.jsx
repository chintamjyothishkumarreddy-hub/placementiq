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
  ShieldAlert
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
      if (isManual) showToast('Dashboard data refreshed from database', 'info');
    } catch (err) {
      showToast('Failed to load dashboard metrics', 'error');
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
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-slate-500 font-medium">Calculating database metrics...</p>
      </div>
    );
  }

  const { kpis, charts, filter_options } = data || {};

  const statCards = [
    {
      label: 'Total Registered',
      value: kpis?.total_registered ?? 0,
      sub: 'All registered students',
      icon: Users,
      color: 'blue'
    },
    {
      label: 'Eligible Students',
      value: kpis?.total_eligible ?? 0,
      sub: `${Math.round(((kpis?.total_eligible || 0) / (kpis?.total_registered || 1)) * 100)}% of registered`,
      icon: CheckCircle,
      color: 'emerald'
    },
    {
      label: 'Placed Students',
      value: kpis?.total_placed ?? 0,
      sub: 'Unique students with offers',
      icon: Award,
      color: 'indigo'
    },
    {
      label: 'Unplaced Eligible',
      value: kpis?.unplaced_eligible ?? 0,
      sub: 'Eligible awaiting placement',
      icon: ShieldAlert,
      color: 'amber'
    },
    {
      label: 'Placement % (Eligible)',
      value: `${kpis?.placement_rate_eligible ?? 0}%`,
      sub: 'Rate among eligible',
      icon: TrendingUp,
      color: 'teal'
    },
    {
      label: 'Placement % (Total)',
      value: `${kpis?.placement_rate_total ?? 0}%`,
      sub: 'Rate among all students',
      icon: Layers,
      color: 'sky'
    },
    {
      label: 'Highest Package',
      value: `₹${kpis?.highest_salary ?? 0} LPA`,
      sub: 'Peak campus offer',
      icon: DollarSign,
      color: 'purple'
    },
    {
      label: 'Average Package',
      value: `₹${kpis?.average_salary ?? 0} LPA`,
      sub: 'Mean placed salary',
      icon: DollarSign,
      color: 'violet'
    },
    {
      label: 'Median Package',
      value: `₹${kpis?.median_salary ?? 0} LPA`,
      sub: 'Median placed CTC',
      icon: DollarSign,
      color: 'fuchsia'
    },
    {
      label: 'Total Job Offers',
      value: kpis?.total_offers ?? 0,
      sub: `Across ${kpis?.total_companies ?? 0} companies`,
      icon: Briefcase,
      color: 'cyan'
    },
    {
      label: 'Participating Companies',
      value: kpis?.total_companies ?? 0,
      sub: 'Recruiters on record',
      icon: Building,
      color: 'rose'
    },
    {
      label: 'Active Drives',
      value: kpis?.active_drives ?? 0,
      sub: 'Upcoming or In Progress',
      icon: Calendar,
      color: 'orange'
    }
  ];

  const colorStyles = {
    blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    indigo: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    teal: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20',
    sky: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
    purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    violet: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20',
    fuchsia: 'bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 border-fuchsia-500/20',
    cyan: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
    rose: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    orange: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20'
  };

  return (
    <div className="space-y-6">
      {/* Role-Specific Hero Header */}
      <div className={`p-5 sm:p-6 rounded-3xl border shadow-2xs transition-all ${
        role === 'admin'
          ? 'bg-gradient-to-r from-purple-500/10 via-indigo-500/5 to-transparent dark:from-purple-950/40 dark:via-indigo-950/20 dark:to-transparent border-purple-200 dark:border-purple-800/50'
          : role === 'placement_officer'
          ? 'bg-gradient-to-r from-blue-500/10 via-sky-500/5 to-transparent dark:from-blue-950/40 dark:via-sky-950/20 dark:to-transparent border-blue-200 dark:border-blue-800/50'
          : 'bg-gradient-to-r from-slate-200/50 via-slate-100/30 to-transparent dark:from-slate-900/60 dark:via-slate-800/30 dark:to-transparent border-slate-200 dark:border-slate-800'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide uppercase border ${
                role === 'admin'
                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300 border-purple-300 dark:border-purple-700'
                  : role === 'placement_officer'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 border-blue-300 dark:border-blue-700'
                  : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700'
              }`}>
                {role === 'admin' ? 'Administrator' : role === 'placement_officer' ? 'Placement Officer' : 'Viewer (Read-Only)'}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                • Authenticated as <strong>{user?.full_name || user?.username}</strong>
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {role === 'admin'
                ? 'Administrator Dashboard & System Control'
                : role === 'placement_officer'
                ? 'Placement Officer Operations Dashboard'
                : 'Campus Placement Overview & Analytics Dashboard'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
              {role === 'admin'
                ? 'Full administrative control active. You can manage system users, configure dynamic CGPA cutoffs & eligibility rules, import/export datasets, inspect audit logs, and oversee campus placement operations.'
                : role === 'placement_officer'
                ? 'Placement operations authorized. Manage recruitment drives, update candidate interview stages, record job offers, track company eligibility, and generate placement reports.'
                : 'Read-only access enabled. You can monitor institutional placement metrics, evaluate department performance, inspect placed student distributions, and review analytics.'}
            </p>
          </div>

          {/* Quick Actions based on role */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {role === 'admin' && (
              <>
                <button
                  onClick={() => onNavigate && onNavigate('users')}
                  className="px-3.5 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                >
                  Manage Users
                </button>
                <button
                  onClick={() => onNavigate && onNavigate('rules')}
                  className="px-3.5 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                >
                  Eligibility Rules
                </button>
                <button
                  onClick={() => onNavigate && onNavigate('settings')}
                  className="px-3.5 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                >
                  System Settings
                </button>
              </>
            )}
            {role === 'placement_officer' && (
              <>
                <button
                  onClick={() => onNavigate && onNavigate('drives')}
                  className="px-3.5 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                >
                  Manage Drives
                </button>
                <button
                  onClick={() => onNavigate && onNavigate('students')}
                  className="px-3.5 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                >
                  Student Records
                </button>
                <button
                  onClick={() => onNavigate && onNavigate('offers')}
                  className="px-3.5 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                >
                  Job Offers
                </button>
              </>
            )}
            {role === 'viewer' && (
              <>
                <button
                  onClick={() => onNavigate && onNavigate('analytics')}
                  className="px-3.5 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                >
                  Full Analytics
                </button>
                <button
                  onClick={() => onNavigate && onNavigate('reports')}
                  className="px-3.5 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                >
                  Placement Reports
                </button>
                <span className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl text-xs font-medium border border-slate-200 dark:border-slate-700">
                  Read-Only Mode
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Filters Bar & Actions */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Dashboard Filters
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Department Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium text-slate-500">Dept:</span>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="text-xs font-semibold py-1.5 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden"
              >
                <option value="All">All Departments</option>
                {filter_options?.departments?.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Academic Year Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium text-slate-500">Academic Year:</span>
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="text-xs font-semibold py-1.5 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden"
              >
                <option value="All">All Years</option>
                {filter_options?.academic_years?.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            {/* Graduation Year Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium text-slate-500">Grad Year:</span>
              <select
                value={graduationYear}
                onChange={(e) => setGraduationYear(e.target.value)}
                className="text-xs font-semibold py-1.5 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden"
              >
                <option value="All">All Grad Years</option>
                {filter_options?.graduation_years?.map((gy) => (
                  <option key={gy} value={gy}>{gy}</option>
                ))}
              </select>
            </div>

            {/* Company Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium text-slate-500">Company:</span>
              <select
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
                className="text-xs font-semibold py-1.5 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden max-w-[150px] truncate"
              >
                <option value="All">All Companies</option>
                {filter_options?.companies?.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Refresh Button */}
            <button
              onClick={() => fetchStats(true)}
              disabled={refreshing}
              className="p-2 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-300 rounded-xl border border-blue-200 dark:border-blue-800 transition-colors"
              title="Refresh metrics from database"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
                  {card.label}
                </span>
                <div className={`p-1.5 rounded-lg border ${colorStyles[card.color]}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {card.value}
                </div>
                <div className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mt-0.5 truncate">
                  {card.sub}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Department-wise Placement Performance */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Department Performance
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Total registered vs Eligible vs Placed students
              </p>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts?.department_stats || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="department" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="total" name="Total" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="eligible" name="Eligible" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="placed" name="Placed" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Salary Package Distribution */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Salary Package Distribution (LPA)
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Placement counts grouped by CTC brackets
              </p>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts?.salary_distribution || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="range" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                />
                <Bar dataKey="count" name="Offers / Placements" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Top Hiring Companies */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Top Hiring Companies & Average CTC
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Number of student selections by recruiter
              </p>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={charts?.company_selections || []} margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="company" tick={{ fontSize: 10 }} width={90} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                />
                <Bar dataKey="selections" name="Selections" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: CGPA Ranges vs Placement */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                CGPA Distribution vs Placement Outcome
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Stacked breakdown across academic score tiers
              </p>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts?.cgpa_ranges || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="range" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="placed" name="Placed" stackId="a" fill="#10b981" />
                <Bar dataKey="unplaced" name="Unplaced" stackId="a" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 5: Placement Eligibility Breakdown (Donut) */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Eligibility Status Breakdown
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Student compliance with current placement rules
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
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="status"
                >
                  {(charts?.eligibility_breakdown || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 6: Year Trends (Area) */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Batch Placement Progression
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Placements and average package trajectory
              </p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts?.year_trends || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                />
                <Area type="monotone" dataKey="placed" name="Placed Students" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
