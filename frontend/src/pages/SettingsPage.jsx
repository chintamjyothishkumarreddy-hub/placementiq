import React, { useState, useEffect } from 'react';
import {
  Settings,
  Save,
  RotateCcw,
  CheckCircle,
  ShieldCheck,
  DollarSign,
  BarChart,
  Sliders,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function SettingsPage() {
  const { showToast } = useAuth();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formValues, setFormValues] = useState({
    academic_years_included: ['2023-2024', '2024-2025', '2025-2026'],
    departments_displayed: ['CSE', 'IT', 'ECE', 'EEE', 'Mechanical', 'Civil'],
    currency_symbol: '₹',
    salary_display_unit: 'LPA',
    placement_rate_method: 'eligible_only',
    placement_offer_criteria: ['Accepted'],
    eligibility_rule_mode: 'global_priority',
    default_chart_type: 'bar',
    auto_recalculate_eligibility: true
  });

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/settings/as-dict');
      setSettings(res.data);
      setFormValues((prev) => ({
        ...prev,
        ...res.data
      }));
    } catch (err) {
      showToast('Error loading system settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/settings/bulk-update', formValues);
      showToast('System configuration & algorithmic parameters committed successfully!', 'success');
      fetchSettings();
    } catch (err) {
      showToast('Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
        <div>
          <div className="editorial-kicker">// PARAMETER SPECIFICATIONS // ALGORITHMIC CONFIGURATION</div>
          <h2 className="text-2xl font-editorial italic font-normal text-white tracking-tight flex items-center gap-3">
            System Parameters & Computation Policies
          </h2>
          <p className="text-xs font-sans text-slate-400 mt-0.5">
            Configure computation methodologies, academic cohorts, currency tokens, and automated evaluation cascades.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-mono font-medium rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.25)] transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto disabled:opacity-50"
        >
          {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
          <span>COMMIT CONFIGURATION</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs font-sans">
        {/* Section 1: Analytics & Placement Rate Calculations */}
        <div className="intel-card p-6 rounded-3xl border border-white/[0.08] space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-white/[0.06]">
            <BarChart className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-serif font-medium text-white">
              Placement Conversion & Formula Methodologies
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-xs text-slate-400 mb-1">
                Primary Conversion Calculation
              </label>
              <select
                value={formValues.placement_rate_method}
                onChange={(e) => setFormValues({ ...formValues, placement_rate_method: e.target.value })}
                className="w-full p-2.5 bg-slate-900 border border-white/[0.08] rounded-xl font-mono text-xs text-slate-200 focus:outline-hidden focus:border-cyan-500 cursor-pointer"
              >
                <option value="eligible_only">
                  Placed / Eligible Candidates (Industry Compliance Standard)
                </option>
                <option value="total_registered">
                  Placed / Total Enrolled Cohort
                </option>
              </select>
              <p className="text-[11px] font-mono text-slate-500 mt-1">
                // Governs headline placement metrics across executive dashboards and statutory reports.
              </p>
            </div>

            <div>
              <label className="block font-mono text-xs text-slate-400 mb-1">
                Offer Acceptance Criterion for "Placed" Status
              </label>
              <select
                value={formValues.placement_offer_criteria ? formValues.placement_offer_criteria[0] : 'Accepted'}
                onChange={(e) => setFormValues({ ...formValues, placement_offer_criteria: [e.target.value] })}
                className="w-full p-2.5 bg-slate-900 border border-white/[0.08] rounded-xl font-mono text-xs text-slate-200 focus:outline-hidden focus:border-cyan-500 cursor-pointer"
              >
                <option value="Accepted">Accepted Letters Only (Strict Verified Placement)</option>
                <option value="Offered">All Extended Letters (Offer Issued or Accepted)</option>
              </select>
              <p className="text-[11px] font-mono text-slate-500 mt-1">
                // Defines whether candidates with pending offer decisions are accounted as placed.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Currency & Salary Display Units */}
        <div className="intel-card p-6 rounded-3xl border border-white/[0.08] space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-white/[0.06]">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-serif font-medium text-white">
              Compensation & Currency Tokens
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-xs text-slate-400 mb-1">
                Default Currency Glyph
              </label>
              <input
                type="text"
                value={formValues.currency_symbol}
                onChange={(e) => setFormValues({ ...formValues, currency_symbol: e.target.value })}
                className="w-full p-2.5 bg-slate-950/60 border border-white/[0.08] rounded-xl font-mono text-xs text-emerald-400 font-bold focus:outline-hidden focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block font-mono text-xs text-slate-400 mb-1">
                Default Compensation Ledger Unit
              </label>
              <select
                value={formValues.salary_display_unit}
                onChange={(e) => setFormValues({ ...formValues, salary_display_unit: e.target.value })}
                className="w-full p-2.5 bg-slate-900 border border-white/[0.08] rounded-xl font-mono text-xs text-slate-200 focus:outline-hidden focus:border-cyan-500 cursor-pointer"
              >
                <option value="LPA">LPA (Lakhs Per Annum — Indian Standard)</option>
                <option value="USD">USD ($)</option>
                <option value="K">Thousands (K)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Eligibility & Cutoff Evaluation Strategy */}
        <div className="intel-card p-6 rounded-3xl border border-white/[0.08] space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-white/[0.06]">
            <Sliders className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-serif font-medium text-white">
              Policy Evaluation Architecture
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-xs text-slate-400 mb-1">
                Rule Evaluation Strategy
              </label>
              <select
                value={formValues.eligibility_rule_mode}
                onChange={(e) => setFormValues({ ...formValues, eligibility_rule_mode: e.target.value })}
                className="w-full p-2.5 bg-slate-900 border border-white/[0.08] rounded-xl font-mono text-xs text-slate-200 focus:outline-hidden focus:border-cyan-500 cursor-pointer"
              >
                <option value="global_priority">
                  Global Rules + Department Overrides (Recommended Cascade)
                </option>
                <option value="company_strict">
                  Company-Specific Strict Isolation Mode
                </option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-5 font-mono text-xs text-slate-300">
              <input
                type="checkbox"
                id="autoRecalc"
                checked={formValues.auto_recalculate_eligibility}
                onChange={(e) => setFormValues({ ...formValues, auto_recalculate_eligibility: e.target.checked })}
                className="w-4 h-4 rounded-md accent-cyan-500 cursor-pointer"
              />
              <label htmlFor="autoRecalc" className="cursor-pointer">
                Automatically re-evaluate all candidate records on policy mutation
              </label>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
