import React, { useState, useEffect, useCallback } from 'react';
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
import api, { getErrorMessage } from '../api';
import { useAuth } from '../context/AuthContext';
import UserAvatar from '../components/UserAvatar';

export default function SettingsPage() {
  const { showToast, user, openProfile } = useAuth();
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

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/settings/as-dict');
      setSettings(res.data);
      setFormValues((prev) => ({
        ...prev,
        ...res.data
      }));
    } catch (err) {
      showToast(getErrorMessage(err, 'Error loading system settings'), 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

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
      {/* Studio Hero Command Bar */}
      <div className="apple-gloss-tile p-6 sm:p-7 rounded-[28px] relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-[#0071e3]/15 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 liquid-pill text-xs font-semibold text-[#0071e3] dark:text-[#2997ff] shadow-xs">
              <Settings className="w-3.5 h-3.5" />
              <span>Institutional Parameters</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7]">
              System Settings & <span className="apple-siri-gradient-text">Configuration</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#86868b] dark:text-[#a1a1a6] max-w-2xl leading-relaxed">
              Customize placement percentage formulas, reporting cycle presets, salary thresholds, and institutional system flags.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={handleSave}
              disabled={saving}
              className="apple-btn-primary px-5 py-2.5 text-xs font-medium cursor-pointer flex items-center gap-2 shadow-md disabled:opacity-50"
            >
              {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save System Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Account Profile Quick Access Tile */}
      <div className="apple-gloss-tile p-5 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <UserAvatar user={user} size={48} showRoleBadge={true} interactive={true} onClick={openProfile} />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">
                {user?.full_name || user?.username}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#0071e3]/10 text-[#0071e3] border border-[#0071e3]/20">
                {user?.role === 'admin' ? 'Administrator' : user?.role}
              </span>
            </div>
            <div className="text-xs text-[#86868b] dark:text-[#a1a1a6] mt-0.5 flex items-center gap-2 font-mono">
              <span>@{user?.username}</span>
              <span>•</span>
              <span>{user?.email}</span>
              {user?.designation && <span>• {user?.designation}</span>}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={openProfile}
          className="apple-btn-secondary px-4 py-2 text-xs font-semibold cursor-pointer self-start sm:self-auto flex items-center gap-2"
        >
          <span>Edit Profile & Credentials</span>
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
