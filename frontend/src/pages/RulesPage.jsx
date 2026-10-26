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
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
        <div>
          <div className="editorial-kicker">// ENGINE POLICIES // CUTOFF GOVERNANCE</div>
          <h2 className="text-2xl font-editorial italic font-normal text-white tracking-tight flex items-center gap-3">
            Automated Cutoff & Eligibility Engine
            <span className="text-[11px] font-mono not-italic px-2.5 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-medium">
              {rules.length} ACTIVE RULES
            </span>
          </h2>
          <p className="text-xs font-sans text-slate-400 mt-0.5">
            Define global, company-specific, and department-wise cutoff criteria. Changes dynamically re-evaluate students across the database.
          </p>
        </div>

        {canEdit && (
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-mono font-medium rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.25)] transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>CONFIGURE NEW RULE</span>
          </button>
        )}
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full text-center py-12 text-slate-500 font-mono text-xs">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-cyan-400" />
            // RETRIEVING ELIGIBILITY RULES...
          </div>
        ) : rules.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-500 intel-card rounded-3xl border border-white/[0.08] font-mono text-xs">
            // ZERO ACTIVE RULES CONFIGURED. ADD A RULE TO ESTABLISH CUTOFFS.
          </div>
        ) : (
          rules.map((rule) => {
            const companyName = companies.find((c) => c.id === rule.company_id)?.name;
            return (
              <div
                key={rule.id}
                className={`intel-card rounded-3xl p-6 border transition-all duration-300 flex flex-col justify-between hover:border-cyan-500/30 ${
                  rule.is_active
                    ? 'border-white/[0.08]'
                    : 'border-white/[0.04] opacity-50 bg-slate-950/40'
                }`}
              >
                <div>
                  {/* Top tags */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider ${
                        rule.rule_type === 'Global'
                          ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/30'
                          : rule.rule_type === 'Company'
                          ? 'bg-purple-950/60 text-purple-300 border border-purple-500/30'
                          : 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {rule.rule_type} RULE
                    </span>

                    <button
                      onClick={() => handleToggleRule(rule.id)}
                      disabled={!canEdit}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                        rule.is_active
                          ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                          : 'bg-slate-900 text-slate-500 border border-white/[0.06]'
                      }`}
                    >
                      <Power className="w-3 h-3" />
                      {rule.is_active ? 'ACTIVE' : 'DISABLED'}
                    </button>
                  </div>

                  <h3 className="text-base font-serif font-medium text-white leading-tight">
                    {rule.name}
                  </h3>

                  {companyName && (
                    <div className="text-xs font-mono text-purple-400 mt-1">
                      TARGET: {companyName}
                    </div>
                  )}

                  {rule.department && (
                    <div className="text-xs font-mono text-cyan-400 mt-1">
                      DEPT: {rule.department}
                    </div>
                  )}

                  {/* Cutoff criteria dock */}
                  <div className="grid grid-cols-2 gap-2 my-4 p-3 bg-slate-950/60 rounded-2xl border border-white/[0.06] text-xs">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-slate-500">// MIN CGPA</span>
                      <p className="font-mono-num font-bold text-emerald-400 text-sm mt-0.5">
                        {rule.min_cgpa.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-slate-500">// MAX ACTIVE BACKLOGS</span>
                      <p className="font-mono-num font-bold text-rose-400 text-sm mt-0.5">
                        {rule.max_active_backlogs} {rule.allow_active_backlogs ? '(Permitted)' : '(Strict)'}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-slate-500">// MIN PERCENTAGE</span>
                      <p className="font-mono-num font-bold text-slate-200 text-sm mt-0.5">
                        {rule.min_percentage ? `${rule.min_percentage}%` : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-slate-500">// INTERNSHIP</span>
                      <p className="font-mono text-cyan-300 text-xs mt-0.5 font-medium">
                        {rule.internship_required ? 'MANDATORY' : 'OPTIONAL'}
                      </p>
                    </div>
                  </div>

                  {/* Allowed Departments */}
                  <div className="space-y-1 mb-3">
                    <span className="text-[10px] font-mono uppercase text-slate-500">// ELIGIBLE BRANCHES:</span>
                    <div className="flex flex-wrap gap-1">
                      {(rule.allowed_departments && rule.allowed_departments.length > 0
                        ? rule.allowed_departments
                        : ['All Branches']
                      ).map((d, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-slate-900 border border-white/[0.06] text-slate-300 rounded font-mono text-[10px]"
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>

                  {rule.notes && (
                    <p className="text-xs text-slate-500 font-sans italic mt-2 line-clamp-2">{rule.notes}</p>
                  )}
                </div>

                {/* Card Actions */}
                <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500">PRIORITY: {rule.priority}</span>
                  <div className="flex items-center gap-2">
                    {canEdit && (
                      <button
                        onClick={() => handleOpenEdit(rule)}
                        className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-white/[0.05] rounded-lg transition-colors cursor-pointer"
                        title="Edit Rule"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                    {canDelete && (
                      <button
                        onClick={() => setDeleteId(rule.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-white/[0.05] rounded-lg transition-colors cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-2xl intel-card rounded-3xl shadow-2xl border border-white/[0.12] overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-white/[0.08] flex items-center justify-between bg-slate-950/60">
              <div>
                <div className="editorial-kicker">// ENGINE DIRECTIVE</div>
                <h3 className="text-xl font-editorial italic font-normal text-white">
                  {editingRule ? `Update Cutoff Rule: ${editingRule.name}` : 'Configure New Cutoff Policy'}
                </h3>
                <p className="text-xs font-mono text-cyan-300/80">All student records will dynamically evaluate against this rule</p>
              </div>
              <button onClick={() => setFormOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 overflow-y-auto space-y-4 text-xs font-sans flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-mono text-xs text-slate-400 mb-1">
                    Rule Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Tier-1 Super Dream Cutoff"
                    className="w-full p-2.5 bg-slate-950/60 border border-white/[0.08] rounded-xl text-slate-200 focus:outline-hidden focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-slate-400 mb-1">
                    Rule Type *
                  </label>
                  <select
                    value={formData.rule_type}
                    onChange={(e) => setFormData({ ...formData, rule_type: e.target.value })}
                    className="w-full p-2.5 bg-slate-900 border border-white/[0.08] rounded-xl font-mono text-xs text-slate-200 focus:outline-hidden focus:border-cyan-500 cursor-pointer"
                  >
                    <option value="Global">Global Rule</option>
                    <option value="Company">Company-Specific Rule</option>
                    <option value="Department">Department-Specific Rule</option>
                    <option value="GraduationYear">Graduation Year Rule</option>
                  </select>
                </div>

                {formData.rule_type === 'Company' && (
                  <div>
                    <label className="block font-mono text-xs text-slate-400 mb-1">
                      Target Company *
                    </label>
                    <select
                      value={formData.company_id}
                      onChange={(e) => setFormData({ ...formData, company_id: e.target.value })}
                      required
                      className="w-full p-2.5 bg-slate-900 border border-white/[0.08] rounded-xl font-mono text-xs text-slate-200 focus:outline-hidden focus:border-cyan-500 cursor-pointer"
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
                    <label className="block font-mono text-xs text-slate-400 mb-1">
                      Target Department *
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      required
                      className="w-full p-2.5 bg-slate-900 border border-white/[0.08] rounded-xl font-mono text-xs text-slate-200 focus:outline-hidden focus:border-cyan-500 cursor-pointer"
                    >
                      <option value="">Select Department</option>
                      {['CSE', 'IT', 'ECE', 'EEE', 'Mechanical', 'Civil'].map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block font-mono text-xs text-slate-400 mb-1">
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
                    className="w-full p-2.5 bg-slate-950/60 border border-white/[0.08] rounded-xl font-mono text-xs text-emerald-300 font-semibold focus:outline-hidden focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-slate-400 mb-1">
                    Minimum Academic Percentage (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={formData.min_percentage}
                    onChange={(e) => setFormData({ ...formData, min_percentage: e.target.value })}
                    className="w-full p-2.5 bg-slate-950/60 border border-white/[0.08] rounded-xl font-mono text-xs text-slate-200 focus:outline-hidden focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-slate-400 mb-1">
                    Max Allowed Active Backlogs
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.max_active_backlogs}
                    onChange={(e) => setFormData({ ...formData, max_active_backlogs: e.target.value })}
                    className="w-full p-2.5 bg-slate-950/60 border border-white/[0.08] rounded-xl font-mono text-xs text-rose-400 focus:outline-hidden focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-slate-400 mb-1">
                    Max Total Backlog History
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.max_total_backlogs}
                    onChange={(e) => setFormData({ ...formData, max_total_backlogs: e.target.value })}
                    className="w-full p-2.5 bg-slate-950/60 border border-white/[0.08] rounded-xl font-mono text-xs text-slate-200 focus:outline-hidden focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 py-2">
                <label className="flex items-center gap-2 cursor-pointer font-mono text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={formData.allow_active_backlogs}
                    onChange={(e) => setFormData({ ...formData, allow_active_backlogs: e.target.checked })}
                    className="w-4 h-4 rounded-md accent-cyan-500 cursor-pointer"
                  />
                  <span>Permit Active Backlogs (if within max limit)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-mono text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={formData.internship_required}
                    onChange={(e) => setFormData({ ...formData, internship_required: e.target.checked })}
                    className="w-4 h-4 rounded-md accent-cyan-500 cursor-pointer"
                  />
                  <span>Require Prior Internship Experience</span>
                </label>
              </div>

              {/* Department Checkboxes */}
              <div>
                <label className="block font-mono text-xs text-slate-400 mb-2">
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
                        className={`p-2 rounded-xl text-center font-mono text-xs border transition-all cursor-pointer ${
                          checked
                            ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                            : 'bg-slate-900 text-slate-400 border-white/[0.06] hover:text-slate-200'
                        }`}
                      >
                        {dept}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs text-slate-400 mb-1">
                  Required Skills (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.required_skills_text}
                  onChange={(e) => setFormData({ ...formData, required_skills_text: e.target.value })}
                  placeholder="e.g. Data Structures, Python, SQL"
                  className="w-full p-2.5 bg-slate-950/60 border border-white/[0.08] rounded-xl font-mono text-xs text-slate-200 focus:outline-hidden focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-slate-400 mb-1">Notes / Description</label>
                <textarea
                  rows="2"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full p-2.5 bg-slate-950/60 border border-white/[0.08] rounded-xl text-slate-200 focus:outline-hidden focus:border-cyan-500"
                />
              </div>

              <div className="p-4 bg-slate-950/80 border-t border-white/[0.08] -mx-6 -mb-6 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handlePreviewImpact}
                  className="px-3.5 py-2 bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-300 rounded-xl font-mono text-xs flex items-center gap-1.5 border border-indigo-500/30 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-indigo-400" />
                  <span>SIMULATE IMPACT</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setFormOpen(false)}
                    className="px-4 py-2 bg-slate-900 border border-white/[0.08] text-slate-400 hover:text-white rounded-xl font-mono text-xs cursor-pointer"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="px-5 py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-mono text-xs font-semibold rounded-xl shadow-xs disabled:opacity-50 cursor-pointer"
                  >
                    {formSubmitting ? 'RECALCULATING...' : editingRule ? 'UPDATE RULE' : 'SAVE DIRECTIVE'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RULE IMPACT PREVIEW MODAL */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg intel-card rounded-3xl shadow-2xl border border-white/[0.12] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="editorial-kicker">// SIMULATION ENGINE</div>
                <h3 className="text-xl font-editorial italic font-normal text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  Live Policy Simulation
                </h3>
              </div>
              <button onClick={() => setPreviewOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {previewLoading ? (
              <div className="text-center py-8 text-slate-400 font-mono text-xs">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-cyan-400" />
                // SIMULATING EVALUATION MATRIX ACROSS ALL CANDIDATE DOSSIERS...
              </div>
            ) : previewResults ? (
              <div className="space-y-4 text-xs font-sans">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-500/30">
                    <span className="font-mono text-[10px] uppercase text-emerald-400">// ELIGIBLE</span>
                    <div className="text-xl font-mono-num font-bold text-emerald-300 mt-1">
                      {previewResults.Eligible}
                    </div>
                  </div>
                  <div className="p-3 bg-rose-950/40 rounded-xl border border-rose-500/30">
                    <span className="font-mono text-[10px] uppercase text-rose-400">// INELIGIBLE</span>
                    <div className="text-xl font-mono-num font-bold text-rose-300 mt-1">
                      {previewResults['Not Eligible']}
                    </div>
                  </div>
                  <div className="p-3 bg-amber-950/40 rounded-xl border border-amber-500/30">
                    <span className="font-mono text-[10px] uppercase text-amber-400">// REVIEW</span>
                    <div className="text-xl font-mono-num font-bold text-amber-300 mt-1">
                      {previewResults['Needs Review']}
                    </div>
                  </div>
                </div>

                <div className="text-slate-400 font-mono text-xs">
                  TOTAL CANDIDATES EVALUATED: <strong className="text-white">{previewResults.Total}</strong>
                </div>

                {previewResults.sample_affected && previewResults.sample_affected.length > 0 && (
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-white/[0.06] space-y-2">
                    <div className="font-mono text-xs uppercase text-slate-300">
                      // SAMPLE RESTRICTED CANDIDATES & RATIONALES:
                    </div>
                    {previewResults.sample_affected.map((item, idx) => (
                      <div key={idx} className="p-2 bg-slate-900/60 rounded-lg border border-white/[0.04]">
                        <div className="font-serif font-medium text-slate-200">
                          {item.name} ({item.roll_number}) — CGPA: <span className="font-mono text-emerald-400">{item.cgpa}</span>
                        </div>
                        <ul className="text-[11px] font-mono text-rose-400 list-disc list-inside mt-0.5">
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
                    className="px-4 py-2 bg-slate-900 border border-white/[0.08] text-slate-300 hover:text-white rounded-xl font-mono text-xs cursor-pointer"
                  >
                    DISMISS SIMULATION
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
        title="Purge Cutoff Policy"
        message="Are you sure you want to remove this cutoff rule? All students will immediately be re-evaluated against the remaining active rules."
        confirmText="Purge Policy"
        confirmVariant="danger"
        loading={deleteLoading}
        onConfirm={handleDelete}
        onClose={() => setDeleteId(null)}
      />
    </div>
  );
}
