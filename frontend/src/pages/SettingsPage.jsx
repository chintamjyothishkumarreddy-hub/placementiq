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
  Layers
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
      showToast('System configuration & analytics settings saved successfully!', 'success');
      fetchSettings();
    } catch (err) {
      showToast('Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            System & Analytics Configuration
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Customize calculation methods, reporting academic years, compensation units, and system-wide behavior.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto disabled:opacity-50"
        >
          {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save System Settings</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Section 1: Analytics & Placement Rate Calculations */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
            <BarChart className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Placement Rate & Formula Preferences
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                Primary Placement Percentage Calculation
              </label>
              <select
                value={formValues.placement_rate_method}
                onChange={(e) => setFormValues({ ...formValues, placement_rate_method: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden"
              >
                <option value="eligible_only">
                  Placed / Eligible Students (Recommended by Industry)
                </option>
                <option value="total_registered">
                  Placed / Total Registered Students
                </option>
              </select>
              <p className="text-[11px] text-slate-400 mt-1">
                Determines the headline placement percentage shown on the dashboard and official summaries.
              </p>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                Offer Status Counted as "Placed"
              </label>
              <select
                value={formValues.placement_offer_criteria ? formValues.placement_offer_criteria[0] : 'Accepted'}
                onChange={(e) => setFormValues({ ...formValues, placement_offer_criteria: [e.target.value] })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden"
              >
                <option value="Accepted">Accepted Offers Only (Strict Placement)</option>
                <option value="Offered">All Extended Offers (Offers + Accepted)</option>
              </select>
              <p className="text-[11px] text-slate-400 mt-1">
                Whether students who received an offer but haven't signed yet are marked as placed.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Currency & Salary Display Units */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
            <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Compensation & Currency Settings
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                Default Currency Symbol
              </label>
              <input
                type="text"
                value={formValues.currency_symbol}
                onChange={(e) => setFormValues({ ...formValues, currency_symbol: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                Default Salary Package Unit
              </label>
              <select
                value={formValues.salary_display_unit}
                onChange={(e) => setFormValues({ ...formValues, salary_display_unit: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden"
              >
                <option value="LPA">LPA (Lakhs Per Annum - Indian Standard)</option>
                <option value="USD">USD ($)</option>
                <option value="K">Thousands (K)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Eligibility & Cutoff Evaluation Strategy */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Sliders className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Rules Engine Evaluation Strategy
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                Rule Evaluation Mode
              </label>
              <select
                value={formValues.eligibility_rule_mode}
                onChange={(e) => setFormValues({ ...formValues, eligibility_rule_mode: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden"
              >
                <option value="global_priority">
                  Global Rules + Department Overrides (Recommended)
                </option>
                <option value="company_strict">
                  Company-Specific Strict Mode
                </option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-5">
              <input
                type="checkbox"
                id="autoRecalc"
                checked={formValues.auto_recalculate_eligibility}
                onChange={(e) => setFormValues({ ...formValues, auto_recalculate_eligibility: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 focus:ring-0"
              />
              <label htmlFor="autoRecalc" className="font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                Automatically recalculate all students on rule mutations
              </label>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
