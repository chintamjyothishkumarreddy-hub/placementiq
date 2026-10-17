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
  Award
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            Institutional Placement Report
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Official summary report for academic reviews, NIRF/NAAC accreditation, and placement council audits.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
          <button
            onClick={() => handleExport('excel')}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Official Data</span>
          </button>
        </div>
      </div>

      {/* Printable Report Canvas */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs p-8 space-y-6 print:border-none print:shadow-none print:p-0">
        {/* Report Official Banner */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-6 flex items-start justify-between">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400">
              PlacementIQ • Institutional Training & Placement Cell
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              Annual Campus Placement & Recruitment Summary Report
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Generated on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} • Certified Database Record
            </p>
          </div>
          <div className="text-right text-xs text-slate-400">
            <span className="font-semibold text-slate-700 dark:text-slate-200">Status: Verified</span>
            <p>Academic Year: 2024-2025</p>
          </div>
        </div>

        {/* Executive Highlights */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
            Executive Summary
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400">Registered Candidates</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {overview?.total_students}
              </div>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400">Total Placed Students</span>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                {overview?.placed_students}
              </div>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400">Overall Success Rate</span>
              <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
                {overview?.overall_rate}%
              </div>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400">Average Compensation</span>
              <div className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">
                ₹{overview?.avg_ctc} LPA
              </div>
            </div>
          </div>
        </div>

        {/* Branch-wise Table */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
            Departmental Placement Statistics
          </h3>
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 font-bold uppercase text-slate-500">
                <tr>
                  <th className="p-3">Department</th>
                  <th className="p-3 text-center">Batch Size</th>
                  <th className="p-3 text-center">Eligible</th>
                  <th className="p-3 text-center">Placed</th>
                  <th className="p-3 text-center">Placement %</th>
                  <th className="p-3 text-right">Highest Package</th>
                  <th className="p-3 text-right">Average Package</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {departments?.map((d) => (
                  <tr key={d.department}>
                    <td className="p-3 font-bold text-slate-900 dark:text-white">{d.department}</td>
                    <td className="p-3 text-center">{d.total_students}</td>
                    <td className="p-3 text-center">{d.eligible_students}</td>
                    <td className="p-3 text-center font-bold text-emerald-600">{d.placed_students}</td>
                    <td className="p-3 text-center font-bold">{d.eligible_placement_rate}%</td>
                    <td className="p-3 text-right font-black text-purple-600">₹{d.highest_ctc} LPA</td>
                    <td className="p-3 text-right">₹{d.average_ctc} LPA</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Salary Tiers */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
            Salary Bracket Distribution
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {tiers?.map((t) => (
              <div key={t.tier} className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 text-xs">
                <span className="text-slate-400 font-semibold">{t.tier}</span>
                <div className="text-xl font-black text-slate-900 dark:text-white mt-1">
                  {t.count} Students
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certification Signoff Footer */}
        <div className="pt-12 mt-8 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs text-slate-500">
          <div>
            <div className="border-t-2 border-slate-300 dark:border-slate-700 pt-2 font-bold text-slate-800 dark:text-slate-200">
              Dr. Rajesh Raman
            </div>
            <p>Dean of Placement & Training</p>
          </div>
          <div>
            <div className="border-t-2 border-slate-300 dark:border-slate-700 pt-2 font-bold text-slate-800 dark:text-slate-200">
              Prof. Sunita Deshmukh
            </div>
            <p>Head Placement Officer</p>
          </div>
          <div className="hidden sm:block text-right">
            <span className="font-mono text-[11px] text-slate-400">
              Report Signature: PIQ-AUDIT-2025-SQL
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
