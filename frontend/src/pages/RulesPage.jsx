import React, { useState, useEffect } from 'react';
import {
  Sliders,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  RefreshCw,
  Power,
  Sparkles,
  Info,
  X
} from 'lucide-react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import ConfirmModal from '../components/ConfirmModal';

export default function RulesPage() {
  const { role, showToast } = useAuth();
  const canEdit = ['admin', 'placement_officer'].includes(role);
  const canDelete = role === 'admin';

  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState([]);

  // Modal State
  const [formOpen, setFormOpen] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Preview State
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewResults, setPreviewResults] = useState(null);

  // Delete State
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Form Data
  const defaultRule = {
    name: '',
    rule_type: 'Global',
    company_id: '',
    department: '',
    graduation_year: '',
    min_cgpa: 6.5,
    min_percentage: 60.0,
    max_active_backlogs: 0,
    allow_active_backlogs: false,
    max_total_backlogs: 2,
    required_skills_text: '',
    internship_required: false,
    allowed_departments: ['CSE', 'IT', 'ECE', 'EEE', 'Mechanical', 'Civil'],
    allowed_degrees: ['B.Tech', 'M.Tech', 'MCA'],
    is_active: true,
    priority: 50,
    notes: ''
  };
  const [formData, setFormData] = useState(defaultRule);

  const fetchRules = async () => {
    setLoading(true);
    try {
      const [rulesRes, compRes] = await Promise.all([
        api.get('/rules'),
        api.get('/companies')
      ]);
      setRules(rulesRes.data);
      setCompanies(compRes.data);
    } catch (err) {
      showToast('Error loading eligibility rules', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const handleOpenAdd = () => {
    setEditingRule(null);
    setFormData(defaultRule);
    setFormOpen(true);
  };

  const handleOpenEdit = (r) => {
    setEditingRule(r);
    setFormData({
      name: r.name,
      rule_type: r.rule_type,
      company_id: r.company_id || '',
      department: r.department || '',
      graduation_year: r.graduation_year || '',
      min_cgpa: r.min_cgpa,
      min_percentage: r.min_percentage,
      max_active_backlogs: r.max_active_backlogs,
      allow_active_backlogs: r.allow_active_backlogs,
      max_total_backlogs: r.max_total_backlogs,
      required_skills_text: (r.required_skills || []).join(', '),
      internship_required: r.internship_required,
      allowed_departments: r.allowed_departments || [],
      allowed_degrees: r.allowed_degrees || ['B.Tech', 'M.Tech', 'MCA'],
      is_active: r.is_active,
      priority: r.priority,
      notes: r.notes || ''
    });
    setFormOpen(true);
  };

  const handleToggleRule = async (ruleId) => {
    try {
      const res = await api.post(`/rules/${ruleId}/toggle`);
      showToast(res.data.message, 'success');
      fetchRules();
    } catch (err) {
      showToast('Failed to toggle rule status', 'error');
    }
  };

  const handlePreviewImpact = async () => {
    setPreviewLoading(true);
    setPreviewOpen(true);
    try {
      const skillsArray = formData.required_skills_text
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const rulePayload = {
        name: formData.name || 'Preview Rule',
        rule_type: formData.rule_type,
        company_id: formData.company_id ? parseInt(formData.company_id, 10) : null,
        department: formData.department || null,
        graduation_year: formData.graduation_year ? parseInt(formData.graduation_year, 10) : null,
        min_cgpa: parseFloat(formData.min_cgpa),
        min_percentage: parseFloat(formData.min_percentage),
        max_active_backlogs: parseInt(formData.max_active_backlogs, 10),
        allow_active_backlogs: formData.allow_active_backlogs,
        max_total_backlogs: parseInt(formData.max_total_backlogs, 10),
        required_skills: skillsArray,
        internship_required: formData.internship_required,
        allowed_departments: formData.allowed_departments,
        allowed_degrees: formData.allowed_degrees
      };

      const res = await api.post('/rules/preview', { rule: rulePayload });
      setPreviewResults(res.data);
    } catch (err) {
      showToast('Failed to simulate rule impact', 'error');
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    try {
      const skillsArray = formData.required_skills_text
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        name: formData.name,
        rule_type: formData.rule_type,
        company_id: formData.company_id ? parseInt(formData.company_id, 10) : null,
        department: formData.department || null,
        graduation_year: formData.graduation_year ? parseInt(formData.graduation_year, 10) : null,
        min_cgpa: parseFloat(formData.min_cgpa),
        min_percentage: parseFloat(formData.min_percentage),
        max_active_backlogs: parseInt(formData.max_active_backlogs, 10),
        allow_active_backlogs: formData.allow_active_backlogs,
        max_total_backlogs: parseInt(formData.max_total_backlogs, 10),
        required_skills: skillsArray,
        internship_required: formData.internship_required,
        allowed_departments: formData.allowed_departments,
        allowed_degrees: formData.allowed_degrees,
        is_active: formData.is_active,
        priority: parseInt(formData.priority, 10),
        notes: formData.notes || null
      };

      if (editingRule) {
        await api.put(`/rules/${editingRule.id}`, payload);
        showToast(`Rule updated & eligibility recalculated across all students!`, 'success');
      } else {
        await api.post('/rules', payload);
        showToast(`Rule created & students re-evaluated!`, 'success');
      }

      setFormOpen(false);
      fetchRules();
    } catch (err) {
      showToast(err.response?.data?.detail || 'Failed to save eligibility rule', 'error');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/rules/${deleteId}`);
      showToast('Rule deleted and student eligibility recalculated', 'success');
      setDeleteId(null);
      fetchRules();
    } catch (err) {
      showToast('Failed to delete rule', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeptToggle = (dept) => {
    const current = formData.allowed_departments || [];
    if (current.includes(dept)) {
      setFormData({ ...formData, allowed_departments: current.filter((d) => d !== dept) });
    } else {
      setFormData({ ...formData, allowed_departments: [...current, dept] });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            Eligibility Rules & Cutoff Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Define global, company-specific, and department-wise cutoff criteria. Changes dynamically re-evaluate students across the database.
          </p>
        </div>

        {canEdit && (
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Eligibility Rule</span>
          </button>
        )}
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full text-center py-12 text-slate-400">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
            Loading active rules...
          </div>
        ) : rules.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-400 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            No rules configured. Add a rule to establish placement cutoffs.
          </div>
        ) : (
          rules.map((rule) => {
            const companyName = companies.find((c) => c.id === rule.company_id)?.name;
            return (
              <div
                key={rule.id}
                className={`bg-white dark:bg-slate-900 rounded-3xl p-6 border transition-all shadow-2xs flex flex-col justify-between ${
                  rule.is_active
                    ? 'border-slate-200 dark:border-slate-800'
                    : 'border-slate-200/50 dark:border-slate-800/40 opacity-60 bg-slate-50/50 dark:bg-slate-950/20'
                }`}
              >
                <div>
                  {/* Top tags */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        rule.rule_type === 'Global'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                          : rule.rule_type === 'Company'
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                      }`}
                    >
                      {rule.rule_type} Rule
                    </span>

                    <button
                      onClick={() => handleToggleRule(rule.id)}
                      disabled={!canEdit}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                        rule.is_active
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40'
                          : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <Power className="w-3 h-3" />
                      {rule.is_active ? 'Active' : 'Disabled'}
                    </button>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                    {rule.name}
                  </h3>

                  {companyName && (
                    <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 mt-1">
                      Applies to: {companyName}
                    </div>
                  )}

                  {rule.department && (
                    <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-1">
                      Department: {rule.department}
                    </div>
                  )}

                  {/* Cutoff criteria grid */}
                  <div className="grid grid-cols-2 gap-2 my-4 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs">
                    <div>
                      <span className="text-[11px] text-slate-400 font-medium">Min CGPA</span>
                      <p className="font-bold text-slate-900 dark:text-slate-100 text-sm mt-0.5">
                        {rule.min_cgpa.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 font-medium">Max Active Backlogs</span>
                      <p className="font-bold text-slate-900 dark:text-slate-100 text-sm mt-0.5">
                        {rule.max_active_backlogs} {rule.allow_active_backlogs ? '(Permitted)' : '(Strict)'}
                      </p>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 font-medium">Min Percentage</span>
                      <p className="font-bold text-slate-900 dark:text-slate-100 text-sm mt-0.5">
                        {rule.min_percentage ? `${rule.min_percentage}%` : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 font-medium">Internship Req</span>
                      <p className="font-bold text-slate-900 dark:text-slate-100 text-sm mt-0.5">
                        {rule.internship_required ? 'Mandatory' : 'Optional'}
                      </p>
                    </div>
                  </div>

                  {/* Allowed Departments */}
                  <div className="space-y-1 mb-3">
                    <span className="text-[11px] font-semibold text-slate-400">Allowed Branches:</span>
                    <div className="flex flex-wrap gap-1">
                      {(rule.allowed_departments && rule.allowed_departments.length > 0
                        ? rule.allowed_departments
                        : ['All Branches']
                      ).map((d, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded text-[10px] font-semibold"
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>

                  {rule.notes && (
                    <p className="text-xs text-slate-500 italic mt-2 line-clamp-2">{rule.notes}</p>
                  )}
                </div>

                {/* Card Actions */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-400">Priority: {rule.priority}</span>
                  <div className="flex items-center gap-2">
                    {canEdit && (
                      <button
                        onClick={() => handleOpenEdit(rule)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        title="Edit Rule"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                    {canDelete && (
                      <button
                        onClick={() => setDeleteId(rule.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        title="Delete Rule"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ADD / EDIT RULE MODAL */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {editingRule ? `Edit Rule: ${editingRule.name}` : 'Configure New Eligibility Rule'}
                </h3>
                <p className="text-xs text-slate-400">All student records will be evaluated against this rule</p>
              </div>
              <button onClick={() => setFormOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Rule Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Tier-1 Super Dream Cutoff"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Rule Type *
                  </label>
                  <select
                    value={formData.rule_type}
                    onChange={(e) => setFormData({ ...formData, rule_type: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden"
                  >
                    <option value="Global">Global Rule</option>
                    <option value="Company">Company-Specific Rule</option>
                    <option value="Department">Department-Specific Rule</option>
                    <option value="GraduationYear">Graduation Year Rule</option>
                  </select>
                </div>

                {formData.rule_type === 'Company' && (
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Target Company *
                    </label>
                    <select
                      value={formData.company_id}
                      onChange={(e) => setFormData({ ...formData, company_id: e.target.value })}
                      required
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden"
                    >
                      <option value="">Select Company</option>
                      {companies.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                {formData.rule_type === 'Department' && (
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Target Department *
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      required
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden"
                    >
                      <option value="">Select Department</option>
                      {['CSE', 'IT', 'ECE', 'EEE', 'Mechanical', 'Civil'].map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Minimum CGPA (0.0 - 10.0) *
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    min="0"
                    max="10"
                    required
                    value={formData.min_cgpa}
                    onChange={(e) => setFormData({ ...formData, min_cgpa: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Minimum Academic Percentage (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={formData.min_percentage}
                    onChange={(e) => setFormData({ ...formData, min_percentage: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Max Allowed Active Backlogs
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.max_active_backlogs}
                    onChange={(e) => setFormData({ ...formData, max_active_backlogs: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Max Total Backlog History
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.max_total_backlogs}
                    onChange={(e) => setFormData({ ...formData, max_total_backlogs: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 py-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.allow_active_backlogs}
                    onChange={(e) => setFormData({ ...formData, allow_active_backlogs: e.target.checked })}
                    className="w-4 h-4 rounded-md text-blue-600 focus:ring-0"
                  />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Permit Active Backlogs (if within max limit)
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.internship_required}
                    onChange={(e) => setFormData({ ...formData, internship_required: e.target.checked })}
                    className="w-4 h-4 rounded-md text-blue-600 focus:ring-0"
                  />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Require Prior Internship Experience
                  </span>
                </label>
              </div>

              {/* Department Checkboxes */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Eligible Departments
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {['CSE', 'IT', 'ECE', 'EEE', 'Mechanical', 'Civil'].map((dept) => {
                    const checked = formData.allowed_departments.includes(dept);
                    return (
                      <button
                        type="button"
                        key={dept}
                        onClick={() => handleDeptToggle(dept)}
                        className={`p-2 rounded-xl text-center font-bold text-xs border transition-all ${
                          checked
                            ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 border-blue-500'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {dept}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Required Skills (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.required_skills_text}
                  onChange={(e) => setFormData({ ...formData, required_skills_text: e.target.value })}
                  placeholder="e.g. Data Structures, Python, SQL"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Notes / Description</label>
                <textarea
                  rows="2"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden"
                />
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950/40 border-t border-slate-200 dark:border-slate-800 -mx-6 -mb-6 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handlePreviewImpact}
                  className="px-3.5 py-2 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 rounded-xl font-bold flex items-center gap-1.5 border border-indigo-200 dark:border-indigo-800"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview Affected Counts</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setFormOpen(false)}
                    className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-xs disabled:opacity-50"
                  >
                    {formSubmitting ? 'Applying & Recalculating...' : editingRule ? 'Save Rule Changes' : 'Create Rule'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RULE IMPACT PREVIEW MODAL */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                Live Rule Impact Preview
              </h3>
              <button onClick={() => setPreviewOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {previewLoading ? (
              <div className="text-center py-8 text-slate-400">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-600" />
                Simulating rule evaluation across all student records...
              </div>
            ) : previewResults ? (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800/40">
                    <span className="text-slate-500 font-medium">Eligible</span>
                    <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                      {previewResults.Eligible}
                    </div>
                  </div>
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-800/40">
                    <span className="text-slate-500 font-medium">Not Eligible</span>
                    <div className="text-xl font-black text-rose-600 dark:text-rose-400 mt-1">
                      {previewResults['Not Eligible']}
                    </div>
                  </div>
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800/40">
                    <span className="text-slate-500 font-medium">Needs Review</span>
                    <div className="text-xl font-black text-amber-600 dark:text-amber-400 mt-1">
                      {previewResults['Needs Review']}
                    </div>
                  </div>
                </div>

                <div className="text-slate-500">
                  Total student cohort evaluated: <strong>{previewResults.Total}</strong>
                </div>

                {previewResults.sample_affected && previewResults.sample_affected.length > 0 && (
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="font-bold text-slate-800 dark:text-slate-200">
                      Sample Ineligible Students & Reasons:
                    </div>
                    {previewResults.sample_affected.map((item, idx) => (
                      <div key={idx} className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                        <div className="font-semibold text-slate-900 dark:text-slate-100">
                          {item.name} ({item.roll_number}) - CGPA: {item.cgpa}
                        </div>
                        <ul className="text-[11px] text-rose-600 dark:text-rose-400 list-disc list-inside mt-0.5">
                          {item.reasons.map((r, ri) => (
                            <li key={ri}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setPreviewOpen(false)}
                    className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-semibold"
                  >
                    Done Reviewing
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Eligibility Rule"
        message="Are you sure you want to remove this cutoff rule? All students will immediately be re-evaluated against the remaining active rules."
        confirmText="Delete Rule"
        confirmVariant="danger"
        loading={deleteLoading}
        onConfirm={handleDelete}
        onClose={() => setDeleteId(null)}
      />
    </div>
  );
}
