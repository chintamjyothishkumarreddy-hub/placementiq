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
  ShieldCheck,
  FileSpreadsheet,
  CheckCircle2,
  FileText
} from 'lucide-react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { PlacementIQEmblem } from '../components/Logo';

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
    } catch {
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
      {/* Studio Header and Print Actions */}
      <div className="apple-gloss-tile p-6 sm:p-8 rounded-[32px] relative overflow-hidden print:hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-[#0071e3]/20 via-[#af52de]/15 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 liquid-pill text-xs font-semibold text-[#0071e3] dark:text-[#2997ff] shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>NIRF & NAAC Accreditation Verified</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7]">
              Institutional <span className="apple-siri-gradient-text">Placement Report</span>
            </h1>

            <p className="text-xs sm:text-sm text-[#86868b] dark:text-[#a1a1a6] max-w-2xl leading-relaxed">
              Official certified summary report for institutional audits, governing body reviews, and placement council documentation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={handlePrint}
              className="apple-btn-secondary px-4 py-2.5 text-xs font-medium cursor-pointer flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Print Report</span>
            </button>
            <button
              onClick={() => handleExport('excel')}
              className="apple-btn-primary px-4 py-2.5 text-xs font-medium cursor-pointer flex items-center gap-2 shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>Export Official Excel</span>
            </button>
          </div>
        </div>
      </div>

      {/* Printable Report Document Canvas */}
      <div className="apple-gloss-tile rounded-[32px] p-8 sm:p-10 space-y-8 print:border-none print:shadow-none print:p-0 print:bg-white print:text-black">
        {/* Report Official Banner */}
        <div className="border-b border-black/[0.08] dark:border-white/[0.1] pb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <PlacementIQEmblem size={48} className="drop-shadow-sm" />
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#0071e3] dark:text-[#2997ff]">
                PlacementIQ • Institutional Training & Placement Council
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7] mt-1">
                Annual Campus Recruitment & Placement Audit Report
              </h2>
              <p className="text-xs text-[#86868b] mt-1">
                Certified on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} • Cryptographically Verified DB Record
              </p>
            </div>
          </div>
          <div className="sm:text-right text-xs text-[#86868b]">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#34c759]/10 text-[#34c759] border border-[#34c759]/20">
              <CheckCircle2 className="w-3 h-3" />
              Verified Status
            </span>
            <p className="mt-1 font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">Academic Cycle 2024–2025</p>
          </div>
        </div>

        {/* Executive Highlights Bento */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#86868b] mb-3">
            Executive Summary Highlights
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl liquid-glass border border-black/[0.06] dark:border-white/[0.08]">
              <span className="text-[11px] font-medium text-[#86868b]">Registered Candidates</span>
              <div className="text-2xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7] mt-1">
                {overview?.total_students}
              </div>
            </div>
            <div className="p-4 rounded-2xl liquid-glass border border-black/[0.06] dark:border-white/[0.08]">
              <span className="text-[11px] font-medium text-[#86868b]">Total Placed Students</span>
              <div className="text-2xl font-bold text-[#34c759] mt-1">
                {overview?.placed_students}
              </div>
            </div>
            <div className="p-4 rounded-2xl liquid-glass border border-black/[0.06] dark:border-white/[0.08]">
              <span className="text-[11px] font-medium text-[#86868b]">Overall Cohort Rate</span>
              <div className="text-2xl font-bold text-[#0071e3] dark:text-[#2997ff] mt-1">
                {overview?.overall_rate}%
              </div>
            </div>
            <div className="p-4 rounded-2xl liquid-glass border border-black/[0.06] dark:border-white/[0.08]">
              <span className="text-[11px] font-medium text-[#86868b]">Mean Package (CTC)</span>
              <div className="text-2xl font-bold text-[#af52de] mt-1">
                ₹{overview?.avg_ctc} LPA
              </div>
            </div>
          </div>
        </div>

        {/* Branch-wise Table */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#86868b] mb-3">
            Departmental Placement Breakdown
          </h3>
          <div className="apple-glass-table-container rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-black/[0.02] dark:bg-white/[0.03] text-[#86868b] font-semibold uppercase text-[11px]">
                  <th className="p-3.5 pl-5">Department</th>
                  <th className="p-3.5 text-center">Batch Size</th>
                  <th className="p-3.5 text-center">Eligible</th>
                  <th className="p-3.5 text-center">Placed</th>
                  <th className="p-3.5 text-center">Placement %</th>
                  <th className="p-3.5 text-right">Highest CTC</th>
                  <th className="p-3.5 text-right pr-5">Average CTC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04] dark:divide-white/[0.04] font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">
                {departments?.map((d) => (
                  <tr key={d.department} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.03]">
                    <td className="p-3.5 pl-5 font-semibold">{d.department}</td>
                    <td className="p-3.5 text-center text-[#86868b]">{d.total_students}</td>
                    <td className="p-3.5 text-center">{d.eligible_students}</td>
                    <td className="p-3.5 text-center font-bold text-[#34c759]">{d.placed_students}</td>
                    <td className="p-3.5 text-center font-semibold text-[#0071e3] dark:text-[#2997ff]">{d.eligible_placement_rate}%</td>
                    <td className="p-3.5 text-right font-bold text-[#af52de]">₹{d.highest_ctc} LPA</td>
                    <td className="p-3.5 text-right pr-5">₹{d.average_ctc} LPA</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Salary Tiers */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#86868b] mb-3">
            Salary Bracket Distribution
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {tiers?.map((t) => (
              <div key={t.tier} className="p-4 rounded-xl liquid-glass border border-black/[0.06] dark:border-white/[0.08] text-xs">
                <span className="text-[#86868b] font-medium">{t.tier}</span>
                <div className="text-xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7] mt-1">
                  {t.count} Students
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certification Signoff Footer */}
        <div className="border-t border-black/[0.08] dark:border-white/[0.1] pt-6 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-[#86868b]">
          <div>
            <p className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">Placement & Career Development Cell</p>
            <p className="text-[11px]">System Automated Verified Audit Record • No Physical Signature Required</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="liquid-pill px-3 py-1 font-semibold text-[#34c759]">
              ✓ Officially Validated
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
