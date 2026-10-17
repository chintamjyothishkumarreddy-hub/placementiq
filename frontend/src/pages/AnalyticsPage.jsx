import React, { useState, useEffect } from 'react';
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
  Download
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
  LineChart,
  Line
} from 'recharts';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function AnalyticsPage() {
  const { showToast } = useAuth();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [academicYear, setAcademicYear] = useState('All');

  const fetchReport = async () => {
    setLoading(true);
    try {
      const params = {};
      if (academicYear !== 'All') params.academic_year = academicYear;
      const res = await api.get('/reports/comprehensive-summary', { params });
      setReport(res.data);
    } catch (err) {
      showToast('Error loading analytics reports', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [academicYear]);

  if (loading && !report) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-slate-500 font-medium">Computing deep statistical models...</p>
      </div>
    );
  }

  const { overview, departments, tiers, cgpa_impact, backlog_impact } = report || {};

  const TIER_COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            Comprehensive Placement Analytics
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Deep multivariate placement insights, salary tier breakdowns, and academic correlation analysis.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
            className="text-xs font-semibold py-1.5 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xs focus:outline-hidden"
          >
            <option value="All">All Academic Batches</option>
            <option value="2024-2025">2024-2025</option>
            <option value="2023-2024">2023-2024</option>
          </select>

          <button
            onClick={fetchReport}
            className="p-2 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 shadow-2xs"
            title="Refresh Analysis"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs font-semibold text-slate-400">Total Placed</span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
            {overview?.placed_students} / {overview?.total_students}
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
            {overview?.overall_rate}% Overall Success Rate
          </span>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs font-semibold text-slate-400">Eligible Conversion</span>
          <div className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400 mt-1">
            {overview?.eligible_rate}%
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            {overview?.placed_students} of {overview?.eligible_students} eligible placed
          </span>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs font-semibold text-slate-400">Average Compensation</span>
          <div className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400 mt-1">
            ₹{overview?.avg_ctc} LPA
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Across all accepted packages</span>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs font-semibold text-slate-400">Highest Offer</span>
          <div className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
            ₹{overview?.highest_ctc} LPA
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Top campus recruitment package</span>
        </div>
      </div>

      {/* Grid: Salary Tiers & Backlog Impact */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Salary Tiers */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">
            Compensation Tier Breakdown
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Tier 1 (&gt;15 LPA), Tier 2 (8-15 LPA), Tier 3 (4-8 LPA), Tier 4 (&lt;4 LPA)
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tiers || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="tier"
                >
                  {(tiers || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={TIER_COLORS[index % TIER_COLORS.length]} />
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

        {/* CGPA Bracket Placement Rate */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">
            CGPA Tier vs Placement Rate (%)
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Direct statistical correlation between academic scores and hiring probability
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cgpa_impact || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="bracket" tick={{ fontSize: 10 }} />
                <YAxis unit="%" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                />
                <Bar dataKey="placement_rate" name="Placement Rate (%)" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Department Comparative Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Branch-wise Comparative Analysis
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Full department metrics including eligible placement rate, peak offer, and average CTC.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
                <th className="p-3">Department</th>
                <th className="p-3 text-center">Cohort Size</th>
                <th className="p-3 text-center">Eligible Students</th>
                <th className="p-3 text-center">Placed Students</th>
                <th className="p-3 text-center">Eligible Placement %</th>
                <th className="p-3 text-right">Highest CTC</th>
                <th className="p-3 text-right">Average CTC</th>
                <th className="p-3 text-right">Median CTC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
              {departments?.map((dept) => (
                <tr key={dept.department} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td className="p-3 font-bold text-slate-900 dark:text-white">{dept.department}</td>
                  <td className="p-3 text-center">{dept.total_students}</td>
                  <td className="p-3 text-center">{dept.eligible_students}</td>
                  <td className="p-3 text-center font-bold text-emerald-600 dark:text-emerald-400">{dept.placed_students}</td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 rounded-full font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                      {dept.eligible_placement_rate}%
                    </span>
                  </td>
                  <td className="p-3 text-right font-black text-purple-600 dark:text-purple-400">
                    ₹{dept.highest_ctc} LPA
                  </td>
                  <td className="p-3 text-right">₹{dept.average_ctc} LPA</td>
                  <td className="p-3 text-right">₹{dept.median_ctc} LPA</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
