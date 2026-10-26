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
  Download,
  Sparkles
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
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 font-mono text-xs">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400">// COMPUTING MULTIVARIATE STATISTICAL MODELS...</p>
      </div>
    );
  }

  const { overview, departments, tiers, cgpa_impact, backlog_impact } = report || {};

  const TIER_COLORS = ['#06b6d4', '#6366f1', '#10b981', '#f59e0b'];

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
        <div>
          <div className="editorial-kicker">// LONGITUDINAL INTELLIGENCE // STATISTICAL MODELS</div>
          <h2 className="text-2xl font-editorial italic font-normal text-white tracking-tight flex items-center gap-3">
            Intelligence Analytics & Longitudinal Trends
          </h2>
          <p className="text-xs font-sans text-slate-400 mt-0.5">
            Deep multivariate placement insights, compensation tier distributions, and academic correlation indices.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
            className="text-xs font-mono py-1.5 px-3 bg-slate-900 border border-white/[0.08] rounded-xl text-slate-300 focus:outline-hidden focus:border-cyan-500/40 cursor-pointer"
          >
            <option value="All">All Academic Batches</option>
            <option value="2024-2025">2024-2025</option>
            <option value="2023-2024">2023-2024</option>
          </select>

          <button
            onClick={fetchReport}
            className="p-2 bg-slate-900 text-slate-300 hover:text-white border border-white/[0.08] rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
            title="Refresh Analysis"
          >
            <RefreshCw className="w-4 h-4 text-cyan-400" />
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="intel-card-interactive p-5 rounded-2xl border border-white/[0.08]">
          <span className="text-[10px] font-mono uppercase text-slate-500">// TOTAL PLACED RATIO</span>
          <div className="text-2xl sm:text-3xl font-mono-num font-bold text-white mt-1">
            {overview?.placed_students} <span className="text-xs font-normal text-slate-500">/ {overview?.total_students}</span>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 mt-1 block">
            {overview?.overall_rate}% Cohort Success Rate
          </span>
        </div>

        <div className="intel-card-interactive p-5 rounded-2xl border border-white/[0.08]">
          <span className="text-[10px] font-mono uppercase text-slate-500">// ELIGIBLE CONVERSION</span>
          <div className="text-2xl sm:text-3xl font-mono-num font-bold text-cyan-300 mt-1">
            {overview?.eligible_rate}%
          </div>
          <span className="text-[11px] font-mono text-slate-500 mt-1 block">
            {overview?.placed_students} of {overview?.eligible_students} eligible
          </span>
        </div>

        <div className="intel-card-interactive p-5 rounded-2xl border border-white/[0.08]">
          <span className="text-[10px] font-mono uppercase text-slate-500">// MEAN COMPENSATION</span>
          <div className="text-2xl sm:text-3xl font-mono-num font-bold text-purple-400 mt-1">
            ₹{overview?.avg_ctc} LPA
          </div>
          <span className="text-[11px] font-mono text-slate-500 mt-1 block">Accepted packages</span>
        </div>

        <div className="intel-card-interactive p-5 rounded-2xl border border-white/[0.08]">
          <span className="text-[10px] font-mono uppercase text-slate-500">// PEAK COMPENSATION</span>
          <div className="text-2xl sm:text-3xl font-mono-num font-bold text-emerald-300 mt-1">
            ₹{overview?.highest_ctc} LPA
          </div>
          <span className="text-[11px] font-mono text-slate-500 mt-1 block">Top campus offer</span>
        </div>
      </div>

      {/* Grid: Salary Tiers & Backlog Impact */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Salary Tiers */}
        <div className="intel-card p-6 rounded-2xl border border-white/[0.08]">
          <div className="editorial-kicker">// SALARY DISTRIBUTION</div>
          <h3 className="text-base font-serif font-medium text-white mb-1">
            Compensation Tier Breakdown
          </h3>
          <p className="text-xs font-mono text-slate-400 mb-4">
            Tier 1 (&gt;15 LPA), Tier 2 (8–15 LPA), Tier 3 (4–8 LPA), Tier 4 (&lt;4 LPA)
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
                  contentStyle={{ backgroundColor: '#07090e', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px', color: '#fff', fontFamily: 'JetBrains Mono, monospace' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', fontFamily: 'JetBrains Mono, monospace', color: '#94a3b8' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CGPA Bracket Placement Rate */}
        <div className="intel-card p-6 rounded-2xl border border-white/[0.08]">
          <div className="editorial-kicker">// ACADEMIC CORRELATION</div>
          <h3 className="text-base font-serif font-medium text-white mb-1">
            CGPA Tier vs. Placement Rate (%)
          </h3>
          <p className="text-xs font-mono text-slate-400 mb-4">
            Direct statistical correlation between academic performance and hiring velocity
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cgpa_impact || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="bracket" tick={{ fontSize: 10, fill: '#64748b', fontFamily: 'JetBrains Mono, monospace' }} />
                <YAxis unit="%" tick={{ fontSize: 11, fill: '#64748b', fontFamily: 'JetBrains Mono, monospace' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#07090e', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px', color: '#fff', fontFamily: 'JetBrains Mono, monospace' }}
                />
                <Bar dataKey="placement_rate" name="Placement Rate (%)" fill="#06b6d4" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Department Comparative Table */}
      <div className="intel-card rounded-2xl border border-white/[0.08] overflow-hidden">
        <div className="p-5 border-b border-white/[0.06]">
          <div className="editorial-kicker">// COMPARATIVE CADRE BENCHMARKS</div>
          <h3 className="text-lg font-serif font-medium text-white">
            Branch-wise Comparative Analysis
          </h3>
          <p className="text-xs font-sans text-slate-400 mt-0.5">
            Full departmental matrix including eligible conversion velocity, peak offer, and average CTC.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-white/[0.08] text-slate-400 font-mono text-[10px] uppercase tracking-wider">
                <th className="p-3">DEPARTMENT</th>
                <th className="p-3 text-center">COHORT</th>
                <th className="p-3 text-center">ELIGIBLE</th>
                <th className="p-3 text-center">PLACED</th>
                <th className="p-3 text-center">ELIGIBLE %</th>
                <th className="p-3 text-right">HIGHEST CTC</th>
                <th className="p-3 text-right">AVERAGE CTC</th>
                <th className="p-3 text-right">MEDIAN CTC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] font-medium text-slate-300">
              {departments?.map((dept) => (
                <tr key={dept.department} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-3 font-mono font-bold text-white">{dept.department}</td>
                  <td className="p-3 text-center font-mono-num">{dept.total_students}</td>
                  <td className="p-3 text-center font-mono-num text-slate-400">{dept.eligible_students}</td>
                  <td className="p-3 text-center font-mono-num font-bold text-emerald-400">{dept.placed_students}</td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 rounded-full font-mono text-xs bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
                      {dept.eligible_placement_rate}%
                    </span>
                  </td>
                  <td className="p-3 text-right font-mono-num font-bold text-emerald-400">
                    ₹{dept.highest_ctc} LPA
                  </td>
                  <td className="p-3 text-right font-mono-num text-slate-300">₹{dept.average_ctc} LPA</td>
                  <td className="p-3 text-right font-mono-num text-slate-400">₹{dept.median_ctc} LPA</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
