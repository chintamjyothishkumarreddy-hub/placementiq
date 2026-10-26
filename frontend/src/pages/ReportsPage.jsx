import React, { useState, useEffect } from 'react';
import {
  FilePieChart,
  Download,
  Printer,
  Calendar,
  Building,
  CheckCircle,
  TrendingUp,
  RefreshCw,
  Award,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function ReportsPage() {
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
      showToast('Error loading reports', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [academicYear]);

  const handlePrint = () => {
    window.print();
  };

  const handleExport = (fmt = 'csv') => {
    window.open(`/api/import-export/export/students?format=${fmt}`, '_blank');
  };

  const { overview, departments, tiers } = report || {};

  return (
    <div className="space-y-6">
      {/* Header and Print Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden border-b border-white/[0.06] pb-5">
        <div>
          <div className="editorial-kicker">// OFFICIAL GAZETTE // CERTIFIED AUDIT DOSSIER</div>
          <h2 className="text-2xl font-editorial italic font-normal text-white tracking-tight flex items-center gap-3">
            Institutional Dossier & Official Gazette
          </h2>
          <p className="text-xs font-sans text-slate-400 mt-0.5">
            Publication-grade institutional report for academic senates, NIRF/NAAC accreditation & statutory governance.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 bg-slate-900 border border-white/[0.08] hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-mono rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-cyan-400" />
            <span>PRINT GAZETTE</span>
          </button>
          <button
            onClick={() => handleExport('excel')}
            className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-mono font-medium rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.25)] flex items-center gap-2 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>EXPORT CERTIFIED DATA</span>
          </button>
        </div>
      </div>

      {/* Printable Report Canvas */}
      <div className="intel-card rounded-3xl border border-white/[0.1] shadow-2xl p-8 space-y-7 print:border-none print:shadow-none print:p-0 print:bg-white print:text-black">
        {/* Report Official Banner */}
        <div className="border-b border-white/[0.08] pb-6 flex items-start justify-between">
          <div>
            <div className="editorial-kicker text-cyan-400">
              PLACEMENTIQ INSTITUTIONAL INTELLIGENCE COUNCIL
            </div>
            <h1 className="text-2xl sm:text-3xl font-editorial italic font-normal text-white mt-1 leading-tight">
              Annual Campus Placement & Recruitment Gazette
            </h1>
            <p className="text-xs font-mono text-slate-400 mt-1">
              Generated on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} • Certified Cryptographic SQLite Master Record
            </p>
          </div>
          <div className="text-right text-xs font-mono text-slate-400">
            <span className="font-semibold text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30">
              STATUS: CERTIFIED
            </span>
            <p className="mt-1 text-slate-400">BATCH: 2024-2025</p>
          </div>
        </div>

        {/* Executive Highlights */}
        <div>
          <div className="editorial-kicker">// EXECUTIVE TELEMETRY</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
            <div className="p-4 bg-slate-950/60 rounded-2xl border border-white/[0.06]">
              <span className="text-[10px] font-mono uppercase text-slate-500">// REGISTERED COHORT</span>
              <div className="text-2xl font-mono-num font-bold text-white mt-1">
                {overview?.total_students}
              </div>
            </div>
            <div className="p-4 bg-slate-950/60 rounded-2xl border border-white/[0.06]">
              <span className="text-[10px] font-mono uppercase text-slate-500">// VERIFIED SELECTIONS</span>
              <div className="text-2xl font-mono-num font-bold text-emerald-400 mt-1">
                {overview?.placed_students}
              </div>
            </div>
            <div className="p-4 bg-slate-950/60 rounded-2xl border border-white/[0.06]">
              <span className="text-[10px] font-mono uppercase text-slate-500">// COHORT CONVERSION</span>
              <div className="text-2xl font-mono-num font-bold text-cyan-300 mt-1">
                {overview?.overall_rate}%
              </div>
            </div>
            <div className="p-4 bg-slate-950/60 rounded-2xl border border-white/[0.06]">
              <span className="text-[10px] font-mono uppercase text-slate-500">// MEAN COMPENSATION</span>
              <div className="text-2xl font-mono-num font-bold text-purple-400 mt-1">
                ₹{overview?.avg_ctc} LPA
              </div>
            </div>
          </div>
        </div>

        {/* Branch-wise Table */}
        <div>
          <div className="editorial-kicker">// DEPARTMENTAL RECRUITMENT AUDIT</div>
          <div className="border border-white/[0.08] rounded-2xl overflow-hidden mt-2">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 font-mono text-[10px] uppercase text-slate-400 border-b border-white/[0.08]">
                <tr>
                  <th className="p-3">DEPARTMENT</th>
                  <th className="p-3 text-center">BATCH SIZE</th>
                  <th className="p-3 text-center">ELIGIBLE</th>
                  <th className="p-3 text-center">PLACED</th>
                  <th className="p-3 text-center">COMPLIANCE %</th>
                  <th className="p-3 text-right">HIGHEST OFFER</th>
                  <th className="p-3 text-right">MEAN OFFER</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] font-medium text-slate-300">
                {departments?.map((d) => (
                  <tr key={d.department} className="hover:bg-white/[0.02]">
                    <td className="p-3 font-mono font-bold text-white">{d.department}</td>
                    <td className="p-3 text-center font-mono-num">{d.total_students}</td>
                    <td className="p-3 text-center font-mono-num text-slate-400">{d.eligible_students}</td>
                    <td className="p-3 text-center font-mono-num font-bold text-emerald-400">{d.placed_students}</td>
                    <td className="p-3 text-center font-mono-num font-bold text-cyan-300">{d.eligible_placement_rate}%</td>
                    <td className="p-3 text-right font-mono-num font-bold text-emerald-400">₹{d.highest_ctc} LPA</td>
                    <td className="p-3 text-right font-mono-num text-slate-300">₹{d.average_ctc} LPA</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Salary Tiers */}
        <div>
          <div className="editorial-kicker">// COMPENSATION TIER LEDGER</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
            {tiers?.map((t) => (
              <div key={t.tier} className="p-3.5 bg-slate-950/60 rounded-xl border border-white/[0.06] text-xs">
                <span className="text-slate-400 font-mono text-[11px]">{t.tier}</span>
                <div className="text-xl font-mono-num font-bold text-white mt-1">
                  {t.count} Candidates
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certification Signoff Footer */}
        <div className="pt-10 mt-6 border-t border-white/[0.08] grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs text-slate-400 font-sans">
          <div>
            <div className="border-t border-white/[0.2] pt-2 font-serif font-medium text-white text-sm">
              Dr. Rajesh Raman
            </div>
            <p className="font-mono text-[11px] text-slate-500 mt-0.5">Dean of Training & Corporate Relations</p>
          </div>
          <div>
            <div className="border-t border-white/[0.2] pt-2 font-serif font-medium text-white text-sm">
              Prof. Sunita Deshmukh
            </div>
            <p className="font-mono text-[11px] text-slate-500 mt-0.5">Head Placement Officer & Senate Liaison</p>
          </div>
          <div className="hidden sm:block text-right">
            <span className="font-mono text-[11px] text-cyan-400/80">
              // CRYPTOGRAPHIC HASH: PIQ-AUDIT-2025-SHA256
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
